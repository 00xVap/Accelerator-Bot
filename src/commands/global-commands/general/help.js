const {
    ComponentType,
    EmbedBuilder,
    SlashCommandBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
} = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Returns a list of the bot's commands."),

    async execute(interaction, client) {
        const emojis = {
            general: "👥",
            moderation: "🛡️",
            music: "🎧",
            utility: "⚙️",
            diep: { name: "tank", id: "1079656450869178369" },
            fun: "🎭",
        };

        const directories = [
            ...new Set(interaction.client.commands.map((cmd) => cmd.folder))
        ];
        directories.splice(6, 1)

        const formatString = (str) =>
            `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

        const categories = directories.map((dir) => {
            const getCommands = interaction.client.commands.filter((cmd) => cmd.folder === dir).map((cmd) => {
                return {
                    name: cmd.data.name,
                    description: cmd.data.description || "No description found for this command."
                };
            });

            return {
                directory: formatString(dir),
                commands: getCommands,
            };
        });

        const embed = new EmbedBuilder()
            .setAuthor({ name: "Accelerator | Help", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`
                Select a command category in the dropdown menu.

                **Command Categories:**
                > **»** 👥 General
                > **»** 🛡️ Moderation
                > **»** 🎧 Music
                > **»** ⚙️ Utility
                > **»** <:tank:1079656450869178369> Diep.io
                > **»** 🎭 Fun\n
                **🔗 Links:**
                > **»** [\`Invite Accelerator   \`](https://discord.com/api/oauth2/authorize?client_id=1011816140885991425&permissions=1644971949559&scope=bot%20applications.commands) - Add Accelerator to your server.
                > **»** [\`Support Server       \`](https://discord.gg/DZwZv73FzG) - Join the support server.
                > **»** [\`Vote for Accelerator \`](https://top.gg/bot/1011816140885991425/vote) - Vote for Accelerator on Top.gg.
                > **»** [\`Github Repository    \`](https://github.com/00xVap/Accelerator-Bot) - See how Accelerator is running.
            `)

        const components = (state) => [
            new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`help-menu`)
                    .setPlaceholder(`Select a category`)
                    .setDisabled(false)
                    .addOptions(
                        categories.map((cmd) => {
                            return {
                                label: cmd.directory,
                                value: cmd.directory.toLowerCase(),
                                description: `Commands in the ${cmd.directory} category.`,
                                emoji: emojis[cmd.directory.toLowerCase() || null],
                            }
                        })
                    )
            ),
        ]

        const initialMessage = await interaction.reply({
            embeds: [embed],
            components: components(false),
        });

        const collector = interaction.channel.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 900000
        });

        collector.on("collect", async (int) => {
            if (int.user.id != interaction.user.id) {
                const embed = new EmbedBuilder()
                    .setDescription(`<:Error:977069715149160448> This interaction belongs to someone else.`);

                await int.reply({
                    embeds: [embed],
                    ephemeral: true,
                });
                return;
            } else {
                await int.deferUpdate();
                const [directory] = int.values;
                const category = categories.find(
                    (x) => x.directory.toLowerCase() === directory
                );

                const categoryEmbed = new EmbedBuilder()
                    .setAuthor({
                        name: `Accelerator | Help » ${formatString(directory)}`,
                        iconURL: client.user.displayAvatarURL(),
                    })
                    .setDescription(`
                  A list of all the commands categorized under \`${directory.toUpperCase()}\`.

                  ${category.commands.map((cmd) => `- \`/${cmd.name}\` - ${cmd.description}`).join("\n")}
                `)
                /*.addFields(
                    category.commands.map((cmd) => {
                        return {
                            name: `\`/${cmd.name}\``,
                            value: cmd.description,
                            inline: true,
                        }
                    })
                )*/

                await int.editReply({ embeds: [categoryEmbed] });
            }
        });

        collector.on("end", async () => {
            try {
                components.components.forEach((c) => c.setDisabled(true));

                await initialMessage.edit({
                    components: components(true)
                });
                return;
            } catch (error) {
                try {
                    await initialMessage.edit({
                        components: []
                    });
                    return;
                } catch (error) {
                    return;
                }
            }
        })
    },
};