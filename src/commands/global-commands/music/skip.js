const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDMPermission(false)
        .setDescription("Skips the current song."),

    async execute(interaction, client) {
        const { options, member, guild, channel } = interaction;

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

        const queue = await client.distube.getQueue(voiceChannel);

        if (!queue) {
            const embed = new EmbedBuilder()
                .setDescription(`<:Error:977069715149160448> There is no queue in this server.`)

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
            return;
        }

        try {
            await queue.skip(voiceChannel);
            embed.setDescription("⏩ Song has been skipped.")
            await interaction.reply({
                embeds: [embed],
            });

        } catch (err) {
            embed.setDescription("⏹️ No song have been queued up. The queue has been stopped.")

            await queue.stop(voiceChannel);

            await interaction.reply({
                embeds: [embed],
                ephemeral: false
            });
            return;
        }
    },
};