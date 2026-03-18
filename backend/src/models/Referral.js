import mongoose from "mongoose";

const referralSchema = new mongoose.Schema(
  {
    affiliate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Affiliate",
      required: true,
      index: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
      index: true,
    },
    affiliateCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    commissionRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 5,
    },
    orderAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    commissionAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "earned", "cancelled"],
      default: "pending",
      index: true,
    },
    customerName: { type: String, trim: true },
    customerEmail: { type: String, trim: true },
    paidAt: Date,
    cancelledAt: Date,
  },
  { timestamps: true }
);

referralSchema.index({ affiliate: 1, createdAt: -1 });

const Referral = mongoose.model("Referral", referralSchema);
export default Referral;

