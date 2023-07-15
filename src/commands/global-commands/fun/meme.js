const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const redditFetch = require("reddit-fetch");

module.exports = {
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("meme")
    .setDMPermission(true)
    .setDescription("Sends memes from r/dankmemes subreddit."),

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

    redditFetch({
      subreddit: "dankmemes",
      sort: "hot",
      allowNSFW: false,
      allowModPost: false,
      allowCrossPost: true,
    }).then(async (post) => {
      embed.setTitle(`${post.title}`)
        .setURL(`${post.url}`)
        .setImage(`${post.url}`)
        .setFooter({ text: `👍 ${post.score}` })
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
        components: [row]
      });
      return;
    });
  },
};