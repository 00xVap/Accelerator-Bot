const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("now-playing")
    .setDescription("Displays the current playing song.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Connect),

  async execute(interaction, client) {
    const embed = new EmbedBuilder();
    const row = new ActionRowBuilder();
    const requested = new ButtonBuilder()
      .setCustomId("requested-by")
      .setDisabled(true)
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

    let bar = queue.node.createProgressBar({
      queue: false,
      length: 15,
    });

    const song = queue.currentTrack;

    requested.setLabel(`Requested by ${song.requestedBy.tag}`)

    embed
      .setAuthor({
        name: "Now Playing",
        iconURL: client.user.displayAvatarURL(),
      })
      .setTitle(`> ${song.title}`)
      .setURL(song.url)
      .setThumbnail(song.thumbnail)
      .setDescription(
        `\`0:00\` ` +
          bar +
          ` \`${song.duration}\`\n
                **Channel:** \`${song.author}\``
      )
      .setTimestamp();

    await interaction.editReply({
      embeds: [embed],
      components: [row]
    });
    return;
  },
};
