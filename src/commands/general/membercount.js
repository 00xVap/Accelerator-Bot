const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("membercount")
    .setDescription("Sends the total amount of members in the current guild.")
    .setDMPermission(false),

  async execute(interaction, client) {
    await interaction.deferReply();
    const embed = new EmbedBuilder();

    let usercount = await interaction.guild.members.cache.filter(
      (member) => !member.user.bot
    ).size;
    let botcount = await interaction.guild.members.cache.filter(
      (member) => member.user.bot
    ).size;

    embed
      .setTitle(`Members (${interaction.guild.name})`)
      .setDescription(
        `**Total:** \`${interaction.guild.memberCount}\`
                    <:space:1005359382776778802>**»** **Users:** \`${usercount}\`
                    <:space:1005359382776778802>**»** **Bots:** \`${botcount}\``
      )
      .setTimestamp();

    await interaction.editReply({
      embeds: [embed],
    });
    return;
  },
};
