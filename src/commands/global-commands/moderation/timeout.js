const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
} = require("discord.js");
const ms = require("ms");
const parseTime = require("parse-duration");
const moment = require("moment");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
  cooldown: 15,
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Add or remove a member's timeout.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Puts the specified user into timeout.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("User you want to timeout.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("duration")
            .setDescription("The amount time to timeout.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("Reason for timing out this user.")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Removes the specified user's timeout.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("User you'd want to remove the timeout.")
            .setRequired(true)
        )
    ),

  async execute(interaction, client) {
    const embed = new EmbedBuilder();
    const row = new ActionRowBuilder();
    const buttonYes = new ButtonBuilder()
      .setCustomId("yes")
      .setLabel("Yes")
      .setStyle(ButtonStyle.Success);
    const buttonNo = new ButtonBuilder()
      .setCustomId("no")
      .setLabel("No")
      .setStyle(ButtonStyle.Danger);
    row.addComponents(buttonYes, buttonNo);

    const user = interaction.options.getUser("user");

    const subcommand = interaction.options.getSubcommand(["add", "remove"]);
    const member =
      interaction.guild.members.cache.get(user.id) || (await interaction.guild.members.fetch(user.id).catch((err) => { }));
    const channel = interaction.channel;

    let reason = interaction.options.getString("reason");
    let time = interaction.options.getString("duration");
    const perms = interaction.channel
      .permissionsFor(client.user)
      .has(PermissionFlagsBits.ModerateMembers, false);

    if (!perms) {
      embed.setDescription(`
        <:Error:977069715149160448> I don't have enough permissions to do this command!
        <:space:1005359382776778802>**»** *Missing Permissions: \`MODERATE_MEMBERS\`*
      `);

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    if (!member) {
      embed.setDescription(
        `<:Error:977069715149160448> Couldn't find this user!`
      );

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    if (!member.moderatable) {
      embed.setDescription(
        `<:Error:977069715149160448> Couldn't timeout this user!`
      );

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    switch (subcommand) {
      case "add":
        const parsedTime = parseTime(time);
        if (!reason) reason = "No reason provided.";

        if (!!member.communicationDisabledUntil === true) {
          embed.setDescription(`
            <:Error:977069715149160448> **User is already in timeout!**
            <:space:1005359382776778802>**»** *User: ${user.tag}*
            <:space:1005359382776778802>**»** *Ends: <t:${moment(member.communicationDisabledUntilTimestamp).unix()}:R>*
          `);

          await interaction.reply({
            embeds: [embed],
            ephemeral: true,
          });
          return;
        }

        if (parsedTime > ms("28d")) {
          embed.setDescription(
            "<:Error:977069715149160448> The provided duration has to be lower than `28d`!"
          );

          await interaction.reply({
            embeds: [embed],
            ephemeral: true,
          });
          return;
        }

        if (!parsedTime) {
          embed.setDescription(
            "<:Error:977069715149160448> The provided duration is invalid!"
          );

          await interaction.reply({
            embeds: [embed],
            ephemeral: true,
          });
          return;
        }

        embed.setDescription(`
          **Are you sure you want to timeout this user?**
          <:space:1005359382776778802>**»** *User: \`${user.tag}\`*
          <:space:1005359382776778802>**»** *Reason: ${reason}*
          <:space:1005359382776778802>**»** *Duration: \`${time}\`*
        `);

        const embedConfirm = await interaction.reply({
          embeds: [embed],
          components: [row],
          fetchReply: true,
        });

        const collector = embedConfirm.createMessageComponentCollector({
          componentType: ComponentType.Button,
          time: 30000,
        });

        collector.on("collect", async (m) => {
          if (m.user.id != interaction.user.id) {
            const embed = new EmbedBuilder().setDescription(
              `<:Error:977069715149160448> This interaction belongs to someone else.`
            );

            await m.reply({
              embeds: [embed],
              ephemeral: true,
            });
            return;
          }

          if (m.customId === "yes") {
            m.deferUpdate();

            embed
              .setTitle("Timeout Results:")
              .setDescription(`
                **Moderator:** <@${interaction.user.id}>
                **Reason:** ${reason}
                **Details:**
                <:space:1005359382776778802>**»** Duration: \`${time}\` <:Success:977389031837040670>
                <:space:1005359382776778802>**»** Status: \`Successful\` <:Success:977389031837040670>
              `)
              .addFields({
                name: "Timed Out User",
                value: `<:space:1005359382776778802>**»** <@${user.id}> [\`${user.id}\`] <:Success:977389031837040670>`,
              })
              .setTimestamp();

            await interaction.deleteReply();
            await member.timeout(parsedTime, reason).catch(async (e) => {
              return;
            });
            wait(ms(time)).then(async () => {
              await member.timeout(null).catch(async (e) => {
                return;
              });
            });

            await channel.send({
              embeds: [embed],
              components: [],
            });
            return;
          } else if (m.customId === "no") {
            m.deferUpdate();

            const embed = new EmbedBuilder().setTitle("Action cancelled!");

            await interaction.deleteReply();
            await channel.send({
              embeds: [embed],
              components: [],
            });
            return;
          }
        });
        collector.on("end", async (collected) => {
          try {
            row.components.forEach((c) => c.setDisabled(true));

            await embedConfirm.edit({
              components: [row],
            });
            return;
          } catch (error) {
            try {
              await embedConfirm.edit({
                components: [],
              });
              return;
            } catch (error) {
              return;
            }
          }
        });
        break;

      case "remove":
        if (!!member.communicationDisabledUntil === false) {
          embed.setDescription(`
            <:Error:977069715149160448> **User is not in timeout!**
            <:space:1005359382776778802>**»** *User: <@${user.id}>*
          `);

          await interaction.reply({
            embeds: [embed],
            components: [],
            ephemeral: true,
          });
          return;
        }

        embed.setDescription(`
          **Are you sure you want to remove this user's timeout?**
          <:space:1005359382776778802>**»** *User: <@${user.id}>*
          <:space:1005359382776778802>**»** *Ends: <t:${moment(member.communicationDisabledUntilTimestamp).unix()}:R>*
        `);

        const embedConfirm2 = await interaction.reply({
          embeds: [embed],
          components: [row],
          fetchReply: true,
        });

        const collector2 = embedConfirm2.createMessageComponentCollector({
          componentType: ComponentType.Button,
          time: 30000,
        });

        collector2.on("collect", async (m) => {
          if (m.user.id != interaction.user.id) {
            const embed = new EmbedBuilder().setDescription(
              `<:Error:977069715149160448> This interaction belongs to someone else.`
            );

            await m.reply({
              embeds: [embed],
              ephemeral: true,
            });
            return;
          }

          if (m.customId === "yes") {
            m.deferUpdate();

            embed
              .setTitle("Timeout Removal:")
              .setDescription(
                `**Moderator:** <@${interaction.user.id}>\n**Details:**\n<:space:1005359382776778802>**»** Status: \`Successful\` <:Success:977389031837040670>`
              )
              .addFields({
                name: "Timeout Removed",
                value: `<:space:1005359382776778802>**»** ${user.tag} [\`${user.id}\`] <:Success:977389031837040670>`,
              })
              .setTimestamp();

            await interaction.deleteReply();
            await member.timeout(null).catch(async (e) => {
              return;
            });

            await channel.send({
              embeds: [embed],
              components: [],
            });
            return;
          } else if (m.customId === "no") {
            m.deferUpdate();

            const embed = new EmbedBuilder().setTitle("Action cancelled!");

            await interaction.deleteReply();
            await channel.send({
              embeds: [embed],
              components: [],
            });
            return;
          }
        });
        collector2.on("end", async (collected) => {
          try {
            row.components.forEach((c) => c.setDisabled(true));

            await embedConfirm2.edit({
              components: [row],
            });
            return;
          } catch (error) {
            try {
              await embedConfirm2.edit({
                components: [],
              });
              return;
            } catch (error) {
              return;
            }
          }
        });
        break;

      default:
        break;
    }
  },
};
