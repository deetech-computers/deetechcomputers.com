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
const productImageUpload = upload.fields([
  { name: "images", maxCount: 6 },
  { name: "descriptionImage", maxCount: 1 },
]);

router.route("/")
  .get(getProducts)
  .post(
    protect,
    admin,
    productImageUpload,
    validateRequest(createProductSchema),
    createProduct
  );

router.route("/:id")
  .get(getProductById)
  .put(
    protect,
    admin,
    productImageUpload,
    validateRequest(updateProductSchema),
    updateProduct
  )
  .delete(protect, admin, deleteProduct);

router.route("/:id/reviews")
  .post(protect, validateRequest(reviewSchema), addReview);

export default router;
