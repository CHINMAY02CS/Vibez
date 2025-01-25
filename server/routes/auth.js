const express = require("express");
require("dotenv").config();
const {
  signUpController,
  signInController,
} = require("../controller/authController");

const router = express.Router();

// API for signup
router.post("/signup", signUpController);

// API for signin
router.post("/signin", signInController);

module.exports = router;
