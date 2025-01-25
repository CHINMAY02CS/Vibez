const express = require("express");
require("dotenv").config();
const { signUpService } = require("../services/auth");
const { signInService } = require("../services/auth");

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
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await signInService({ email, password });
    if (result.error) {
      return res.status(422).json({ error: result.error });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("SignIn Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
