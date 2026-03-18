// backend/src/routes/wishlistRoutes.js
import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get logged-in user’s wishlist
router.get("/", protect, getWishlist);

// ✅ Add product to wishlist
router.post("/:productId", protect, addToWishlist);

// ✅ Remove product from wishlist
router.delete("/:productId", protect, removeFromWishlist);

// ✅ Export default (needed for app.js)
export default router;
