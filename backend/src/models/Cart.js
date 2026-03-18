// backend/src/models/Cart.js
import mongoose from "mongoose";

// ✅ Sub-schema for cart items
const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    qty: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  { _id: false } // no need for a separate _id for each item
);

// ✅ Main cart schema
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // each user has only 1 cart
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

// ✅ Export as default (ESM compatible)
const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default Cart;
