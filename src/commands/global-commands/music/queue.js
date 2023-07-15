const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDMPermission(false)
        .setDescription("View the server queue."),

    async execute(interaction, client) {
        const { member, guild } = interaction;

        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            const embed = new EmbedBuilder()
                .setDescription("<:Error:977069715149160448> You have to be in a voice channel to execute this command.")

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
            return;
        }

        if (!member.voice.channelId == guild.members.me.voice.guildId) {
            const embed = new EmbedBuilder()
                .setDescription(`<:Error:977069715149160448> I am already connected to <#${guild.members.me.voice.channelId}>.`)

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
            return;
        }

        const row = new ActionRowBuilder()
        const next = new ButtonBuilder()
            .setCustomId("queueNext")
            .setLabel(`→`)
            .setStyle(ButtonStyle.Primary)
        const back = new ButtonBuilder()
            .setCustomId("queueBack")
            .setLabel(`←`)
            .setStyle(ButtonStyle.Primary)
        row.addComponents(back, next)

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

            let currentPage = 0;
            const embeds = generateQueueEmbeds(queue);

            const queueEmbed = await interaction.reply({
                content: `> **Current Page:** \`${currentPage + 1}/${embeds.length}\``,
                embeds: [embeds[currentPage]],
                components: [row]
            });

            const collector = queueEmbed.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 900000
            });

            collector.on("collect", async (q) => {
                if (q.user.id != interaction.user.id) {
                    const embed = new EmbedBuilder()
                        .setDescription(`<:Error:977069715149160448> This interaction belongs to someone else.`);

                    await q.reply({
                        embeds: [embed],
                        ephemeral: true,
                    });
                    return;
                } else {
                    await q.deferUpdate()

                    switch (q.customId) {
                        case "queueNext":
                            if (currentPage < embeds.length - 1) {
                                currentPage++;

                                await interaction.editReply({
                                    content: `> **Current Page:** \`${currentPage + 1}/${embeds.length}\``,
                                    embeds: [embeds[currentPage]],
                                    components: [row]
                                })
                            }
                            break;

                        case "queueBack":
                            if (currentPage !== 0) {
                                --currentPage;

                                await interaction.editReply({
                                    content: `> **Current Page:** \`${currentPage + 1}/${embeds.length}\``,
                                    embeds: [embeds[currentPage]],
                                    components: [row]
                                })
                            }
                            break;

                        default:
                            break;
                    }
                }
            });

            collector.on("end", async (collected) => {
                try {
                    row.components.forEach((c) => c.setDisabled(true));

                    await queueEmbed.edit({
                        components: [row],
                    });
                    return;
                } catch (error) {
                    try {
                        await queueEmbed.edit({
                            components: [],
                        });
                        return;
                    } catch (error) {
                        return;
                    }
                }
            });

        } catch (err) {
            console.log(err);

            const embed = new EmbedBuilder()
                .setDescription("<:Error:977069715149160448> Something went wrong..")
            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
            return;
        }
    }
};

function generateQueueEmbeds(queue) {
    const embeds = [];
    let k = 10;

    for (let i = 0; i < queue.songs.length; i += 10) {
        const current = queue.songs.slice(i, k);
        let j = i;
        k += 10;
        const info = current.map(track => `\`${++j}.\` [**${track.name}**](${track.url}) - \`[${track.formattedDuration}]\` • ${track.user}`).join("\n\n");
        const embed = new EmbedBuilder()
            .setAuthor({ name: `Accelerator | Queue`, iconURL: `https://cdn.discordapp.com/avatars/1011816140885991425/2ee7ce27fe55c22e8cf7d966b90fe841.webp?size=4096` })
            .setDescription(`${info}`)
            .setTimestamp()
        embeds.push(embed);
    }
    return embeds;
}