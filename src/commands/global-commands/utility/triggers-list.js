const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const triggerSchema = require("../../../model/triggers");

module.exports = {
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("triggers-list")
    .setDMPermission(false)
    .setDescription("View all the triggers that were added in the server."),

  async execute(interaction, client) {
    const { guild } = interaction;

    const embed = new EmbedBuilder()
      .setTitle(`Triggers in ${guild.name}`)
      .setThumbnail(guild.iconURL({ dynamic: true }));

    triggerSchema.find({ Guild: interaction.guild.id }, async (err, data) => {
      if (err) throw err;

      const list = data.map((cmd, i) => `\`${cmd.Command}\``).join(", ");

      embed.setDescription(list || `<:Error:977069715149160448> There are no triggers in this guild yet!`);

      await interaction.reply({
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
