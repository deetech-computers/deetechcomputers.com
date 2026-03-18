// backend/src/routes/userRoutes.js
import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getAllUsersAdmin,
  getUserByIdAdmin,
  deleteUserAdmin,
  resetUserPasswordAdmin,
  updateUserStatusAdmin,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateMiddleware.js";
import { updateProfileSchema } from "../validators/userSchemas.js";
import { createRateLimiter } from "../middleware/rateLimitFactory.js";

const router = express.Router();

const adminSensitiveLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
});

// Logged-in user profile management
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, validateRequest(updateProfileSchema), updateUserProfile)
  .delete(protect, deleteUser);

// Admin user management
router.route("/admin/users").get(protect, admin, getAllUsersAdmin);

router
  .route("/admin/users/:id")
  .get(protect, admin, getUserByIdAdmin)
  .delete(protect, admin, deleteUserAdmin);

router
  .route("/admin/users/:id/reset-password")
  .put(protect, admin, adminSensitiveLimiter, resetUserPasswordAdmin);

router
  .route("/admin/users/:id/status")
  .put(protect, admin, adminSensitiveLimiter, updateUserStatusAdmin);

export default router;
