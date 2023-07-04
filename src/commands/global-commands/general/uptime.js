const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const prettyMilliseconds = require("pretty-ms");

module.exports = {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName("uptime")
    .setDMPermission(true)
    .setDescription("Displays the amount of time the bot has been online."),

  async execute(interaction, client) {
    await interaction.deferReply();
    const embed = new EmbedBuilder();

    embed.setDescription(`
      **Uptime:**\n\`\`\`fix\n${prettyMilliseconds(client.uptime)}\`\`\`
    `);

    await interaction.editReply({
      embeds: [embed],
    });
    return;
  },
};
