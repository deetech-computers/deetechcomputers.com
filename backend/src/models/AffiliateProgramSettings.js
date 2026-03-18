import mongoose from "mongoose";

const affiliateProgramSettingsSchema = new mongoose.Schema(
  {
    singleton: {
      type: String,
      default: "default",
      unique: true,
      index: true,
    },
    defaultCommissionRate: {
      type: Number,
      default: 5,
      min: 0,
      max: 100,
    },
    tierThresholds: {
      bronze: { type: Number, default: 5, min: 1 },
      silver: { type: Number, default: 15, min: 1 },
      gold: { type: Number, default: 30, min: 1 },
    },
  },
  { timestamps: true }
);

const AffiliateProgramSettings = mongoose.model(
  "AffiliateProgramSettings",
  affiliateProgramSettingsSchema
);

export default AffiliateProgramSettings;

