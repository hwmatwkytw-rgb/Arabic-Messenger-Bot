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
  name: "ضم_مشرف",
  aliases: ["اضافة_مشرف"],
  role: 2, // مالك فقط
  run: async ({ api, event, args, send }) => {
    const target = args[0] || (event.mentions && Object.keys(event.mentions)[0]);
    if (!target) return send(api, event, "❌ اكتب: !ضم_مشرف <UID> أو منشن الشخص.");

    const { p, cfg } = readConfig();
    cfg.admins = Array.isArray(cfg.admins) ? cfg.admins : [];
    if (!cfg.admins.includes(target)) cfg.admins.push(target);
    writeConfig(p, cfg);

    return send(api, event, `✅ تم إضافة مشرف: ${target}`);
  }
};
