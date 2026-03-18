import express from "express";
import { generateDiscounts, listDiscounts } from "../controllers/discountController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, admin, listDiscounts);
router.post("/", protect, admin, generateDiscounts);

export default router;
