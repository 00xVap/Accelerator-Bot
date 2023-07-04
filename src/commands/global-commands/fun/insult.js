const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const axios = require("axios");

module.exports = {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName("insult")
    .setDMPermission(true)
    .setDescription("Returns insults that are a little bit *too* detailed."),

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

    axios({
      method: "GET",
      url: "https://evilinsult.com/generate_insult.php?lang=en&type=json",
    }).then(async ({ data }) => {
      embed
        .setDescription(`**${data.insult}**\n-${data.createdby}`)
        .setFooter({ text: `#${data.number} | Powered by evilinsult.com` })
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
        components: [row]
      });
      return;
    });
  },
};