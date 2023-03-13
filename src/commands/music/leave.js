const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription(
      "Accelerator will leave the voice channel and clear the queue."
    )
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Connect),

  async execute(interaction, client) {
    const embed = new EmbedBuilder();
    const queue = client.player.nodes.get(interaction.guild.id);
    const channel = interaction.member.voice.channel;

    if (!channel) {
      embed.setDescription(
        "<:Error:977069715149160448> You have to be in a voice channel."
      );

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    if (!queue) {
      embed.setDescription(
        "<:Error:977069715149160448> There are no songs in the queue."
      );

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply();

    embed.setDescription(
      "<:Success:977389031837040670> Left the voice channel."
    );

    if (!queue.deleted) await queue.delete();

    await interaction.editReply({
      embeds: [embed],
    });
    return;
  },
};
