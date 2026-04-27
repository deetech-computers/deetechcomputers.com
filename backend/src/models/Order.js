// backend/src/models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        qty: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 }, // price at time of order
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["mtn", "vodafone", "bank", "hubtel"],
      required: true,
    },
    paymentFlow: {
      type: String,
      enum: ["manual", "auto"],
      default: "manual",
    },
    paymentGateway: { type: String, trim: true },
    paymentGatewayReference: { type: String, trim: true },
    paymentGatewayCheckoutUrl: { type: String, trim: true },
    paymentGatewayStatus: { type: String, trim: true },
    paymentGatewayPayload: { type: mongoose.Schema.Types.Mixed },
    guestName: { type: String, trim: true },
    guestEmail: { type: String, trim: true },
    guestAddress: { type: String, trim: true },
    guestCity: { type: String, trim: true },
    guestNotes: { type: String, trim: true },
    paymentScreenshotUrl: { type: String, trim: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    deliveryRegion: {
      type: String,
      required: true,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          // Must start with +233 or 0, followed by 9 digits
          return /^(\+233|0)[0-9]{9}$/.test(value);
        },
        message:
          "Invalid mobile number. Must be a valid Ghanaian number (e.g. 024XXXXXXX or +23324XXXXXXX).",
      },
    },
    paymentMobileNumber: {
      type: String,
      trim: true,
      validate: {
        validator: function (value) {
          if (!value) return true;
          return /^(\+233|0)[0-9]{9}$/.test(value);
        },
        message:
          "Invalid payment mobile number. Must be a valid Ghanaian number (e.g. 024XXXXXXX or +23324XXXXXXX).",
      },
    },
    shippingName: { type: String, trim: true },
    shippingEmail: { type: String, trim: true },
    shippingAddress: { type: String, trim: true },
    shippingCity: { type: String, trim: true },
    clientOrderRef: { type: String, trim: true },
    attemptFingerprint: { type: String, trim: true },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discountCode: { type: String, trim: true },
    discountPercent: { type: Number, min: 0, max: 100 },
    discountAmount: { type: Number, min: 0, default: 0 },
    affiliateCodeEntered: { type: String, trim: true, uppercase: true },
    affiliateCode: { type: String, trim: true, uppercase: true },
    affiliate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Affiliate",
      required: false,
    },
    affiliateCommissionRate: { type: Number, min: 0, max: 100, default: 0 },
    affiliateCommissionAmount: { type: Number, min: 0, default: 0 },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    stockReserved: {
      type: Boolean,
      default: false,
    },
    estimatedDeliveryDate: Date,
    deliveredAt: Date,
    paidAt: Date,
  },
  { timestamps: true }
);

// Index for faster lookups
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ affiliate: 1, createdAt: -1 });
orderSchema.index({ user: 1, attemptFingerprint: 1, createdAt: -1 });
orderSchema.index({ guestEmail: 1, attemptFingerprint: 1, createdAt: -1 });
orderSchema.index({ shippingEmail: 1, attemptFingerprint: 1, createdAt: -1 });
orderSchema.index({ clientOrderRef: 1 }, {
  unique: true,
  partialFilterExpression: { clientOrderRef: { $exists: true, $type: "string" } },
});
orderSchema.index({ clientOrderRef: 1, createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);
export default Order;
