const mongoose = require("mongoose");
const { mongoPath } = process.env;

module.exports = async () => {
  mongoose.connect(mongoPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  return mongoose;
};

mongoose.connection.on("connected", () => {
  console.log(`[SYSTEM]: Connected to Database.`);
});
