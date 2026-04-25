// backend/src/server.js
import { createServer } from "http";
import mongoose from "mongoose";
import { PORT, NODE_ENV } from "./config/env.js";
import connectDB from "./config/db.js";
import createApp from "./app.js";
import logger from "./utils/logger.js";

let server;
let shutdownStarted = false;
let reconnectInProgress = false;
let reconnectTimer = null;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function scheduleReconnect(delayMs = 10000) {
  if (shutdownStarted || reconnectInProgress || reconnectTimer) return;
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    void connectToMongoWithRecovery();
  }, delayMs);
}

async function connectToMongoWithRecovery() {
  if (shutdownStarted || reconnectInProgress) return;
  reconnectInProgress = true;

  try {
    while (!shutdownStarted) {
      try {
        await connectDB(5, 5000);
        logger.info("✅ MongoDB is ready.");
        break;
      } catch (err) {
        logger.error("❌ MongoDB connection cycle failed", {
          error: err?.message || "Unknown MongoDB error",
        });
        logger.info("⏳ Will retry MongoDB connection in 10s...");
        await sleep(10000);
      }
    }
  } finally {
    reconnectInProgress = false;
  }
}

async function start() {
  try {
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

    server.listen(PORT, () => {
      logger.info(`🚀 Deetech backend running in ${NODE_ENV} mode on port ${PORT}`);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected. Scheduling reconnect...");
      scheduleReconnect(1000);
    });

    mongoose.connection.on("error", (error) => {
      logger.error("MongoDB connection error", {
        error: error?.message || error,
      });
    });

    await connectToMongoWithRecovery();
  } catch (err) {
    logger.error("❌ Failed to start server", { error: err.stack || err.message });
    process.exit(1);
  }
}

start();

async function shutdown(signal) {
  if (shutdownStarted) {
    logger.warn(`Shutdown already in progress. Ignoring duplicate signal: ${signal}`);
    return;
  }

  shutdownStarted = true;
  logger.info(`${signal} received. Shutting down gracefully...`);

  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }

  try {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
      logger.info("✅ HTTP server closed");
    }

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      logger.info("✅ MongoDB connection closed");
    }

    process.exit(0);
  } catch (err) {
    logger.error("❌ Error during shutdown", { error: err.message });
    process.exit(1);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("beforeExit", (code) => {
  logger.warn(`beforeExit event fired with code ${code}`);
});
process.on("exit", (code) => {
  logger.warn(`Process exit event fired with code ${code}`);
});

process.on("uncaughtException", (err) => {
  logger.error("❌ Uncaught Exception", { error: err.stack || err.message });
  shutdown("uncaughtException");
});

process.on("unhandledRejection", (reason) => {
  logger.error("❌ Unhandled Rejection", { error: reason });
  shutdown("unhandledRejection");
});
