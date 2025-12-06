import mongoose from "mongoose";

const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

export const connectToDatabase = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");
};

async function connectToDB() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
    });
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
}

async function disconnectFromDB() {
  try {
    await mongoose.disconnect();
    console.log("Disconnecting from database...");
  } catch (error) {
    console.error("Error disconnecting from database:", error);
    throw error;
  }
}

// mongoose connection event handler
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from DB");
});

module.exports = {
  connectToDB,
  disconnectFromDB,
};
