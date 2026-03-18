// backend/src/controllers/wishlistController.js
import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "wishlist",
    "name price description category countInStock isFeatured images"
  );

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user.wishlist || []);
});

// @desc    Add to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const alreadyInWishlist = user.wishlist.some(
    (id) => String(id) === String(product._id)
  );
  if (alreadyInWishlist) {
    res.status(400);
    throw new Error("Product already in wishlist");
  }

  user.wishlist.push(product._id);
  await user.save();

  const updatedUser = await User.findById(req.user._id).populate(
    "wishlist",
    "name price description category countInStock isFeatured images"
  );

  res.status(201).json(updatedUser.wishlist);
});

// @desc    Remove from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.wishlist = user.wishlist.filter(
    (p) => p.toString() !== req.params.productId
  );
  await user.save();

  const updatedUser = await User.findById(req.user._id).populate(
    "wishlist",
    "name price description category countInStock isFeatured images"
  );

  res.json(updatedUser.wishlist);
});

export { getWishlist, addToWishlist, removeFromWishlist };
