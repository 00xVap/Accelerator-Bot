const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {

        if (interaction.customId === "event") {
            if (!interaction.isModalSubmit()) return;
            const embedSuccess = new EmbedBuilder()
                .setDescription(`<:Success:977389031837040670> Your suggestion was submitted successfully!`)

            await interaction.reply({
                embeds: [embedSuccess],
                ephemeral: true
            });

            const eventTitle = interaction.fields.getTextInputValue("title")
            const eventDescription = interaction.fields.getTextInputValue("description")
            const eventPrice = interaction.fields.getTextInputValue("price")

            const channel = client.channels.cache.get("1089840703649091695")

            const embed = new EmbedBuilder()
                .setAuthor({ name: `Event Suggestion`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setTitle(`\`${interaction.user.tag}\` has suggested a new event.`)
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`
                    __**Event Title/Name**__
                    \`\`\`${eventTitle}\`\`\`
                    __**Event Description**__
                    \`\`\`${eventDescription}\`\`\`
                    __**Event Rewards (OPTIONAL)**__
                    \`\`\`${eventPrice || `No answer provided.`}\`\`\`
                `)
                .setFooter({ text: `User ID: ${interaction.user.id}` })

            await channel.send({
                embeds: [embed]
            });
            return;
        } else if (interaction.customId === "applications") {
            if (!interaction.isModalSubmit()) return;
            const embedSuccess = new EmbedBuilder()
                .setDescription(`<:Success:977389031837040670> Your suggestion was submitted successfully!`)

            await interaction.reply({
                embeds: [embedSuccess],
                ephemeral: true
            });

            const a1 = interaction.fields.getTextInputValue("q1")
            const a2 = interaction.fields.getTextInputValue("q2")
            const a3 = interaction.fields.getTextInputValue("q3")

            const channel = client.channels.cache.get("1093801035421720656")

            const embed = new EmbedBuilder()
                .setAuthor({ name: `Event Manager Applications`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setTitle(`\`${interaction.user.tag}\` has submitted a new application.`)
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`
                    __**Why do you want to be an Event Manager?**__
                    \`\`\`${a1}\`\`\`
                    __**At which moment of the day are you online?**__
                    \`\`\`${a2}\`\`\`
                    __**Will you be active enough?**__
                    \`\`\`${a3}\`\`\`
                `)
                .setFooter({ text: `User ID: ${interaction.user.id}` })

            await channel.send({
                embeds: [embed]
            });
            return;
        } else if (interaction.customId === "bug") {
            if (!interaction.isModalSubmit()) return;
            const embedSuccess = new EmbedBuilder()
                .setDescription(`<:Success:977389031837040670> Your report was submitted successfully! The developers have been notified and will look into it shortly.`)

            await interaction.reply({
                embeds: [embedSuccess],
                ephemeral: true
            });

            const a1 = interaction.fields.getTextInputValue("bug1")
            const a2 = interaction.fields.getTextInputValue("bug2")
            const a3 = interaction.fields.getTextInputValue("bug3")

            const channel = client.channels.cache.get("1124594303059103764")

            const embed = new EmbedBuilder()
                .setAuthor({ name: `Accelerator | Bugs`, iconURL: client.user.displayAvatarURL() })
                .setTitle(`New Bug Report`)
                .setDescription(`
                    <@${interaction.user.id}> has submitted a new bug report.
                
                    __**Which command are you getting this bug on?**__
                    \`\`\`${a1}\`\`\`
                    __**What exactly is the error you are getting?**__
                    \`\`\`${a2}\`\`\`
                    __**Tell us the steps to replicate this error.**__
                    \`\`\`${a3}\`\`\`
                `)
                .setTimestamp()

            await channel.send({
                content: `<@&1000139993194442895>`,
                embeds: [embed]
            });
            return;
        }
    },
};