const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
  PermissionFlagsBits,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
} = require("discord.js");
const warnSchema = require("../../../model/warning");
const moment = require("moment");

module.exports = {
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Add, remove or view a user's warnings.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Warns the specified user.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("User you want to warn.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("Reason for warning this user.")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Removes a warning based on ID.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("User you want to remove warns.")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("id")
            .setDescription("ID of the warning.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("view")
        .setDescription("View a user's warnings.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("View the warnings of this user.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("clear")
        .setDescription("Clears all warning of a user.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Clear the warnings of this user.")
            .setRequired(true)
        )
    ),

  async execute(interaction, client) {
    const { guildId, user } = interaction;

    const subcommand = interaction.options.getSubcommand(["add", "remove", "view"]);

    const target = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");
    const warnId = interaction.options.getInteger("id") - 1;
    const warnDate = new Date(interaction.createdTimestamp);

    const userTag = `${target.username}#${target.discriminator}`;

    const embed = new EmbedBuilder();

    switch (subcommand) {
      case "add":
        warnSchema.findOne(
          {
            GuildID: interaction.guild.id,
            UserID: target.id,
            UserTag: userTag,
          },
          async (err, data) => {
            if (err) throw err;

            if (!data) {
              data = new warnSchema({
                GuildID: guildId,
                UserID: target.id,
                UserTag: userTag,
                Content: [
                  {
                    ExecutorId: user.id,
                    ExecutorTag: user.tag,
                    Reason: reason,
                    Date: warnDate,
                  },
                ],
              });
            } else {
              const warnContent = {
                ExecutorId: user.id,
                ExecutorTag: user.tag,
                Reason: reason,
                Date: warnDate,
              };
              data.Content.push(warnContent);
            }
            data.save();
          }
        );

        embed.setDescription(`
                    <:Success:977389031837040670> User warned successfully.
                    <:space:1005359382776778802>**»** *User: ${userTag}*
                    <:space:1005359382776778802>**»** *Reason: ${reason || "No reason provided."
          }*
                `);

        await interaction.reply({
          embeds: [embed],
        });
        break;

      case "remove":
        warnSchema.findOne(
          {
            GuildID: interaction.guild.id,
            UserID: target.id,
            UserTag: userTag,
          },
          async (err, data) => {
            if (err) throw err;

            if (!data) {
              embed.setDescription(
                `<:Error:977069715149160448> User has no warnings.`
              );

              await interaction.reply({
                embeds: [embed],
                ephemeral: true,
              });
              return;
            }

            data.Content.splice(warnId, 1);
            data.save();

            embed.setDescription(`
                            <:Success:977389031837040670> Warning deleted successfully.
                            <:space:1005359382776778802>**»** *User: ${userTag}*
                            <:space:1005359382776778802>**»** *ID: \`${warnId + 1
              }\`*
                        `);

            await interaction.reply({
              embeds: [embed],
            });
            return;
          }
        );

        break;

      case "view":
        warnSchema.findOne(
          {
            GuildID: interaction.guild.id,
            UserID: target.id,
            UserTag: userTag,
          },
          async (err, data) => {
            if (err) throw err;

            if (!data) {
              embed.setDescription(
                `<:Error:977069715149160448> User has no warnings.`
              );

              await interaction.reply({
                embeds: [embed],
                ephemeral: true,
              });
              return;
            }

            embed
              .setAuthor({
                name: `${target.tag}'s Warnings`,
                iconURL: user.displayAvatarURL({ dynamic: true }),
              })
              .setDescription(
                `${data.Content.map((w, i) => `
                  ID: \`${i + 1}\` **-** <t:${moment(w.Date).unix()}:R>
                  <:space:1005359382776778802>**»** *Reason: ${w.Reason || "No reason provided."}*
                `).join(" ")}`
              )
              .setTimestamp();

            await interaction.reply({
              embeds: [embed],
            });
            return;
          }
        );
        break;

      case "clear":
        warnSchema.findOne(
          {
            GuildID: interaction.guild.id,
            UserID: target.id,
            UserTag: userTag,
          },
          async (err, data) => {
            if (err) throw err;

            if (!data) {
              embed.setDescription(
                `<:Error:977069715149160448> User has no warnings.`
              );

              await interaction.reply({
                embeds: [embed],
                ephemeral: true,
              });
              return;
            }
            await interaction.deferReply();

            await warnSchema.findOneAndDelete({
              GuildID: guildId,
              UserID: target.id,
              UserTag: userTag,
            });

            embed.setDescription(`
                            <:Success:977389031837040670> Warnings cleared successfully.
                            <:space:1005359382776778802>**»** *User: ${userTag}*
                        `);

            await interaction.editReply({
              embeds: [embed],
            });
            return;
          }
        );
        break;

      default:
        break;
    }
  },
};
