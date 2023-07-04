const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Ask the magic 8ball anything!")
    .setDMPermission(true)
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription(`The question you want to ask the 8ball.`)
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

    let option = interaction.options.getString("question");
    let url = `https://eightballapi.com/api?question=${option}&lucky=false`;

    const ballFetch = fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!ballFetch) {
      embed.setDescription(
        "<:Error:977069715149160448> An error occured. Try again later."
      );

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    ballFetch.then((r) => r.json())
      .then(async (data) => {
        embed
          .setTitle(`> ${option}`)
          .setDescription(`\`\`\`${data.reading}\`\`\``)
          .setTimestamp()

        await interaction.reply({
          embeds: [embed],
          components: [row]
        });
        return;
      });
  },
};
