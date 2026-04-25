import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { createClient } from "redis";
import { NODE_ENV, RATE_LIMIT_PREFIX, REDIS_URL } from "../config/env.js";

let redisClient = null;
let redisStore = null;
let redisInitStarted = false;

function initRedisStore() {
  if (!REDIS_URL || redisStore || redisInitStarted) return;
  redisInitStarted = true;

  redisClient = createClient({ url: REDIS_URL });
  redisClient.on("error", (err) => {
    console.warn("Redis rate-limit client error:", err?.message || err);
  });

  redisClient.connect().catch((err) => {
    console.warn("Redis rate-limit client connect failed:", err?.message || err);
  });

  redisStore = new RedisStore({
    prefix: `${RATE_LIMIT_PREFIX}:`,
    sendCommand: (...args) => redisClient.sendCommand(args),
  });
}

export function createRateLimiter(options = {}) {
  initRedisStore();
  const store = redisStore || undefined;
  return rateLimit({
    standardHeaders: true,
    legacyHeaders: false,
    passOnStoreError: true,
    ...options,
    ...(store ? { store } : {}),
  });
}

export function getRateLimiterMode() {
  if (redisStore) return "redis";
  if (REDIS_URL && NODE_ENV === "production") return "memory-fallback";
  return "memory";
}

