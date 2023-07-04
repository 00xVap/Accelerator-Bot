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

module.exports = {
  cooldown: 15,
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Modifies the channel's slowmode.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add a slowmode to the channel.")
        .addStringOption((option) =>
          option
            .setName("time")
            .setDescription("The slowmode time.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove the channel's slowmode")
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
    let time = interaction.options.getString("time");
    const channel = interaction.channel;
    const perms = interaction.channel
      .permissionsFor(client.user)
      .has(PermissionFlagsBits.ManageChannels, false);

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
        const milliseconds = ms(time);

        if (!milliseconds || milliseconds < 1000 || milliseconds > 21600000) {
          embed.setDescription(
            `<:Error:977069715149160448> The provided duration is either higher than \`1s\`, lower than \`6h\`, or is invalid.`
          );

          await interaction.reply({
            embeds: [embed],
            ephemeral: true,
          });
          return;
        }

        embed.setDescription(`
                    **Are you sure you want to add a slowmode to this channel?**
                    <:space:1005359382776778802>**»** *Channel: ${
                      interaction.channel
                    }*
                    <:space:1005359382776778802>**»** *Duration: \`${ms(
                      milliseconds
                    )}\`*
                `);

        const embedConfirm = await interaction.reply({
          embeds: [embed],
          components: [row],
          fetchReply: true,
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
              .setTitle("Slowmode Added:")
              .setDescription(
                `
                                **Moderator:** <@${interaction.user.id}>
                                **Details:**
                                <:space:1005359382776778802>**»** Channel: ${
                                  interaction.channel
                                }
                                <:space:1005359382776778802>**»** Duration: \`${ms(
                                  milliseconds
                                )}\`
                                <:space:1005359382776778802>**»** Status: \`Successful\` <:Success:977389031837040670>
                            `
              )
              .setTimestamp();

            await interaction.deleteReply();
            await interaction.channel
              .setRateLimitPerUser(milliseconds / 1000)
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

        embed.setDescription(
          `**Are you sure you want to remove this channel's slowmode?**
                    <:space:1005359382776778802>**»** *Channel: ${interaction.channel}*`
        );

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

          m.deferUpdate();

          if (m.customId === "yes") {
            embed
              .setTitle("Slowmode Removal:")
              .setDescription(
                `
                                **Moderator:** <@${interaction.user.id}>
                                **Details:**
                                <:space:1005359382776778802>**»** Channel: ${interaction.channel}
                                <:space:1005359382776778802>**»** Status: \`Successful\` <:Success:977389031837040670>
                            `
              )
              .setTimestamp();

            await interaction.deleteReply();
            await interaction.channel
              .setRateLimitPerUser(null)
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
