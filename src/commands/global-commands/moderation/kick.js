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
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kicks the specified user.")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User you want to kick.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Reason for kicking this user.")
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
    const reason = interaction.options.getString("reason");
    const channel = interaction.channel;
    const member =
      interaction.guild.members.cache.get(user.id) ||
      (await interaction.guild.members.fetch(user.id).catch((err) => { }));
    const perms = interaction.channel
      .permissionsFor(client.user)
      .has(PermissionFlagsBits.KickMembers, false);

    if (!perms) {
      embed.setDescription(`
                <:Error:977069715149160448> I don't have enough permissions to do this command!
                <:space:1005359382776778802>**»** *Missing Permissions: \`KICK_MEMBERS\`*
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

    if (!member.kickable) {
      embed.setDescription(
        `<:Error:977069715149160448> Couldn't kick this user!`
      );

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    embed.setDescription(`
            **Are you sure you want to kick this user?**
            <:space:1005359382776778802>**»** *User: \`${user.tag}\`*
            <:space:1005359382776778802>**»** *Reason: ${reason || "No reason provided."
      }*
            `);

    const embedConfirm = await interaction.reply({
      embeds: [embed],
      components: [row],
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
          .setTitle("Kick Results:")
          .setDescription(
            `
                        **Moderator:** <@${interaction.user.id}>
                        **Reason:** ${reason || "No reason provided."}
                        **Details:**
                        <:space:1005359382776778802>**»** Status: \`Successful\` <:Success:977389031837040670>
                    `
          )
          .addFields({
            name: "Kicked User",
            value: `<:space:1005359382776778802>**»** <@${user.id}> [\`${user.id}\`] <:Success:977389031837040670>`,
          })
          .setTimestamp();

        await interaction.deleteReply();
        await member
          .kick({
            reason: reason || "No reason provided.",
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
  },
};
