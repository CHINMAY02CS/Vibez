require("dotenv").config();
require("./models/model");
require("./models/post");
const connectDB = require("./config/db");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require("./routes/auth"));
app.use(require("./routes/user"));
app.use(require("./routes/post"));

connectDB();

app.listen(process.env.PORT, () => {
  console.log("server is running on port " + process.env.PORT);
});
