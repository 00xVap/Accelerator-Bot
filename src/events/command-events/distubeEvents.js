const { EmbedBuilder } = require("discord.js");
const client = require("../../index");

client.distube
    .on('playSong', (queue, song) =>
        queue.textChannel.send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: "Now playing.", iconURL: client.user.displayAvatarURL() })
                    .setTitle(`\`${song.name}\``)
                    .setURL(`${song.url}`)
                    .setThumbnail(`${song.thumbnail}`)
                    .setDescription(`**Channel:** \`${song.uploader.name}\`\n**Duration:** \`${song.formattedDuration}\`\n**Requested by:** ${song.user}`)
                    .setTimestamp()
            ]
        })
    )
    .on('addSong', (queue, song) =>
        queue.textChannel.send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: "Added to queue.", iconURL: client.user.displayAvatarURL() })
                    .setTitle(`\`${song.name}\``)
                    .setURL(`${song.url}`)
                    .setThumbnail(`${song.thumbnail}`)
                    .setDescription(`**Channel:** \`${song.uploader.name}\`\n**Duration:** \`${song.formattedDuration}\`\n**Requested by:** ${song.user}`)
                    .setTimestamp()
            ]
        })
    )
    .on('addList', (queue, playlist) =>
        queue.textChannel.send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: "Added to queue.", iconURL: client.user.displayAvatarURL() })
                    .setTitle(`\`${playlist.name}\``)
                    .setURL(`${playlist.url}`)
                    .setThumbnail(`${playlist.thumbnail}`)
                    .setDescription(`**Number of songs:** \`${playlist.songs.length}\`\n**Requested by:** ${playlist.user}`)
                    .setTimestamp()
            ]
        })
    )
    .on('error', (channel, e) => {
        if (channel) {
            channel.send({
                embeds: [new EmbedBuilder()
                    .setDescription(`<:Error:977069715149160448> ${e.toString().slice(0, 1974)}`)]
            })
        } else {
            console.error(e)
        }
    })
    .on('empty', (channel) => {
        channel.send({
            embeds: [new EmbedBuilder()
                .setDescription('<:Error:977069715149160448> Voice channel is empty! Leaving the channel...')]
        })
    })
    .on('searchNoResult', (message, query) =>
        message.channel.send({
            embeds: [new EmbedBuilder()
                .setDescription(`<:Error:977069715149160448> No result found for \`${query}\`!`)]
        })
    )