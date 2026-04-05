// backend/src/routes/orderRoutes.js
import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import {
  createOrder,
  createGuestOrder,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
  updateOrderPaymentStatus,
  deleteOrder,
  resyncAffiliateReferrals,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create new order (user) / Get all orders (admin)
router
  .route("/")
  .post(protect, asyncHandler(createOrder))
  .get(protect, admin, asyncHandler(getAllOrders));

// Guest order (JSON)
router.post("/guest", asyncHandler(createGuestOrder));

// Get current user's orders
router.route("/myorders").get(protect, asyncHandler(getMyOrders));
router.route("/myorders/:id").get(protect, asyncHandler(getMyOrderById));

// Mark as paid (admin only)
router.route("/:id/pay").put(protect, admin, asyncHandler(updateOrderToPaid));

// Mark as delivered (admin only)
router.route("/:id/deliver").put(protect, admin, asyncHandler(updateOrderToDelivered));

// Update order status (admin only)
router.route("/:id/status").put(protect, admin, asyncHandler(updateOrderStatus));

// Update payment status (admin only)
router
  .route("/:id/payment-status")
  .put(protect, admin, asyncHandler(updateOrderPaymentStatus));

// Delete order permanently (admin only)
router.route("/:id").delete(protect, admin, asyncHandler(deleteOrder));

// Admin utility: reconcile affiliate links/referrals for existing orders
router.post("/admin/resync-affiliates", protect, admin, asyncHandler(resyncAffiliateReferrals));

export default router;
