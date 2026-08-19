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

// Atomically set the qty on an existing line, or push a new line - never
// reads a document into memory and writes it back, so two concurrent
// requests for the same cart (e.g. rapid +/- clicks) can't silently clobber
// each other. Each step is a single indivisible Mongo operation instead of
// the old find -> mutate in JS -> save() pattern, which raced under load:
// a document.save() with no matching array-element update doesn't trip
// Mongoose's version check, so concurrent saves could silently overwrite
// one another with stale in-memory state and no error at all.
export async function upsertCartLine(userId, lineKey, productId, qty, selectedUpgrades) {
  const existingLineUpdate = await Cart.findOneAndUpdate(
    { user: userId, "items.lineKey": lineKey },
    { $set: { "items.$.qty": qty, "items.$.selectedUpgrades": selectedUpgrades } },
    { new: true }
  );
  if (existingLineUpdate) return existingLineUpdate;

  try {
    return await Cart.findOneAndUpdate(
      { user: userId },
      {
        $push: { items: { product: productId, qty, lineKey, selectedUpgrades } },
        $setOnInsert: { user: userId },
      },
      { new: true, upsert: true }
    );
  } catch (error) {
    // Two concurrent "first add of this line" requests both missed the
    // $set above and raced to create/push here - exactly one wins the
    // insert, the other gets a duplicate-key error on the cart's unique
    // `user` index. Retry the $set: the winner's push means the line now
    // exists, so this always succeeds on retry.
    if (error?.code === 11000) {
      const retried = await Cart.findOneAndUpdate(
        { user: userId, "items.lineKey": lineKey },
        { $set: { "items.$.qty": qty, "items.$.selectedUpgrades": selectedUpgrades } },
        { new: true }
      );
      if (retried) return retried;
    }
    throw error;
  }
}

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

    const upgradesToStore = {
      ram: resolvedUpgrades.selectedUpgrades?.ram?.label || "",
      storage: resolvedUpgrades.selectedUpgrades?.storage?.label || "",
    };

    const cart = await upsertCartLine(req.user._id, lineKey, productId, qty, upgradesToStore);

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

    // $pull is a single atomic op - safe to run concurrently with another
    // request adding/updating a different line on the same cart document.
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { items: lineKey ? { lineKey } : { product: productId } } },
      { new: true }
    );

    if (!cart) return res.json({ message: "Item removed from cart", items: [] });

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
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [] } }
    );

    res.json({ message: "Cart cleared", items: [] });
  } catch (error) {
    console.error("❌ Error clearing cart:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
