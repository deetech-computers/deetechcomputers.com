// backend/src/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isActive: { type: Boolean, default: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    region: { type: String, trim: true },
    city: { type: String, trim: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    // ✅ Wishlist: references to Product
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    behavior: {
      preferredCategory: { type: String, trim: true, lowercase: true, default: "" },
      categoryInterests: [
        {
          category: { type: String, trim: true, lowercase: true },
          count: { type: Number, default: 0 },
          lastInteractedAt: { type: Date, default: Date.now },
        },
      ],
      searchTerms: [
        {
          term: { type: String, trim: true },
          count: { type: Number, default: 0 },
          lastSearchedAt: { type: Date, default: Date.now },
        },
      ],
    },
  },
  { timestamps: true }
);

// ✅ Exclude sensitive fields in API responses
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

// ✅ Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ Compare entered password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
