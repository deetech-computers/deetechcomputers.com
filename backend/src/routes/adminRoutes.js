// backend/src/routes/adminRoutes.js
import express from "express";
import {
  getDashboardStats,
  updateUserRole,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateMiddleware.js";
import { updateUserRoleSchema, adminUpdateUserSchema } from "../validators/userSchemas.js";

const router = express.Router();

// Dashboard
router.get("/stats", protect, admin, getDashboardStats);

// User management
router.get("/users", protect, admin, getAllUsers);
router.get("/users/:id", protect, admin, getUserById);

// Update role only
router.put(
  "/users/:id/role",
  protect,
  admin,
  validateRequest(updateUserRoleSchema),
  updateUserRole
);

// Full update (name, email, role)
router.put(
  "/users/:id",
  protect,
  admin,
  validateRequest(adminUpdateUserSchema),
  updateUserById
);

// Delete user
router.delete("/users/:id", protect, admin, deleteUserById);

export default router;
