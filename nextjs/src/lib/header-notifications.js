const READ_STORAGE_KEY_PREFIX = "deetech:header-notifications:read";
const DISMISSED_STORAGE_KEY_PREFIX = "deetech:header-notifications:dismissed";
export const HEADER_NOTIFICATIONS_UPDATED_EVENT = "deetech:header-notifications:updated";

function toTime(value) {
  const time = value ? new Date(value).getTime() : 0;
  return Number.isFinite(time) ? time : 0;
}

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeRole(value) {
  return String(value || "guest").trim().toLowerCase();
}

function resolveViewerId(user) {
  return normalizeText(user?._id || user?.id || user?.email || user?.name || "guest");
}

export function buildNotificationScope(user) {
  const role = normalizeRole(user?.role);
  const viewerId = resolveViewerId(user);
  return `${role}:${viewerId}`;
}

function getStorageKey(prefix, scope) {
  return `${prefix}:${normalizeText(scope) || "guest"}`;
}

function notifyStorageUpdate(scope) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(HEADER_NOTIFICATIONS_UPDATED_EVENT, {
      detail: { scope: normalizeText(scope) || "guest" },
    })
  );
}

function readNotificationIds(prefix, scope) {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(getStorageKey(prefix, scope));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map((value) => normalizeText(value)).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function writeNotificationIds(prefix, scope, ids) {
  if (typeof window === "undefined") return;
  try {
    const nextIds = Array.isArray(ids) ? ids.map((value) => normalizeText(value)).filter(Boolean) : [];
    window.localStorage.setItem(getStorageKey(prefix, scope), JSON.stringify(nextIds));
    notifyStorageUpdate(scope);
  } catch {
    // Ignore storage write failures and keep notifications non-blocking.
  }
}

export function readNotificationReadIds(scope) {
  return readNotificationIds(READ_STORAGE_KEY_PREFIX, scope);
}

export function writeNotificationReadIds(scope, ids) {
  writeNotificationIds(READ_STORAGE_KEY_PREFIX, scope, ids);
}

export function readNotificationDismissedIds(scope) {
  return readNotificationIds(DISMISSED_STORAGE_KEY_PREFIX, scope);
}

export function writeNotificationDismissedIds(scope, ids) {
  writeNotificationIds(DISMISSED_STORAGE_KEY_PREFIX, scope, ids);
}

export function markNotificationAsRead(scope, id) {
  const target = normalizeText(id);
  if (!target) return;
  const current = readNotificationReadIds(scope);
  if (current.includes(target)) return;
  writeNotificationReadIds(scope, [...current, target]);
}

export function markNotificationsAsRead(scope, ids) {
  const nextIds = Array.isArray(ids) ? ids.map((value) => normalizeText(value)).filter(Boolean) : [];
  if (!nextIds.length) return;
  const current = readNotificationReadIds(scope);
  const merged = Array.from(new Set([...current, ...nextIds]));
  writeNotificationReadIds(scope, merged);
}

export function dismissNotification(scope, id) {
  const target = normalizeText(id);
  if (!target) return;
  const current = readNotificationDismissedIds(scope);
  if (current.includes(target)) return;
  writeNotificationDismissedIds(scope, [...current, target]);
}

export function dismissNotifications(scope, ids) {
  const nextIds = Array.isArray(ids) ? ids.map((value) => normalizeText(value)).filter(Boolean) : [];
  if (!nextIds.length) return;
  const current = readNotificationDismissedIds(scope);
  const merged = Array.from(new Set([...current, ...nextIds]));
  writeNotificationDismissedIds(scope, merged);
}

function buildNotificationEventId(prefix, sourceId, eventTime) {
  const normalizedSourceId = normalizeText(sourceId || "event");
  const normalizedEventTime = Number(eventTime || 0) || 0;
  return `${prefix}-${normalizedSourceId}-${normalizedEventTime}`;
}

function buildCustomerName(order) {
  return (
    normalizeText(order?.shippingName) ||
    normalizeText(order?.guestName) ||
    normalizeText(order?.shippingEmail) ||
    normalizeText(order?.guestEmail) ||
    "Customer"
  );
}

function buildOrderLabel(order) {
  return normalizeText(order?.orderNumber || order?._id || order?.id || "Order");
}

function buildStatusLabel(status) {
  const value = normalizeRole(status);
  if (!value) return "updated";
  return value.replace(/[-_]+/g, " ");
}

function latestSupportMessage(ticket, sender) {
  const thread = Array.isArray(ticket?.messages) ? ticket.messages : [];
  return thread
    .filter((entry) => normalizeRole(entry?.sender) === normalizeRole(sender))
    .sort((a, b) => toTime(b?.createdAt) - toTime(a?.createdAt))[0] || null;
}

export function buildAdminNotifications(orders, tickets) {
  const orderNotifications = (Array.isArray(orders) ? orders : [])
    .map((order) => {
      const eventTime = toTime(order?.createdAt || order?.updatedAt);
      if (!eventTime) return null;
      return {
        id: buildNotificationEventId("admin-order", order?._id || order?.id, eventTime),
        href: "/admin/orders",
        title: "New order received",
        body: `${buildCustomerName(order)} placed order #${buildOrderLabel(order)}.`,
        timestamp: eventTime,
        kind: "order",
      };
    })
    .filter(Boolean);

  const supportNotifications = (Array.isArray(tickets) ? tickets : [])
    .map((ticket) => {
      const latestCustomerReply = latestSupportMessage(ticket, "user");
      const eventTime = toTime(latestCustomerReply?.createdAt || ticket?.createdAt || ticket?.updatedAt);
      if (!eventTime) return null;
      return {
        id: buildNotificationEventId("admin-ticket", ticket?._id || ticket?.id, eventTime),
        href: "/admin/messages",
        title: "New customer message",
        body: `${normalizeText(ticket?.subject) || "Support request"} from ${normalizeText(ticket?.name || ticket?.email || "customer")}.`,
        timestamp: eventTime,
        kind: "message",
      };
    })
    .filter(Boolean);

  return [...orderNotifications, ...supportNotifications].sort((a, b) => b.timestamp - a.timestamp);
}

export function buildUserNotifications(orders, tickets) {
  const orderNotifications = (Array.isArray(orders) ? orders : [])
    .map((order) => {
      const createdTime = toTime(order?.createdAt);
      const eventTime = toTime(order?.deliveredAt || order?.paidAt || order?.updatedAt || order?.createdAt);
      if (!eventTime || eventTime <= createdTime) return null;
      const statusLabel = buildStatusLabel(order?.orderStatus);
      return {
        id: buildNotificationEventId("user-order", order?._id || order?.id, eventTime),
        href: normalizeText(order?._id || order?.id) ? `/orders/${normalizeText(order?._id || order?.id)}` : "/account?tab=orders",
        title: `Order #${buildOrderLabel(order)} ${statusLabel}`,
        body: "Your order record has a new update. Open it to track the latest progress.",
        timestamp: eventTime,
        kind: "order",
      };
    })
    .filter(Boolean);

  const supportNotifications = (Array.isArray(tickets) ? tickets : [])
    .map((ticket) => {
      const latestAdminReply = latestSupportMessage(ticket, "admin");
      const eventTime = toTime(latestAdminReply?.createdAt);
      if (!eventTime) return null;
      return {
        id: buildNotificationEventId("user-ticket", ticket?._id || ticket?.id, eventTime),
        href: "/account?tab=messages",
        title: "Support replied to your message",
        body: normalizeText(ticket?.subject) || "Open your account messages to continue the conversation.",
        timestamp: eventTime,
        kind: "message",
      };
    })
    .filter(Boolean);

  return [...orderNotifications, ...supportNotifications].sort((a, b) => b.timestamp - a.timestamp);
}

export function formatNotificationTime(value) {
  const timestamp = Number(value || 0);
  if (!timestamp) return "Just now";
  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
  }).format(new Date(timestamp));
}
