// controllers/cartController.js
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// @desc    Get logged-in user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product", "name price images")
      .lean();

    if (!cart) {
      return res.json({ items: [] });
    }

    res.json(cart);
  } catch (error) {
    console.error("❌ Error fetching cart:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add or update product in cart
// @route   POST /api/cart/:productId
// @access  Private
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    let { qty } = req.body;

    qty = parseInt(qty) > 0 ? parseInt(qty) : 1;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    const availableStock = Number(product.countInStock ?? 0);
    if (qty > availableStock) {
      return res.status(400).json({ message: "Requested quantity exceeds available stock" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.qty = qty; // Always overwrite with provided qty
    } else {
      cart.items.push({ product: productId, qty });
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id)
      .populate("items.product", "name price images")
      .lean();

    res.json(updatedCart);
  } catch (error) {
    console.error("❌ Error adding to cart:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Remove product from cart
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.json({ message: "Item removed from cart", items: [] });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    const updatedCart = await Cart.findById(cart._id)
      .populate("items.product", "name price images")
      .lean();

    res.json(updatedCart);
  } catch (error) {
    console.error("❌ Error removing from cart:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.json({ message: "Cart cleared", items: [] });

    cart.items = [];
    await cart.save();

    res.json({ message: "Cart cleared", items: [] });
  } catch (error) {
    console.error("❌ Error clearing cart:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
