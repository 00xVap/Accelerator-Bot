const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Fetches the avatar of the given user.")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Type of avatar you want to get (User or Server).")
        .setRequired(true)
        .setChoices(
          { name: "Global", value: "global" },
          { name: "Server", value: "server" }
        )
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User you want to get the avatar from.")
    ),

  async execute(interaction, client) {
    await interaction.deferReply();
    const embed = new EmbedBuilder();

    const type = interaction.options.getString("type");
    let target = interaction.options.getUser("user");

    switch (type) {
      case "global":
        if (!target) target = interaction.user;
        embed
          .setAuthor({
            name: `${target.tag}'s Avatar. | Global`,
            iconURL: `${target.displayAvatarURL({ dynamic: true })}`,
          })
          .setImage(`${target.displayAvatarURL({ dynamic: true, size: 4096 })}`)
          .setTimestamp();

        await interaction.editReply({
          embeds: [embed],
        });
        break;

      case "server":
        if (!target) target = interaction.user;

        let res = await axios.get(
          `https://discord.com/api/guilds/${interaction.guild.id}/members/${target.id}`,
          {
            headers: {
              Authorization: `Bot ${process.env.token}`,
            },
          }
        );

        if (res.data.avatar !== undefined && res.data.avatar !== null) {
          let url = `https://cdn.discordapp.com/guilds/${interaction.guild.id}/users/${target.id}/avatars/${res.data.avatar}.webp?size=4096`;

          embed
            .setAuthor({
              name: `${target.tag}'s Avatar. | Server`,
              iconURL: `${target.displayAvatarURL({ dynamic: true })}`,
            })
            .setImage(url)
            .setTimestamp();

          await interaction.editReply({
            embeds: [embed],
          });
          return;
        } else {
          embed
            .setAuthor({
              name: `${target.tag}'s Avatar. | Global`,
              iconURL: `${target.displayAvatarURL({ dynamic: true })}`,
            })
            .setImage(
              `${target.displayAvatarURL({ dynamic: true, size: 4096 })}`
            )
            .setTimestamp()
            .setFooter({ text: `User has no server avatar.` });

          await interaction.editReply({
            embeds: [embed],
          });
        }
        break;

      default:
        break;
    }
  },
};
