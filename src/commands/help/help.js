const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ComponentType,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDMPermission(true)
    .setDescription("Sends a list of the commands Accelerator has to offer."),

  async execute(interaction, client) {
    await interaction.deferReply();
    const embed = new EmbedBuilder();
    const row = new ActionRowBuilder();
    const row2 = new ActionRowBuilder();
    const row3 = new ActionRowBuilder();
    const row4 = new ActionRowBuilder();
    const menu = new StringSelectMenuBuilder()
      .setCustomId(`help-${interaction.user.id}`)
      .addOptions(
        {
          label: "General",
          description: "List of general commands.",
          value: "general",
          emoji: { name: "👥" },
        },
        {
          label: "Music",
          description: "List of music related commands.",
          value: "music",
          emoji: { name: "🎵" },
        },
        {
          label: "Fun",
          description: "List of fun commands.",
          value: "fun",
          emoji: { name: "🎭" },
        },
        {
          label: "Games",
          description: "List of gaming related commands.",
          value: "games",
          emoji: { name: "🎮" },
        },
        {
          label: "Moderation",
          description: "List of moderation related commands.",
          value: "moderation",
          emoji: { name: "🛡️" },
        },
        {
          label: "Utility",
          description: "List of utility related commands.",
          value: "utility",
          emoji: { name: "⚙️" },
        },
        {
          label: "NSFW",
          description: "List of NSFW commands.",
          value: "nsfw",
          emoji: { name: "🔞" },
        }
      )
      .setPlaceholder("Select a command category");
    const menu2 = new StringSelectMenuBuilder()
      .setCustomId(`game-${interaction.user.id}`)
      .addOptions({
        label: "Diep.io",
        description: "List of Diep.io related commands.",
        value: "diep",
        emoji: { name: "tank", id: "1079656450869178369" },
      })
      .setPlaceholder("Select a command sub-category");
    const helpButton = new ButtonBuilder()
      .setCustomId("helpButton")
      .setLabel("Help Menu")
      .setEmoji("<:left_arrow:1079662359246798979>")
      .setStyle(ButtonStyle.Secondary);
    const gameButton = new ButtonBuilder()
      .setCustomId("gameButton")
      .setLabel("Game Menu")
      .setEmoji("<:left_arrow:1079662359246798979>")
      .setStyle(ButtonStyle.Secondary);

    embed
      .setAuthor({
        name: "Accelerator | Help",
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        `
                Select a command category to see all \`${client.commandArray.length}\` commands. 

                **Command Categories:**
                > **»** 👥 General
                > **»** 🎵 Music
                > **»** 🎭 Fun
                > **»** 🎮 Games
                > <:space:1005359382776778802>├  <:tank:1079656450869178369> Diep.io
                > <:space:1005359382776778802>└  More games coming soon!
                > **»** 🛡️ Moderation
                > **»** ⚙️ Utility
                > **»** 🔞 NSFW\n
                **🔗 Links:**
                > **»** [\`Invite Accelerator\`](https://discord.com/api/oauth2/authorize?client_id=1011816140885991425&permissions=1644971949559&scope=bot%20applications.commands)
                > **»** [\`Support Server\`](https://discord.gg/DZwZv73FzG)
            `
      )
      .setTimestamp();

    row.addComponents(menu);
    row2.addComponents(menu2);
    row3.addComponents(helpButton);
    row4.addComponents(gameButton);

    const helpMessage = await interaction.editReply({
      embeds: [embed],
      components: [row],
      fetchReply: true,
    });

    const collector = helpMessage.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 60000 * 5,
    });
    const buttonCollector = helpMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60000 * 5,
    });
    const gameCollector = helpMessage.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 60000 * 5,
    });
    const gameButtonCollector = helpMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60000 * 5,
    });

    // command category select menu
    collector.on("collect", async (m) => {
      if (m.user.id != interaction.user.id) {
        embed.setDescription(
          `<:Error:977069715149160448> This interaction belongs to someone else.`
        );

        await m.reply({
          embeds: [embed],
          ephemeral: true,
        });
        return;
      }

      m.deferUpdate();
      const selected = await m.values[0];

      switch (selected) {
        case "general":
          embed
            .setAuthor({
              name: "Accelerator | Help » General",
              iconURL: client.user.displayAvatarURL(),
            })
            .setDescription(
              `
                            \`/info        \` - Gets information on different things.
                            \`/membercount \` - Gets the total member count of the current server.
                            \`/ping        \` - Gets the bot's latency.
                            \`/uptime      \` - Displays the amount of time the bot has been online.
                        `
            )
            .setTimestamp();

          await interaction.editReply({
            embeds: [embed],
            components: [row, row3],
          });
          break;

        case "moderation":
          embed
            .setAuthor({
              name: "Accelerator | Help » Moderation",
              iconURL: client.user.displayAvatarURL(),
            })
            .setDescription(
              `
                            \`/warn     \` - Add or remove a user's warnings.
                            \`/timeout  \` - Add or remove a member's timeout.
                            \`/kick     \` - Kicks the specified user.
                            \`/ban      \` - Bans the specified user.
                            \`/purge    \` - Deletes a specified number of messages.
                            \`/slowmode \` - Modifies the channel's slowmode.
                            \`/lock     \` - Locks or unlocks the current channel.
                            `
            )
            .setTimestamp();

          await interaction.editReply({
            embeds: [embed],
            components: [row, row3],
          });
          break;

        case "music":
          embed
            .setAuthor({
              name: "Accelerator | Help » Music",
              iconURL: client.user.displayAvatarURL(),
            })
            .setDescription(
              `
                                \`/play        \` - Loads a video/playlist from youtube from links or search terms.
                                \`/now-playing \` - Displays the current playing song.
                                \`/queue       \` - Returns the server queue.
                                \`/skip        \` - Skips the current song.
                                \`/pause       \` - Pauses the current song.
                                \`/resume      \` - Resumes the current song. If already paused.
                                \`/leave       \` - Leaves the voice channel and clears the server queue.
                                \`/loop        \` - Loops the queue or the current song.
                                \`/save        \` - Sends the current song in your DMs.
                                \`/remove      \` - Removes a specified song from the queue.
                            `
            )
            .setTimestamp();

          await interaction.editReply({
            embeds: [embed],
            components: [row, row3],
          });
          break;

        case "fun":
          embed
            .setAuthor({
              name: "Accelerator | Help » Fun",
              iconURL: client.user.displayAvatarURL(),
            })
            .setDescription(`
              \`/anime      \` - Gets information on a specified anime.
              \`/manga      \` - Gets information on a specified manga.
              \`/meme       \` - Sends memes from r/dankmemes subreddit.
              \`/8ball      \` - Ask the magic 8ball anything!
              \`/soundboard \` - Plays sound effects in voice channels.
              \`/ask-gpt    \` - Get GPT-3 to answer questions and help on different topics.
            `)
            .setTimestamp();

          await interaction.editReply({
            embeds: [embed],
            components: [row, row3],
          });
          break;

        case "games":
          embed
            .setAuthor({
              name: "Accelerator | Help » Games » Diep.io",
              iconURL: client.user.displayAvatarURL(),
            })
            .setDescription(
              `
                            Select a command sub-category.

                            **Sub-Categories of \`Games\`:**
                            > **»** <:tank:1079656450869178369> Diep.io
                            > **»** More games will be added to the future, hence why this sub category system.
                        `
            )
            .setTimestamp();

          await interaction.editReply({
            embeds: [embed],
            components: [row2, row, row3],
          });
          break;

        case "utility":
          embed
            .setAuthor({
              name: "Accelerator | Help » Utility",
              iconURL: client.user.displayAvatarURL(),
            })
            .setDescription(
              `
                            \`/enlarge        \` - Makes emojis bigger.
                            \`/avatar         \` - Gets your avatar or the avatar of the provided user.
                            \`/snipe          \` - Snipes the last deleted message.
                            \`/embed          \` - Creates a customized embed in the specified channel.
                            \`/triggers        \` - See what triggers are added in the server.
                            \`/manage-triggers \` - Adds or removes triggers.
                            
                        `
            )
            .setTimestamp();

          await interaction.editReply({
            embeds: [embed],
            components: [row, row3],
          });
          break;

        case "nsfw":
          if (!interaction.channel.nsfw) {
            embed
              .setAuthor({
                name: "Accelerator | Help » NSFW",
                iconURL: client.user.displayAvatarURL(),
              })
              .setDescription(
                "<:Error:977069715149160448> **Channel isn't flagged as NSFW.**"
              )
              .setTimestamp();

            await interaction.editReply({
              embeds: [embed],
              components: [row, row3],
            });
            return;
          } else {
            embed
              .setAuthor({
                name: "Accelerator | Help » NSFW",
                iconURL: client.user.displayAvatarURL(),
              })
              .setDescription(
                `
                                \`/nsfw \` - NSFW for the horny ones.
                            `
              )
              .setTimestamp();

            await interaction.editReply({
              embeds: [embed],
              components: [row, row3],
            });
          }
          break;

        default:
          break;
      }
    });
    collector.on("end", async (collected) => {
      try {
        row.components.forEach((c) => c.setDisabled(true));
        row2.components.forEach((c) => c.setDisabled(true));
        row3.components.forEach((c) => c.setDisabled(true));
        row4.components.forEach((c) => c.setDisabled(true));

        await helpMessage.edit({
          components: [row],
        });
        return;
      } catch (error) {
        try {
          await helpMessage.edit({
            components: [],
          });
          return;
        } catch (error) {
          return;
        }
      }
    });

    //back to help menu button
    buttonCollector.on("collect", async (a) => {
      if (a.user.id != interaction.user.id) {
        embed.setDescription(
          `<:Error:977069715149160448> This interaction belongs to someone else.`
        );

        await a.reply({
          embeds: [embed],
          ephemeral: true,
        });
        return;
      }

      if (a.customId === "helpButton") {
        embed
          .setAuthor({
            name: "Accelerator | Help",
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(
            `
                        Select a command category to see all \`${client.commandArray.length}\` commands. 

                        **Command Categories:**
                        > **»** 🛠️ General
                        > **»** ⚙️ Moderation
                        > **»** 🎵 Music
                        > **»** 🎭 Fun
                        > **»** 🎮 Games
                        > <:space:1005359382776778802>├  <:tank:1079656450869178369> Diep.io
                        > <:space:1005359382776778802>└  <:flower:1079656780843458651> Florr.io
                        > **»** 🔞 NSFW\n
                        🔗 **Links:**
                        > **»** [\`Invite Accelerator\`](https://discord.com/api/oauth2/authorize?client_id=1011816140885991425&permissions=1644971949559&scope=bot%20applications.commands)
                        > **»** [\`Support Server\`](https://discord.gg/DZwZv73FzG)
                    `
          )
          .setTimestamp();

        await interaction.editReply({
          embeds: [embed],
          components: [row],
        });
        return;
      }
    });
    buttonCollector.on("end", async (collected) => {
      try {
        row3.components.forEach((c) => c.setDisabled(true));

        await generalMessage.edit({
          components: [row],
        });
        return;
      } catch (error) {
        try {
          await generalMessage.edit({
            components: [],
          });
          return;
        } catch (error) {
          return;
        }
      }
    });

    // game category select menu
    gameCollector.on("collect", async (g) => {
      if (g.user.id != interaction.user.id) {
        embed.setDescription(
          `<:Error:977069715149160448> This interaction belongs to someone else.`
        );

        await g.reply({
          embeds: [embed],
          ephemeral: true,
        });
        return;
      }

      const select = await g.values[0];

      switch (select) {
        case "diep":
          embed
            .setAuthor({
              name: "Accelerator | Help » Games » Diep.io",
              iconURL: client.user.displayAvatarURL(),
            })
            .setDescription(
              `
                            \`/get-diep-servers \` - Gets the current [Diep.io](https://diep.io/) servers.
                        `
            )
            .setTimestamp();

          await interaction.editReply({
            embeds: [embed],
            components: [row2, row4],
          });
          break;

        default:
          break;
      }
    });
    gameCollector.on("end", async (collected) => {
      try {
        row2.components.forEach((c) => c.setDisabled(true));

        await helpMessage.edit({
          components: [row],
        });
        return;
      } catch (error) {
        try {
          await helpMessage.edit({
            components: [],
          });
          return;
        } catch (error) {
          return;
        }
      }
    });

    gameButtonCollector.on("collect", async (b) => {
      if (b.user.id != interaction.user.id) {
        embed.setDescription(
          `<:Error:977069715149160448> This interaction belongs to someone else.`
        );

        await b.reply({
          embeds: [embed],
          ephemeral: true,
        });
        return;
      }

      if (b.customId === "gameButton") {
        embed
          .setAuthor({
            name: "Accelerator | Help » Games",
            iconURL: client.user.displayAvatarURL(),
          })
          .setDescription(
            `
                        Select a command sub-category.

                        **Sub-Categories of \`Games\`:**
                        > **»** <:tank:1079656450869178369> Diep.io
                        > **»** More games will be added to the future, hence why this sub category system.
                    `
          )
          .setTimestamp();

        await interaction.editReply({
          embeds: [embed],
          components: [row2, row, row3],
        });
        return;
      }
    });
    gameButtonCollector.on("end", async (collected) => {
      try {
        row4.components.forEach((c) => c.setDisabled(true));

        await helpMessage.edit({
          components: [row],
        });
        return;
      } catch (error) {
        try {
          await helpMessage.edit({
            components: [],
          });
          return;
        } catch (error) {
          return;
        }
      }
    });
  },
};
