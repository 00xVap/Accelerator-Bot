async function handleGlobalCommands(client, interaction) {
  const ascii = require("ascii-table");
  const fs = require("fs");
  const table = new ascii()
    .setHeading("Commands", "Status");

  let globalCommandArray = [];

  const commandFolders = fs.readdirSync("./src/commands/global-commands");
  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(`./src/commands/global-commands/${folder}`)
      .filter((file) => file.endsWith(".js"));

    const { commands } = client;
    for (const file of commandFiles) {
      const command = require(`../../commands/global-commands/${folder}/${file}`);
      const properties = { folder, ...command };
      
      commands.set(command.data.name, properties);
      globalCommandArray.push(command.data.toJSON());

      table.addRow(file, "Loaded")
      continue;
    }
  }

  client.application.commands.set(globalCommandArray)

  return console.log(table.toString(), `\n[SYSTEM]: Loaded ${globalCommandArray.length} commands in: GLOBAL.`)
}

module.exports = { handleGlobalCommands };
