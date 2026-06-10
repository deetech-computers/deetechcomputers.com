// backend/src/models/Review.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true, default: "", maxlength: 150 },
    comment: { type: String, required: true },
    image_url: { type: String, trim: true, default: "" },
    approved: { type: Boolean, default: true },
    moderatedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1, approved: 1, createdAt: -1 });
reviewSchema.index({ product: 1, user: 1 });
reviewSchema.index({ user: 1, updatedAt: -1, createdAt: -1 });
reviewSchema.index({ approved: 1, createdAt: -1 });

const Review = mongoose.model("Review", reviewSchema);
export default Review;


