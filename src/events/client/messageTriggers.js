const triggerSchema = require(`../../model/triggers`);

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (message.author.bot) return;

    await triggerSchema
      .findOne(
        { Guild: message.guild.id, Command: message.content },
        async (err, data) => {
          if (err) throw err;
          if (!data) return;

          await message.channel.send({
            content: `${data.Response}`,
          });
          return;
        }
      )
      .clone()
      .catch(function (err) {
        console.log(err);
      });
  },
};