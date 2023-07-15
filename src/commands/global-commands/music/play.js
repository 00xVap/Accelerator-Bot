const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const client = require("../../../index");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
        .setName("play")
        .setDMPermission(false)
        .setDescription("Loads a video/playlist from youtube from links or search terms.")
        .addStringOption(option =>
            option.setName("query")
                .setDescription("Link/SearchTerm")
                .setRequired(true)
        ),

    async execute(interaction) {
        const { options, member, guild, channel } = interaction;

        const query = options.getString("query");
        const voiceChannel = member.voice.channel;

        const embed = new EmbedBuilder();

        if (!voiceChannel) {
            embed.setDescription("<:Error:977069715149160448> You have to be in a voice channel to execute this command.")

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
            return;
        }

        if (!member.voice.channelId == guild.members.me.voice.guildId) {
            embed.setDescription(`<:Error:977069715149160448> I am already playing music in <#${guild.members.me.voice.channelId}>.`)

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
            return;
        }

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Connect || PermissionsBitField.Flags.ViewChannel)) {
            embed.setDescription(`<:Error:977069715149160448> I don't have permissions to join this voice channel.`)

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
            return;
        }

        await interaction.deferReply();

        client.distube.play(voiceChannel, query, { textChannel: channel, member: member }).catch(async err => {
            embed.setDescription(`<:Error:977069715149160448> ${err.message}.`)

            await interaction.followUp({
                embeds: [embed],
                ephemeral: true
            });
            return;
        })

        await interaction.editReply({
            content: "🎶 Loading song...",
        });
    },
};