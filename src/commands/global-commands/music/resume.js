const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDMPermission(false)
        .setDescription("Resumes the current song. If already paused."),

    async execute(interaction, client) {
        const { member, guild } = interaction;

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

        try {
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

            await queue.resume(voiceChannel);
            embed.setDescription("▶️ Song has been resumed.")
            await interaction.reply({
                embeds: [embed],
            });

        } catch (err) {
            console.log(err);

            embed.setDescription("<:Error:977069715149160448> Something went wrong..")
            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
            return;
        }
    },
};