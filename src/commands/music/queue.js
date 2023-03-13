const {
  SlashCommandBuilder,
  EmbedBuilder,
  hyperlink,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Displays the current song queue.")
    .setDMPermission(false)
    .addNumberOption((option) =>
      option
        .setName("page")
        .setDescription("Page number of the queue.")
        .setMinValue(1)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Connect),

  async execute(interaction, client) {
    const embed = new EmbedBuilder();
    const row = new ActionRowBuilder();
    const requested = new ButtonBuilder()
      .setCustomId("requested-by")
      .setDisabled(true)
      .setLabel(`Requested by ${interaction.user.tag}`)
      .setStyle(ButtonStyle.Secondary);
    row.addComponents(requested);
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

    if (!queue || !queue.node.isPlaying()) {
      embed.setDescription(
        "<:Error:977069715149160448> There are no songs in the queue."
      );

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    const totalPages = Math.ceil(queue.tracks.length / 10) || 1;
    const page = (interaction.options.getNumber("page") || 1) - 1;

    if (page > totalPages) {
      embed.setDescription(
        `<:Error:977069715149160448> Invalid page! There is only a total of \`${totalPages}\` pages in the queue.`
      );

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply();

    const queueString = queue.tracks
      .slice(page * 10, page * 10 + 10)
      .map((song, i) => {
        return (
          `\`${page * 10 + i + 1}\` **•** ` +
          hyperlink(`**${song.title}**`, `${song.url}`) +
          ` \`[${song.duration}]\` • <@${song.requestedBy.id}>`
        );
      })
      .join("\n");

    const currentSong = queue.currentTrack;

    embed
      .setAuthor({
        name: "Accelerator",
        iconURL: client.user.displayAvatarURL(),
      })
      .setDescription(
        `**Now Playing**\n` +
          (currentSong
            ? `> ` +
              hyperlink(`**${currentSong.title}**`, `${currentSong.url}`) +
              ` \`[${currentSong.duration}]\` • <@${currentSong.requestedBy.id}>`
            : "None") +
          `\n\n**Coming Up Next**\n${
            queueString ||
            "<:Error:977069715149160448> No songs have been queued up."
          }`
      )
      .setFooter({ text: `Page ${page + 1} of ${totalPages} | ${queue.tracks.size} songs` })
      .setTimestamp();

    await interaction.editReply({
      embeds: [embed],
      components: [row]
    });
    return;
  },
};
