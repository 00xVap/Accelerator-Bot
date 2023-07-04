const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { default: axios } = require("axios");

module.exports = {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName("enlarge")
    .setDescription("Returns the source image of emojis.")
    .setDMPermission(true)
    .addStringOption((option) =>
      option
        .setName("emoji")
        .setDescription("Emoji to enlarge")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const embed = new EmbedBuilder();

    let emoji = interaction.options.getString("emoji")?.trim();

    if (emoji.startsWith("<") && emoji.endsWith(">")) {
      const id = emoji.match(/\d{15,}/g)[0];
      const type = await axios
        .get(`https://cdn.discordapp.com/emojis/${id}.gif`)
        .then((image) => {
          if (image) return "gif";
          else return "png";
        })
        .catch((err) => {
          return "png";
        });

      emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`;

      if (!emoji.startsWith("http")) {
        embed.setDescription(
          `<:Error:977069715149160448> Can't enlarge default Discord emojis.`
        );
        await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
      }

      if (!emoji.startsWith("https")) {
        embed.setDescription(
          `<:Error:977069715149160448> Can't enlarge default Discord emojis.`
        );
        await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
      }

      embed.setImage(emoji);

      await interaction.reply({
        embeds: [embed],
      });
    }
  },
};
