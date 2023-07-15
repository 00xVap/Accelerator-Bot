const { ActivityType, EmbedBuilder, ButtonBuilder, ButtonStyle, ComponentType, ActionRowBuilder } = require("discord.js");
const { AutoPoster } = require('topgg-autoposter')
const { topggToken } = process.env;

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    client.user.setPresence({
      activities: [
        {
          name: `over Academy City.`,
          type: ActivityType.Watching,
        },
      ],
    });

    console.log(
      `[SYSTEM]: ${client.user.tag} is online in ${client.guilds.cache.size} guilds.`
    );

    const ap = AutoPoster(topggToken, client)
    ap.on("posted", () => {
      console.log("[SYSTEM]: Stats posted on Top.gg.")
    });

    const channel = client.channels.cache.get("405124374698524672")
    const msg = 1

    const embed = new EmbedBuilder()
    const row = new ActionRowBuilder()
    const ruleButton = new ButtonBuilder()
      .setCustomId("rules")
      .setLabel("Rules")
      .setEmoji("📜")
      .setStyle(ButtonStyle.Secondary)
    const informationButton = new ButtonBuilder()
      .setCustomId("information")
      .setEmoji("💬")
      .setLabel("Additional Information")
      .setStyle(ButtonStyle.Secondary)
    const inviteButton = new ButtonBuilder()
      .setCustomId("invite")
      .setLabel("Invite a Friend")
      .setEmoji("🌐")
      .setStyle(ButtonStyle.Secondary)
    row.addComponents(ruleButton, informationButton, inviteButton)

    embed.setTitle("🚫 Server Information")
      .setTitle("About Us")
      .setThumbnail("https://cdn.discordapp.com/icons/358671240568766464/adc6a89a486a3d372f033229af79ee6d.webp?size=1024")
      .setDescription(`Hello! Welcome to THE GR🚫UP! This place is for decent people to have a decent conversation and to game with each other. We mainly play Diep.io, but many of us also play Among Us, Starve.io, Minecraft, Surviv.io, Moomoo.io, LittleBigSnake, Skribbl.io, and many more arena-based multiplayer games . Let's have fun here and kick some ass! The staff will always be adding new things to the server to make it more interesting.\n\nIf you have an idea or a suggestion you would like to share with the server, just message any staff member!\n\nUse the buttons below to view the server rules, some additional information about the server or to invite a friend here!`)

    await channel.messages
      .fetch({ msg })
      .then(async (message) => {
        await channel.bulkDelete(msg).catch(async (e) => {
          return;
        });
      });

    const infoMessage = await channel.send({
      username: "ACCELERAT🚫R B🚫T (/)",
      avatarURL: `${client.user.displayAvatarURL()}`,
      embeds: [embed],
      components: [row],
    })

    const collector = infoMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
    });

    collector.on("collect", async (i) => {
      await i.deferUpdate({
        ephemeral: true
      })
      switch (i.customId) {
        case "rules":
          embed.setTitle("🚫 Rules")
            .setDescription(`
              \`01\` No spamming in chat or using a bot. You will be muted. If you keep spamming when your mute is over your punishment gets worse.

              \`02\` Offensive names, profile pictures, member (especially STAFF) impersonation, and gifs will not be tolerated, as this includes NSFW / Gore / Attention Seeking / Targeting / and Racial matters.
              
              \`03\` Erotic Roleplay is blacklisted from our server.
              
              \`04\` Abide by Discord's [Terms of Service](https://discordapp.com/terms) and [Guidelines](https://discordapp.com/guidelines).
              
              \`05\` Respect other members. Bullying, toxicity, and harassment, as well as, sexist, homophobic and racial remarks (referring to things like the n word, beaner, or cracker). The n word is not allowed in any capacity, however, beaner, and cracker, and other similar words, so long as they have an alternative civil usage in language, are fine, but only if they are used in general conversation, and not against somebody. Using words like these as a method of insulting or degrading will count in breaking Rule 5 and will NOT be tolerated.
              
              \`06\` Use channels appropriately and keep use of bots in their respective channels.
              
              \`07\` Don't ping members unnecessarily, staff members especially. We may not always be able to reply right away. Reaching out to an active mod/admin rather than a specific one will likely save you time.
              
              \`08\` Do not advertise, DM or otherwise outside of . Doing so will result in a swifty punishment.
              
              \`09\` Don't post NSFW pics.
              
              \`10\` Use voice channels appropriately. Do not use voice changers and/or earrape. Doing so will result in a mute/warn.
              
              \`11\` Use common sense and have a sense of social awareness. Just because it's not in the rules doesn't make insensitive behavior right.
              
              \`12\` RESPECT ALL STAFF MEMBERS AT ALL TIMES. There are no exceptions.
              
              \`13\` Insinuating drama about one or more individuals, whether it be inside or outside of the server doesn't make you any better than the person you're targeting. Staff WILL punish you, no matter how "in the right" you are.
              `)

          await i.followUp({
            embeds: [embed],
            ephemeral: true
          });
          break;

        case "information":
          embed.setTitle("🚫 Additional Information")
            .setDescription(`
                **-** We have a leveling system! Check out our [leaderboard](https://mee6.xyz/levels/358671240568766464) for more information.
                <:space:1005359382776778802> ↳ The more active you are in this server, the more you level up and gain more experience.

                **-** You can now enhance your discord experience and even buy roles. For more information look in <#408115231181766666> and go to pinned messages. 

                **-** If you want to assign yourself a selfrole, take a look in <#908043023940739073>.
              `)

          await i.followUp({
            embeds: [embed],
            ephemeral: true
          })
          break;

        case "invite":
          embed.setTitle("🚫 Server Invite")
            .setDescription(`
                If you want to invite a friend here, here's our vanity URL!

                \`discord.gg/thegroup\`
                \`https://discord.com/invite/thegroup\`
              `)

          await i.followUp({
            embeds: [embed],
            ephemeral: true
          })
          break;

        default:
          break;
      }
    })
  },
};
