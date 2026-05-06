const fs = require("fs");
const path = require("path");

/**
 * كل ملف داخل commands لازم يصدر:
 * {
 *   name: "مساعدة",
 *   aliases: ["اوامر","help"],
 *   role: 0|1|2,
 *   run: async ({api,event,args,config,commands,send}) => {}
 * }
 */
function loadCommands(dir) {
  const map = new Map();

  const files = fs.readdirSync(dir).filter(f => f.endsWith(".js"));
  for (const file of files) {
    const full = path.join(dir, file);
    delete require.cache[require.resolve(full)];
    const cmd = require(full);

    if (!cmd || !cmd.name || typeof cmd.run !== "function") {
      console.warn("تخطي ملف أمر غير صالح:", file);
      continue;
    }

    const names = [cmd.name, ...(Array.isArray(cmd.aliases) ? cmd.aliases : [])]
      .filter(Boolean)
      .map(x => String(x).toLowerCase());

    for (const n of names) map.set(n, cmd);
  }

  return map;
}

module.exports = { loadCommands };
