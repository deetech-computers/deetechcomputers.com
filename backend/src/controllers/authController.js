// backend/src/controllers/authController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import { JWT_SECRET, JWT_EXPIRES_IN, FRONTEND_URL } from "../config/env.js";
import { sendPasswordResetEmail } from "../utils/emailService.js";

function generateToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

// REGISTER
export async function registerUser(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error("User already exists");
  }

  // 🚀 Let the User model pre-save hook handle hashing
  const user = await User.create({ name, email, password });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user),
  });
}

// LOGIN
export async function loginUser(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  if (user.isActive === false) {
    res.status(403);
    throw new Error("Account is temporarily disabled. Contact support.");
  }

  // use schema method
  const match = await user.matchPassword(password);

  if (!match) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    token: generateToken(user),
  });
}

// LOGOUT
export async function logoutUser(req, res) {
  res.json({ message: "Logged out successfully" });
}

// REFRESH TOKEN
export async function refreshToken(req, res) {
  const { token } = req.body;
  if (!token) {
    res.status(400);
    throw new Error("Token required");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const newToken = generateToken({ _id: decoded.id, role: decoded.role });
    res.json({ token: newToken });
  } catch {
    res.status(401);
    throw new Error("Invalid token");
  }
}

// FORGOT PASSWORD
export async function forgotPassword(req, res) {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1h
  await user.save();

  const resetUrl = `${FRONTEND_URL}/reset-password.html?token=${resetToken}`;
  await sendPasswordResetEmail(user.email, resetUrl);

  res.json({ message: "Password reset link sent" });
}

// RESET PASSWORD
export async function resetPassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired token");
  }

  user.password = password; // plain → will be hashed by pre-save hook
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: "Password reset successful" });
}

// SOCIAL LOGIN (future)
export async function socialLogin(req, res) {
  res.status(501).json({ message: "Social login not implemented" });
}
