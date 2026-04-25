// resetPassword.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./src/models/User.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function resetPassword() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    const email = "admin@deetech.com";
    const newPassword = "38454Daniel";

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    const user = await User.findOneAndUpdate(
      { email },
      { password: hashed },
      { new: true }
    );

    if (user) {
      console.log(`🔑 Password reset successful for ${email}`);
    } else {
      console.log("❌ Admin user not found");
    }

    process.exit();
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

resetPassword();
