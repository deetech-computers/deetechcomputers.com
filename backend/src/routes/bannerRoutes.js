// backend/routes/bannerRoutes.js
import express from "express";
import { getAllBanners, createBanner, deleteBanner } from "../controllers/bannerController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllBanners); // public
router.post("/", protect, admin, createBanner); // admin only
router.delete("/:id", protect, admin, deleteBanner); // admin only

export default router;
