import mongoose from "mongoose";

const affiliateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 4,
      maxlength: 20,
      index: true,
    },
    commissionRate: {
      type: Number,
      default: 5,
      min: 0,
      max: 100,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tier: {
      type: String,
      enum: ["starter", "bronze", "silver", "gold"],
      default: "starter",
    },
    promotedAt: Date,
  },
  { timestamps: true }
);

affiliateSchema.index({ user: 1, isActive: 1 });

const Affiliate = mongoose.model("Affiliate", affiliateSchema);
export default Affiliate;

