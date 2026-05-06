module.exports = {
  name: "مساعدة",
  aliases: ["اوامر", "الأوامر", "menu"],
  role: 0,
  run: async ({ api, event, config, commands, send }) => {
    const prefix = config.prefix || "!";
    const unique = new Map();

    for (const c of commands.values()) {
      unique.set(c.name, c);
    }

    const list = [...unique.values()]
      .sort((a, b) => String(a.name).localeCompare(String(b.name), "ar"))
      .map(c => `• ${prefix}${c.name}`)
      .join("\n");

    return send(api, event, `📌 الأوامر المتاحة:\n${list}\n\nاكتب: ${prefix}مساعدة`);
  }
};
