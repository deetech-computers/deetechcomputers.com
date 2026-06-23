// backend/src/routes/activityLogRoutes.js
import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import { getActivityLogs } from "../controllers/activityLogController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, admin, asyncHandler(getActivityLogs));

export default router;
