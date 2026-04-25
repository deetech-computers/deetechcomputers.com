import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const mongoUri = String(process.env.MONGO_URI || "").trim();

if (!mongoUri) {
  console.error("MONGO_URI is missing. Set it in your environment before running this script.");
  process.exit(1);
}

console.log("Testing MongoDB connection using environment MONGO_URI...");

mongoose
  .connect(mongoUri, {
    serverSelectionTimeoutMS: 20000,
  })
  .then(() => {
    console.log("SUCCESS: Connected to MongoDB.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Connection failed:", err.message);
    process.exit(1);
  });
