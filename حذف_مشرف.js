const fs = require("fs");
const path = require("path");

function readConfig() {
  const p = path.join(__dirname, "..", "config.json");
  return { p, cfg: JSON.parse(fs.readFileSync(p, "utf8")) };
}
function writeConfig(p, cfg) {
  fs.writeFileSync(p, JSON.stringify(cfg, null, 2), "utf8");
}

module.exports = {
  name: "حذف_مشرف",
  aliases: ["ازالة_مشرف"],
  role: 2, // مالك فقط
  run: async ({ api, event, args, send }) => {
    const target = args[0] || (event.mentions && Object.keys(event.mentions)[0]);
    if (!target) return send(api, event, "❌ اكتب: !حذف_مشرف <UID> أو منشن الشخص.");

    const { p, cfg } = readConfig();
    cfg.admins = Array.isArray(cfg.admins) ? cfg.admins : [];
    cfg.admins = cfg.admins.filter(x => x !== target);
    writeConfig(p, cfg);

    return send(api, event, `✅ تم حذف المشرف: ${target}`);
  }
};
