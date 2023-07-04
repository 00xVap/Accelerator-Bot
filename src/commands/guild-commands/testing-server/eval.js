const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { inspect } = require("util");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Evaluates a block of code.")
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("Code to evaluate")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const embed = new EmbedBuilder();
    const code = interaction.options.getString("code");

    const result = await eval(code);

    if (typeof result !== "string") {
      output = inspect(result);
    }

    await interaction.deferReply();

    embed
      .setDescription(
        `**Code To Evaluate:**\n\`\`\`js\n${code}\`\`\`\n**Evaluated Code:**\n\`\`\`js\n${output}\`\`\``
      )
      .setTimestamp();

    await interaction.editReply({
      embeds: [embed],
    });
  },
};
