// backend/src/server.js
import { createServer } from "http";
import mongoose from "mongoose";
import { PORT, NODE_ENV } from "./config/env.js";
import connectDB from "./config/db.js";
import createApp from "./app.js";
import logger from "./utils/logger.js";

let server;

async function start() {
  try {
    // 1️⃣ Connect to DB first
    await connectDB();

    // 2️⃣ Initialize Express app
    const app = await createApp();
    server = createServer(app);

    // 3️⃣ Start server
    server.listen(PORT, () => {
      logger.info(`🚀 Deetech backend running in ${NODE_ENV} mode on port ${PORT}`);
    });
  } catch (err) {
    logger.error("❌ Failed to start server", { error: err.stack || err.message });
    process.exit(1);
  }
}

start();

// 🛑 Graceful shutdown handler
async function shutdown(signal) {
  logger.info(`${signal} received. Shutting down gracefully...`);

  try {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
      logger.info("✅ HTTP server closed");
    }

    // ✅ Close Mongo connection too
    await mongoose.connection.close();
    logger.info("✅ MongoDB connection closed");

    process.exit(0);
  } catch (err) {
    logger.error("❌ Error during shutdown", { error: err.message });
    process.exit(1);
  }
}

// 🔌 Handle kill signals
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// 🔥 Handle uncaught errors
process.on("uncaughtException", (err) => {
  logger.error("❌ Uncaught Exception", { error: err.stack || err.message });
  shutdown("uncaughtException");
});

process.on("unhandledRejection", (reason) => {
  logger.error("❌ Unhandled Rejection", { error: reason });
  shutdown("unhandledRejection");
});
