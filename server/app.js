require("dotenv").config();
require("./models/model");
require("./models/post");
const connectDB = require("./config/db");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true, // Allow cookies if needed
  })
);
app.use(express.json());

app.use(require("./routes/auth"));
app.use(require("./routes/user"));
app.use(require("./routes/post"));

connectDB();

app.listen(process.env.PORT, () => {
  console.log("server is running on port " + process.env.PORT);
});
