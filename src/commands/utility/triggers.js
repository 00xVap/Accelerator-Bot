const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const triggerSchema = require("../../model/triggers");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("triggers")
    .setDescription("list of triggers")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("List of triggers in the server.")
    ),

  async execute(interaction, client) {
    const { guild } = interaction;

    const embed = new EmbedBuilder()
      .setTitle(`Triggers in ${guild.name}`)
      .setThumbnail(guild.iconURL({ dynamic: true }));

    triggerSchema
      .find({ Guild: interaction.guild.id }, async (err, data) => {
        if (err) throw err;

        await interaction.deferReply();

        const list = data.map((cmd, i) => `\`${cmd.Command}\``).join(", ");

        embed.setDescription(
          list ||
            `<:Error:977069715149160448> There are no triggers for this guild yet!`
        );

        await interaction.editReply({
          embeds: [embed],
        });
        return;
      })
      .clone()
      .catch(function (err) {
        console.log(err);
      });
  },
};
