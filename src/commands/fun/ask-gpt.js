const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ask-gpt")
    .setDescription(
      "Get GPT-3 to answer questions and help on different topics."
    )
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("What you want to ask to GPT-3")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const embed = new EmbedBuilder();
    const row = new ActionRowBuilder();
    const requested = new ButtonBuilder()
      .setCustomId("requested-by")
      .setDisabled(true)
      .setLabel(`Requested by ${interaction.user.tag}`)
      .setStyle(ButtonStyle.Secondary);
    row.addComponents(requested);

    const prompt = interaction.options.getString("prompt");

    await interaction.deferReply();

    const res = await openai.createCompletion({
      model: "text-davinci-003",
      max_tokens: 2048,
      temperature: 0.5,
      prompt: prompt,
    });

    embed
      .setTitle(`> ${prompt}`)
      .setDescription(`\`\`\`${res.data.choices[0].text}\`\`\``);

    await interaction.editReply({
      embeds: [embed],
      components: [row],
    });
    return;
  },
};
