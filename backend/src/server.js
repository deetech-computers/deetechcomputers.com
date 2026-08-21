// backend/src/server.js
import { createServer } from "http";
import mongoose from "mongoose";
import { PORT, NODE_ENV, BACKEND_PUBLIC_URL } from "./config/env.js";
import connectDB from "./config/db.js";
import createApp from "./app.js";
import logger from "./utils/logger.js";
import { migrateLegacyReviewStatus } from "./utils/reviewStatusMigration.js";

// Render's free tier spins a web service down after 15 minutes with no
// inbound HTTP traffic, then pays a slow cold-start on the next real
// request. Pinging our own public health endpoint well inside that window
// counts as normal inbound traffic and keeps the instance warm. This only
// works while the process is already running - it can't wake up an
// instance that's already asleep, and won't help if Render restarts the
// service for its own reasons (a deploy, a crash, host maintenance). It's
// one layer, not a substitute for an external uptime monitor (e.g.
// UptimeRobot, cron-job.org) hitting the same endpoint from outside, which
// also gets you downtime alerts this can't provide.
const SELF_PING_INTERVAL_MS = 10 * 60 * 1000;

function startSelfPing() {
  if (NODE_ENV !== "production") return;
  const publicUrl = String(BACKEND_PUBLIC_URL || "").replace(/\/+$/, "");
  if (!publicUrl) {
    logger.warn("BACKEND_PUBLIC_URL is not set - self-ping keep-alive is disabled.");
    return;
  }

  const pingUrl = `${publicUrl}/api/health`;
  setInterval(() => {
    fetch(pingUrl).catch((err) => {
      logger.warn("Self-ping keep-alive request failed", { error: err?.message || err });
    });
  }, SELF_PING_INTERVAL_MS);
  logger.info(`Self-ping keep-alive enabled -> ${pingUrl} every ${SELF_PING_INTERVAL_MS / 60000} minutes`);
}

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
      startSelfPing();
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
    await migrateLegacyReviewStatus();
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
