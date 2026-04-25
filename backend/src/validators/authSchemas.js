import Joi from "joi";

// ✅ Registration
export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// ✅ Login
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// ✅ Forgot Password
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

// ✅ Reset Password
export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required(),
});

// ✅ Social Login placeholder
export const socialLoginSchema = Joi.object({
  provider: Joi.string().valid("google", "twitter", "tiktok").required(),
  token: Joi.string().required(),
});
