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
const percentage = require("../../../utils/calculatePercentage");

function generateRandomInteger(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

let diepFetched = `${process.env.acceleratorApi}/lobbies`;
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
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("diep-lobbies")
    .setDescription("Returns the active Diep.io Servers. | Credits: ToDP")
    .setDMPermission(true)
    .addStringOption((option) =>
      option
        .setName("region")
        .setDescription("Select the region")
        .setRequired(true)
        .addChoices(
          { name: "Atlanta", value: "lnd-atl", emoji: { name: "🇺🇸" } },
          { name: "San Francisco", value: "lnd-sfo", emoji: { name: "🇺🇸" } },
          { name: "Frankfurt", value: "lnd-fra", emoji: { name: "🇩🇪" } },
          { name: "Tokyo", value: "lnd-tok", emoji: { name: "🇯🇵" } },
          { name: "Sydney", value: "lnd-syd", emoji: { name: "🇦🇺" } }
        )
    ),

  async execute(interaction, client) {
    const { options } = interaction;

    const requestedRow = new ActionRowBuilder()
    const requestedButton = new ButtonBuilder()
      .setCustomId("requested")
      .setDisabled(true)
      .setStyle(ButtonStyle.Secondary)
    const voteButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setURL("https://top.gg/bot/1011816140885991425/vote")
      .setLabel("Vote for Accelerator!")

      await interaction.deferReply();

      if (!interaction.user.discriminator || interaction.user.discriminator === 0 || interaction.user.tag === `${interaction.user.username}#0`) {
        requestedButton.setLabel(`Requested by ${interaction.user.username}`)
      } else {
        requestedButton.setLabel(`Requested by ${interaction.user.tag}`)
      }

    requestedRow.addComponents(requestedButton, voteButton);

    fetch(diepFetched, {
      headers: {
        "Origin": "https:/diep.io/",
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    }).then((r) => r.json())
      .then(async (data) => {

        if (data.info.length === 0 && data.servers.length === 0) {
          const embed = new EmbedBuilder()
            .setDescription(`<:Error:977069715149160448> Accelerator API isn't working at the moment. Try again later.`)

          await interaction.editReply({
            embeds: [embed],
          });
          return;
        }

        const num = (Math.floor(Math.random() * 54) + 1).toString();

        const diepHomeEmbed = new EmbedBuilder()
          .setThumbnail(`attachment://${num}.png`)
          .setAuthor({
            name: `Diep.io Links`,
            url: `https://diep.io/`,
            iconURL: `attachment://${num}.png`,
          })
          .setTimestamp()

        let selectedRegion = options.getString("region");

        const regions = [...new Set(data.servers.map((i) => i.region))];
        const modes = [...new Set(data.servers.filter((f) => f.gamemode != "sandbox").map((i) => i.gamemode))];
        const optionsList = [];

        regions.forEach((c) =>
          optionsList.push({
            label: `${niceNames[c] || c} (${data.servers.filter((a) => a.region === c && !a.gamemode != "sandbox").length})`,
            description: `View links for ${niceNames[c] || c}`,
            value: c,
          })
        );

        const cat = selectedRegion;

        fieldsObjs = [];

        let regionPlayerCount = data.servers.filter((a) => a.region === cat && a.gamemode != "sandbox").map((t) => t.playerCount).reduce((partialSum, a) => partialSum + a, 0)
        let regionServerCount = data.servers.filter((a) => a.region === cat && a.gamemode != "sandbox").length

        modes.forEach((mode) => {
          fieldsObjs.push({
            name: `${niceNames[mode] || mode}`,
            value: data.servers.filter((i) => i.region === cat && i.gamemode === mode)
              .sort((a, b) => b.playerCount - a.playerCount)
              .map((m) => `- ` + hyperlink(`\`${m.playerCount} Players\``, `https://${m.link}`))
              .join("\n") || "- \`None\`",
            inline: true,
          });
        });


        diepHomeEmbed.addFields([...fieldsObjs]);

        const title = `${niceNames[cat] || cat} has \`${regionPlayerCount}\` players across \`${regionServerCount}\` servers, which accounts for \`${percentage(regionPlayerCount, data.info[0].totalPlayerCount).toFixed(2)}%\` of all players.`;

        diepHomeEmbed.setTitle(`${niceNames[cat] || cat}`.toUpperCase());
        
        diepHomeEmbed.setDescription(
          `>>> Diep.io has \`${data.info[0].totalPlayerCount}\` players across \`${data.info[0].serverCount}\` servers, which is an average of \`${Math.round(data.info[0].totalPlayerCount / data.info[0].serverCount)}\` players per server.\n${title}\n\n**Last Updated:** *<t:${data.info[0].lastUpdated}:R>*`
        );

        diepHomeEmbed.addFields({
          name: "Extra",
          value:
            `- ` + hyperlink(`\`New Diep Tab\``, `https://diep.io/`) + `\n- ` + hyperlink(`\`World Records\``, `https://diepstats.com`),
          inline: true,
        });

        const row = new ActionRowBuilder();
        const atlButton = new ButtonBuilder()
          .setCustomId('lnd-atl')
          .setLabel("Atlanta")
          .setEmoji("🇺🇸")
          .setStyle(ButtonStyle.Secondary)
        const sfoButton = new ButtonBuilder()
          .setCustomId('lnd-sfo')
          .setLabel("San Francisco")
          .setEmoji("🇺🇸")
          .setStyle(ButtonStyle.Secondary)
        const fraButton = new ButtonBuilder()
          .setCustomId('lnd-fra')
          .setLabel("Frankfurt")
          .setEmoji("🇩🇪")
          .setStyle(ButtonStyle.Secondary)
        const tokButton = new ButtonBuilder()
          .setCustomId('lnd-tok')
          .setLabel("Tokyo")
          .setEmoji("🇯🇵")
          .setStyle(ButtonStyle.Secondary)
        const sydButton = new ButtonBuilder()
          .setCustomId('lnd-syd')
          .setLabel("Sydney")
          .setEmoji("🇦🇺")
          .setStyle(ButtonStyle.Secondary)
        row.addComponents(atlButton, sfoButton, fraButton, tokButton, sydButton);

        switch (cat) {
          case "lnd-atl":
            row.components[0].setDisabled(true)
              .setStyle(ButtonStyle.Primary)
            break;

          case "lnd-sfo":
            row.components[1].setDisabled(true)
              .setStyle(ButtonStyle.Primary)
            break;

          case "lnd-fra":
            row.components[2].setDisabled(true)
              .setStyle(ButtonStyle.Primary)
            break;

          case "lnd-tok":
            row.components[3].setDisabled(true)
              .setStyle(ButtonStyle.Primary)
            break;

          case "lnd-syd":
            row.components[4].setDisabled(true)
              .setStyle(ButtonStyle.Primary)
            break;

          default:
            break;
        }

        const diepMessage = await interaction.editReply({
          embeds: [diepHomeEmbed],
          files: [`src/commands/global-commands/diep/images/${num}.png`],
          components: [row, requestedRow],
          fetchReply: true,
        });

        const collector = diepMessage.createMessageComponentCollector({
          componentType: ComponentType.Button,
          time: 900000
        });

        //https://diep.io links
        collector.on("collect", async (m) => {
          if (m.user.id != interaction.user.id) {
            const embed = new EmbedBuilder()
              .setDescription(`<:Error:977069715149160448> This interaction belongs to someone else.`);

            await m.reply({
              embeds: [embed],
              ephemeral: true,
            });
            return;
          } else {
            m.deferUpdate();

            const diepEmbed = new EmbedBuilder()
              .setAuthor({
                name: `Diep.io Links`,
                url: `https://diep.io/`,
                iconURL: `attachment://${num}.png`,
              })
              .setThumbnail(`attachment://${num}.png`)
              .setTimestamp()

            const modes = [...new Set(data.servers.filter((f) => f.gamemode != "sandbox").map((i) => i.gamemode))];

            const cat = m.customId;

            fieldsObjs = [];

            let regionPlayerCount = data.servers.filter((a) => a.region === cat && a.gamemode != "sandbox").map((t) => t.playerCount).reduce((partialSum, a) => partialSum + a, 0)
            let regionServerCount = data.servers.filter((a) => a.region === cat && a.gamemode != "sandbox").length

            modes.forEach((mode) => {
              fieldsObjs.push({
                name: `${niceNames[mode] || mode}`,
                value: data.servers.filter((i) => i.region === cat && i.gamemode === mode)
                  .sort((a, b) => b.playerCount - a.playerCount)
                  .map((m, n) => `- ` + hyperlink(`\`${m.playerCount} Players\``, `https://${m.link}`))
                  .join("\n") || "- \`None\`",
                inline: true,
              });
            });

            const title = `${niceNames[cat] || cat} has \`${regionPlayerCount}\` players across \`${regionServerCount}\` servers, which accounts for \`${percentage(regionPlayerCount, data.info[0].totalPlayerCount).toFixed(2)}%\` of all players.`;

            diepEmbed.setTitle(`${niceNames[cat] || cat}`.toUpperCase());
            diepEmbed.setDescription(
              `>>> Diep.io has \`${data.info[0].totalPlayerCount}\` players across \`${data.info[0].serverCount}\` servers, which is an average of \`${Math.round(data.info[0].totalPlayerCount / data.info[0].serverCount)}\` players per server.\n${title}\n\n**Last Updated:** *<t:${data.info[0].lastUpdated}:R>*`
            );

            try {
              diepEmbed.addFields([...fieldsObjs]);
            } catch (error) {
              const embed = new EmbedBuilder()
                .setDescription(`<:Error:977069715149160448> Rivet API isn't working at the moment. Try again later.`)

              await interaction.followUp({
                embeds: [embed],
                ephemeral: true
              });
              return;
            }

            diepEmbed.addFields({
              name: "Extra",
              value:
                `- ` +
                hyperlink(`\`New Diep Tab\``, `https://diep.io/`) +
                `\n- ` +
                hyperlink(`\`World Records\``, `https://diepstats.com`),
              inline: true,
            });

            switch (m.customId) {
              case "lnd-atl":
                row.components[0].setDisabled(true)
                  .setStyle(ButtonStyle.Primary)
                row.components[1].setDisabled(false)
                  .setStyle(ButtonStyle.Secondary)
                row.components[2].setDisabled(false)
                  .setStyle(ButtonStyle.Secondary)
                row.components[3].setDisabled(false)
                  .setStyle(ButtonStyle.Secondary)
                row.components[4].setDisabled(false)
                  .setStyle(ButtonStyle.Secondary)

                await interaction.editReply({
                  embeds: [diepEmbed],
                  files: [`src/commands/global-commands/diep/images/${num}.png`],
                  components: [row, requestedRow],
                });
                break;

              case "lnd-sfo":
                row.components[1].setDisabled(true)
                  .setStyle(ButtonStyle.Primary)
                row.components[0].setDisabled(false)
                  .setStyle(ButtonStyle.Secondary)
                row.components[2].setDisabled(false)
                  .setStyle(ButtonStyle.Secondary)
                row.components[3].setDisabled(false)
                  .setStyle(ButtonStyle.Secondary)
                row.components[4].setDisabled(false)
                  .setStyle(ButtonStyle.Secondary)

                await interaction.editReply({
                  embeds: [diepEmbed],
                  files: [`src/commands/global-commands/diep/images/${num}.png`],
                  components: [row, requestedRow],
                });
                break;

              case "lnd-fra":
                row.components[2].setDisabled(true)
                  .setStyle(ButtonStyle.Primary)
                row.components[0].setDisabled(false)
                  .setStyle(ButtonStyle.Secondary)
                row.components[1].setDisabled(false)
                  .setStyle(ButtonStyle.Secondary)
                row.components[3].setDisabled(false)
                  .setStyle(ButtonStyle.Secondary)
                row.components[4].setDisabled(false)
                  .setStyle(ButtonStyle.Secondary)

                await interaction.editReply({
                  embeds: [diepEmbed],
                  files: [`src/commands/global-commands/diep/images/${num}.png`],
                  components: [row, requestedRow],
                });
                break;

              case "lnd-tok":
                row.components[3].setDisabled(true)
                  .setStyle(ButtonStyle.Primary)
                row.components[0].setDisabled(false)
                  .setStyle(ButtonStyle.Secondary)
                row.components[1].setDisabled(false)
                  .setStyle(ButtonStyle.Secondary)
                row.components[2].setDisabled(false)
                  .setStyle(ButtonStyle.Secondary)
                row.components[4].setDisabled(false)
                  .setStyle(ButtonStyle.Secondary)

                await interaction.editReply({
                  embeds: [diepEmbed],
                  files: [`src/commands/global-commands/diep/images/${num}.png`],
                  components: [row, requestedRow],
                });
                break;

              case "lnd-syd":
                row.components[4].setDisabled(true)
                  .setStyle(ButtonStyle.Primary)
                row.components[0].setDisabled(false)
                  .setStyle(ButtonStyle.Secondary)
                row.components[1].setDisabled(false)
                  .setStyle(ButtonStyle.Secondary)
                row.components[2].setDisabled(false)
                  .setStyle(ButtonStyle.Secondary)
                row.components[3].setDisabled(false)
                  .setStyle(ButtonStyle.Secondary)

                await interaction.editReply({
                  embeds: [diepEmbed],
                  files: [`src/commands/global-commands/diep/images/${num}.png`],
                  components: [row, requestedRow],
                });
                break;

              default:
                break;
            }
          }
        });
        collector.on("end", async (collected) => {
          try {
            row.components.forEach((c) => c.setDisabled(true));

            await diepMessage.edit({
              components: [row, requestedRow],
            });
            return;
          } catch (error) {
            try {
              await diepMessage.edit({
                components: [requestedRow],
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