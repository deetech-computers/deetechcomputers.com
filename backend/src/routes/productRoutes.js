import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addReview,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateMiddleware.js";
import {
  createProductSchema,
  updateProductSchema,
  reviewSchema,
} from "../validators/productSchemas.js";
import { upload } from "../middleware/uploadMiddleware.js"; // multer middleware

const router = express.Router();

// Products routes
router.route("/")
  .get(getProducts)
  .post(
    protect,
    admin,
    upload.array("images", 5), // allow up to 5 images
    validateRequest(createProductSchema),
    createProduct
  );

router.route("/:id")
  .get(getProductById)
  .put(
    protect,
    admin,
    upload.array("images", 5),
    validateRequest(updateProductSchema),
    updateProduct
  )
  .delete(protect, admin, deleteProduct);

router.route("/:id/reviews")
  .post(protect, validateRequest(reviewSchema), addReview);

export default router;
