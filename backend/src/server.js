// backend/src/server.js
import { createServer } from "http";
import mongoose from "mongoose";
import { PORT, NODE_ENV } from "./config/env.js";
import connectDB from "./config/db.js";
import createApp from "./app.js";
import logger from "./utils/logger.js";

let server;
let shutdownStarted = false;

async function start() {
  try {
    // 1️⃣ Connect to DB first
    await connectDB();

    // 2️⃣ Initialize Express app
    const app = await createApp();
    server = createServer(app);

    server.on("close", () => {
      logger.warn("HTTP server close event fired");
    });

    server.on("error", (error) => {
      logger.error("HTTP server emitted an error", {
        error: error.stack || error.message,
      });
    });

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
  if (shutdownStarted) {
    logger.warn(`Shutdown already in progress. Ignoring duplicate signal: ${signal}`);
    return;
  }

  shutdownStarted = true;
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
process.on("beforeExit", (code) => {
  logger.warn(`beforeExit event fired with code ${code}`);
});
process.on("exit", (code) => {
  logger.warn(`Process exit event fired with code ${code}`);
});

// 🔥 Handle uncaught errors
process.on("uncaughtException", (err) => {
  logger.error("❌ Uncaught Exception", { error: err.stack || err.message });
  shutdown("uncaughtException");
});

process.on("unhandledRejection", (reason) => {
  logger.error("❌ Unhandled Rejection", { error: reason });
  shutdown("unhandledRejection");
});
