const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
        .setName("remove")
        .setDMPermission(false)
        .setDescription("Removes a song from the queue based on its position.")
        .addIntegerOption(option =>
            option.setName("id")
                .setDescription("The song number in the queue.")
                .setRequired(true)
                .setMinValue(1)
        ),

    async execute(interaction, client) {
        const { options, member, guild } = interaction;

        const songId = options.getInteger("id");
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
            embed.setDescription(`<:Error:977069715149160448> I am already connected to <#${guild.members.me.voice.channelId}>.`)

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

            if (songId > queue.songs.length) {
                const embed = new EmbedBuilder()
                    .setDescription(`<:Error:977069715149160448> There is no song at this position!`)

                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                });
                return;
            }

            if (songId === 1) {
                try {
                    await queue.skip(voiceChannel);

                    const embed = new EmbedBuilder()
                        .setDescription("⏩ Song has been skipped.")

                    await interaction.reply({
                        embeds: [embed],
                    });

                } catch (error) {
                    embed.setDescription("⏹️ No song have been queued up. The queue has been stopped.")

                    await queue.stop(voiceChannel);

                    await interaction.reply({
                        embeds: [embed],
                        ephemeral: false
                    });
                    return;
                }

                return;
            }

            await queue.songs.splice(songId - 1, 1);

            embed.setDescription(`<:Success:977389031837040670> Removed track at position \`${songId}\`.`)
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