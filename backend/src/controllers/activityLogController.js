// backend/src/controllers/activityLogController.js
import ActivityLog from "../models/ActivityLog.js";

// @desc    Get paginated, filterable site activity log
// @route   GET /api/admin/activity-logs
// @access  Admin
export async function getActivityLogs(req, res) {
  const page = Math.max(1, Number(req.query?.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query?.limit) || 25));
  const action = String(req.query?.action || "").trim();
  const actorType = String(req.query?.actorType || "").trim();
  const search = String(req.query?.search || "").trim();

  const filter = {};
  if (action) filter.action = action;
  if (actorType) filter.actorType = actorType;
  if (search) {
    filter.$or = [
      { targetLabel: { $regex: search, $options: "i" } },
      { actorEmail: { $regex: search, $options: "i" } },
      { actorName: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const [logs, total, distinctActions] = await Promise.all([
    ActivityLog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    ActivityLog.countDocuments(filter),
    ActivityLog.distinct("action"),
  ]);

  res.json({
    logs,
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    actions: distinctActions.sort(),
  });
}
