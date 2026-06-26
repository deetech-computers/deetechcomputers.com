// backend/src/utils/reviewStatusMigration.js
import Review from "../models/Review.js";
import logger from "./logger.js";

// One-time, idempotent backfill: legacy reviews only ever had a boolean
// `approved` field with no real "pending" state. Map them onto the new
// `status` enum so existing reviews keep their current visibility instead
// of all turning up as "pending" once the moderation queue starts filtering
// by status. Safe to run on every boot - it only touches documents that
// don't have `status` set yet.
export async function migrateLegacyReviewStatus() {
  try {
    const legacyApproved = await Review.updateMany(
      { status: { $exists: false }, approved: { $ne: false } },
      { $set: { status: "approved" } }
    );
    const legacyRejected = await Review.updateMany(
      { status: { $exists: false }, approved: false },
      { $set: { status: "rejected" } }
    );

    const touched = (legacyApproved.modifiedCount || 0) + (legacyRejected.modifiedCount || 0);
    if (touched > 0) {
      logger.info(`Review status migration: backfilled ${touched} legacy review(s).`);
    }
  } catch (error) {
    logger.error("Review status migration failed", { error: error?.message || error });
  }
}
