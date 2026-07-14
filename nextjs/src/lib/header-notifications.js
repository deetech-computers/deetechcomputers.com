import { buildApiUrl } from "./config";

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

function uniqueNotificationsById(items) {
  const seen = new Set();
  return (Array.isArray(items) ? items : []).filter((item) => {
    const id = normalizeText(item?.id);
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

function resolveAdminTicketEvent(ticket) {
  const latestCustomerReply = latestSupportMessage(ticket, "user");
  if (latestCustomerReply) {
    return {
      eventTime: toTime(latestCustomerReply?.createdAt),
      eventId: buildNotificationEventId(
        "admin-ticket",
        ticket?._id || ticket?.id,
        toTime(latestCustomerReply?.createdAt)
      ),
    };
  }

  const createdTime = toTime(ticket?.createdAt);
  return createdTime
    ? {
        eventTime: createdTime,
        eventId: buildNotificationEventId("admin-ticket", ticket?._id || ticket?.id, createdTime),
      }
    : null;
}

function resolveUserOrderEvent(order) {
  const sourceId = order?._id || order?.id;
  const deliveredAt = toTime(order?.deliveredAt);
  if (deliveredAt) {
    return { eventTime: deliveredAt, eventKey: "delivered" };
  }

  const shippedStatus = normalizeRole(order?.orderStatus) === "shipped";
  const shippedTime = toTime(order?.updatedAt || order?.paidAt);
  if (shippedStatus && shippedTime) {
    return { eventTime: shippedTime, eventKey: "shipped" };
  }

  const cancelled =
    normalizeRole(order?.orderStatus) === "cancelled" ||
    normalizeRole(order?.paymentStatus) === "failed";
  const cancelledTime = toTime(order?.updatedAt);
  if (cancelled && cancelledTime) {
    return { eventTime: cancelledTime, eventKey: "cancelled" };
  }

  const accepted =
    normalizeRole(order?.orderStatus) === "processing" ||
    normalizeRole(order?.paymentStatus) === "paid";
  const acceptedTime = toTime(order?.paidAt || order?.updatedAt);
  const createdTime = toTime(order?.createdAt);
  if (accepted && acceptedTime && acceptedTime > createdTime) {
    return { eventTime: acceptedTime, eventKey: "processing" };
  }

  if (accepted && toTime(order?.paidAt)) {
    return { eventTime: toTime(order?.paidAt), eventKey: "processing" };
  }

  if (!sourceId) return null;
  return null;
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
      const event = resolveAdminTicketEvent(ticket);
      if (!event?.eventTime || !event?.eventId) return null;
      return {
        id: event.eventId,
        href: "/admin/messages",
        title: "New customer message",
        body: `${normalizeText(ticket?.subject) || "Support request"} from ${normalizeText(ticket?.name || ticket?.email || "customer")}.`,
        timestamp: event.eventTime,
        kind: "message",
      };
    })
    .filter(Boolean);

  return uniqueNotificationsById([...orderNotifications, ...supportNotifications]).sort(
    (a, b) => b.timestamp - a.timestamp
  );
}

export function buildUserNotifications(orders, tickets) {
  const orderNotifications = (Array.isArray(orders) ? orders : [])
    .map((order) => {
      const event = resolveUserOrderEvent(order);
      if (!event?.eventTime || !event?.eventKey) return null;
      const statusLabel =
        event.eventKey === "processing" ? "accepted" : buildStatusLabel(event.eventKey);
      return {
        id: `user-order-${normalizeText(order?._id || order?.id)}-${event.eventKey}`,
        href: normalizeText(order?._id || order?.id) ? `/orders/${normalizeText(order?._id || order?.id)}` : "/account?tab=orders",
        title: `Order #${buildOrderLabel(order)} ${statusLabel}`,
        body: "Your order record has a new update. Open it to track the latest progress.",
        timestamp: event.eventTime,
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

  return uniqueNotificationsById([...orderNotifications, ...supportNotifications]).sort(
    (a, b) => b.timestamp - a.timestamp
  );
}

export function sanitizeNotificationIds(notifications, ids) {
  const validIds = new Set(
    (Array.isArray(notifications) ? notifications : [])
      .map((item) => normalizeText(item?.id))
      .filter(Boolean)
  );

  return (Array.isArray(ids) ? ids : [])
    .map((value) => normalizeText(value))
    .filter((value) => value && validIds.has(value));
}

export function buildQuickNotificationItems(notifications, readIds = [], dismissedIds = []) {
  const readSet = new Set((Array.isArray(readIds) ? readIds : []).map((value) => normalizeText(value)));
  const dismissedSet = new Set((Array.isArray(dismissedIds) ? dismissedIds : []).map((value) => normalizeText(value)));

  return uniqueNotificationsById(notifications)
    .filter((item) => {
      const id = normalizeText(item?.id);
      return id && !readSet.has(id) && !dismissedSet.has(id);
    })
    .sort((a, b) => Number(b?.timestamp || 0) - Number(a?.timestamp || 0));
}

export async function fetchRemoteReadIds(token) {
  if (!token) return [];
  try {
    const res = await fetch(buildApiUrl("/api/users/notifications/read-ids"), {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.readIds)
      ? data.readIds.map((v) => normalizeText(v)).filter(Boolean)
      : [];
  } catch {
    return [];
  }
}

export async function syncRemoteReadIds(token, ids) {
  if (!token || !Array.isArray(ids) || !ids.length) return;
  try {
    await fetch(buildApiUrl("/api/users/notifications/read-ids"), {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ readIds: ids }),
      cache: "no-store",
    });
  } catch {
    // Sync failures are non-critical; localStorage is the local source of truth.
  }
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
