// backend/src/models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    short_description: { type: String, trim: true, default: "" },
    description: { type: String, required: true },
    specs: { type: Map, of: String, default: {} },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, trim: true, default: "" },
    price: { type: Number, required: true },
    discountPrice: { type: Number, min: 0, default: null },
    discountMode: {
      type: String,
      enum: ["none", "instant", "timed"],
      default: "none",
    },
    discountStartsAt: { type: Date, default: null },
    discountEndsAt: { type: Date, default: null },
    countInStock: { type: Number, required: true, default: 0 },
    isFeatured: { type: Boolean, default: false },
    homeSections: [{ type: String }],
    image_url: { type: String, trim: true, default: "" },
    images: [{ type: String }],
    sold: { type: Number, default: 0 },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
