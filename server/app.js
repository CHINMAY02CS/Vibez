require("dotenv").config();
require("./models/model");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(require("./routes/auth"));

mongoose.connect(process.env.MONGO_DB_URL);

mongoose.connection.on("connected", () => {
  console.log("successfully connected to mongo");
});

mongoose.connection.on("error", () => {
  console.log("error");
});

app.listen(process.env.PORT, () => {
  console.log("server is running on port " + process.env.PORT);
});
