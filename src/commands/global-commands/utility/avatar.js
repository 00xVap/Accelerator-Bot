const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("View your avatar or the avatar of a given user.")
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
    const embed = new EmbedBuilder();

    const type = interaction.options.getString("type");
    let target = interaction.options.getUser("user") || interaction.user;

    switch (type) {
      case "global":
        if (!interaction.user.discriminator || interaction.user.discriminator === 0 || interaction.user.tag === `${interaction.user.username}#0`) {
          embed.setAuthor({
            name: `${target.username}'s Avatar. | Global`,
            iconURL: `${target.displayAvatarURL({ dynamic: true })}`,
          })
        } else {
          embed.setAuthor({
            name: `${target.tag}'s Avatar. | Global`,
            iconURL: `${target.displayAvatarURL({ dynamic: true })}`,
          })
        }


        embed.setImage(`${target.displayAvatarURL({ dynamic: true, size: 4096 })}`)
          .setTimestamp();

        await interaction.reply({
          embeds: [embed],
        });
        break;

      case "server":
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

          if (!interaction.user.discriminator || interaction.user.discriminator === 0 || interaction.user.tag === `${interaction.user.username}#0`) {
            embed.setAuthor({
              name: `${target.username}'s Avatar. | Server`,
              iconURL: `${target.displayAvatarURL({ dynamic: true })}`,
            })
          } else {
            embed.setAuthor({
              name: `${target.tag}'s Avatar. | Server`,
              iconURL: `${target.displayAvatarURL({ dynamic: true })}`,
            })
          }

          embed.setImage(url)
            .setTimestamp();

          await interaction.reply({
            embeds: [embed],
          });
          return;
        } else {

          if (!interaction.user.discriminator || interaction.user.discriminator === 0 || interaction.user.tag === `${interaction.user.username}#0`) {
            embed.setAuthor({
              name: `${target.username}'s Avatar. | Global`,
              iconURL: `${target.displayAvatarURL({ dynamic: true })}`,
            })
          } else {
            embed.setAuthor({
              name: `${target.tag}'s Avatar. | Global`,
              iconURL: `${target.displayAvatarURL({ dynamic: true })}`,
            })
          }

          embed.setImage(
            `${target.displayAvatarURL({ dynamic: true, size: 4096 })}`
          )
            .setTimestamp()
            .setFooter({ text: `User has no server avatar.` });

          await interaction.reply({
            embeds: [embed],
          });
        }
        break;

      default:
        break;
    }
  },
};
