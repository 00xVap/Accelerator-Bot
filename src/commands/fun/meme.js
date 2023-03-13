const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle  } = require("discord.js");
const redditFetch = require("reddit-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("meme")
    .setDMPermission(true)
    .setDescription("Sends meme from the r/dankmemes subreddit"),

  async execute(interaction, client) {
    await interaction.deferReply();
    const embed = new EmbedBuilder();
    const row = new ActionRowBuilder();
    const requested = new ButtonBuilder()
      .setCustomId("requested-by")
      .setDisabled(true)
      .setLabel(`Requested by ${interaction.user.tag}`)
      .setStyle(ButtonStyle.Secondary);
    row.addComponents(requested);

    redditFetch({
      subreddit: "dankmemes",
      sort: "hot",
      allowNSFW: false,
      allowModPost: false,
      allowCrossPost: true,
    }).then(async (post) => {
      embed
        .setTitle(`${post.title}`)
        .setURL(`${post.url}`)
        .setImage(`${post.url}`)
        .setFooter({ text: `👍 ${post.score}` })
        .setTimestamp();

      await interaction.editReply({
        embeds: [embed],
        components: [row]
      });
      return;
    });
  },
};