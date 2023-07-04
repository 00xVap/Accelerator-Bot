const { Schema, model } = require("mongoose");

let toggleSchema = new Schema({
  Guild: String,
  Command: String,
});

module.exports = model("ToggleSchema", toggleSchema);