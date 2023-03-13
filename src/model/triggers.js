const { Schema, model } = require("mongoose");

let triggerSchema = new Schema({
  Guild: String,
  Command: String,
  Response: String,
});

module.exports = model("TriggerSchema", triggerSchema);
