require("dotenv").config();
require("./models/model");
require("./models/post");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use(require("./routes/auth"));
app.use(require("./routes/user"));
app.use(require("./routes/createPost"));

const connectDB = require("./config/db");
connectDB();

app.listen(process.env.PORT, () => {
  console.log("server is running on port " + process.env.PORT);
});
