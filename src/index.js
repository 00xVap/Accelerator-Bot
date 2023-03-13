require("dotenv").config();
const { token } = process.env;
const { Player } = require("discord-player");
const {
  Client,
  Collection,
  GatewayIntentBits,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});

client.commands = new Collection();
require("./mongo")();

client.commandArray = [];
client.color = "#302c34";
client.owner = "380933616898932746";
client.player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  },
});
client.snipes = new Map();

client.on("messageDelete", async (message, channel) => {
  client.snipes.set(message.channel.id, {
    content: message.content,
    author: message.author,
    image: message.attachments.first()
      ? message.attachments.first().proxyURL
      : null,
  });
});

const { handleCommands } = require("./functions/handlers/handleCommands");
const { handleEvents } = require("./functions/handlers/handleEvents");

client.login(token).then(() => {
  handleCommands(client);
  handleEvents(client);
});
