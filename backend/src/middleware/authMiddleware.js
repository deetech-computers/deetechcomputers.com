// backend/src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET } from "../config/env.js";

// Protect middleware: verifies token & attaches user to request
export async function protect(req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        res.status(401);
        return next(new Error("User not found"));
      }
      if (req.user.isActive === false) {
        res.status(403);
        return next(new Error("Account is disabled"));
      }

      return next();
    } catch (err) {
      res.status(401);
      return next(new Error("Not authorized, token failed"));
    }
  }

  res.status(401);
  next(new Error("Not authorized, no token provided"));
}

// Admin middleware: allows role === "admin" OR isAdmin === true
export function admin(req, res, next) {
  try {
    if (req.user && (req.user.role === "admin" || req.user.isAdmin === true)) {
      return next();
    }
    res.status(403);
    return next(new Error("Admin access only"));
  } catch (err) {
    res.status(500);
    next(new Error("Authorization middleware error"));
  }
}
