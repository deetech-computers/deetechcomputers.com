// backend/src/routes/authRoutes.js
import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  forgotPassword,
  resetPassword,
  socialLogin,
} from "../controllers/authController.js";
import { validateRequest } from "../middleware/validateMiddleware.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  socialLoginSchema,
} from "../validators/authSchemas.js";
import { createRateLimiter } from "../middleware/rateLimitFactory.js";

const router = Router();
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 25,
  message: { message: "Too many authentication attempts, try again later." },
});

const forgotPasswordLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 8,
  message: { message: "Too many reset attempts, try again later." },
});

// user registration & login
router.post("/register", authLimiter, validateRequest(registerSchema), registerUser);
router.post("/login", authLimiter, validateRequest(loginSchema), loginUser);
router.post("/logout", logoutUser);

// token refresh
router.post("/refresh", refreshToken);

// password flows
router.post("/forgot-password", forgotPasswordLimiter, validateRequest(forgotPasswordSchema), forgotPassword);
router.post("/reset-password/:token", forgotPasswordLimiter, validateRequest(resetPasswordSchema), resetPassword);

// social login placeholder (Google, X/Twitter, TikTok)
router.post("/social", validateRequest(socialLoginSchema), socialLogin);

export default router;
