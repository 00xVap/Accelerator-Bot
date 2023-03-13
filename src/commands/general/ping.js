const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDMPermission(true)
    .setDescription("Sends the latency of Accelerator."),

  async execute(interaction, client) {
    const sent = await interaction.deferReply({
      fetchReply: true,
    });
    const embed = new EmbedBuilder();

    embed.setDescription(
      `**Pong!** 🏓
                \`\`\`yaml\nClient: ${client.ws.ping}ms\nAPI: ${
        sent.createdTimestamp - interaction.createdTimestamp
      }ms\`\`\``
    );

    await interaction.editReply({
      embeds: [embed],
    });
    return;
  },
};
