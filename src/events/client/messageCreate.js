const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { handleCommands } = require("../../functions/handlers/handleCommands");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    const prefix = "a?";
    if (!client.owner.includes(message.author.id)) return;
    if (!message.content.startsWith(prefix)) return;
    const perms = message.channel
      .permissionsFor(client.user)
      .has(PermissionFlagsBits.SendMessages, false);
    if (!perms) {
      return;
    }

    if (message.content === `${prefix}reload`) {
      const embed = new EmbedBuilder();

      try {
        client.application.commands.set([]);
        handleCommands(client);
      } catch (error) {
        console.log(error);

        embed.setDescription(
          `<:Error:977069715149160448> An error has occured.`
        );

        await message.channel.send({
          embeds: [embed],
        });
        return;
      }

      embed.setDescription(
        `<:Success:977389031837040670> Reloaded \`[/] Slash Commands\`.`
      );

      await message.channel.send({
        embeds: [embed],
      });
      return;
    }

    // Server List Command
    if (message.content === `${prefix}serverlist`) {
      index = 1;
      const discordServers = client.guilds.cache
        .map((g) => `\`${index++}\` **•** ${g.name} [\`${g.id}\`]`)
        .join("\n");

      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({
          name: "Accelerator",
          iconURL: client.user.displayAvatarURL(),
        })
        .setTitle("Server List")
        .setDescription(discordServers)
        .setTimestamp();

      await message.channel.send({
        embeds: [embed],
      });
      return;
    }

    if (message.content === `${prefix}perms test`) {
      await message.channel.send({
        content: "yes bro",
      });
    }

    if (message.content === `${prefix}diepv2`) {
      var region = "atl";
      var gamemode = "4teams";
      var diepFetched = "https://matchmaker.api.rivet.gg/v1/lobbies/list";
      function decimalToHex(d) {
        var hex = Number(d).toString(16);
        while (hex.length < 2) {
          hex = "0" + hex;
        }
        return hex;
      }

      fetch(diepFetched, {
        headers: {
          Origin: "https:/diep.io/",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((response) => response.json())
        .then((json) => {
          for (let i = 0; i < json.lobbies.length; i++) {
            if (
              json.lobbies[i].region_id == "lnd-" + region &&
              json.lobbies[i].game_mode_id == gamemode
            ) {
              console.log(
                `${
                  "https://diep.io/#" +
                  json.lobbies[i].lobby_id
                    .split("")
                    .map((r) => r.charCodeAt())
                    .map((x) => ((x & 0x0f) << 4) | ((x & 0xf0) >> 4))
                    .map((x) => decimalToHex(x))
                    .join("")
                }`
              );
            }
          }
        });
    }
  },
};
