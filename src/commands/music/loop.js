const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { QueueRepeatMode } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription(
      "Loops the queue or the current song depending on the mode provided."
    )
    .addStringOption((option) =>
      option
        .setName("mode")
        .setDescription("Select the loop mode.")
        .setRequired(true)
        .setChoices(
          { name: "Off", value: "OFF" },
          { name: "Song", value: "TRACK" },
          { name: "Queue", value: "QUEUE" }
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Connect),

  async execute(interaction, client) {
    const embed = new EmbedBuilder();
    const queue = client.player.nodes.get(interaction.guild.id);
    const channel = interaction.member.voice.channel;

    if (!channel) {
      embed.setDescription(
        "<:Error:977069715149160448> You have to be in a voice channel."
      );

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    if (!queue) {
      embed.setDescription(
        "<:Error:977069715149160448> There are no songs in the queue."
      );

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply();

    const loopMode = interaction.options.getString("mode");

    switch (loopMode) {
      case "OFF":
        embed.setDescription(
          `<:Success:977389031837040670> Loop has been disabled.`
        );

        queue.setRepeatMode(QueueRepeatMode.OFF);

        await interaction.editReply({
          embeds: [embed],
        });
        break;

      case "TRACK":
        embed.setDescription(
          `<:Success:977389031837040670> The current song will now repeat.`
        );

        queue.setRepeatMode(QueueRepeatMode.TRACK);

        await interaction.editReply({
          embeds: [embed],
        });
        break;

      case "QUEUE":
        embed.setDescription(
          `<:Success:977389031837040670> The queue will now repeat.`
        );

        queue.setRepeatMode(QueueRepeatMode.QUEUE);

        await interaction.editReply({
          embeds: [embed],
        });
        break;

      default:
        break;
    }
  },
};
