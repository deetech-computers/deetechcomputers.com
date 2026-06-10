// backend/src/models/Support.js
import mongoose from "mongoose";

const supportSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, maxlength: 2000 },
    imageUrl: { type: String },
    status: {
      type: String,
      enum: ["new", "in-progress", "resolved"],
      default: "new",
    },
    response: { type: String }, // admin reply
    messages: [
      {
        sender: { type: String, enum: ["user", "admin"], required: true },
        text: { type: String, maxlength: 2000 },
        imageUrl: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

supportSchema.index({ email: 1, updatedAt: -1 });
supportSchema.index({ email: 1, createdAt: -1 });
supportSchema.index({ status: 1, updatedAt: -1 });
supportSchema.index({ createdAt: -1 });

const Support = mongoose.model("Support", supportSchema);
export default Support;
