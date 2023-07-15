const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
        .setName("report")
        .setDescription("Report a bug to the developers.")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("bug")
                .setDescription("Report a bug to the developers.")
        ),

    async execute(interaction, client) {
        const { options } = interaction;

        let subcommands = options.getSubcommand();

        switch (subcommands) {
            case "bug":
                const bugModal = new ModalBuilder()
                    .setCustomId("bug")
                    .setTitle("Accelerator | Report a Bug");

                const question1 = new TextInputBuilder()
                    .setCustomId("bug1")
                    .setLabel("Which command are you getting this bug on?")
                    .setPlaceholder("Ex: /play")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMaxLength(250);

                const question2 = new TextInputBuilder()
                    .setCustomId("bug2")
                    .setLabel("What exactly is the error you are getting?")
                    .setPlaceholder("Detailed paragraph on the type of error you are experiencing")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                    .setMaxLength(1000);

                const question3 = new TextInputBuilder()
                    .setCustomId("bug3")
                    .setLabel("Tell us the steps to replicate this error.")
                    .setPlaceholder("Detailed step by step list to replicated the error")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                    .setMaxLength(1000);

                const firstActionRow = new ActionRowBuilder().addComponents(question1);
                const secondActionRow = new ActionRowBuilder().addComponents(question2);
                const thirdActionRow = new ActionRowBuilder().addComponents(question3);

                bugModal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

                await interaction.showModal(bugModal);

                break;

            default:
                break;
        }
    },
};