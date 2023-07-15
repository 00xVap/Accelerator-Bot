const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDMPermission(true)
    .setDescription("Returns the bot's latency."),

  async execute(interaction, client) {
    const sent = await interaction.deferReply({
      fetchReply: true,
    });
    const embed = new EmbedBuilder();

    embed.setDescription(`
      **Pong!** 🏓
      \`\`\`yaml\nClient: ${client.ws.ping}ms\nRoundtrip: ${sent.createdTimestamp - interaction.createdTimestamp}ms\`\`\`
    `);

    await interaction.editReply({
      embeds: [embed],
    });
    return;
  },
};
