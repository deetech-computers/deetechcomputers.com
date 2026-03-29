// backend/src/app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "express-async-errors";
import mongoose from "mongoose";
import path from "path";

import { FRONTEND_URL, NODE_ENV } from "./config/env.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { createRateLimiter, getRateLimiterMode } from "./middleware/rateLimitFactory.js";

// ✅ Route imports
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import adminWishlistRoutes from "./routes/adminWishlistRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import discountRoutes from "./routes/discountRoutes.js";
import adminDiscountRoutes from "./routes/adminDiscountRoutes.js";
import affiliateRoutes from "./routes/affiliateRoutes.js";
import { ensureProductSnapshotExists, rebuildProductSnapshot } from "./utils/productSnapshot.js";

export default async function createApp() {
  const app = express();
  app.set("trust proxy", 1);

  ensureProductSnapshotExists().catch((error) => {
    console.warn("Initial product snapshot check failed:", error?.message || error);
  });
  rebuildProductSnapshot().catch((error) => {
    console.warn("Initial product snapshot rebuild failed:", error?.message || error);
  });

  // 🔒 Security & parsing
  app.use(helmet());
  const normalizeOrigin = (value) =>
    String(value || "")
      .trim()
      .replace(/\/+$/, "");

  const allowedOrigins = String(FRONTEND_URL || "")
    .split(",")
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);
  app.use(
    cors({
      origin: (origin, cb) => {
        if (NODE_ENV !== "production") return cb(null, true);
        // Allow server-side/no-origin requests only.
        if (!origin) return cb(null, true);
        if (origin === "null") return cb(new Error("CORS blocked"), false);
        const normalizedRequestOrigin = normalizeOrigin(origin);
        return cb(null, allowedOrigins.includes(normalizedRequestOrigin));
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  // 📝 Logging
  if (NODE_ENV !== "test") {
    app.use(morgan("dev"));
  }

  // ⏳ Rate limiting
  app.use(
    createRateLimiter({
      windowMs: 60 * 1000,
      max: 120,
      message: { message: "Too many requests, try again shortly." },
    })
  );
  if (NODE_ENV !== "test") {
    console.info(`Rate limiter mode: ${getRateLimiterMode()}`);
  }

  // ✅ Health checks
  app.get("/api/health", (req, res) =>
    res.json({ status: "ok", env: NODE_ENV || "development" })
  );

  app.get("/api/health/db", (req, res) => {
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };
    const mongoState = mongoose.connection.readyState;
    res.json({
      status: "ok",
      env: NODE_ENV || "development",
      mongo: states[mongoState] || "unknown",
    });
  });

  // ✅ Serve uploaded images (allow cross-origin image embedding)
  app.use(
    "/uploads",
    (req, res, next) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Access-Control-Allow-Origin", "*");
      next();
    },
    express.static(path.join(path.resolve(), "uploads"))
  );

  // ✅ Mount API routes
  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/reviews", reviewRoutes);
  app.use("/api/wishlist", wishlistRoutes);
  app.use("/api/admin/wishlist", adminWishlistRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/upload", uploadRoutes);
  app.use("/api/support", supportRoutes);
  app.use("/api/banners", bannerRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/discounts", discountRoutes);
  app.use("/api/discount", discountRoutes);
  app.use("/api/admin/discounts", adminDiscountRoutes);
  app.use("/api/affiliates", affiliateRoutes);

  // ❌ Fallback 404 handler
  app.use(notFound);

  // 🛠 Global error handler
  app.use(errorHandler);

  return app;
}


