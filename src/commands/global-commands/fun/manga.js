const { get } = require("request-promise-native");
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  cooldown: 15,
  data: new SlashCommandBuilder()
    .setName("manga")
    .setDescription("Gets information on a specified manga.")
    .setDMPermission(true)
    .addStringOption((option) =>
      option
        .setName("manga")
        .setDescription("Manga you want to get information from.")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const embed = new EmbedBuilder();
    const row = new ActionRowBuilder();
    const requested = new ButtonBuilder()
      .setCustomId("requested-by")
      .setDisabled(true)
      .setStyle(ButtonStyle.Secondary);

    if (!interaction.user.discriminator || interaction.user.discriminator === 0 || interaction.user.tag === `${interaction.user.username}#0`) {
      requested.setLabel(`Requested by ${interaction.user.username}`)
    } else {
      requested.setLabel(`Requested by ${interaction.user.tag}`)
    }

    row.addComponents(requested);

    let manga = interaction.options.getString("manga");

    let option = {
      url: `https://kitsu.io/api/edge/manga?filter[text]=${manga}`,
      method: `GET`,
      headers: {
        "Content-Type": "application/vnd.api+json",
        Accept: "application/vnd.api+json",
      },
      json: true,
    };

    get(option).then(async (mat) => {
      embed
        .setTitle(mat.data[0].attributes.titles.en_jp)
        .setURL(`https://kitsu.io/${mat.data[0].id}`)
        .setThumbnail(mat.data[0].attributes.posterImage.original)
        .setDescription(">>> " + mat.data[0].attributes.synopsis)
        .addFields(
          {
            name: "Type",
            value: `\`${mat.data[0].type.toUpperCase()}\``,
            inline: true,
          },
          {
            name: "Published",
            value: `\`${mat.data[0].attributes.startDate}\` **To** \`${mat.data[0].attributes.endDate
              ? mat.data[0].attributes.endDate
              : "N/A"
              }\``,
            inline: true,
          },
          {
            name: "Status",
            value: `\`${mat.data[0].attributes.status.toUpperCase({})}\``,
            inline: true,
          },
          {
            name: "Volume Count",
            value: `\`${mat.data[0].attributes.volumeCount
              ? mat.data[0].attributes.volumeCount
              : "N/A"
              }\``,
            inline: true,
          },
          {
            name: "Chapter Count",
            value: `\`${mat.data[0].attributes.chapterCount
              ? mat.data[0].attributes.chapterCount
              : "N/A"
              }\``,
            inline: true,
          },
          {
            name: "Rating",
            value: `\`${mat.data[0].attributes.ageRating}\``,
            inline: true,
          },
          {
            name: "Tags",
            value: `\`${mat.data[0].attributes.ageRatingGuide}\``,
            inline: true,
          }
        )
        .setTimestamp()
        .setFooter({ text: `Powered by kitsu.io` });

      await interaction.reply({
        embeds: [embed],
        components: [row]
      });
      return;
    });
  }
}
