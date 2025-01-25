const { signUpService, signInService } = require("../services/authService");

const signUpController = async (req, res) => {
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
};

const signInController = async (req, res) => {
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
};

module.exports = { signUpController, signInController };
