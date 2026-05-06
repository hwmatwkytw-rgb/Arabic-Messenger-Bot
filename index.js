const fs = require("fs");
const path = require("path");
const login = require("facebook-chat-api");

const { loadCommands } = require("./src/loader");
const { hasPermission } = require("./src/permissions");
const { nowUptime } = require("./src/utils");

function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

const CONFIG_PATH = path.join(__dirname, "config.json");
const APPSTATE_PATH = path.join(__dirname, "appstate.json");

let config = readJSON(CONFIG_PATH);
const commands = loadCommands(path.join(__dirname, "commands"));

function send(api, event, text) {
  return api.sendMessage(text, event.threadID, event.messageID);
}

function reloadConfigSafe() {
  try {
    config = readJSON(CONFIG_PATH);
  } catch (e) {
    console.error("فشل قراءة config.json:", e.message);
  }
}

if (!fs.existsSync(APPSTATE_PATH)) {
  console.error("❌ ملف appstate.json غير موجود.");
  process.exit(1);
}

const appState = readJSON(APPSTATE_PATH);

login(
  { appState },
  (err, api) => {
    if (err) {
      console.error("❌ فشل تسجيل الدخول عبر appstate:", err);
      process.exit(1);
    }

    api.setOptions({
      listenEvents: true,
      selfListen: false,
      updatePresence: true
    });

    console.log("✅ البوت اشتغل بنجاح.");
    console.log("⏱️", nowUptime());

    // إعادة تحميل config عند تغييره (كل 5 ثواني)
    setInterval(reloadConfigSafe, 5000);

    api.listenMqtt(async (err, event) => {
      if (err) return console.error(err);

      // نتعامل فقط مع الرسائل النصية
      if (!event || event.type !== "message" || typeof event.body !== "string") return;

      const prefix = config.prefix || "!";
      if (!event.body.startsWith(prefix)) return;

      const body = event.body.slice(prefix.length).trim();
      if (!body) return;

      const [rawName, ...args] = body.split(/\s+/);
      const name = rawName.toLowerCase();

      const cmd = commands.get(name);
      if (!cmd) return send(api, event, "❌ الأمر غير موجود. اكتب: !مساعدة");

      const ok = hasPermission(event.senderID, cmd.role ?? 0, config);
      if (!ok) return send(api, event, "⛔ ليس لديك صلاحية لاستخدام هذا الأمر.");

      // تبريد بسيط لكل مستخدم/أمر
      const cd = Number(config.cooldownSeconds ?? 2);
      if (cd > 0) {
        cmd._cooldowns = cmd._cooldowns || new Map();
        const key = `${event.senderID}:${cmd.name}`;
        const now = Date.now();
        const last = cmd._cooldowns.get(key) || 0;
        if (now - last < cd * 1000) return;
        cmd._cooldowns.set(key, now);
      }

      try {
        await cmd.run({ api, event, args, config, commands, send });
      } catch (e) {
        console.error("خطأ داخل الأمر:", cmd.name, e);
        return send(api, event, "⚠️ صار خطأ أثناء تنفيذ الأمر.");
      }
    });
  }
);
