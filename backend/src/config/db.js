// backend/src/config/db.js
import mongoose from "mongoose";
import { MONGO_URI, NODE_ENV } from "./env.js";
import logger from "../utils/logger.js";

const connectDB = async (retries = 5, delay = 5000) => {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  const opts = {
    autoIndex: NODE_ENV !== "production",
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const conn = await mongoose.connect(MONGO_URI, opts);
      logger.info(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    } catch (err) {
      logger.error(`❌ MongoDB connection attempt ${attempt} failed`, {
        error: err?.message || "Unknown MongoDB error",
        code: err?.code || "",
        name: err?.name || "",
      });

      if (attempt < retries) {
        logger.info(`⏳ Retrying MongoDB connection in ${delay / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(`All MongoDB connection attempts failed after ${retries} retries`);
};

export default connectDB;
