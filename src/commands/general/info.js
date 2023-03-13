const {
  SlashCommandBuilder,
  EmbedBuilder,
  userMention,
  ChannelType,
  GuildExplicitContentFilter,
  GuildNSFWLevel,
  GuildVerificationLevel,
  hyperlink,
} = require("discord.js");
const moment = require("moment");
const prettyMilliseconds = require("pretty-ms");
const cpuStat = require("cpu-stat");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription(
      "Returns info about the bot, the specified user or the current server."
    )
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("Sends information about a given user.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("User you want to get information on.")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("bot")
        .setDescription("Sends information on Accelerator.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("server")
        .setDescription("Sends information about the current server.")
    ),

  async execute(interaction, client) {
    const embed = new EmbedBuilder();

    const subcommand = interaction.options.getSubcommand([
      "user",
      "bot",
      "server",
    ]);

    switch (subcommand) {
      case "user":
        await interaction.deferReply();
        const target = interaction.options.getUser("user");
        const flags =
          interaction.user.flags.toArray() || target.flags.toArray();
        const badge = flags
          .join(" ")
          .replace(
            "HypeSquadOnlineHouse1",
            "<:badge_bravery:1054671675213500436>"
          )
          .replace(
            "HypeSquadOnlineHouse2",
            "<:badge_brilliance:1054671512319295498>"
          )
          .replace(
            "HypeSquadOnlineHouse3",
            "<:badge_balance:1054671843438641222>"
          )
          .replace(
            "PremiumEarlySupporter",
            "<:badge_early_supporter:1054671994181931008>"
          );

        if (!target) {
          const member = await interaction.guild.members.cache.get(
            interaction.user.id
          );
          let userRoles = member.roles.cache
            .map((r) => r)
            .join(" ")
            .replace("@everyone", " ");
          let roles = userRoles.split(" ");

          if (roles.length > 10) {
            embed
              .setTitle(`${interaction.user.tag} [\`${interaction.user.id}\`]`)
              .setThumbnail(
                interaction.user.displayAvatarURL({ dynamic: true })
              )
              .setDescription(
                `
                                ${userMention(interaction.user.id)}\n
                                >>> **Account Creation:** <t:${moment(
                                  interaction.user.createdAt
                                ).unix()}:f> **-** <t:${moment(
                  interaction.user.createdAt
                ).unix()}:R>
                                **Joined Server:** <t:${moment(
                                  member.joinedAt
                                ).unix()}:f> **-** <t:${moment(
                  member.joinedAt
                ).unix()}:R>
                                **Badges:** ${badge || "No badges."}
                                **Avatar Link:** [128px](${interaction.user.displayAvatarURL(
                                  { dynamic: true, size: 128 }
                                )}) | [256px](${interaction.user.displayAvatarURL(
                  { dynamic: true, size: 256 }
                )}) | [512px](${interaction.user.displayAvatarURL({
                  dynamic: true,
                  size: 512,
                })})
                                **Roles:** Too many roles to show (${
                                  roles.length
                                }).
                            `
              )
              .setTimestamp();

            await interaction.editReply({
              embeds: [embed],
            });
            return;
          }
          embed
            .setTitle(`${interaction.user.tag} [\`${interaction.user.id}\`]`)
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setDescription(
              `
                            ${userMention(interaction.user.id)}\n
                            >>> **Account Creation:** <t:${moment(
                              interaction.user.createdAt
                            ).unix()}:f> **-** <t:${moment(
                interaction.user.createdAt
              ).unix()}:R>
                            **Joined Server:** <t:${moment(
                              member.joinedAt
                            ).unix()}:f> **-** <t:${moment(
                member.joinedAt
              ).unix()}:R>
                            **Badges:** ${badge || "No badges."}
                            **Avatar Link:** [128px](${interaction.user.displayAvatarURL(
                              { dynamic: true, size: 128 }
                            )}) | [256px](${interaction.user.displayAvatarURL({
                dynamic: true,
                size: 256,
              })}) | [512px](${interaction.user.displayAvatarURL({
                dynamic: true,
                size: 512,
              })})
                            **Roles:** ${userRoles}
                        `
            )
            .setTimestamp();

          await interaction.editReply({
            embeds: [embed],
          });
          return;
        } else {
          const member2 = await interaction.guild.members.cache.get(target.id);
          let userRoles = member2.roles.cache
            .map((r) => r)
            .join(" ")
            .replace("@everyone", " ");
          let roles = userRoles.split(" ");

          if (roles.length > 10) {
            embed
              .setTitle(`${target.tag} [\`${target.id}\`]`)
              .setThumbnail(target.displayAvatarURL({ dynamic: true }))
              .setDescription(
                `${userMention(target.id)}\n
                                >>> **Account Creation:** <t:${moment(
                                  target.createdAt
                                ).unix()}:f> **-** <t:${moment(
                  target.createdAt
                ).unix()}:R>
                                **Joined Server:** <t:${moment(
                                  member2.joinedAt
                                ).unix()}:f> **-** <t:${moment(
                  member2.joinedAt
                ).unix()}:R>
                                **Badges:** ${badge || "No badges."}
                                **Avatar Link:** [128px](${target.displayAvatarURL(
                                  { dynamic: true, size: 128 }
                                )}) | [256px](${target.displayAvatarURL({
                  dynamic: true,
                  size: 256,
                })}) | [512px](${target.displayAvatarURL({
                  dynamic: true,
                  size: 512,
                })})
                                **Roles:** Too many roles to show (${
                                  roles.length
                                }),
                            `
              )
              .setTimestamp();

            await interaction.editReply({
              embeds: [embed],
            });
            return;
          }
          embed
            .setTitle(`${target.tag} [\`${target.id}\`]`)
            .setThumbnail(target.displayAvatarURL({ dynamic: true }))
            .setDescription(
              `${userMention(target.id)}\n
                            >>> **Account Creation:** <t:${moment(
                              target.createdAt
                            ).unix()}:f> **-** <t:${moment(
                target.createdAt
              ).unix()}:R>
                            **Joined Server:** <t:${moment(
                              member2.joinedAt
                            ).unix()}:f> **-** <t:${moment(
                member2.joinedAt
              ).unix()}:R>
                            **Badges:** ${badge || "No badges."}
                            **Avatar Link:** [128px](${target.displayAvatarURL({
                              dynamic: true,
                              size: 128,
                            })}) | [256px](${target.displayAvatarURL({
                dynamic: true,
                size: 256,
              })}) | [512px](${target.displayAvatarURL({
                dynamic: true,
                size: 512,
              })})
                            **Roles:** ${userRoles}`
            )
            .setTimestamp();

          await interaction.editReply({
            embeds: [embed],
          });
        }
        break;

      case "bot":
        cpuStat.usagePercent(async function (error, percent) {
          if (error) {
            const embed = new EmbedBuilder().setDescription(
              `<:Error:977069715149160448> An error occured, try again later.`
            );

            await interaction.reply({
              embeds: [embed],
              ephemeral: true,
            });
            return;
          }
          await interaction.deferReply();
          const node = process.version;
          const memoryUsage = formatBytes(process.memoryUsage().heapUsed);
          const cpu = percent.toFixed(2);
          await interaction.client.application.fetch();

          embed
            .setTitle(`${client.user.tag} [\`${client.user.id}\`]`)
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(
              `
                            \`Project Accelerator v1.0\`\n
                            >>> **Creation:** <t:${moment(
                              client.user.createdAt
                            ).unix()}:f> **-** <t:${moment(
                client.user.createdAt
              ).unix()}:R>
                            **Developer:** ${
                              interaction.client.application.owner.tag
                            }
                            **Server Count:** \`${client.guilds.cache.size}\`
                            **User Count:** \`${client.users.cache.size}\`
                            **Uptime:** \`${prettyMilliseconds(client.uptime)}\`
                            **Commands:** \`${client.commandArray.length}\`
                            **Node Version:** \`${node}\`
                            **Library:** Discord.js
                            **CPU Usage:** \`${cpu}%\`
                            **RAM Usage:** \`${memoryUsage}\`
                        `
            )
            .setTimestamp();

          await interaction.editReply({
            embeds: [embed],
          });
        });

        function formatBytes(a, b) {
          let c = 1024;
          d = b || 2;
          e = ["B", "KB", "MB", "GB", "TB"];
          f = Math.floor(Math.log(a) / Math.log(c));

          return parseFloat((a / Math.pow(c, f)).toFixed(d)) + "" + e[f];
        }
        break;

      case "server":
        await interaction.deferReply();
        const { guild } = interaction;
        const { members, channels, emojis, roles, stickers } = guild;

        const sortedRoles = roles.cache
          .map((role) => role)
          .slice(1, roles.cache.size)
          .sort((a, b) => b.position - a.position);
        const userRoles = sortedRoles.filter((role) => !role.managed);
        const botCount = members.cache.filter((member) => member.user.bot).size;

        const splitPascal = (string, separator) =>
          string.split(/(?=[A-U])/).join(separator);
        const toPascalCase = (string, separator = false) => {
          const pascal =
            string.charAt(0).toUpperCase() +
            string
              .slice(1)
              .toLowerCase()
              .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
          return separator ? splitPascal(pascal, separator) : pascal;
        };
        let amogus =
          "https://media.discordapp.net/attachments/240595502167490562/856899509568405514/image0-41.gif";
        const getChannelTypeSize = (type) =>
          channels.cache.filter((channel) => type.includes(channel.type)).size;
        const totalChannels = getChannelTypeSize([
          ChannelType.GuildText,
          ChannelType.GuildNews,
          ChannelType.GuildVoice,
          ChannelType.GuildStageVoice,
          ChannelType.GuildForum,
          ChannelType.GuildPublicThread,
          ChannelType.GuildNewsThread,
          ChannelType.GuildPrivateThread,
          ChannelType.GuildCategory,
          ChannelType.GuildDirectory,
        ]);

        embed
          .setTitle(`Information For: ${guild.name}`)
          .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }) || amogus)
          .addFields(
            { name: "Description", value: `📃 ${guild.description || "None"}` },
            {
              name: "General",
              value: [
                `📜 **Date Created:** <t:${parseInt(
                  guild.createdTimestamp / 1000
                )}:R>`,
                `💳 **ID:** \`${guild.id}\``,
                `👑 **Owner:** <@${guild.ownerId}>`,
                `🌎 **Language:** \`${new Intl.DisplayNames(["en"], {
                  type: "language",
                }).of(guild.preferredLocale)}\``,
                `💻 **Vanity URL:** \`${guild.vanityURLCode || "None"}\``,
              ].join("\n"),
            },
            {
              name: "Security",
              value: [
                `👀 **Explicit Filter:** \`${splitPascal(
                  GuildExplicitContentFilter[guild.explicitContentFilter],
                  " "
                )}\``,
                `🔞 **NSFW Level:** \`${splitPascal(
                  GuildNSFWLevel[guild.nsfwLevel],
                  " "
                )}\``,
                `🔒 **Verification Level:** \`${splitPascal(
                  GuildVerificationLevel[guild.verificationLevel],
                  " "
                )}\``,
              ].join("\n"),
              inline: true,
            },
            {
              name: `Channels, Threads and Categories [\`${totalChannels}\`]`,
              value: [
                `💬 **Text Channels:** \`${getChannelTypeSize([
                  ChannelType.GuildText,
                  ChannelType.GuildForum,
                  ChannelType.GuildNews,
                ])}\``,
                `🔊 **Voice Channels:** \`${getChannelTypeSize([
                  ChannelType.GuildVoice,
                  ChannelType.GuildStageVoice,
                ])}\``,
                `🧵 **Threads:** \`${getChannelTypeSize([
                  ChannelType.GuildPublicThread,
                  ChannelType.GuildPrivateThread,
                  ChannelType.GuildNewsThread,
                ])}\``,
                `📂 **Categories:** \`${getChannelTypeSize([
                  ChannelType.GuildCategory,
                  ChannelType.GuildDirectory,
                ])}\``,
              ].join("\n"),
              inline: true,
            },
            {
              name: `Emojis & Stickers [\`${
                emojis.cache.size + stickers.cache.size
              }\`]`,
              value: [
                `🌪️ **Animated:** \`${
                  emojis.cache.filter((emoji) => emoji.animated).size
                }\``,
                `🗿 **Static:** \`${
                  emojis.cache.filter((emoji) => !emoji.animated).size
                }\``,
                `🌠 **Stickers:** \`${stickers.cache.size}\``,
              ].join("\n"),
              inline: true,
            },
            {
              name: `Nitro`,
              value: [
                `📈 **Level:** \`${guild.premiumTier || "None"}\``,
                `💪🏻 **Boosts:** \`${guild.premiumSubscriptionCount}\``,
                `💎 **Boosters:** \`${
                  guild.members.cache.filter(
                    (member) => member.roles.premiumSubscriberRole
                  ).size
                }\``,
              ].join("\n"),
              inline: true,
            },
            {
              name: `Members [\`${guild.memberCount}\`]`,
              value: [
                `👤 **Users:** \`${guild.memberCount - botCount}\``,
                `🤖 **Bots:** \`${botCount}\``,
              ].join("\n"),
              inline: true,
            },
            {
              name: `Roles`,
              value: [`**User Roles:** \`${userRoles.length || "None"}\``].join(
                "\n"
              ),
              inline: true,
            },
            {
              name: "Features",
              value:
                guild.features
                  ?.map((feature) => `\`${toPascalCase(feature, " ")}\``)
                  ?.join(", ") || "None",
            },
            {
              name: "Banner",
              value:
                `${hyperlink("Link", guild.bannerURL({ dynamic: true }))}` ||
                "None",
            }
          );

        await interaction.editReply({
          embeds: [embed],
        });

        /*let owner = await interaction.guild.fetchOwner();
                let usercount = await interaction.guild.members.cache.filter((member) => !member.user.bot).size
                let botcount = await interaction.guild.members.cache.filter((member) => member.user.bot).size
                let amogus = "https://media.discordapp.net/attachments/240595502167490562/856899509568405514/image0-41.gif"

                embed.setTitle(`${interaction.guild.name} [\`${interaction.guild.id}\`]`)
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true }) || amogus)
                    .setDescription(
                        `>>> **Creation:** <t:${moment(interaction.guild.createdAt).unix()}:f> **-** <t:${moment(interaction.guild.createdAt).unix()}:R>
                    **Owner:** ${userMention(owner.id)} [\`${owner.id}\`]
                    **Member Count:** \`${interaction.guild.memberCount}\`
                    <:space:1005359382776778802>**»** **Users:** \`${usercount}\`
                    <:space:1005359382776778802>**»** **Bots:** \`${botcount}\`
                    **Boost Level:** \`${interaction.guild.premiumTier}\`
                    **Boost Count:** \`${interaction.guild.premiumSubscriptionCount}\`
                    **Icon Link:** [128px](${interaction.guild.iconURL({ dynamic: true, size: 128 }) || "N/A"}) | [256px](${interaction.guild.iconURL({ dynamic: true, size: 256 }) || "N/A"}) | [512px](${interaction.guild.iconURL({ dynamic: true, size: 512 }) || "N/A"})
                    **Banner Link:** [128px](${interaction.guild.bannerURL({ dynamic: true, size: 128 }) || "N/A"}) | [256px](${interaction.guild.bannerURL({ dynamic: true, size: 256 }) || "N/A"}) | [512px](${interaction.guild.bannerURL({ dynamic: true, size: 512 }) || "N/A"})`
                    )
                    .setTimestamp()

                await interaction.editReply({
                    embeds: [embed]
                });*/
        break;

      default:
        break;
    }
  },
};
