const { get } = require("request-promise-native");
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  cooldown: 15,
  data: new SlashCommandBuilder()
    .setName("anime")
    .setDescription("Gets information on a specified anime.")
    .setDMPermission(true)
    .addStringOption((option) =>
      option
        .setName("anime")
        .setDescription("Anime you want to get information from.")
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

    let anime = interaction.options.getString("anime");

    let option = {
      url: `https://kitsu.io/api/edge/anime?filter[text]=${anime}`,
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
            value: `\`${mat.data[0].attributes.showType}\``,
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
            name: "Episode Count",
            value: `\`${mat.data[0].attributes.episodeCount
              ? mat.data[0].attributes.episodeCount
              : "N/A"
              }\``,
            inline: true,
          },
          {
            name: "Duration",
            value: `\`${mat.data[0].attributes.episodeLength
              ? mat.data[0].attributes.episodeLength
              : "N/A"
              } Min\``,
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

