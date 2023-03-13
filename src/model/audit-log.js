const { Schema, model } = require("mongoose");

let logSchema = new Schema({
  Guild: String,
  Channel: String,
});

module.exports = model("audit-log", logSchema);
