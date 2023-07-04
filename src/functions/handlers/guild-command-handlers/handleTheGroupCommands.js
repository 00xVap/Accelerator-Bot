const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const fs = require("fs");

async function handleTheGroupCommands(client) {
  const commandFiles = fs
    .readdirSync(`./src/commands/guild-commands/the-group`)
    .filter((file) => file.endsWith(".js"));

  const { commands, groupCommandArray } = client;
  for (const file of commandFiles) {
    const command = require(`../../../commands/guild-commands/the-group/${file}`);
    commands.set(command.data.name, command);
    groupCommandArray.push(command.data.toJSON());
  }

  const clientId = "1011816140885991425";
  const guildId = "358671240568766464";
  const rest = new REST({ version: "10" }).setToken(process.env.token);
  try {
    const dataGroup = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      {
        body: client.groupCommandArray,
      }
    );

    /*
        rest.delete(Routes.applicationCommand(clientId, '1060130789825708042'))
            .then(() => console.log('🟢 | Successfully deleted application (/) command,'))
            .catch(console.error);
        */

    console.log(
      `[SYSTEM]: Loaded ${dataGroup.length} commands in: The Group.`
    );
  } catch (error) {
    console.log(
      `[SYSTEM]: Error: No commands found in: The Group.`
    );
  }
}

module.exports = { handleTheGroupCommands };
