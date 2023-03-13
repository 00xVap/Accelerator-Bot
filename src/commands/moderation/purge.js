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
    .setName("purge")
    .setDescription("Deletes the given amount of messages.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false)
    .addIntegerOption((option) =>
      option
        .setName("messages")
        .setDescription("Number of messages you want to delete.")
        .setRequired(true)
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

    const msg = interaction.options.getInteger("messages");
    const channel = interaction.channel;
    const perms = interaction.channel
      .permissionsFor(client.user)
      .has(PermissionFlagsBits.ManageMessages, false);

    if (!perms) {
      embed.setDescription(`
                <:Error:977069715149160448> I don't have enough permissions to do this command!
                <:space:1005359382776778802>**»** *Missing Permissions: \`MANAGE_MESSAGES\`*
            `);

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    if (msg > 100) {
      embed.setDescription(
        "<:Error:977069715149160448> You cannot delete more than 100 messages."
      );

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    if (msg < 1) {
      embed.setDescription(
        "<:Error:977069715149160448> You have to delete at least 1 message."
      );

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply();

    embed.setDescription(
      `**Are you sure you want to purge messages?**
                <:space:1005359382776778802>**»** *Messages Requested: \`${msg}\`*`
    );

    const embedConfirm = await interaction.editReply({
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

      m.deferUpdate();

      if (m.customId === "yes") {
        embed
          .setTitle("Purge Results:")
          .setDescription(
            `
                        **Moderator:** <@${interaction.user.id}>
                        **Details:**
                        <:space:1005359382776778802>**»** Messages Requested: \`${msg}\` <:Success:977389031837040670>
                        <:space:1005359382776778802>**»** Messages Deleted: \`${msg}\` <:Success:977389031837040670>
                        <:space:1005359382776778802>**»** Status: \`Successful\` <:Success:977389031837040670>
                    `
          )
          .setTimestamp();

        await interaction.deleteReply();
        await interaction.channel.messages
          .fetch({ msg })
          .then(async (message) => {
            await interaction.channel.bulkDelete(msg).catch(async (e) => {
              return;
            });
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
  },
};
