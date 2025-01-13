const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.post("/create-post", (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  res.json("ok");
});

module.exports = router;
