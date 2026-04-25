// backend/routes/bannerRoutes.js
import express from "express";
import { getAllBanners, createBanner, updateBanner, deleteBanner } from "../controllers/bannerController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getAllBanners); // public
router.post("/", protect, admin, upload.single("image"), createBanner); // admin only
router.put("/:id", protect, admin, upload.single("image"), updateBanner); // admin only
router.delete("/:id", protect, admin, deleteBanner); // admin only

export default router;
