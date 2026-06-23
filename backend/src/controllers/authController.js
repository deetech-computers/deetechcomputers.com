// backend/src/controllers/authController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  FRONTEND_URL,
  GOOGLE_CLIENT_ID,
} from "../config/env.js";
import { sendPasswordResetEmail } from "../utils/emailService.js";

function generateToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

function buildAuthResponse(user) {
  const safeUser = {
    _id: user._id,
    name: user.name,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    avatarUrl: user.avatarUrl || "",
    authProvider: user.authProvider || "local",
  };

  return {
    token: generateToken(user),
    user: safeUser,
    ...safeUser,
  };
}

function splitFullName(nameRaw = "") {
  const parts = String(nameRaw || "").trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" "),
  };
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

  res.status(201).json(buildAuthResponse(user));
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

  res.json(buildAuthResponse(user));
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

  // Always return the same response whether or not the email is registered,
  // to avoid leaking which addresses have accounts (user enumeration).
  if (user) {
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30m
    await user.save();

    const resetUrl = `${FRONTEND_URL}/reset-password.html?token=${resetToken}`;
    await sendPasswordResetEmail(user.email, resetUrl);
  }

  res.json({ message: "If that email is registered, a password reset link has been sent" });
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

export async function googleAuthConfig(req, res) {
  res.json({
    enabled: Boolean(GOOGLE_CLIENT_ID),
    clientId: GOOGLE_CLIENT_ID || "",
  });
}

export async function googleAuth(req, res) {
  if (!GOOGLE_CLIENT_ID || !googleClient) {
    res.status(503);
    throw new Error("Google authentication is not configured.");
  }

  const credential = String(req.body?.credential || "").trim();
  if (!credential) {
    res.status(400);
    throw new Error("Google credential is required.");
  }

  let payload = null;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch {
    res.status(401);
    throw new Error("Google sign-in could not be verified.");
  }

  const googleId = String(payload?.sub || "").trim();
  const email = String(payload?.email || "").trim().toLowerCase();
  const emailVerified = Boolean(payload?.email_verified);
  const displayName = String(payload?.name || "").trim();
  const avatarUrl = String(payload?.picture || "").trim();

  if (!googleId || !email || !emailVerified) {
    res.status(401);
    throw new Error("Google account verification is incomplete.");
  }

  const nameParts = splitFullName(displayName);
  let user =
    (await User.findOne({ googleId })) ||
    (await User.findOne({ email }));

  if (user) {
    if (user.isActive === false) {
      res.status(403);
      throw new Error("Account is temporarily disabled. Contact support.");
    }

    let changed = false;
    if (!user.googleId) {
      user.googleId = googleId;
      changed = true;
    }
    if (user.authProvider !== "google") {
      user.authProvider = "google";
      changed = true;
    }
    if (!user.firstName && nameParts.firstName) {
      user.firstName = nameParts.firstName;
      changed = true;
    }
    if (!user.lastName && nameParts.lastName) {
      user.lastName = nameParts.lastName;
      changed = true;
    }
    if (!user.name && displayName) {
      user.name = displayName;
      changed = true;
    }
    if (!user.avatarUrl && avatarUrl) {
      user.avatarUrl = avatarUrl;
      changed = true;
    }
    if (changed) {
      await user.save();
    }
    return res.json(buildAuthResponse(user));
  }

  user = await User.create({
    name: displayName || email.split("@")[0],
    firstName: nameParts.firstName,
    lastName: nameParts.lastName,
    email,
    password: crypto.randomBytes(32).toString("hex"),
    googleId,
    authProvider: "google",
    avatarUrl,
  });

  return res.status(201).json(buildAuthResponse(user));
}

// SOCIAL LOGIN (future)
export async function socialLogin(req, res) {
  res.status(501).json({ message: "Social login not implemented" });
}
