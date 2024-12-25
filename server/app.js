require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_DB_URL);

mongoose.connection.on("connected", () => {
  console.log("successfully connected to mongo");
});

mongoose.connection.on("error", () => {
  console.log("error");
});
