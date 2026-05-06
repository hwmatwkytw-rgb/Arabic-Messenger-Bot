module.exports = {
  name: "بنج",
  aliases: ["ping"],
  role: 0,
  run: async ({ api, event, send }) => {
    return send(api, event, "🏓 شغال!");
  }
};
