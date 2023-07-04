const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const toggleSchema = require("../../../model/toggle");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("toggle-command")
        .setDescription("Enable or disable specific commands.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand((subcommand) =>
            subcommand
                .setName("enable")
                .setDescription("Enables a specific command (if already disabled).")
                .addStringOption((option) =>
                    option.setName("command-name")
                        .setDescription("Command to enable (if already disabled).")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("disable")
                .setDescription("Disables a specific command.")
                .addStringOption((option) =>
                    option.setName("command-name")
                        .setDescription("Command to disable")
                        .setRequired(true)
                )
        ),

    async execute(interaction, client) {
        const embed = new EmbedBuilder()
        const { guild, options } = interaction;
        const sub = options.getSubcommand();
        const cmd = options.getString("command")

        switch (sub) {
            case "enable":
                toggleSchema.findOne({ Guild: guild.id, Command: cmd }, async (err, data) => {
                    if (err) throw err;

                    if (!data) {
                        embed.setDescription(
                            `<:Error:977069715149160448> Command \`${cmd}\` is already enabled!`
                        );

                        await interaction.reply({
                            embeds: [embed],
                            ephemeral: true,
                        });
                        return;
                    }

                    await toggleSchema.findOneAndDelete({
                        Guild: guild.id,
                        Command: cmd,
                    });

                    embed.setDescription(
                        `<:Success:977389031837040670> Command \`${cmd}\` enabled successfully!`
                    );

                    await interaction.reply({
                        embeds: [embed],
                        ephemeral: true,
                    });
                })
                    .clone()
                    .catch(function (err) {
                        console.log(err);
                    });
                break;

            case "disable":
                toggleSchema.findOne({ Guild: guild.id, Command: cmd }, async (err, data) => {
                    if (err) throw err;

                    const commands = client.globalCommandArray.map((e) => e.name)

                    console.log(commands)

                    commands.forEach(async (command) => {
                        if (!command.includes(cmd)) {
                            embed.setDescription(
                                `<:Error:977069715149160448> This is not a valid command!`
                            );

                            await interaction.reply({
                                embeds: [embed],
                                ephemeral: true,
                            });
                            return;
                        }
                    })

                    const noDisable = ["toggle-command", "help"]

                    noDisable.forEach(async (a) => {
                        if (cmd.includes(a)) {
                            embed.setDescription(
                                `<:Error:977069715149160448> Cannot disable this command!`
                            );

                            await interaction.reply({
                                embeds: [embed],
                                ephemeral: true,
                            });
                            return;
                        }
                    })

                    if (data) {
                        embed.setDescription(
                            `<:Error:977069715149160448> Command \`${cmd}\` is already disabled!`
                        );

                        await interaction.reply({
                            embeds: [embed],
                            ephemeral: true,
                        });
                        return;
                    }

                    data = new toggleSchema({
                        Guild: guild.id,
                        Command: cmd,
                    });

                    await data.save();

                    embed.setDescription(
                        `<:Success:977389031837040670> Command \`${cmd}\` disabled successfully!`
                    );

                    await interaction.reply({
                        embeds: [embed],
                        ephemeral: true,
                    });
                })
                    .clone()
                    .catch(function (err) {
                        console.log(err);
                    });
                break;

            default:
                break;
        }
    }
}