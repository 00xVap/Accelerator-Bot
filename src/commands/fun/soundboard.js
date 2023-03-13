const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const {
  createAudioPlayer,
  joinVoiceChannel,
  createAudioResource,
  AudioPlayerStatus,
} = require("@discordjs/voice");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("soundboard")
    .setDescription(
      "Plays sound effects in the voice channel you are connected to."
    )
    .addStringOption((option) =>
      option
        .setName("sound")
        .setDescription("The sound you want to play in the voice channel.")
        .setRequired(true)
        .addChoices(
          { name: "Ambatukam", value: "ambatukam" },
          { name: "Vine Boom", value: "boom" },
          { name: "Heheheha", value: "heheheha" },
          { name: "Discord Ping", value: "ping" },
          { name: "Auugh", value: "auugh" }
        )
    ),

  async execute(interaction, client) {
    const embed = new EmbedBuilder();

    const sound = interaction.options.getString("sound");
    const perms = interaction.channel
      .permissionsFor(client.user)
      .has(PermissionFlagsBits.Connect, false);

    if (!perms) {
      embed.setDescription(`
                <:Error:977069715149160448> I don't have enough permissions to do this command!
                <:space:1005359382776778802>**»** *Missing Permissions: \`VOICE_CONNECT\`*
            `);

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    if (!interaction.member.voice.channel) {
      embed.setDescription(
        "<:Error:977069715149160448> You have to be in a voice channel."
      );

      await interaction.editReply({
        embeds: [embed],
      });
      return;
    }

    await interaction.deferReply();

    const connection = joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.guild.id,
      adapterCreator:
        interaction.member.voice.channel.guild.voiceAdapterCreator,
    });
    const player = createAudioPlayer();

    embed.setDescription("<:Success:977389031837040670> Playing audio.");

    switch (sound) {
      case "ambatukam":
        const resourceAmbatukam = createAudioResource(
          "https://cdn.discordapp.com/attachments/817958270949261313/1073556788873531392/ambatukam.mp3"
        );

        connection.subscribe(player);
        player.play(resourceAmbatukam);

        player.on(AudioPlayerStatus.Idle, () => {
          connection.destroy();
        });

        await interaction.editReply({
          embeds: [embed],
        });
        break;

      case "boom":
        const resourceBoom = createAudioResource(
          "https://cdn.discordapp.com/attachments/817958270949261313/983933389411352576/boom.mp3"
        );

        connection.subscribe(player);
        player.play(resourceBoom);

        player.on(AudioPlayerStatus.Idle, () => {
          connection.destroy();
        });

        await interaction.editReply({
          embeds: [embed],
        });
        break;

      case "heheheha":
        const resourceHeheheha = createAudioResource(
          "https://cdn.discordapp.com/attachments/817958270949261313/983941250166165585/heheheha.mp3"
        );

        connection.subscribe(player);
        player.play(resourceHeheheha);

        player.on(AudioPlayerStatus.Idle, () => {
          connection.destroy();
        });

        await interaction.editReply({
          embeds: [embed],
        });
        break;

      case "auugh":
        const resourceAuugh = createAudioResource(
          "https://cdn.discordapp.com/attachments/817958270949261313/977445240749314048/auugh.mp3"
        );

        connection.subscribe(player);
        player.play(resourceAuugh);

        player.on(AudioPlayerStatus.Idle, () => {
          connection.destroy();
        });

        await interaction.editReply({
          embeds: [embed],
        });
        break;

      case "ping":
        const resourcePing = createAudioResource(
          "https://cdn.discordapp.com/attachments/817958270949261313/979603007392059402/ping.mp3"
        );

        connection.subscribe(player);
        player.play(resourcePing);

        player.on(AudioPlayerStatus.Idle, () => {
          connection.destroy();
        });

        await interaction.editReply({
          embeds: [embed],
        });
        break;

      default:
        break;
    }
  },
};
