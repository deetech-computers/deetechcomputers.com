// backend/src/routes/supportRoutes.js
import express from "express";
import {
  createSupport,
  getSupportTickets,
  updateSupport,
  getMySupportTickets,
  addSupportReply,
} from "../controllers/supportController.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { createRateLimiter } from "../middleware/rateLimitFactory.js";

const router = express.Router();
const supportCreateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many support requests. Please try again later." },
});

const supportUploadLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { message: "Too many uploads. Please try again later." },
});

// Public: Create new support message
router.post("/", supportCreateLimiter, createSupport);

// Admin: View & Update tickets
router.get("/", protect, admin, getSupportTickets);
router.put("/:id", protect, admin, updateSupport);

// User: View own tickets
router.get("/my", protect, getMySupportTickets);

// User: Reply to a ticket
router.post("/:id/reply", protect, addSupportReply);

// User: Upload support image
router.post("/upload", protect, supportUploadLimiter, upload.single("image"), (req, res) => {
  res.status(201).json({ imageUrl: `/uploads/${req.file.filename}` });
});

export default router;
