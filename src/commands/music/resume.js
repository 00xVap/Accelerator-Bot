const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resumes the current song if paused.")
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
    } else if (!queue) {
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
      "<:Success:977389031837040670> Song has been resumed."
    );

    queue.node.resume();

    await interaction.editReply({
      embeds: [embed],
    });
    return;
  },
};
