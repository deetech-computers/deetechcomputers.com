// backend/src/routes/reviewRoutes.js
import express from "express";
import {
  addReview,
  updateReview,
  deleteReview,
  getProductReviews,
  getMyProductReview,
  getMyReviews,
  getAllReviews,
  moderateReview,
} from "../controllers/reviewController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateMiddleware.js";
import {
  addReviewSchema,
  updateReviewSchema,
  moderateReviewSchema,
} from "../validators/reviewSchemas.js";

const router = express.Router();

/**
 * @route   GET /api/reviews
 * @desc    Admin get all reviews
 * @access  Admin
 */
router.get("/", protect, admin, getAllReviews);
router.get("/me", protect, getMyReviews);

/**
 * @route   GET /api/reviews/product/:productId
 * @desc    Get all reviews for a product
 * @access  Public
 */
router.get("/product/:productId", getProductReviews);

/**
 * @route   GET /api/reviews/my/:productId
 * @desc    Get current user's review for a product
 * @access  Private
 */
router.get("/my/:productId", protect, getMyProductReview);

/**
 * @route   POST /api/reviews/:productId
 * @desc    Add a new review for a product
 * @access  Private
 */
router.post(
  "/:productId",
  protect,
  validateRequest(addReviewSchema),
  addReview
);

/**
 * @route   PUT /api/reviews/:id
 * @desc    Update a review (only owner)
 * @access  Private
 *
 * @route   DELETE /api/reviews/:id
 * @desc    Delete a review (owner or admin)
 * @access  Private/Admin
 */
router
  .route("/:id")
  .put(protect, validateRequest(updateReviewSchema), updateReview)
  .delete(protect, deleteReview);

/**
 * @route   PUT /api/reviews/:id/moderate
 * @desc    Approve or reject a review
 * @access  Admin
 */
router.put(
  "/:id/moderate",
  protect,
  admin,
  validateRequest(moderateReviewSchema),
  moderateReview
);

export default router;
