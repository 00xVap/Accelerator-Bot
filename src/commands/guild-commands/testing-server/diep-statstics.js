const {
    EmbedBuilder,
    SlashCommandBuilder,
    hyperlink,
    ActionRowBuilder,
    ComponentType,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");
const fetch = require("node-fetch");
const { get } = require("request-promise-native");
const percentage = require("../../../utils/calculatePercentage");

function generateRandomInteger(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
}

const niceNames = {
    "lnd-sfo": "San Francisco",
    "lnd-atl": "Atlanta",
    "lnd-fra": "Frankfurt",
    "lnd-syd": "Sydney",
    "lnd-tok": "Tokyo",
    ffa: "FFA",
    teams: "2 Teams",
    "4teams": "4 Teams",
    maze: "Maze",
    event: "Event",
    sandbox: "Sandbox",
};

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("diep-statistics")
        .setDescription("Sneak-peak into the new Diep.io command.")
        .setDMPermission(true),

    async execute(interaction, client) {
        const { options } = interaction;

        const requestedRow = new ActionRowBuilder()
        const requestedButton = new ButtonBuilder()
            .setCustomId("requested")
            .setDisabled(true)
            .setStyle(ButtonStyle.Secondary)

        if (!interaction.user.discriminator || interaction.user.discriminator === 0 || interaction.user.tag === `${interaction.user.username}#0`) {
            requestedButton.setLabel(`Requested by ${interaction.user.username}`)
        } else {
            requestedButton.setLabel(`Requested by ${interaction.user.tag}`)
        }



        const voteButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL("https://top.gg/bot/1011816140885991425/vote")
            .setLabel("Vote for Accelerator!")

        requestedRow.addComponents(requestedButton, voteButton);

        const game_token = await fetch("https://identity.api.rivet.gg/v1/identities", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Origin": "https://diep.io/"
            },
            body: "{}"
        }).then(r => r.json()).then(r => r.identity_token);

        const player_token = game_token.replace("game_user", "player");

        await fetch("https://matchmaker.api.rivet.gg/v1/players/statistics", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + player_token,
                "Origin": "https://diep.io/"
            }
        }).then(r => r.json()).then(r => console.log(r))
    },
};