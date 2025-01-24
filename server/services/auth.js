const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const bcrypt = require("bcrypt");

const signUpService = async ({ name, email, userName, password }) => {
  try {
    if (!name || !email || !password || !userName) {
      return { error: "Please add all the fields" };
    }
    const existingUser = await USER.findOne({
      $or: [{ email: email }, { userName: userName }],
    });
    if (existingUser) {
      return { error: "User already exists with this email or username" };
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new USER({
      name,
      email,
      userName,
      password: hashedPassword,
    });
    await user.save();
    return { message: "user saved successfully", user: user };
  } catch (error) {
    console.error("Signup Service Error:", error);
    return { error: "signup process failed" };
  }
};

module.exports = signUpService;
