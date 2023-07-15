const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const toggleSchema = require("../../../model/toggle");
const { globalCommandArray } = require("../../../functions/handlers/handleGlobalCommands")

module.exports = {
    cooldown: 3,
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
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("disabled_list")
                .setDescription("View a list of all the disabled commands.")
        ),

    async execute(interaction, client) {
        const embed = new EmbedBuilder()
        const { guild, options } = interaction;
        const sub = options.getSubcommand();
        const cmd = options.getString("command-name")

        const directories = [
            ...new Set(interaction.client.commands.map((cmd) => cmd.folder))
        ];

        directories.splice(6, 1)

        const getCommands = interaction.client.commands.filter((cmd) => cmd.folder).map((cmd) => {
            return cmd.data.name
        });

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

                    const noDisable = ["toggle-command", "help"]

                    if (!getCommands.includes(cmd)) {
                        embed.setDescription(
                            `<:Error:977069715149160448> This is not a valid command!`
                        );

                        await interaction.reply({
                            embeds: [embed],
                            ephemeral: true,
                        });
                        return;
                    }

                    if (noDisable.includes(cmd)) {
                        embed.setDescription(
                            `<:Error:977069715149160448> Cannot disable this command!`
                        );

                        await interaction.reply({
                            embeds: [embed],
                            ephemeral: true,
                        });
                        return;
                    }

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

            case "disabled_list":
                toggleSchema.find({ Guild: interaction.guild.id }, async (err, data) => {
                    if (err) throw err;

                    const list = data.map((cmd, i) => `\`${cmd.Command}\``).join(", ");

                    embed.setTitle(`Disabled commands in ${guild.name}`)
                        .setThumbnail(guild.iconURL({ dynamic: true }))
                        .setDescription(list || `<:Error:977069715149160448> There are no disabled command in this guild yet!`);

                    await interaction.reply({
                        embeds: [embed],
                    });
                    return;
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