const { nowUptime } = require("../src/utils");

module.exports = {
  name: "وقت_التشغيل",
  aliases: ["uptime"],
  role: 0,
  run: async ({ api, event, send }) => {
    return send(api, event, `⏱️ ${nowUptime()}`);
  }
};
