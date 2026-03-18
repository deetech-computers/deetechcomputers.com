
import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get user cart
router.get("/", protect, getCart);

// ✅ Add/update item in cart
router.post("/:productId", protect, addToCart);

// ✅ Remove single item from cart
router.delete("/:productId", protect, removeFromCart);

// ✅ Clear entire cart
router.delete("/", protect, clearCart);

export default router;
