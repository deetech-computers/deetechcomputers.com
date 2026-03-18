// backend/src/routes/adminWishlistRoutes.js
import express from "express";
import {
  getUserWishlist,
  removeUserWishlistItem,
  clearUserWishlist,
} from "../controllers/adminWishlistController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get a user’s wishlist
router.get("/:userId", protect, admin, getUserWishlist);

// ✅ Remove single product (must come BEFORE clear all)
router.delete("/:userId/:productId", protect, admin, removeUserWishlistItem);

// ✅ Clear entire wishlist
router.delete("/:userId", protect, admin, clearUserWishlist);

export default router;
