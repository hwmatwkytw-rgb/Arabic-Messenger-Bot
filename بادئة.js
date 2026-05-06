const fs = require("fs");
const path = require("path");

module.exports = {
  name: "بادئة",
  aliases: ["prefix"],
  role: 2,
  run: async ({ api, event, args, send }) => {
    const newPrefix = args[0];
    if (!newPrefix) return send(api, event, "❌ اكتب: !بادئة <رمز> مثال: !بادئة #");

    const p = path.join(__dirname, "..", "config.json");
    const cfg = JSON.parse(fs.readFileSync(p, "utf8"));
    cfg.prefix = newPrefix;
    fs.writeFileSync(p, JSON.stringify(cfg, null, 2), "utf8");

    return send(api, event, `✅ تم تغيير البادئة إلى: ${newPrefix}`);
  }
};
