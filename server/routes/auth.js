const express = require("express");
const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const bcrypt = require("bcrypt");
require("dotenv").config();
const signUpService = require("../services/auth");

const jwt = require("jsonwebtoken");
const router = express.Router();

// API for signup
router.post("/signup", async (req, res) => {
  const { name, userName, email, password } = req.body;
  try {
    const result = await signUpService({ name, email, userName, password });
    if (result.error) {
      return res.status(422).json({ error: result.error });
    }
    return res.status(200).json({ result: result });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// API for signin
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
          const token = jwt.sign(
            { _id: savedUser._id },
            process.env.JWT_SECRET_KEY
          );
          const { _id, name, email, userName } = savedUser;
          res.json({ token, user: { _id, name, email, userName } });
        } else {
          return res.status(422).json({ error: "Invalid password" });
        }
      })
      .catch((error) => console.log(error));
  });
});

module.exports = router;
