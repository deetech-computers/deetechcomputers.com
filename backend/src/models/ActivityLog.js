import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    actorType: {
      type: String,
      enum: ["user", "guest", "admin", "system"],
      default: "user",
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    actorName: {
      type: String,
      trim: true,
    },
    actorEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    targetType: {
      type: String,
      trim: true,
    },
    targetId: {
      type: String,
      trim: true,
    },
    targetLabel: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: undefined,
    },
  },
  { timestamps: true }
);

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ actor: 1, createdAt: -1 });
activityLogSchema.index({ actorType: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });
activityLogSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

export default ActivityLog;
