// backend/src/controllers/adminWishlistController.js
import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/User.js";

// @desc    Get all users (Admin only)
// @route   GET /api/admin/wishlist/users
// @access  Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -__v");
  res.status(200).json(users);
});

// @desc    Get a user’s wishlist (Admin only)
// @route   GET /api/admin/wishlist/:userId
// @access  Admin
const getUserWishlist = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).populate(
    "wishlist",
    "name price images"
  );

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user.wishlist || []);
});

// @desc    Remove a product from a user’s wishlist (Admin only)
// @route   DELETE /api/admin/wishlist/:userId/:productId
// @access  Admin
const removeUserWishlistItem = asyncHandler(async (req, res) => {
  const { userId, productId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Filter out the product
  const beforeCount = user.wishlist.length;
  user.wishlist = user.wishlist.filter(
    (p) => p.toString() !== productId.toString()
  );

  if (beforeCount === user.wishlist.length) {
    res.status(404);
    throw new Error("Product not found in wishlist");
  }

  await user.save();

  res.status(200).json({ message: "✅ Product removed from user’s wishlist" });
});

// @desc    Clear entire wishlist for a user (Admin only)
// @route   DELETE /api/admin/wishlist/:userId
// @access  Admin
const clearUserWishlist = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.wishlist.length === 0) {
    return res.status(200).json({ message: "⚡ Wishlist already empty" });
  }

  user.wishlist = [];
  await user.save();

  res.status(200).json({ message: "✅ User’s wishlist cleared" });
});

export {
  getAllUsers,
  getUserWishlist,
  removeUserWishlistItem,
  clearUserWishlist,
};
