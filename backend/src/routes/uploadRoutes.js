// backend/routes/uploadRoutes.js
import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { createRateLimiter } from "../middleware/rateLimitFactory.js";
import { storeImageFile } from "../utils/mediaStorage.js";

const router = express.Router();
const uploadLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 40,
  message: { message: "Too many uploads. Please try again later." },
});

router.post(
  "/",
  protect,
  admin,
  uploadLimiter,
  upload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400);
      throw new Error("Image file is required");
    }
    const stored = await storeImageFile(req.file, "deetech/uploads");
    res.status(201).json({ imageUrl: stored.url, storage: stored.storage });
  })
);

router.post(
  "/payment-proof",
  uploadLimiter,
  upload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400);
      throw new Error("Payment proof image is required");
    }
    const stored = await storeImageFile(req.file, "deetech/payment-proofs");
    return res.status(201).json({ imageUrl: stored.url, storage: stored.storage });
  })
);

export default router;
