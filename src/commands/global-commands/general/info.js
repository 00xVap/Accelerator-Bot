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
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription(
      "Returns various information about users, the bot or the server."
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

    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "user":
        let target = interaction.options.getUser("user") || interaction.user;
        const member = await interaction.guild.members.cache.get(target.id);
        let flags = target.flags.toArray();

        let badges = [];
        let extrabadges = [];

        await Promise.all(flags.map(async badge => {

          if (badge === "Staff") badges.push("<:DiscordStaff:1121062358157103195>")
          if (badge === "Partner") badges.push("<:Partner:1121062597161127966>")
          if (badge === "CertifiedModerator") badges.push("<:CertifiedModerator:1121062356781387816>")
          if (badge === "Hypesquad") badges.push("<:Hypesquad:1121062362615644190>")
          if (badge === "HypeSquadOnlineHouse1") badges.push("<:Bravery:1121062352670953532>")
          if (badge === "HypeSquadOnlineHouse2") badges.push("<:Brilliance:1121062353841168546>")
          if (badge === "HypeSquadOnlineHouse3") badges.push("<:Balance:1121062349374246953>")
          if (badge === "BugHunterLevel1") badges.push("<:BugHunter1:1121062354680021034>")
          if (badge === "BugHunterLevel2") badges.push("<:BugHunter2:1121062408996278323>")
          if (badge === "ActiveDeveloper") badges.push("<:ActiveDeveloper:1121062348233379850>")
          if (badge === "VerifiedDeveloper") badges.push("<:VerifiedBotDeveloper:1121062346706649140>")
          if (badge === "PremiumEarlySupporter") badges.push("<:EarlySupporter:1121062361042800802>")
          if (badge === "VerifiedBot") badges.push("<:VerifiedBot:1121062344777277490>")

        }));

        await fetch(`https://japi.rest/discord/v1/user/${target.id}`)
            .then(r => r.json()).then(async ({ data }) => {
                if (data.public_flags_array) {
                    await Promise.all(data.public_flags_array.map(async badge => {
                        if (badge === "NITRO") badges.push("<:Nitro:1121062370136043541>")
                    }))
                }
            }).catch((err) => {
                return;
            })

        if (target.bot) {
          const botFetch = await fetch(
            `https://discord.com/api/v10/applications/${target.id}/rpc`
          );

          let json = await botFetch.json();
          let flagsBot = json.flags;

          const gateways = {
            APPLICATION_COMMAND_BADGE: 1 << 23,
          };

          const arrayFlags = [];

          for (let i in gateways) {
            const bit = gateways[i];
            if ((flagsBot & bit) === bit) arrayFlags.push(i);
          }

          if (arrayFlags.includes("APPLICATION_COMMAND_BADGE")) {
            badges.push("<:SlashCommands:1121062375022411826> ");
          }
        }

        if (!target.discriminator || target.discriminator === 0 || target.tag === `${target.username}#0`) {
          badges.push("<:Knownas:1121062367149707438>");

          extrabadges.push(`https://cdm.discordapp.com/attachments/1080219392337522718/1109461965711089694/username.png`)
        }

        let uUserRoles = member.roles.cache
          .sort((a, b) => b.position - a.position || b.id - a.id)
          .filter(e => e.name !== "@everyone")
          .map((r) => `\`${r.name}\``)
          .join(", ")

        embed.setThumbnail(target.displayAvatarURL({ dynamic: true }))
          .setDescription(`
                ${userMention(target.id)}\n
                >>> **User ID:** \`${target.id}\`
                **Account Creation:** <t:${moment(target.createdAt).unix()}:f> **-** <t:${moment(target.createdAt).unix()}:R>
                **Joined Server:** <t:${moment(member.joinedAt).unix()}:f> **-** <t:${moment(member.joinedAt).unix()}:R>
                **Badges:** ${badges.join(" ") || "User has no badges."}
                **Bot:** ${target.bot.toString().replace("false", "<:Error:977069715149160448>").replace("true", "<:Success:977389031837040670>")}
                **Avatar Link:** [128px](${target.displayAvatarURL({ dynamic: true, size: 128 })}) | [256px](${target.displayAvatarURL({ dynamic: true, size: 256 })}) | [512px](${target.displayAvatarURL({ dynamic: true, size: 512, })})
                **Roles:** ${uUserRoles}
              `)
          .setTimestamp();

        if (!target.discriminator || target.discriminator === 0 || target.tag === `${target.username}#0`) {
          embed.setTitle(`Information for: \`${target.username}\``)
        } else {
          embed.setTitle(`Information for: \`${target.tag}\``)
        }

        await interaction.reply({
          embeds: [embed],
        });
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

          const node = process.version;
          const memoryUsage = formatBytes(process.memoryUsage().heapUsed);
          const cpu = percent.toFixed(2);
          await interaction.client.application.fetch();

          embed.setTitle(`${client.user.tag} [\`${client.user.id}\`]`)
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(`
              \`Project Accelerator v1.0\`\n
              >>> **Creation:** <t:${moment(client.user.createdAt).unix()}:f> **-** <t:${moment(client.user.createdAt).unix()}:R>
              **Developer:** <@${interaction.client.application.owner.id}>
              **Server Count:** \`${client.guilds.cache.size}\`
              **User Count:** \`${client.users.cache.size}\`
              **Uptime:** \`${prettyMilliseconds(client.uptime)}\`
              **Node Version:** \`${node}\`
              **Library:** Discord.js
              **CPU Usage:** \`${cpu}%\`
              **RAM Usage:** \`${memoryUsage}\`
            `)
            .setTimestamp();

          await interaction.reply({
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

        embed.setTitle(`Information For: ${guild.name}`)
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
              name: `Emojis & Stickers [\`${emojis.cache.size + stickers.cache.size
                }\`]`,
              value: [
                `🌪️ **Animated:** \`${emojis.cache.filter((emoji) => emoji.animated).size
                }\``,
                `🗿 **Static:** \`${emojis.cache.filter((emoji) => !emoji.animated).size
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
                `💎 **Boosters:** \`${guild.members.cache.filter(
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

        await interaction.reply({
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
