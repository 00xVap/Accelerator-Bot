require("dotenv").config();
const { token } = process.env;
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify")

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});
client.setMaxListeners(25);

client.commands = new Collection();
client.cooldowns = new Collection();
require("./mongo")();

client.groupCommandArray = [];
client.testingCommandArray = [];
client.color = "#302c34";
client.owner = "380933616898932746";
client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnFinish: true,
  emitAddSongWhenCreatingQueue: false,
  plugins: [new SpotifyPlugin({
    parallel: true,
    emitEventsAfterFetching: false,
    api: {
      clientId: "624a1b42c6d54653b2358a60b7cb166b",
      clientSecret: "c12df0061a824536b3597e510085925d",
    },
  })]
});

module.exports = client;

/*client.on("messageDelete", async (message, channel) => {
  client.snipes.set(message.channel.id, {
    content: message.content,
    author: message.author,
    image: message.attachments.first()
      ? message.attachments.first().proxyURL
      : null,
  });
});*/

process.on('uncaughtException', async (err) => {
  console.error('Uncaught Exception:', err.message);
  console.error(err.stack);

  return;
});

process.on('unhandledRejection', async (err) => {
  console.error('Unhandled Promise Rejection:', err.message);
  console.error(err.stack);

  return;
});

const { handleGlobalCommands } = require("./functions/handlers/handleGlobalCommands");
const { handleTestingCommands } = require("./functions/handlers/guild-command-handlers/handleTestingCommands");
const { handleTheGroupCommands } = require("./functions/handlers/guild-command-handlers/handleTheGroupCommands");
const { handleEvents } = require("./functions/handlers/handleEvents");

client.login(token).then(() => {
  handleGlobalCommands(client);
  handleTheGroupCommands(client);
  handleTestingCommands(client);
  handleEvents(client);
});