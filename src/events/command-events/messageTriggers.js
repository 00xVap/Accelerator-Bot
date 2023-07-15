const triggerSchema = require(`../../model/triggers`);

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (message.author.bot) return;

    let trigger = message.content.toLowerCase().split(/ +/g)

    await triggerSchema.findOne(
      { Guild: message.guild.id, Command: trigger },
      async (err, data) => {
        if (err) throw err;
        if (!data) return;

        if (trigger.includes(data.Command)) {
          await message.channel.send({
            content: `${data.Response}`
          });
          return;
        }
      }
    ).clone().catch(function (err) {
      console.log(err);
    });
  },
};