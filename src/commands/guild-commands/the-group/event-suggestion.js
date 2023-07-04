const { SlashCommandBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, Events } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("event-suggestion")
        .setDescription("Suggest an event for our Event Managers!"),

    async execute(interaction, client) {
        const modal = new ModalBuilder()
            .setCustomId("event")
            .setTitle(`${interaction.guild.name} Event Suggestion`)

        const eventTitleInput = new TextInputBuilder()
            .setCustomId("title")
            .setLabel("What is the title of the event?")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMaxLength(99)

        const eventDescriptionInput = new TextInputBuilder()
            .setCustomId("description")
            .setLabel("Write us a description of your event.")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setMaxLength(2500)

        const eventPriceInput = new TextInputBuilder()
            .setCustomId("price")
            .setLabel("What rewards are you suggesting?")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("This question is optional.")
            .setMaxLength(99)
            .setRequired(false)

        const firstRow = new ActionRowBuilder().addComponents(eventTitleInput)
        const secondRow = new ActionRowBuilder().addComponents(eventDescriptionInput)
        const thirdRow = new ActionRowBuilder().addComponents(eventPriceInput)

        modal.addComponents(firstRow, secondRow, thirdRow)

        await interaction.showModal(modal)
    },
};
