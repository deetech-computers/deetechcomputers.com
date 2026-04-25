import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Admin only: Get dashboard stats
router.get("/", protect, admin, getDashboardStats);

export default router;
