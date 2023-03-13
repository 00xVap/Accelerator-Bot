const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Ask the 8ball some questions!")
    .setDMPermission(true)
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription(`The question you want to ask the 8ball.`)
        .setRequired(true)
    ),

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

    let option = interaction.options.getString("question");
    let url = "https://api.popcat.xyz/8ball";

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

    ballFetch
      .then((r) => r.json())
      .then(async (data) => {
        embed
          .setTitle(`> ${option}`)
          .setDescription(`🎱 \`\`\`${data.answer}\`\`\``)
          .setTimestamp()
          .setFooter({ text: `Powered by popcat.xyz` });

        await interaction.editReply({
          embeds: [embed],
          components: [row]
        });
        return;
      });
  },
};
