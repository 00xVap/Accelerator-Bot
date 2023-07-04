const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const fs = require("fs");

async function handleTestingCommands(client) {
  const commandFiles = fs
    .readdirSync(`./src/commands/guild-commands/testing-server`)
    .filter((file) => file.endsWith(".js"));

  const { commands, testingCommandArray } = client;
  for (const file of commandFiles) {
    const command = require(`../../../commands/guild-commands/testing-server/${file}`);
    commands.set(command.data.name, command);
    testingCommandArray.push(command.data.toJSON());
  }

  const clientId = "1011816140885991425";
  const guildId = "461032244241498113";
  const rest = new REST({ version: "10" }).setToken(process.env.token);
  try {
    const dataTesting = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      {
        body: client.testingCommandArray,
      }
    );

    /*
        rest.delete(Routes.applicationCommand(clientId, '1060130789825708042'))
            .then(() => console.log('🟢 | Successfully deleted application (/) command,'))
            .catch(console.error);
        */

    console.log(
      `[SYSTEM]: Loaded ${dataTesting.length} commands in: Testing Server.`
    );
  } catch (error) {
    console.log(
      `[SYSTEM]: Error: No commands found in: Testing Server.`
    );
  }
}

module.exports = { handleTestingCommands };
