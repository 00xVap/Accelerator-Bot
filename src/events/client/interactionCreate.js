const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    await interaction.client.application.fetch();

    const perms = interaction.channel
      .permissionsFor(client.user)
      .has(PermissionFlagsBits.SendMessages, false);

    if (!perms) {
      const embed = new EmbedBuilder().setDescription(`
                <:Error:977069715149160448> I don't have enough permissions to do this command!
                <:space:1005359382776778802>**»** *Missing Permissions: \`SEND_MESSAGES\`*
            `);

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    const channel = interaction.channel;

    if (interaction.isChatInputCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const command = commands.get(commandName);
      if (!command) return;

      try {
        await command.execute(interaction, client);
      } catch (err) {
        console.log(err);
        const embed = new EmbedBuilder()
          .setColor(client.color)
          .setDescription(
            `
                        <:Error:977069715149160448> **An error occured while executing this command.**
                        <:space:1005359382776778802>**»** *You shouldn't be getting this error, contact ${interaction.client.application.owner.tag}.*
                        
                        **Error:** \`${err}\`
                    `
          )
          .setTimestamp();

        try {
          await interaction.reply({
            embeds: [embed],
            ephemeral: true,
          });
          return;
        } catch (error) {
          try {
            await interaction.editReply({
              embeds: [embed],
            });
            return;
          } catch (error) {
            await channel.send({
              embeds: [embed],
            });
          }
        }
      }
    } else if (interaction.isContextMenuCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const contextCommand = commands.get(commandName);
      if (!contextCommand) return;

      try {
        await contextCommand.execute(interaction, client);
      } catch (err) {
        console.log(err);
        const embed = new EmbedBuilder()
          .setColor(client.color)
          .setDescription(
            `
                        <:Error:977069715149160448> **An error occured while executing this command.**
                        <:space:1005359382776778802>**»** *You shouldn't be getting this error, contact ${interaction.client.application.owner.tag}.*
                        
                        **Error:** \`${err}\`
                    `
          )
          .setTimestamp();

        try {
          await interaction.reply({
            embeds: [embed],
            ephemeral: true,
          });
          return;
        } catch (error) {
          try {
            await interaction.editReply({
              embeds: [embed],
            });
            return;
          } catch (error) {
            await channel.send({
              embeds: [embed],
            });
          }
        }
      }
    }
  },
};
