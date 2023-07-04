const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { handleGlobalCommands } = require("../../../functions/handlers/handleGlobalCommands");
const { handleEvents } = require("../../../functions/handlers/handleEvents");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reload")
        .setDescription("reload commands or events")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("commands")
                .setDescription("Reload the bot's commands.")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("events")
                .setDescription("Reload the bot's events.")
        ),

    async execute(interaction, client) {
        const { options } = interaction;

        const sub = options.getSubcommand()

        const embed = new EmbedBuilder();

        switch (sub) {
            case "commands":
                handleGlobalCommands(client);

                embed.setDescription(`<:Success:977389031837040670> Commands reloaded successfully.`)

                await interaction.reply({
                    embeds: [embed]
                });
                break;

            case "events":
                handleEvents(client);

                embed.setDescription(`<:Success:977389031837040670> Events reloaded successfully.`)

                await interaction.reply({
                    embeds: [embed]
                });
                break;

            default:
                break;
        }
    },
};