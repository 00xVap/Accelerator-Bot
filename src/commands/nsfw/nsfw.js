const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const redditFetch = require("reddit-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nsfw")
    .setDescription("For the horny folks.")
    .setDMPermission(true)
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("You're horny.")
        .setRequired(true)
        .setChoices(
          { name: "hentai", value: "hentai" },
          { name: "hthighs", value: "thighdeology" },
          { name: "hfemdom", value: "hentaifemdom" }
        )
    ),

  async execute(interaction, client) {
    const embed = new EmbedBuilder();
    const sub = interaction.options.getString("category");

    if (!interaction.channel.nsfw) {
      embed.setDescription(
        "<:Error:977069715149160448> Channel isn't flagged as NSFW."
      );

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply();

    redditFetch({
      subreddit: `${sub}`,
      sort: "hot",
      allowNSFW: true,
      allowModPost: false,
      allowCrossPost: true,
    }).then(async (post) => {
      embed
        .setImage(`${post.url}`)
        .setFooter({
          text: interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      await interaction.editReply({
        embeds: [embed],
      });
      return;
    });
  },
};
