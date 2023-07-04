const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, PermissionFlagsBits } = require("discord.js");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("auto-mod")
        .setDescription("Setup the Auto-Moderation system.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false)
        .addSubcommand((subcommand) =>
            subcommand
                .setName("flagged_words")
                .setDescription("Block profanity, sexual content and slurs.")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("spam_messages")
                .setDescription("Block messages suspected of spam.")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("mention_spam")
                .setDescription("Block messages containing a certain amount of mentions.")
                .addIntegerOption((option) =>
                    option
                        .setName("number")
                        .setDescription("Number of mentions required to block a message.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("key_word")
                .setDescription("Blocks a provided key word in the server.")
                .addStringOption((option) =>
                    option
                        .setName("word")
                        .setDescription("The word to block.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("rule_list")
                .setDescription("Returns a list of all the enabled Auto-Moderation rules.")
        ),

    async execute(interaction, client) {
        const { guild, options } = interaction;
        const sub = options.getSubcommand();

        switch (sub) {
            case "flagged_words":
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription("<a:typing:834179851522408458> Loading Auto-Moderation rule...")
                    ],
                });

                const rule = await guild.autoModerationRules.create({
                    name: "Auto-Moderation: Block profanity, sexual content and slurs.",
                    creatorId: "1011816140885991425",
                    enabled: true,
                    eventType: 1,
                    triggerType: 4,
                    triggerMetadata:
                    {
                        presets: [1, 2, 3]
                    },
                    actions: [
                        {
                            type: 1,
                            metadata: {
                                channel: interaction.channel,
                                durationSeconds: 10,
                                customMessage: "This message was prevented by Accelerator's Auto-Moderation System"
                            }
                        }
                    ]
                }).catch(async err => {
                    setTimeout(async () => {
                        console.log(err);
                        await interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription(`${err}`)
                            ]
                        })
                    }, 2000)
                })

                setTimeout(async () => {
                    if (!rule) return;

                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(`
                                    <:Success:977389031837040670> Auto-Moderation rule created successfully.
                                    <:space:1005359382776778802>**»** *Rule: \`Profanity, Sexual Content, Slurs\`*
                                `)
                        ]
                    })
                }, 3000)

                break;

            case "key_word":
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription("<a:typing:834179851522408458> Loading Auto-Moderation rule...")
                    ],
                });

                const word = options.getString("word")

                const rule2 = await guild.autoModerationRules.create({
                    name: `Auto-Moderation: Prevent the word ${word} from being used.`,
                    creatorId: "1011816140885991425",
                    enabled: true,
                    eventType: 1,
                    triggerType: 1,
                    triggerMetadata:
                    {
                        keywordFilter: [`${word}`]
                    },
                    actions: [
                        {
                            type: 1,
                            metadata: {
                                channel: interaction.channel,
                                durationSeconds: 10,
                                customMessage: "This message was prevented by Accelerator's Auto-Moderation System"
                            }
                        }
                    ]
                }).catch(async err => {
                    setTimeout(async () => {
                        console.log(err);
                        await interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription(`${err}`)
                            ]
                        })
                    }, 2000)
                })

                setTimeout(async () => {
                    if (!rule2) return;

                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(`
                                    <:Success:977389031837040670> Auto-Moderation rule created successfully.
                                    <:space:1005359382776778802>**»** *Rule: \`Block specified words.\`*
                                `)
                        ]
                    })
                }, 3000)
                break;

            case "spam_messages":
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription("<a:typing:834179851522408458> Loading Auto-Moderation rule...")
                    ],
                });

                const rule3 = await guild.autoModerationRules.create({
                    name: `Auto-Moderation: Prevent spam messages.`,
                    creatorId: "1011816140885991425",
                    enabled: true,
                    eventType: 1,
                    triggerType: 3,
                    triggerMetadata:
                    {
                        //mentionTotalLimit: number
                    },
                    actions: [
                        {
                            type: 1,
                            metadata: {
                                channel: interaction.channel,
                                durationSeconds: 10,
                                customMessage: "This message was prevented by Accelerator's Auto-Moderation System"
                            }
                        }
                    ]
                }).catch(async err => {
                    setTimeout(async () => {
                        console.log(err);
                        await interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription(`${err}`)
                            ]
                        })
                    }, 2000)
                })

                setTimeout(async () => {
                    if (!rule3) return;

                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(`
                                    <:Success:977389031837040670> Auto-Moderation rule created successfully.
                                    <:space:1005359382776778802>**»** *Rule: \`Block messages suspected of spam.\`*
                                `)
                        ]
                    })
                }, 3000)
                break;

            case "mention_spam":
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription("<a:typing:834179851522408458> Loading Auto-Moderation rule...")
                    ],
                });

                const number = options.getInteger("word")

                const rule4 = await guild.autoModerationRules.create({
                    name: `Auto-Moderation: Prevent mention spammning.`,
                    creatorId: "1011816140885991425",
                    enabled: true,
                    eventType: 1,
                    triggerType: 5,
                    triggerMetadata:
                    {
                        mentionTotalLimit: number
                    },
                    actions: [
                        {
                            type: 1,
                            metadata: {
                                channel: interaction.channel,
                                durationSeconds: 10,
                                customMessage: "This message was prevented by Accelerator's Auto-Moderation System"
                            }
                        }
                    ]
                }).catch(async err => {
                    setTimeout(async () => {
                        console.log(err);
                        await interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription(`${err}`)
                            ]
                        })
                    }, 2000)
                })

                setTimeout(async () => {
                    if (!rule4) return;

                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(`
                                    <:Success:977389031837040670> Auto-Moderation rule created successfully.
                                    <:space:1005359382776778802>**»** *Rule: \`Block mention spam.\`*
                                `)
                        ]
                    })
                }, 3000)

                break;

            case "rule_list":
                const fetch = require("node-fetch");

                let res = await fetch(`https://discord.com/api/v10/guilds/${interaction.guild.id}/auto-moderation/rules`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bot ${process.env.token}`
                    }
                }).then(r => r.json()).then(async (data) => {
                    const embed = new EmbedBuilder()
                    let index = 1;

                    const list = data.map(e => `\`${index++}.\` Rule Name: \`${e.name}\`\n<:space:1005359382776778802>**»** Rule ID: \`${e.id}\``).join("\n\n")

                    embed.setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                        .setTitle("Auto-Moderation Rules")
                        .setDescription(list || "<:Error:977069715149160448> No rules were found.")
                        .setTimestamp()

                    await interaction.reply({
                        embeds: [embed]
                    });
                    return;
                })
                break;

            default:
                break;
        }
    },
};