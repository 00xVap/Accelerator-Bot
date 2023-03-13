const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Removes a specified song from the queue.")
    .addIntegerOption((option) =>
      option
        .setName("number")
        .setDescription("The song number in the queue.")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Connect),

  async execute(interaction, client) {
    const embed = new EmbedBuilder();
    const number = interaction.options.getInteger("number");
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

    const index = number - 1;
    const trackname = queue.tracks[index].title;

    if (!trackname) {
      embed.setDescription(
        "<:Error:977069715149160448> This track does not exist."
      );

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply();

    queue.node.remove(index);

    embed.setDescription(
      `<:Success:977389031837040670> Removed \`${trackname}\` from the queue.`
    );

    await interaction.editReply({
      embeds: [embed],
    });
  },
};
