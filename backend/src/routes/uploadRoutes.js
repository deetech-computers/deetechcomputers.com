// backend/routes/uploadRoutes.js
import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { createRateLimiter } from "../middleware/rateLimitFactory.js";

const router = express.Router();
const uploadLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 40,
  message: { message: "Too many uploads. Please try again later." },
});

// POST /api/upload - upload a single image (admin only)
router.post("/", protect, admin, uploadLimiter, upload.single("image"), (req, res) => {
  res.status(201).json({ imageUrl: `/uploads/${req.file.filename}` });
});

// POST /api/upload/payment-proof - upload payment proof image (public/checkout)
router.post("/payment-proof", uploadLimiter, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Payment proof image is required" });
  }
  return res.status(201).json({ imageUrl: `/uploads/${req.file.filename}` });
});

export default router;
