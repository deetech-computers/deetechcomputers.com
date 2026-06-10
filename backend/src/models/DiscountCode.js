import mongoose from "mongoose";

const discountCodeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    percent: { type: Number, required: true, min: 2, max: 10 },
    used: { type: Boolean, default: false },
    usedAt: { type: Date },
    usedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

discountCodeSchema.index({ code: 1, used: 1 });
discountCodeSchema.index({ used: 1, createdAt: -1 });
discountCodeSchema.index({ createdAt: -1 });

const DiscountCode = mongoose.model("DiscountCode", discountCodeSchema);
export default DiscountCode;
