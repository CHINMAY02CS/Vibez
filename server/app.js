const express = require("express");
const app = express();

const PORT = 5000;

app.get("/", (req, res) => {
  res.json({ name: "Chinmay", email: "chinmay@mail.com" });
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
