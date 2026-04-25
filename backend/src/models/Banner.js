// backend/models/Banner.js
import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: "" },
    imageUrl: { type: String, required: true },
    link: { type: String, trim: true, default: "" }, // optional custom URL
    linkCategory: { type: String, trim: true, default: "" }, // optional category slug
    linkSubCategory: { type: String, trim: true, default: "" }, // optional brand/subcategory slug
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Banner = mongoose.model("Banner", bannerSchema);
export default Banner;
