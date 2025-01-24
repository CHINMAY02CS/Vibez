const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    mongoose.connection.on("connected", () => {
      console.log("successfully connected to mongo");
    });

    mongoose.connection.on("error", () => {
      console.log("error");
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
