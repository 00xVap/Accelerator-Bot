const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
        .setName("save")
        .setDMPermission(false)
        .setDescription("Saves the currently playing song in you DMs."),

    async execute(interaction, client) {
        const { member, guild, user } = interaction;

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
                await interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setDescription(`<:Error:977069715149160448> There is no queue in this server.`)
                    ],
                    ephemeral: true
                });
                return;
            }

            const currentSong = queue.songs[0];

            try {
                await interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setDescription(`🎶 \`${currentSong.name}\` has been saved in your DMs.`)
                    ]
                })

                await user.send({
                    embeds: [new EmbedBuilder()
                        .setAuthor({ name: `Song Saved`, iconURL: client.user.displayAvatarURL() })
                        .setTitle(`\`${currentSong.name}\``)
                        .setURL(`${currentSong.url}`)
                        .setThumbnail(`${currentSong.thumbnail}`)
                        .setDescription(`
                            **Channel:** \`${currentSong.uploader.name}\`
                            **Duration:** \`${currentSong.formattedDuration}\`
                            **Requested By:** \`${currentSong.user.tag}\`
                            **Saved From:** \`${guild.name}\`
                        `)
                        .setTimestamp()
                    ]
                });
                return;
            } catch (error) {
                await interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setDescription(`<:Error:977069715149160448> Couldn't send you the song, check your settings and try again.`)
                    ],
                    ephemeral: true
                })
            }

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