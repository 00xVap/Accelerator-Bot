const { ActivityType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    client.user.setPresence({
      activities: [
        {
          name: `/help.`,
          type: ActivityType.Listening,
        },
      ],
    });

    console.log(
      `🟢 | ${client.user.tag} is online in ${client.guilds.cache.size} guilds.`
    );
  },
};
