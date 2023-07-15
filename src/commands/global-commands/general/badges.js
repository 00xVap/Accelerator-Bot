const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
        .setName("badges")
        .setDescription("Returns the badges of a user.")
        .addUserOption((option) =>
            option.setName("user").setDescription("The user you want to check the badges of")
        ),

    async execute(interaction, client) {

        const { options } = interaction;

        let user = options.getUser("user") || interaction.user;
        const member = await interaction.guild.members.cache.get(user.id);
        let flags = user.flags.toArray();

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

        await fetch(`https://japi.rest/discord/v1/user/${user.id}`)
            .then(r => r.json()).then(async ({ data }) => {
                if (data.public_flags_array) {
                    await Promise.all(data.public_flags_array.map(async badge => {
                        if (badge === "NITRO") badges.push("<:Nitro:1121062370136043541>")
                    }))
                }
            }).catch((err) => {
                return;
            })

        if (user.bot) {
            const botFetch = await fetch(
                `https://discord.com/api/v10/applications/${user.id}/rpc`
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

        if (!user.discriminator || user.discriminator === 0 || user.tag === `${user.username}#0`) {
            badges.push("<:Knownas:1121062367149707438>");

            extrabadges.push(`https://cdm.discordapp.com/attachments/1080219392337522718/1109461965711089694/username.png`)
        }

        const embed = new EmbedBuilder()
            .setTitle(`${user.username}'s Badges`)
            .setDescription(`${badges.join(" ") || "\`No badges found.\`"}`)
            .setTimestamp()

        await interaction.reply({
            embeds: [embed]
        });
        return;
    },
};