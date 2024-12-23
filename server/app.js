const express = require("express");
const app = express();
const PORT = 5000;
const data = require("./data.js");

app.get("/", (req, res) => {
  res.json(data);
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
