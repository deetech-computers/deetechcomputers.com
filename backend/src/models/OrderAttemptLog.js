import mongoose from "mongoose";

const orderAttemptLogSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    scope: {
      type: String,
      enum: ["authenticated", "guest", "system"],
      default: "system",
    },
    stage: {
      type: String,
      enum: [
        "received",
        "duplicate_returned",
        "created",
        "gateway_initiated",
        "status_check",
        "callback",
        "failed",
      ],
      required: true,
    },
    outcome: {
      type: String,
      trim: true,
      required: true,
    },
    clientOrderRef: {
      type: String,
      trim: true,
    },
    attemptFingerprint: {
      type: String,
      trim: true,
    },
    paymentMethod: {
      type: String,
      trim: true,
    },
    paymentFlow: {
      type: String,
      trim: true,
    },
    itemCount: {
      type: Number,
      min: 0,
      default: 0,
    },
    totalPrice: {
      type: Number,
      min: 0,
      default: 0,
    },
    shippingEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    guestEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    mobileNumber: {
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
    reason: {
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

orderAttemptLogSchema.index({ createdAt: -1 });
orderAttemptLogSchema.index({ clientOrderRef: 1, createdAt: -1 });
orderAttemptLogSchema.index({ attemptFingerprint: 1, createdAt: -1 });
orderAttemptLogSchema.index({ order: 1, createdAt: -1 });
orderAttemptLogSchema.index({ user: 1, createdAt: -1 });

const OrderAttemptLog = mongoose.model("OrderAttemptLog", orderAttemptLogSchema);

export default OrderAttemptLog;
