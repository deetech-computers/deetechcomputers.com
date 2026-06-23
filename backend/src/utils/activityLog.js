import ActivityLog from "../models/ActivityLog.js";

function getRequestIp(req) {
  return String(
    req?.headers?.["x-forwarded-for"] || req?.ip || req?.socket?.remoteAddress || ""
  )
    .split(",")[0]
    .trim();
}

function getRequestUserAgent(req) {
  return String(req?.headers?.["user-agent"] || "").trim().slice(0, 500);
}

// Fire-and-forget site activity log. Never throws - a logging failure
// must never break the actual request it's recording.
export async function logActivity({
  req,
  actorType = "user",
  actor = null,
  actorName = "",
  actorEmail = "",
  action,
  targetType = "",
  targetId = "",
  targetLabel = "",
  description = "",
  metadata = undefined,
}) {
  try {
    await ActivityLog.create({
      actorType,
      actor: actor?._id || actor || undefined,
      actorName: String(actorName || actor?.name || `${actor?.firstName || ""} ${actor?.lastName || ""}`.trim() || "").trim() || undefined,
      actorEmail: String(actorEmail || actor?.email || "").trim().toLowerCase() || undefined,
      action,
      targetType: String(targetType || "").trim() || undefined,
      targetId: String(targetId || "").trim() || undefined,
      targetLabel: String(targetLabel || "").trim() || undefined,
      description: String(description || "").trim() || undefined,
      ipAddress: getRequestIp(req) || undefined,
      userAgent: getRequestUserAgent(req) || undefined,
      metadata,
    });
  } catch (error) {
    console.warn("Activity log write failed:", error?.message || error);
  }
}
