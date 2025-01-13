const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const requireLogin = require("../middlewares/requireLogin");

router.get("/", (req, res) => {
  res.send("Hello");
});

router.post("/signup", (req, res) => {
  const { name, userName, email, password } = req.body;
  if (!name || !email || !password || !userName) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  USER.findOne({
    $or: [{ email: email }, { userName: userName }],
  }).then((savedUser) => {
    if (savedUser) {
      return res
        .status(422)
        .json({ error: "User already exists with this email or username" });
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

router.post("/signin", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "Please add email and password" });
  }
  USER.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid Email" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((match) => {
        if (match) {
          // return res.status(200).json({message:"Signed In successfully"})
          const token = jwt.sign(
            { _id: savedUser._id },
            process.env.JWT_SECRET_KEY
          );
          const { _id, name, email, userName } = savedUser;
          res.json({ token, user: { _id, name, email, userName } });
          console.log({ token, user: { _id, name, email, userName } });
        } else {
          return res.status(422).json({ error: "Invalid password" });
        }
      })
      .catch((error) => console.log(error));
  });
});

module.exports = router;
