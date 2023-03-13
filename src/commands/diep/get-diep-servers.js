const {
  EmbedBuilder,
  SlashCommandBuilder,
  inlineCode,
  hyperlink,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ComponentType,
} = require("discord.js");
const fetch = require("node-fetch");
const moment = require("moment");
const convertServerIdToParty = require("../../utils/convertServerIdToParty");

function generateRandomInteger(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}
let diepFetched = "https://matchmaker.api.rivet.gg/v1/lobbies/list";
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
  data: new SlashCommandBuilder()
    .setName("get-diep-servers")
    .setDescription("Returns the current Diep.io Servers.")
    .setDMPermission(true)
    .addStringOption((option) =>
      option
        .setName("region")
        .setDescription("Select the region")
        .setRequired(true)
        .addChoices(
          { name: "Atlanta", value: "lnd-atl" },
          { name: "San Francisco", value: "lnd-sfo" },
          { name: "Frankfurt", value: "lnd-fra" },
          { name: "Tokyo", value: "lnd-tok" },
          { name: "Sydney", value: "lnd-syd" }
        )
    ),

  async execute(interaction, client) {
    const lastFetched = fetch(diepFetched, {
      headers: {
        Origin: "https:/diep.io/",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!lastFetched) {
      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(
          "<:Error:977069715149160448> An error occured. Try again later."
        );

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply();

    lastFetched
      .then((r) => r.json())
      .then(async (data) => {
        const servers = [];
        let playerCount = 0;
        let serverCount = 0;
        const timestamp = new Date(lastFetched.createdTimestamp);

        for (const eachLobby of data.lobbies) {
          playerCount += eachLobby.total_player_count;
          servers.push({
            link: convertServerIdToParty(eachLobby.lobby_id),
            gamemode: eachLobby.game_mode_id,
            region: eachLobby.region_id,
            playerCount: eachLobby.total_player_count,
          });
          serverCount = servers.length;
        }

        const num = (Math.floor(Math.random() * 54) + 1).toString();

        const diepHomeEmbed = new EmbedBuilder()
          .setThumbnail(`attachment://${num}.png`)
          .setAuthor({
            name: `Diep.io Links`,
            url: `https://diep.io/`,
            iconURL: `attachment://${num}.png`,
          })
          .setTimestamp();

        let selectedRegion = interaction.options.getString("region");

        const regions = [...new Set(servers.map((i) => i.region))];
        const modes = [
          ...new Set(
            servers
              .filter((f) => f.gamemode != "sandbox")
              .map((i) => i.gamemode)
          ),
        ];
        const optionsList = [];

        regions.forEach((c) =>
          optionsList.push({
            label: `${niceNames[c] || c} (${
              servers.filter((a) => a.region === c && !a.gamemode != "sandbox")
                .length
            })`,
            description: `View links for ${niceNames[c] || c}`,
            value: c,
          })
        );

        const cat = selectedRegion;

        fieldsObjs = [];
        modes.forEach((mode) => {
          fieldsObjs.push({
            name: `${niceNames[mode] || mode}`,
            value:
              servers
                .filter((i) => i.region === cat && i.gamemode === mode)
                .sort((a, b) => b.playerCount - a.playerCount)
                .map(
                  (m, n) =>
                    `• ` +
                    hyperlink(
                      `\`${m.playerCount} Players\``,
                      `https://${m.link}`
                    )
                )
                .join("\n") || "None",
            inline: true,
          });
        });

        const title = `${niceNames[cat] || cat} has ${inlineCode(
          servers
            .filter((a) => a.region === cat && a.gamemode != "sandbox")
            .map((t) => t.playerCount)
            .reduce((partialSum, a) => partialSum + a, 0)
        )} players across ${inlineCode(
          servers.filter((a) => a.region === cat && a.gamemode != "sandbox")
            .length
        )} servers.`;

        diepHomeEmbed.setTitle(`${niceNames[cat] || cat}`.toUpperCase());
        diepHomeEmbed.setDescription(
          `Diep.io has \`${playerCount}\` players across \`${serverCount}\` servers.\n${title}\n__Last Fetched:__ *<t:${moment().unix(
            timestamp
          )}:R>*`
        );
        diepHomeEmbed.addFields([...fieldsObjs]);
        diepHomeEmbed.addFields({
          name: "Extra",
          value:
            `• ` +
            hyperlink(`\`New Diep Tab\``, `https://diep.io/`) +
            `\n• ` +
            hyperlink(`\`World Records\``, `https://diepstats.com`),
          inline: true,
        });

        const row = new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId(`diepMenu`)
            .setPlaceholder("Select a region")
            .addOptions(
              {
                label: "Atlanta",
                description: "Servers in Atlanta region.",
                value: "lnd-atl",
                emoji: { name: "🇺🇸" },
              },
              {
                label: "San Francisco",
                description: "Servers in San Francisco region.",
                value: "lnd-sfo",
                emoji: { name: "🇺🇸" },
              },
              {
                label: "Frankfurt",
                description: "Servers in Frankfurt region.",
                value: "lnd-fra",
                emoji: { name: "🇩🇪" },
              },
              {
                label: "Tokyo",
                description: "Servers in Tokyo region.",
                value: "lnd-tok",
                emoji: { name: "🇯🇵" },
              },
              {
                label: "Sydney",
                description: "Servers in Sydney region.",
                value: "lnd-syd",
                emoji: { name: "🇦🇺" },
              }
            )
        );

        const diepMessage = await interaction.editReply({
          embeds: [diepHomeEmbed],
          files: [`src/commands/diep/images/${num}.png`],
          components: [row],
          fetchReply: true,
        });

        const collector = diepMessage.createMessageComponentCollector({
          componentType: ComponentType.StringSelect,
          time: 60000 * 5,
        });

        collector.on("collect", async (m) => {
          if (m.user.id != interaction.user.id) {
            const embed = new EmbedBuilder()
              .setColor(client.color)
              .setDescription(
                `<:Error:977069715149160448> This interaction belongs to someone else.`
              );

            await m.reply({
              embeds: [embed],
              ephemeral: true,
            });
            return;
          } else {
            m.deferUpdate();

            const diepEmbed = new EmbedBuilder()
              .setColor(client.color)
              .setAuthor({
                name: `Diep.io Links`,
                url: `https://diep.io/`,
                iconURL: `attachment://${num}.png`,
              })
              .setThumbnail(`attachment://${num}.png`)
              .setTimestamp();

            const regions = [...new Set(servers.map((i) => i.region))];
            const modes = [
              ...new Set(
                servers
                  .filter((f) => f.gamemode != "sandbox")
                  .map((i) => i.gamemode)
              ),
            ];
            const optionsList = [];

            regions.forEach((c) =>
              optionsList.push({
                label: `${niceNames[c] || c} (${
                  servers.filter(
                    (a) => a.region === c && !a.gamemode != "sandbox"
                  ).length
                })`,
                description: `View links for ${niceNames[c] || c}`,
                value: c,
              })
            );

            const cat = m.values[0];

            fieldsObjs = [];
            modes.forEach((mode) => {
              fieldsObjs.push({
                name: `${niceNames[mode] || mode}`,
                value:
                  servers
                    .filter((i) => i.region === cat && i.gamemode === mode)
                    .sort((a, b) => b.playerCount - a.playerCount)
                    .map(
                      (m, n) =>
                        `• ` +
                        hyperlink(
                          `\`${m.playerCount} Players\``,
                          `https://${m.link}`
                        )
                    )
                    .join("\n") || "None",
                inline: true,
              });
            });

            const title = `${niceNames[cat] || cat} has ${inlineCode(
              servers
                .filter((a) => a.region === cat && a.gamemode != "sandbox")
                .map((t) => t.playerCount)
                .reduce((partialSum, a) => partialSum + a, 0)
            )} players across ${inlineCode(
              servers.filter((a) => a.region === cat && a.gamemode != "sandbox")
                .length
            )} servers.`;

            diepEmbed.setTitle(`${niceNames[cat] || cat}`.toUpperCase());
            diepEmbed.setDescription(
              `Diep.io has \`${playerCount}\` players across \`${serverCount}\` servers.\n${title}\n__Last Fetched:__ <t:${moment().unix(
                diepMessage.createdTimestamp
              )}:R>`
            );
            diepEmbed.addFields([...fieldsObjs]);
            diepEmbed.addFields({
              name: "Extra",
              value:
                `• ` +
                hyperlink(`\`New Diep Tab\``, `https://diep.io/`) +
                `\n• ` +
                hyperlink(`\`World Records\``, `https://diepstats.com`),
              inline: true,
            });

            const row = new ActionRowBuilder().addComponents(
              new StringSelectMenuBuilder()
                .setCustomId(`diepMenu`)
                .setPlaceholder("Select a region")
                .addOptions(
                  {
                    label: "Atlanta",
                    description: "Servers in Atlanta region (United States). ",
                    value: "lnd-atl",
                    emoji: { name: "🇺🇸" },
                  },
                  {
                    label: "San Francisco",
                    description:
                      "Servers in San Francisco region (United States).",
                    value: "lnd-sfo",
                    emoji: { name: "🇺🇸" },
                  },
                  {
                    label: "Frankfurt",
                    description: "Servers in Frankfurt region (Germany).",
                    value: "lnd-fra",
                    emoji: { name: "🇩🇪" },
                  },
                  {
                    label: "Tokyo",
                    description: "Servers in Tokyo region (Japan).",
                    value: "lnd-tok",
                    emoji: { name: "🇯🇵" },
                  },
                  {
                    label: "Sydney",
                    description: "Servers in Sydney region (Australia).",
                    value: "lnd-syd",
                    emoji: { name: "🇦🇺" },
                  }
                )
            );

            await interaction.editReply({
              embeds: [diepEmbed],
              files: [`src/commands/diep/images/${num}.png`],
              components: [row],
            });
            return;
          }
        });
        collector.on("end", async (collected) => {
          try {
            row.components.forEach((c) => c.setDisabled(true));

            await diepMessage.edit({
              components: [row],
            });
            return;
          } catch (error) {
            try {
              await diepMessage.edit({
                components: [],
              });
              return;
            } catch (error) {
              return;
            }
          }
        });
      });
  },
};
