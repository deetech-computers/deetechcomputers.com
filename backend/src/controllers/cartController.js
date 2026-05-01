// controllers/cartController.js
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import {
  buildUpgradeSignature,
  normalizeUpgradeSelection,
  resolveProductUpgradeSelection,
} from "../utils/productUpgrades.js";

function getCartItemProductId(item) {
  if (!item?.product) return "";
  if (typeof item.product === "string") return item.product;
  if (item.product?._id) return String(item.product._id);
  if (typeof item.product?.toString === "function") return String(item.product.toString());
  return "";
}

function ensureCartLineKeys(cart) {
  if (!cart || !Array.isArray(cart.items)) return false;
  let changed = false;

  cart.items.forEach((item) => {
    const productId = getCartItemProductId(item);
    if (!productId) return;
    const selectedUpgrades = normalizeUpgradeSelection(item?.selectedUpgrades);
    const signature = buildUpgradeSignature(selectedUpgrades);
    const expectedLineKey = `${productId}::${signature || "base"}`;
    if (String(item.lineKey || "").trim() !== expectedLineKey) {
      item.lineKey = expectedLineKey;
      changed = true;
    }
    const nextRam = selectedUpgrades.ram || "";
    const nextStorage = selectedUpgrades.storage || "";
    if (
      String(item?.selectedUpgrades?.ram || "") !== nextRam ||
      String(item?.selectedUpgrades?.storage || "") !== nextStorage
    ) {
      item.selectedUpgrades = {
        ram: nextRam,
        storage: nextStorage,
      };
      changed = true;
    }
  });

  return changed;
}

// @desc    Get logged-in user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price discountPrice discountMode discountStartsAt discountEndsAt images upgradeSpecs"
    );

    if (!cart) {
      return res.json({ items: [] });
    }

    if (ensureCartLineKeys(cart)) {
      await cart.save();
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
    const selectedUpgrades = normalizeUpgradeSelection(req.body?.selectedUpgrades);

    qty = parseInt(qty) > 0 ? parseInt(qty) : 1;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    const resolvedUpgrades = resolveProductUpgradeSelection(product, selectedUpgrades);
    const lineKey = `${productId}::${resolvedUpgrades.signature || "base"}`;
    const availableStock = Number(product.countInStock ?? 0);
    if (qty > availableStock) {
      return res.status(400).json({ message: "Requested quantity exceeds available stock" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    } else if (ensureCartLineKeys(cart)) {
      await cart.save();
    }

    const existingItem = cart.items.find(
      (item) => String(item.lineKey || "") === lineKey
    );

    if (existingItem) {
      existingItem.qty = qty; // Always overwrite with provided qty
    } else {
      cart.items.push({
        product: productId,
        qty,
        lineKey,
        selectedUpgrades: {
          ram: resolvedUpgrades.selectedUpgrades?.ram?.label || "",
          storage: resolvedUpgrades.selectedUpgrades?.storage?.label || "",
        },
      });
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id)
      .populate("items.product", "name price discountPrice discountMode discountStartsAt discountEndsAt images upgradeSpecs")
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
    const lineKey = String(req.query?.lineKey || "").trim();

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.json({ message: "Item removed from cart", items: [] });

    if (ensureCartLineKeys(cart)) {
      await cart.save();
    }

    cart.items = cart.items.filter(
      (item) =>
        lineKey
          ? String(item.lineKey || "") !== lineKey
          : item.product.toString() !== productId
    );

    await cart.save();
    const updatedCart = await Cart.findById(cart._id)
      .populate("items.product", "name price discountPrice discountMode discountStartsAt discountEndsAt images upgradeSpecs")
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

    if (ensureCartLineKeys(cart)) {
      await cart.save();
    }

    cart.items = [];
    await cart.save();

    res.json({ message: "Cart cleared", items: [] });
  } catch (error) {
    console.error("❌ Error clearing cart:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
