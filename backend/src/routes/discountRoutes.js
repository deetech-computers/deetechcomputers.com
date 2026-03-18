import express from "express";
import { validateDiscount } from "../controllers/discountController.js";

const router = express.Router();

router.post("/validate", validateDiscount);

export default router;
