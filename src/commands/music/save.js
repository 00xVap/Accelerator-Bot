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
    .setName("save")
    .setDescription("Saves the current song in your DMs.")
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

    if (!queue || !queue.playing) {
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

    const song = queue.current;

    requested.setLabel(`Requested by ${song.requestedBy.tag}`)

    embed
      .setAuthor({
        name: "Song Saved",
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTitle(song.title)
      .setURL(song.url)
      .setThumbnail(song.thumbnail)
      .setDescription(
        `**Channel:** \`${song.author}\`
                    **Duration:** \`${song.duration}\`
                    **Requested By:** \`${song.requestedBy.tag}\`
                    **Saved From:** \`${interaction.guild.name}\``
      )
      .setTimestamp();

    const embedSaved = new EmbedBuilder().setDescription(
      "<:Success:977389031837040670> Song has been saved."
    );

    try {
      await interaction.user.send({
        embeds: [embed],
        components: [row]
      });
      await interaction.editReply({
        embeds: [embedSaved],
      });
      return;
    } catch (err) {
      const embedError = new EmbedBuilder().setDescription(
        "<:Error:977069715149160448> Error sending DM, check your settings and try again."
      );

      await interaction.editReply({
        embeds: [embedError],
      });
      return;
    }
  },
};
