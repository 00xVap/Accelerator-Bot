const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const fs = require("fs");

async function handleCommands(client) {
  const commandFolders = fs.readdirSync("./src/commands");
  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(`./src/commands/${folder}`)
      .filter((file) => file.endsWith(".js"));

    const { commands, commandArray } = client;
    for (const file of commandFiles) {
      const command = require(`../../commands/${folder}/${file}`);
      commands.set(command.data.name, command);
      commandArray.push(command.data.toJSON());
    }
  }

  const clientId = "1011816140885991425";
  const rest = new REST({ version: "10" }).setToken(process.env.token);
  try {
    console.log(`🟡 | [/] Started reloading commands.`);

    const dataGlobal = await rest.put(Routes.applicationCommands(clientId), {
      body: client.commandArray,
    });

    /*
        rest.delete(Routes.applicationCommand(clientId, '1060130789825708042'))
            .then(() => console.log('🟢 | Successfully deleted application (/) command,'))
            .catch(console.error);
        */

    console.log(
      `🟢 | [/] Successfully reloaded ${dataGlobal.length} commands.`
    );
  } catch (error) {
    console.log(error);
  }
}

module.exports = { handleCommands };
