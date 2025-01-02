const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  res.send("Hello");
});

router.post("/signup", (req, res) => {
  const { name, userName, email, password } = req.body;
  if (!name || !email || !password || !userName) {
    res.status(422).json({ error: "Please add all the fields" });
  }

  USER.findOne({
    $or: [{ email: email }, { userName: userName }],
  }).then((savedUser) => {
    if (savedUser) {
      return res
        .status(422)
        .json({ error: "User already exists with this email or userName" });
    }
    bcrypt.hash(password, 12).then((hashedPassword) => {
      const user = new USER({
        name,
        email,
        userName,
        password: hashedPassword,
      });

      user
        .save()
        .then((user) => {
          res.json({ message: "user saved successfully" });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
});

module.exports = router;