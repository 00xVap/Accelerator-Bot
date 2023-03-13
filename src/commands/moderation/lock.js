const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Locks or unlock the current channel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription(
          "Locks the current channel, preventing users from sending messages."
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Unlocks the current channel.")
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

    const subcommand = interaction.options.getSubcommand(["add", "remove"]);
    const channel = interaction.channel;
    const perms = interaction.channel
      .permissionsFor(client.user)
      .has(PermissionFlagsBits.ManageChannels);

    if (!perms) {
      embed.setDescription(`
                <:Error:977069715149160448> I don't have enough permissions to do this command!
                <:space:1005359382776778802>**»** *Missing Permissions: \`MANAGE_CHANNELS\`*
            `);

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    switch (subcommand) {
      case "add":
        if (
          !interaction.channel
            .permissionsFor(interaction.guild.roles.everyone)
            .has(PermissionFlagsBits.SendMessages)
        ) {
          embed.setDescription(`
                            <:Error:977069715149160448> **🔒 Channel is already in lockdown!**
                            <:space:1005359382776778802>**»** *Channel: ${interaction.channel}*
                            `);

          await interaction.reply({
            embeds: [embed],
            ephemeral: true,
          });
          return;
        }

        await interaction.deferReply();

        embed.setDescription(`
                    **Are you sure you want to lock this channel?**
                    <:space:1005359382776778802>**»** *Channel: ${interaction.channel}*
                `);

        const embedConfirm = await interaction.editReply({
          embeds: [embed],
          components: [row],
        });

        const collector = embedConfirm.createMessageComponentCollector({
          componentType: ComponentType.Button,
          time: 60000,
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

          m.deferUpdate();

          if (m.customId === "yes") {
            embed
              .setTitle("Locking Results:")
              .setDescription(
                `
                                **Moderator:** <@${interaction.user.id}>
                                **Details:**
                                <:space:1005359382776778802>**»** Channel: ${interaction.channel} [\`${interaction.channel.id}\`]
                                <:space:1005359382776778802>**»** Status: 🔒 \`Locked\` <:Success:977389031837040670>
                            `
              )
              .setTimestamp();

            await interaction.deleteReply();
            await interaction.channel.permissionOverwrites
              .create(interaction.guild.id, {
                SendMessages: false,
              })
              .catch(async (e) => {
                return;
              });

            await channel.send({
              embeds: [embed],
              components: [],
            });
            return;
          } else if (m.customId === "no") {
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
        if (
          interaction.channel
            .permissionsFor(interaction.guild.roles.everyone)
            .has(PermissionFlagsBits.SendMessages)
        ) {
          embed.setDescription(`
                            <:Error:977069715149160448> **🔓 Channel is not in lockdown!**
                            <:space:1005359382776778802>**»** *Channel: ${interaction.channel}*
                            `);

          await interaction.reply({
            embeds: [embed],
            ephemeral: true,
          });
          return;
        }

        await interaction.deferReply();

        embed.setDescription(`
                    **Are you sure you want to unlock this channel?**
                    <:space:1005359382776778802>**»** *Channel: ${interaction.channel}*
                `);

        const embedConfirm2 = await interaction.editReply({
          embeds: [embed],
          components: [row],
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

          m.deferUpdate();

          if (m.customId === "yes") {
            embed
              .setTitle("Unlocking Results:")
              .setDescription(
                `
                                **Moderator:** <@${interaction.user.id}>
                                **Details:**
                                <:space:1005359382776778802>**»** Channel: ${interaction.channel} [\`${interaction.channel.id}\`]
                                <:space:1005359382776778802>**»** Status: 🔓 \`Unlocked\` <:Success:977389031837040670>
                            `
              )
              .setTimestamp();

            await interaction.deleteReply();
            await interaction.channel.permissionOverwrites
              .create(interaction.guild.id, {
                SendMessages: true,
              })
              .catch(async (e) => {
                return;
              });

            await channel.send({
              embeds: [embed],
              components: [],
            });
            return;
          } else if (m.customId === "no") {
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
