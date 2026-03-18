import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import {
  registerAffiliate,
  getMyAffiliateProfile,
  validateAffiliateCode,
  getAffiliateProgramSettings,
  getAffiliateProgramSettingsAdmin,
  updateAffiliateProgramSettingsAdmin,
  getAllAffiliatesAdmin,
  getAffiliateByIdAdmin,
  deleteAffiliateAdmin,
  updateAffiliateStatusAdmin,
} from "../controllers/affiliateController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", protect, asyncHandler(registerAffiliate));
router.get("/me", protect, asyncHandler(getMyAffiliateProfile));
router.post("/validate-code", asyncHandler(validateAffiliateCode));
router.get("/settings", asyncHandler(getAffiliateProgramSettings));

router.get("/admin/settings", protect, admin, asyncHandler(getAffiliateProgramSettingsAdmin));
router.put("/admin/settings", protect, admin, asyncHandler(updateAffiliateProgramSettingsAdmin));
router.get("/admin", protect, admin, asyncHandler(getAllAffiliatesAdmin));
router.get("/admin/:id", protect, admin, asyncHandler(getAffiliateByIdAdmin));
router.delete("/admin/:id", protect, admin, asyncHandler(deleteAffiliateAdmin));
router.put("/admin/:id/status", protect, admin, asyncHandler(updateAffiliateStatusAdmin));

export default router;
