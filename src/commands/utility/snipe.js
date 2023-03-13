const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");
const moment = require("moment");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("snipe")
    .setDescription("Snipes the last deleted message.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Channel you want to snipe a message in.")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const embed = new EmbedBuilder();
    const channel = interaction.options.getChannel("channel");

    const msg = client.snipes.get(channel.id);

    if (!msg) {
      const embed = new EmbedBuilder().setDescription(
        "<:Error:977069715149160448> Couldn't find any deleted messages."
      );

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply();

    const ID = msg.author.id;
    const member = interaction.guild.members.cache.get(ID);
    const URL = member.user.displayAvatarURL({ dynamic: true });

    embed
      .setAuthor({ name: `Deleted by ${member.user.tag}.`, iconURL: URL })
      .setDescription(
        `**Channel:** ${channel}
                **Message Content:**
                \`\`\`${msg.content}\`\`\``
      )
      .setTimestamp()
      .setFooter({ text: `User ID: ${ID}` });

    if (msg.image) embed.setImage(msg.image);

    await interaction.editReply({
      embeds: [embed],
    });
    return;
  },
};
