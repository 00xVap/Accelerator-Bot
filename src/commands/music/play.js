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
    .setName("play")
    .setDescription(
      "Loads a video/playlist from youtube from links or search terms."
    )
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Link/Search terms.")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Connect),

  async execute(interaction, client) {
    const embed = new EmbedBuilder();
    const row = new ActionRowBuilder();
    const requested = new ButtonBuilder()
      .setCustomId("requested-by")
      .setDisabled(true)
      .setStyle(ButtonStyle.Secondary);
    row.addComponents(requested);
    const { channel } = interaction;
    const voiceChannel = interaction.member.voice.channel;
    const perms = channel
      .permissionsFor(client.user || member.guild.me)
      .has(PermissionFlagsBits.Connect, false);

    if (!client.owner.includes(interaction.user.id)) {
      embed.setDescription(
        `<:Error:977069715149160448> The play command is being rewritten, be patient!`
      );

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    if (!perms) {
      embed.setDescription(`
                <:Error:977069715149160448> I don't have enough permissions to do this command!
                <:space:1005359382776778802>**»** *Missing Permissions: \`VOICE_CONNECT\`*
            `);

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    const queue = client.player.nodes.create(interaction.guild.id, {
      metadata: {
        requestedBy: interaction.user,
      },
      selfDeaf: false,
      leaveOnEmpty: true,
      leaveOnEmptyCooldown: 300000,
      leaveOnEnd: true,
      leaveOnEndCooldown: 300000,
      volume: 100,
    });

    if (!voiceChannel) {
      embed.setDescription(
        "<:Error:977069715149160448> You have to be in a voice channel."
      );

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    if (!queue.connection) {
      queue.connect(voiceChannel);
    }

    let url = interaction.options.getString("query");
    const result = await client.player.search(url, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO,
    });

    if (!result.hasTracks()) {
      embed.setDescription("<:Error:977069715149160448> No results found.");

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply();

    embed
      .setAuthor({
        name: "Added to queue.",
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    const playlist = result.playlist;
    const song = result.tracks[0];

    requested.setLabel(`Requested by ${song.requestedBy.tag}`);

    if (!result.playlist) {
      await queue.addTrack(song);
      embed.setDescription(
        hyperlink(
          `>>> **${song.title || playlist.title}**`,
          `${song.url || playlist.url}`
        ) +
          `
                **Channel:** \`${song.author}\`
                **Duration:** \`${song.duration}\``
      );
      embed.setThumbnail(song.thumbnail);

      if (!queue.node.isPlaying()) {
        try {
          await queue.node.play();
        } catch (e) {
          console.log(e);
        }
      }

      await interaction.editReply({
        embeds: [embed],
        components: [row],
      });
      return;
    }

    embed.setDescription(
      hyperlink(`>>> **${playlist.title}**`, `${playlist.url}`) +
        `
            **Number of Songs:** \`${result.tracks.size}\``
    );
    embed.setThumbnail(song.thumbnail);

    await queue.addTracks(result.tracks);

    if (!queue.node.isPlaying()) {
      try {
        await queue.node.play();
      } catch (e) {
        console.log(e);
      }
    }

    await interaction.editReply({
      embeds: [embed],
      components: [row],
    });
    return;
  },
};
