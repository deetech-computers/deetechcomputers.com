import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const mongoUri = String(process.env.MONGO_URI || "").trim();

if (!mongoUri) {
  console.error("MONGO_URI is missing. Set it in your environment before running this script.");
  process.exit(1);
}

console.log("Testing MongoDB connection...");

mongoose
  .connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("SUCCESS: Connected to MongoDB.");
    console.log("Database:", mongoose.connection.db.databaseName);
    console.log("Host:", mongoose.connection.host);
    mongoose.connection.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error("Connection failed:", err.message);
    process.exit(1);
  });
