const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");

module.exports = {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Creates a customized embed in the specified channel.")
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Creates a customized embed in the specified channel.")
        .addStringOption((option) =>
          option
            .setName("description")
            .setDescription("Embed description.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("color")
            .setDescription("Embed color (Must be a HEX code).")
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Channel to send the embed.")
            .addChannelTypes(ChannelType.GuildText)
        )
        .addStringOption((option) =>
          option.setName("title").setDescription("Embed title.")
        )
        .addStringOption((option) =>
          option
            .setName("image")
            .setDescription("Embed image (Has to be an image link).")
        )
        .addStringOption((option) =>
          option.setName("footer").setDescription("Embed footer.")
        )
        .addStringOption((option) =>
          option
            .setName("thumbnail")
            .setDescription("Embed thumbnail (Has to be an image link).")
        )
    ),

  async execute(interaction, client) {
    const embed = new EmbedBuilder();

    const color = interaction.options.getString("color");
    let channel = interaction.options.getChannel("channel");
    const description = interaction.options.getString("description");
    const title = interaction.options.getString("title");
    const image = interaction.options.getString("image");
    const footer = interaction.options.getString("footer");
    const thumbnail = interaction.options.getString("thumbnail");

    if (color) {
      if (color.length > 6 || !color.startsWith("#")) {
        embed.setDescription(`<:Error:977069715149160448> Invalid HEX code!`);

        await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
        return;
      }

      embed.setColor(`${color}`);
    }

    if (description) {
      if (description.length > 4096) {
        embed.setDescription(
          `<:Error:977069715149160448> Embed description is longer than \`4096\` characters.`
        );

        await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
        return;
      }

      embed.setDescription(`${description}`);
    }

    if (title) {
      if (title.length > 256) {
        embed.setDescription(
          `<:Error:977069715149160448> Embed title is longer than \`256\` characters.`
        );

        await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
        return;
      }

      embed.setTitle(`${title}`);
    }

    if (image) {
      if (!image.startsWith("http")) {
        embed.setDescription(
          `<:Error:977069715149160448> Embed image has an invalid link!`
        );

        await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
        return;
      }

      embed.setImage(`${image}`);
    }

    if (footer) {
      if (footer.length > 2048) {
        embed.setDescription(
          `<:Error:977069715149160448> Embed footer is longer than \`2048\` characters.`
        );

        await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
        return;
      }

      embed.setFooter({ text: `${footer}` });
    }

    if (thumbnail) {
      if (!thumbnail.startsWith("http")) {
        embed.setDescription(
          `<:Error:977069715149160448> Embed thumbnail has an invalid link!`
        );

        await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
        return;
      }

      embed.setThumbnail(`${thumbnail}`);
    }

    if (channel) {
      const embed2 = new EmbedBuilder().setDescription(
        `<:Success:977389031837040670> Embed sent!`
      );
      channel.send({
        embeds: [embed],
      });
      await interaction.reply({
        embeds: [embed2],
        ephemeral: true,
      });
      return;
    } else if (!channel) {
      await interaction.reply({
        embeds: [embed],
      });
      return;
    }
    await interaction.reply({
      embeds: [embed],
    });
  },
};
