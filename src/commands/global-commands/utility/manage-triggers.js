const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const triggerSchema = require("../../../model/triggers");

module.exports = {
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("manage-triggers")
    .setDMPermission(false)
    .setDescription("Add or remove message triggers.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add a message for the bot to respond to.")
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("Message you want to bot to repond to.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("response")
            .setDescription("Response to the message.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove a trigger.")
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("Trigger to remove (by name).")
            .setRequired(true)
        )
    ),

  async execute(interaction, client) {
    const { guild, options } = interaction;
    const embed = new EmbedBuilder();

    const subcommand = options.getSubcommand(["add", "remove"]);
    const command = options.getString("message");
    const response = options.getString("response");

    switch (subcommand) {
      case "add":
        await interaction.deferReply()
        triggerSchema.findOne({ Guild: guild.id, Command: command }, async (err, data) => {
          if (err) throw err;

          if (data) {
            embed.setDescription(
              `<:Error:977069715149160448> Trigger already exists!`
            );

            await interaction.editReply({
              embeds: [embed],
              ephemeral: true,
            });
            return;
          }

          data = new triggerSchema({
            Guild: guild.id,
            Command: command,
            Response: response,
          });

          await data.save();

          embed.setDescription(
            `<:Success:977389031837040670> Trigger \`${command}\` added successfully!`
          );

          await interaction.editReply({
            embeds: [embed],
          });
        })
          .clone()
          .catch(function (err) {
            console.log(err);
          });
        break;

      case "remove":
        await interaction.deferReply()
        triggerSchema.findOne({ Guild: guild.id, Command: command }, async (err, data) => {
          if (err) throw err;

          if (!data) {
            embed.setDescription(
              `<:Error:977069715149160448> Trigger doesn't exist!`
            );

            await interaction.editReply({
              embeds: [embed],
              ephemeral: true,
            });
            return;
          }

          await triggerSchema.findOneAndDelete({
            Guild: guild.id,
            Command: command,
          });

          embed.setDescription(
            `<:Success:977389031837040670> Trigger \`${command}\` removed successfully!`
          );

          await interaction.editReply({
            embeds: [embed],
          });
        })
          .clone()
          .catch(function (err) {
            console.log(err);
          });
        break;

      default:
        break;
    }
  },
};
