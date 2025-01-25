const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

const signInService = async ({ email, password }) => {
  try {
    if (!email || !password) {
      return { error: "Please add email and password" };
    }
    const existingUser = await USER.findOne({ email: email });
    if (!existingUser) {
      return { error: "User does not exist with this email" };
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return { error: "Invalid password" };
    }
    const token = jwt.sign(
      { _id: existingUser._id },
      process.env.JWT_SECRET_KEY
    );
    const { _id, name, userName } = existingUser;
    return {
      message: "Sign-in successful",
      token,
      user: { _id, name, email, userName },
    };
  } catch (error) {
    console.error("SignIn Service Error:", error);
    return { error: "SignIn process failed" };
  }
};

module.exports = { signUpService, signInService };
