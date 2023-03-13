const { Schema, model } = require("mongoose");

let warnSchema = new Schema({
  GuildID: String,
  UserID: String,
  UserTag: String,
  Content: Array,
});

module.exports = model("WarnSchema", warnSchema);
