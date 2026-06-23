"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/providers/toast-provider";
import { API_BASE, API_BASE_ORDERS, API_BASE_PRODUCTS, API_BASE_SUPPORT, API_BASE_USERS } from "@/lib/config";
import StableImage from "@/components/ui/stable-image";
import { formatCurrency } from "@/lib/format";
import { getLinesDiscountTotal } from "@/lib/order-line-pricing";
import { getProductPricing } from "@/lib/product-pricing";
import { requestWithToken, asArray } from "@/lib/resource";
import { resolveProductImage } from "@/lib/products";
import { formatSelectedUpgrades, normalizeProductUpgradeSpecs } from "@/lib/product-upgrades";
import { MobileNavDrawer } from "./admin-nav";

const PRODUCT_CATEGORIES = [
  ["laptops", "Laptops and Desktops"],
  ["phones", "Mobile Phones"],
  ["monitors", "Monitors"],
  ["accessories", "Accessories"],
  ["printers", "Printers"],
  ["storage", "Storage Devices"],
  ["others", "Other Gadgets"],
];

const BRANDS_BY_CATEGORY = {
  laptops: ["HP", "Dell", "Lenovo", "Apple", "Asus", "Acer", "Microsoft", "Samsung", "Toshiba", "MSI", "Other"],
  phones: ["Apple", "Samsung", "Google", "Huawei", "Xiaomi", "Oppo", "Vivo", "Tecno", "Infinix", "Nokia", "Other"],
  monitors: ["Dell", "HP", "Lenovo", "Samsung", "LG", "Acer", "Asus", "BenQ", "ViewSonic", "Philips", "AOC", "Other"],
  accessories: ["Logitech", "Microsoft", "Apple", "Samsung", "Anker", "JBL", "Sony", "Razer", "Corsair", "HyperX", "Other"],
  storage: ["Seagate", "Western Digital", "Samsung", "Toshiba", "Kingston", "SanDisk", "Crucial", "Transcend", "Other"],
  printers: ["HP", "Canon", "Epson", "Brother", "Xerox", "Lexmark", "Ricoh", "Kyocera", "Other"],
  others: ["Generic", "Unbranded", "Other", "Multiple"],
};

const SUBCATEGORY_BY_CATEGORY = BRANDS_BY_CATEGORY;
const PRODUCT_SORT_OPTIONS = [
  ["newest", "Newest first"],
  ["oldest", "Oldest first"],
  ["name-asc", "Name A-Z"],
  ["name-desc", "Name Z-A"],
  ["price-asc", "Price low-high"],
  ["price-desc", "Price high-low"],
  ["stock-desc", "Stock high-low"],
  ["stock-asc", "Stock low-high"],
];
const USER_SORT_OPTIONS = [
  ["newest", "Newest first"],
  ["oldest", "Oldest first"],
  ["name-asc", "Name A-Z"],
  ["name-desc", "Name Z-A"],
  ["email-asc", "Email A-Z"],
  ["email-desc", "Email Z-A"],
];
const AFFILIATE_SORT_OPTIONS = [
  ["earned-desc", "Highest earned commission"],
  ["pending-desc", "Highest pending commission"],
  ["referrals-desc", "Most referrals"],
  ["newest", "Newest first"],
  ["oldest", "Oldest first"],
  ["code-asc", "Code A-Z"],
  ["code-desc", "Code Z-A"],
];
const REVIEW_SORT_OPTIONS = [
  ["newest", "Newest first"],
  ["oldest", "Oldest first"],
  ["rating-desc", "Highest rating"],
  ["rating-asc", "Lowest rating"],
];
const DISCOUNT_SORT_OPTIONS = [
  ["newest", "Newest first"],
  ["oldest", "Oldest first"],
  ["percent-desc", "Highest percent"],
  ["percent-asc", "Lowest percent"],
  ["code-asc", "Code A-Z"],
  ["code-desc", "Code Z-A"],
];

const HOME_SECTION_OPTIONS = [
  ["hot_deals", "Hot Deals"],
  ["just_landed", "Just Landed"],
  ["student_laptops", "Laptops for Students"],
  ["business_laptops", "Laptops for Work & Business"],
  ["gaming_laptops", "Powerful/Gaming Laptops"],
  ["budget_smartphones", "Smartphones for Every Budget"],
  ["quality_accessories", "Quality Accessories"],
  ["trusted_brands", "Shop Trusted Brands"],
];
const HOME_SECTION_LABELS = new Map(HOME_SECTION_OPTIONS);
const PRODUCT_DISCOUNT_PRESET_OPTIONS = [
  ["none", "No discount"],
  ["instant", "Instant discount"],
  ["24h", "Timed discount - 24 hours"],
  ["72h", "Timed discount - 3 days"],
  ["168h", "Timed discount - 7 days"],
];
const MAX_PRODUCT_IMAGES = 6;

function resolveDiscountPreset(product) {
  const mode = String(product?.discountMode || "none").trim().toLowerCase();
  const discountPrice = Number(product?.discountPrice || 0);
  if (!Number.isFinite(discountPrice) || discountPrice <= 0) return "none";
  if (mode === "instant") return "instant";
  if (mode !== "timed") return "none";

  const start = product?.discountStartsAt ? new Date(product.discountStartsAt) : null;
  const end = product?.discountEndsAt ? new Date(product.discountEndsAt) : null;
  if (!start || !end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "none";
  }
  if (end.getTime() <= Date.now()) {
    return "none";
  }
  const diffHours = Math.round((end.getTime() - start.getTime()) / (60 * 60 * 1000));
  if (diffHours <= 24) return "24h";
  if (diffHours <= 72) return "72h";
  return "168h";
}

function buildInitialImageUrlSlots(product) {
  const existingImages = Array.isArray(product?.images)
    ? product.images.map((value) => String(value || "").trim()).filter(Boolean)
    : [];
  const mainImage = String(product?.image_url || existingImages[0] || "").trim();
  const secondaryImages = existingImages.filter((value) => value && value !== mainImage);
  const slots = [mainImage, ...secondaryImages].slice(0, MAX_PRODUCT_IMAGES);
  while (slots.length < 2) {
    slots.push("");
  }
  return slots;
}

function buildCurrentProductImages(product) {
  const imageList = Array.isArray(product?.images)
    ? product.images.map((value) => String(value || "").trim()).filter(Boolean)
    : [];
  const mainImage = String(product?.image_url || imageList[0] || "").trim();
  const combined = [mainImage, ...imageList];
  return [...new Set(combined.filter(Boolean))].slice(0, MAX_PRODUCT_IMAGES);
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function formatCount(value) {
  return Number(value || 0).toLocaleString("en-GB");
}

function toSlug(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "export";
}

function summarizeCounts(entries, limit = 6) {
  const map = new Map();
  for (const entry of entries || []) {
    const key = String(entry || "").trim();
    if (!key) continue;
    map.set(key, Number(map.get(key) || 0) + 1);
  }
  return [...map.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

function summarizeWeighted(entries, limit = 6) {
  const map = new Map();
  for (const entry of entries || []) {
    const label = String(entry?.label || "").trim();
    const weight = Number(entry?.weight || 0);
    if (!label || !Number.isFinite(weight) || weight <= 0) continue;
    map.set(label, Number(map.get(label) || 0) + weight);
  }
  return [...map.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

function toCsv(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escapeCell = (value) => {
    const raw = value == null ? "" : String(value);
    if (/[",\n]/.test(raw)) return `"${raw.replace(/"/g, "\"\"")}"`;
    return raw;
  };
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escapeCell(row[header])).join(",")),
  ];
  return lines.join("\n");
}

function toSqlInsert(tableName, rows) {
  if (!rows.length) return `-- No rows to export for ${tableName}\n`;
  const columns = Object.keys(rows[0]);
  const escapeSql = (value) => {
    if (value == null || value === "") return "NULL";
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
    if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
    return `'${String(value).replace(/'/g, "''")}'`;
  };
  const values = rows
    .map((row) => `(${columns.map((column) => escapeSql(row[column])).join(", ")})`)
    .join(",\n");
  return `INSERT INTO ${tableName} (${columns.join(", ")})\nVALUES\n${values};\n`;
}

function downloadTextFile(filename, content, mimeType) {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
}

function TinyBarChart({ title, rows = [], formatter = (value) => value }) {
  const safeRows = rows.filter((row) => Number(row?.value || 0) > 0);
  const max = Math.max(...safeRows.map((row) => Number(row.value || 0)), 1);
  return (
    <article className="admin-viz-card">
      <h3>{title}</h3>
      <div className="admin-viz-bars">
        {safeRows.length ? safeRows.map((row) => (
          <div key={row.label} className="admin-viz-bar-row">
            <span>{row.label}</span>
            <div className="admin-viz-bar-track">
              <i style={{ width: `${Math.max(8, (Number(row.value || 0) / max) * 100)}%` }} />
            </div>
            <strong>{formatter(Number(row.value || 0))}</strong>
          </div>
        )) : <p>No data yet.</p>}
      </div>
    </article>
  );
}

function DonutChart({ title, segments = [], formatter = (value) => value }) {
  const valid = segments.filter((segment) => Number(segment?.value || 0) > 0);
  const total = valid.reduce((sum, segment) => sum + Number(segment.value || 0), 0);
  const slices = valid.map((segment, index) => {
    const value = Number(segment.value || 0);
    const slice = total > 0 ? (value / total) * 264 : 0;
    const strokeDashoffset = -valid
      .slice(0, index)
      .reduce((sum, entry) => sum + (total > 0 ? (Number(entry?.value || 0) / total) * 264 : 0), 0);
    return {
      key: `${segment.label}-${index}`,
      index,
      segment,
      slice,
      strokeDashoffset,
    };
  });
  return (
    <article className="admin-viz-card">
      <h3>{title}</h3>
      <div className="admin-viz-donut-wrap">
        <svg viewBox="0 0 120 120" className="admin-viz-donut" aria-hidden="true">
          <circle cx="60" cy="60" r="42" className="admin-viz-donut__base" />
          {slices.map(({ key, index, slice, strokeDashoffset }) => (
            <circle
              key={key}
              cx="60"
              cy="60"
              r="42"
              className={`admin-viz-donut__slice is-${index % 5}`}
              strokeDasharray={`${slice} 264`}
              strokeDashoffset={strokeDashoffset}
            />
          ))}
        </svg>
        <div className="admin-viz-donut__center">
          <strong>{formatCount(total)}</strong>
          <span>Total</span>
        </div>
      </div>
      <div className="admin-viz-legend">
        {valid.length ? valid.map((segment, index) => (
          <div key={`${segment.label}-${index}`} className="admin-viz-legend__row">
            <i className={`admin-viz-dot is-${index % 5}`} />
            <span>{segment.label}</span>
            <strong>{formatter(Number(segment.value || 0))}</strong>
          </div>
        )) : <p>No data yet.</p>}
      </div>
    </article>
  );
}

function User360Modal({ user, insight, activity, onClose, onAction, busy = false }) {
  const wishlistCount = Number(activity?.wishlistCount || 0);
  const searchTerms = Array.isArray(activity?.searchTerms) ? activity.searchTerms : [];
  const interests = Array.isArray(activity?.interests) ? activity.interests : [];
  const active = user?.isActive !== false;
  const isAdminUser = String(user?.role || "").toLowerCase() === "admin";

  const timeline = useMemo(() => {
    const orders = Array.isArray(activity?.orders) ? activity.orders : [];
    const reviews = Array.isArray(activity?.reviews) ? activity.reviews : [];
    const tickets = Array.isArray(activity?.tickets) ? activity.tickets : [];
    const orderEvents = orders.map((order) => ({
      type: "Order",
      date: order?.createdAt || "",
      label: `Order ${order?.orderNumber || order?._id || ""}`,
      detail: `${formatCurrency(Number(order?.totalPrice || 0))} • ${order?.orderStatus || "pending"}`,
    }));
    const reviewEvents = reviews.map((review) => ({
      type: "Review",
      date: review?.createdAt || "",
      label: review?.product?.name || "Product review",
      detail: `${Number(review?.rating || 0).toFixed(1)} stars`,
    }));
    const ticketEvents = tickets.map((ticket) => ({
      type: "Support",
      date: ticket?.createdAt || "",
      label: ticket?.subject || "Support ticket",
      detail: ticket?.status || "new",
    }));
    return [...orderEvents, ...reviewEvents, ...ticketEvents]
      .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
      .slice(0, 24);
  }, [activity]);

  return (
    <div className="admin-overlay" role="dialog" aria-modal="true" aria-label="User 360 details">
      <div className="admin-overlay__backdrop" onClick={onClose} />
      <section className="admin-overlay__card panel">
        <header className="admin-overlay__head">
          <div>
            <p className="section-kicker">User 360</p>
            <h2>{user?.name || user?.email || "User insight"}</h2>
            <p>{user?.email || "No email"} • Joined {formatDateTime(user?.createdAt)}</p>
          </div>
          <button type="button" className="ghost-button" onClick={onClose}>Close</button>
        </header>

        <section className="admin-overlay__stats">
          <span className="admin-chip">Orders: {Number(insight?.totalOrders || 0)}</span>
          <span className="admin-chip is-success">Spent: {formatCurrency(Number(insight?.totalSpent || 0))}</span>
          <span className="admin-chip is-neutral">Wishlist: {wishlistCount}</span>
          <span className="admin-chip is-warning">Reviews: {Number(insight?.reviewCount || 0)}</span>
          <span className="admin-chip is-warning">Support: {Number(insight?.supportTickets || 0)}</span>
          <span className="admin-chip is-success">Avg rating: {Number(insight?.avgRating || 0).toFixed(1)}</span>
        </section>

        <section className="admin-overlay__grid">
          <article className="admin-viz-card">
            <h3>Top Search Terms</h3>
            <div className="admin-viz-bars">
              {searchTerms.length ? searchTerms.map((entry) => (
                <div key={entry?.term || "term"} className="admin-viz-bar-row">
                  <span>{entry?.term || "term"}</span>
                  <div className="admin-viz-bar-track"><i style={{ width: `${Math.max(8, Math.min(100, Number(entry?.count || 0) * 10))}%` }} /></div>
                  <strong>{formatCount(entry?.count || 0)}</strong>
                </div>
              )) : <p>No search history yet.</p>}
            </div>
          </article>

          <article className="admin-viz-card">
            <h3>Category Interests</h3>
            <div className="admin-viz-bars">
              {interests.length ? interests.map((entry) => (
                <div key={entry?.category || "interest"} className="admin-viz-bar-row">
                  <span>{entry?.category || "category"}</span>
                  <div className="admin-viz-bar-track"><i style={{ width: `${Math.max(8, Math.min(100, Number(entry?.count || 0) * 10))}%` }} /></div>
                  <strong>{formatCount(entry?.count || 0)}</strong>
                </div>
              )) : <p>No category interest data yet.</p>}
            </div>
          </article>
        </section>

        <article className="admin-viz-card">
          <h3>Activity Timeline</h3>
          <div className="admin-timeline">
            {timeline.length ? timeline.map((entry, index) => (
              <div key={`${entry.type}-${entry.date}-${index}`} className="admin-timeline__item">
                <span className="admin-chip is-neutral">{entry.type}</span>
                <div>
                  <strong>{entry.label}</strong>
                  <p>{entry.detail}</p>
                </div>
                <time>{formatDateTime(entry.date)}</time>
              </div>
            )) : <p>No timeline events yet.</p>}
          </div>
        </article>
        <footer className="admin-user360-actions">
          <button type="button" disabled={busy} onClick={() => onAction("userStatus", user, null, !active)}>{active ? "Deactivate Account" : "Activate Account"}</button>
          {isAdminUser ? <span>Protected admin account</span> : <button type="button" disabled={busy} onClick={() => onAction("deleteUser", user)}>Delete User Profile</button>}
        </footer>
      </section>
    </div>
  );
}

function canonicalHomeSectionKey(value) {
  const key = String(value || "").trim().toLowerCase();
  if (!key) return "";
  if (key === "popular") return "hot_deals";
  if (key === "new_arrivals") return "just_landed";
  if (key === "best_laptops") return "student_laptops";
  if (key === "top_smartphones") return "budget_smartphones";
  if (key === "shop_by_brands") return "trusted_brands";
  return key;
}

const ADMIN_CONFIG = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Full store command center for DEETECH operations.",
    endpoint: `${API_BASE}/dashboard`,
  },
  products: {
    title: "Products",
    subtitle: "Create, update, and remove product inventory.",
    endpoint: API_BASE_PRODUCTS,
  },
  orders: {
    title: "Orders",
    subtitle: "Track payment, delivery, affiliate sync, and order lifecycle.",
    endpoint: API_BASE_ORDERS,
  },
  messages: {
    title: "Messages",
    subtitle: "Respond to customer support tickets and update ticket status.",
    endpoint: API_BASE_SUPPORT,
  },
  users: {
    title: "Users",
    subtitle: "Manage customer access and account status.",
    endpoint: `${API_BASE_USERS}/admin/users`,
  },
  reviews: {
    title: "Reviews",
    subtitle: "Approve, reject, or remove customer product reviews.",
    endpoint: `${API_BASE}/reviews`,
  },
  affiliates: {
    title: "Affiliates",
    subtitle: "Manage affiliate status, tiers, and commission settings.",
    endpoint: `${API_BASE}/affiliates/admin`,
  },
  discounts: {
    title: "Discounts",
    subtitle: "Generate and remove checkout coupon codes.",
    endpoint: `${API_BASE}/admin/discounts`,
  },
  banners: {
    title: "Banners",
    subtitle: "Create and remove homepage marketing banners.",
    endpoint: `${API_BASE}/banners`,
  },
};

function pickList(type, payload) {
  if (type === "dashboard") return payload || {};
  if (type === "affiliates") return Array.isArray(payload?.affiliates) ? payload.affiliates : asArray(payload);
  return asArray(payload);
}

function normalizeText(value) {
  return String(value || "").trim();
}

function formatDate(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "Recently";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function formatDateTime(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "Recently";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function toDateTimeLocalValue(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "";
  const pad = (number) => String(number).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function resolvePaymentProofUrl(order) {
  const raw = order?.paymentScreenshotUrl || order?.paymentProofUrl || order?.screenshot_url || "";
  const value = String(raw || "").trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value) || value.startsWith("data:")) return value;
  if (value.startsWith("/")) return `${API_BASE}${value}`;
  return `${API_BASE}/${value.replace(/^\/+/, "")}`;
}

function resolveAssetUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw) || raw.startsWith("data:")) return raw;
  if (raw.startsWith("/")) return `${API_BASE}${raw}`;
  return `${API_BASE}/${raw.replace(/^\/+/, "")}`;
}

function itemSearchText(item) {
  return JSON.stringify(item || {}).toLowerCase();
}

function statusClass(value) {
  const v = String(value || "").toLowerCase();
  if (["paid", "delivered", "resolved", "approved", "active", "earned"].includes(v) || v === "true") return "is-success";
  if (["pending", "processing", "in-progress", "new", "starter"].includes(v)) return "is-warning";
  if (["failed", "cancelled", "rejected", "inactive", "false"].includes(v)) return "is-danger";
  return "is-neutral";
}

function AdminGate({ children, title, subtitle }) {
  const { status, isAuthenticated, user } = useAuth();

  if (status === "loading") {
    return <section className="panel admin-state">Loading admin...</section>;
  }

  if (!isAuthenticated) {
    return (
      <section className="panel admin-state">
        <p className="section-kicker">Admin</p>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <p>Login is required before opening the admin portal.</p>
        <Link href="/login" className="primary-link">Go to login</Link>
      </section>
    );
  }

  if (user?.role !== "admin") {
    return (
      <section className="panel admin-state">
        <p className="section-kicker">Admin</p>
        <h1>Admin access required</h1>
        <p>This portal is restricted to DEETECH admin accounts only.</p>
      </section>
    );
  }

  return children;
}

function AdminHero({ title, subtitle, count, busy }) {
  return (
    <section className="admin-hero panel">
      <div>
        <p className="section-kicker">Admin Portal</p>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="admin-hero__badge">
        <strong>{busy ? "..." : count}</strong>
        <span>records</span>
      </div>
    </section>
  );
}

function buildUserInsights(users = [], orders = [], reviews = [], tickets = []) {
  const insights = {};
  const usersById = new Map(users.map((user) => [String(user?._id || ""), user]).filter(([id]) => id));

  const ensure = (email) => {
    const key = normalizeEmail(email);
    if (!key) return null;
    if (!insights[key]) {
      insights[key] = {
        totalOrders: 0,
        totalSpent: 0,
        reviewCount: 0,
        avgRating: 0,
        supportTickets: 0,
      };
    }
    return insights[key];
  };

  for (const order of orders) {
    const fallbackUser = usersById.get(String(order?.user?._id || order?.user || "")) || {};
    const email = order?.shippingEmail || order?.guestEmail || order?.user?.email || fallbackUser?.email;
    const target = ensure(email);
    if (!target) continue;
    target.totalOrders += 1;
    const isDelivered =
      String(order?.orderStatus || "").toLowerCase() === "delivered" ||
      Boolean(order?.isDelivered);
    if (isDelivered) {
      target.totalSpent += Number(order?.totalPrice || 0);
    }
  }

  for (const review of reviews) {
    const fallbackUser = usersById.get(String(review?.user?._id || review?.user || "")) || {};
    const email = review?.user?.email || fallbackUser?.email;
    const target = ensure(email);
    if (!target) continue;
    target.reviewCount += 1;
    target.avgRating += Number(review?.rating || 0);
  }

  for (const ticket of tickets) {
    const target = ensure(ticket?.email);
    if (!target) continue;
    target.supportTickets += 1;
  }

  Object.values(insights).forEach((entry) => {
    entry.avgRating = entry.reviewCount ? entry.avgRating / entry.reviewCount : 0;
  });

  return insights;
}

function normalizeUpgradeOptionDraft(item = {}) {
  return {
    id: String(item?.id || item?._id || Math.random().toString(36).slice(2, 10)),
    label: String(item?.label || "").trim(),
    priceDelta: item?.priceDelta == null || item?.priceDelta === "" ? "" : String(item.priceDelta),
  };
}

function buildUpgradeDraft(options = []) {
  return Array.isArray(options) && options.length
    ? options.map((option) => normalizeUpgradeOptionDraft(option))
    : [normalizeUpgradeOptionDraft()];
}

function serializeUpgradeSpecs(enabled, ramOptions, storageOptions) {
  const cleanOptions = (items) =>
    items
      .map((item) => ({
        label: String(item?.label || "").trim(),
        priceDelta: Number(item?.priceDelta || 0),
      }))
      .filter((item) => item.label)
      .map((item) => ({
        label: item.label,
        priceDelta: Number.isFinite(item.priceDelta) && item.priceDelta > 0 ? Number(item.priceDelta) : 0,
      }));

  const payload = {
    enabled: Boolean(enabled),
    ramOptions: cleanOptions(ramOptions),
    storageOptions: cleanOptions(storageOptions),
  };

  if (!payload.enabled || (!payload.ramOptions.length && !payload.storageOptions.length)) {
    return JSON.stringify({
      enabled: false,
      ramOptions: [],
      storageOptions: [],
    });
  }

  return JSON.stringify(payload);
}

function UpgradeOptionsEditor({ title, items, onChange, addLabel }) {
  function updateItem(id, key, value) {
    onChange(items.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
  }

  function removeItem(id) {
    const next = items.filter((item) => item.id !== id);
    onChange(next.length ? next : [normalizeUpgradeOptionDraft()]);
  }

  function addItem() {
    onChange([...items, normalizeUpgradeOptionDraft()]);
  }

  return (
    <div className="admin-upgrade-editor">
      <div className="admin-upgrade-editor__head">
        <strong>{title}</strong>
        <button type="button" className="ghost-button" onClick={addItem}>{addLabel}</button>
      </div>
      <div className="admin-upgrade-editor__rows">
        {items.map((item, index) => (
          <div key={item.id} className="admin-upgrade-editor__row">
            <input
              className="field"
              value={item.label}
              onChange={(event) => updateItem(item.id, "label", event.target.value)}
              placeholder={title === "RAM options" ? `Option ${index + 1}: e.g. 16GB RAM` : `Option ${index + 1}: e.g. 512GB SSD`}
            />
            <input
              className="field"
              type="number"
              min="0"
              step="0.01"
              value={item.priceDelta}
              onChange={(event) => updateItem(item.id, "priceDelta", event.target.value)}
              placeholder="Extra price"
            />
            <button
              type="button"
              className="ghost-button admin-upgrade-editor__remove"
              onClick={() => removeItem(item.id)}
              aria-label={`Remove ${title} option ${index + 1}`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductEditorSection({ title, meta = "", icon = "box", children }) {
  return (
    <section className="admin-product-editor-section">
      <div className="admin-product-editor-section__head">
        <span><AdminProductsIcon name={icon} /><strong>{title}</strong>{meta ? <small>{meta}</small> : null}</span>
      </div>
      <div className="admin-product-editor-section__body">{children}</div>
    </section>
  );
}

function BannersWorkspace({
  items,
  query,
  setQuery,
  toolbarOpen,
  setToolbarOpen,
  formOpen,
  setFormOpen,
  count,
  loading,
  refreshing,
  busyAction,
  loadData,
  exportCsv,
  exportJson,
  exportSql,
  runAction,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const bannerLinkLabel = (item) => (item.linkCategory
    ? `Category: ${item.linkCategory}${item.linkSubCategory && item.linkSubCategory !== "all" ? ` / ${item.linkSubCategory}` : ""}`
    : item.link
      ? `Custom URL: ${item.link}`
      : "No link (plain banner)");

  return (
    <section className="admin-banners-workspace">
      <section className="admin-banners-desktop-shell">
        <header className="admin-banners-desktop-toolbar">
          <div className="admin-banners-desktop-toolbar__title">
            <h1>Banner Management</h1>
            <p>Manage homepage heroes and promotional displays.</p>
          </div>
          <div className="admin-banners-desktop-toolbar__controls">
            <label className="admin-banners-desktop-search">
              <AdminProductsIcon name="search" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search banners..."
                aria-label="Search banners"
              />
            </label>
            <button type="button" className="admin-banners-icon-button" disabled={loading || refreshing} onClick={() => loadData({ background: true })} aria-label="Refresh banners">
              <AdminProductsIcon name="refresh" />
            </button>
            <div className="admin-banners-export-group">
              <button type="button" onClick={exportCsv}>CSV</button>
              <button type="button" onClick={exportJson}>JSON</button>
              <button type="button" onClick={exportSql}>SQL</button>
            </div>
          </div>
        </header>

        <div className="admin-banners-desktop-grid">
          <section className="admin-banners-desktop-form">
            <div className="admin-banners-desktop-form__head">
              <AdminProductsIcon name="plus" />
              <h2>Create New Banner</h2>
            </div>
            <BannerForm
              busy={busyAction === "createBanner"}
              onSubmit={(event) => runAction("createBanner", { _id: "createBanner" }, event)}
              submitLabel="Save & Publish Banner"
            />
          </section>

          <section className="admin-banners-desktop-list">
            <header className="admin-banners-desktop-list__head">
              <div>
                <AdminProductsIcon name="grid" />
                <h2>Active Marketplace Banners</h2>
              </div>
              <span className="admin-banners-count-badge">{loading ? "..." : count} Banner{count === 1 ? "" : "s"} Active</span>
            </header>

            {!items.length ? (
              <div className="admin-banners-empty-state">
                <h3>No banners yet</h3>
                <p>Your homepage campaigns will appear here once a banner is created.</p>
              </div>
            ) : (
              <div className="admin-banners-desktop-rows">
                {items.map((item) => {
                  const id = item._id || item.id;
                  return (
                    <BannerDesktopRow
                      key={id}
                      item={item}
                      busy={busyAction === id}
                      linkLabel={bannerLinkLabel(item)}
                      runAction={runAction}
                    />
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </section>

      <section className="admin-banners-mobile-shell">
        <header className="admin-banners-mobile-topbar">
          <button type="button" onClick={() => setDrawerOpen(true)} aria-label="Open navigation menu"><AdminProductsIcon name="menu" /></button>
          <h1>Banners</h1>
          <button type="button" onClick={() => loadData({ background: true })} aria-label="Refresh banners">
            <AdminProductsIcon name="refresh" />
          </button>
        </header>

        <section className="admin-banners-mobile-create">
          <button
            type="button"
            className="admin-banners-mobile-create__toggle"
            onClick={() => setFormOpen((current) => !current)}
            aria-expanded={formOpen}
            aria-controls="admin-banners-mobile-create-body"
          >
            <span><AdminProductsIcon name="plus" />Create Banner</span>
            <AdminProductsIcon name="chevron" />
          </button>
          {formOpen ? (
            <div id="admin-banners-mobile-create-body" className="admin-banners-mobile-create__body">
              <BannerForm
                busy={busyAction === "createBanner"}
                onSubmit={(event) => runAction("createBanner", { _id: "createBanner" }, event)}
                submitLabel="Create Banner"
              />
            </div>
          ) : null}
        </section>

        <label className="admin-banners-mobile-search">
          <AdminProductsIcon name="search" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search banners..." aria-label="Search banners" />
        </label>

        <div className="admin-banners-mobile-list-head">
          <h2>Active Banners</h2>
          <span className="admin-banners-count-badge">{loading ? "..." : count} Active</span>
        </div>

        {!items.length ? (
          <div className="admin-banners-empty-state is-mobile">
            <h3>No banners yet</h3>
            <p>Your homepage campaigns will appear here once a banner is created.</p>
          </div>
        ) : (
          <div className="admin-banners-mobile-list">
            {items.map((item) => {
              const id = item._id || item.id;
              return (
                <BannerMobileCard
                  key={id}
                  item={item}
                  busy={busyAction === id}
                  linkLabel={bannerLinkLabel(item)}
                  runAction={runAction}
                />
              );
            })}
          </div>
        )}

        <button
          type="button"
          className="admin-banners-fab"
          aria-label="Create banner"
          onClick={() => setFormOpen(true)}
        >
          <AdminProductsIcon name="plus" />
        </button>

        <MobileNavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </section>
    </section>
  );
}

function BannerDesktopRow({ item, busy, linkLabel, runAction }) {
  const [editing, setEditing] = useState(false);
  const id = item._id || item.id || "";
  return (
    <article className="admin-banners-desktop-row">
      <div className="admin-banners-desktop-row__media">
        {item.imageUrl ? <StableImage src={item.imageUrl} alt={item.title || "Banner"} width={240} height={135} /> : <span>No image</span>}
      </div>
      <div className="admin-banners-desktop-row__body">
        <div className="admin-banners-desktop-row__head">
          <h3>{item.title || "DEETECH Banner"}</h3>
          {id ? <span className="admin-banners-id-chip">ID: {String(id).slice(-6).toUpperCase()}</span> : null}
        </div>
        <p>{linkLabel}</p>
        <span className="admin-banners-order-number">{String(item.order ?? 0).padStart(2, "0")}</span>
      </div>
      <div className="admin-banners-desktop-row__actions">
        <button type="button" className="ghost-button" onClick={() => setEditing((current) => !current)}>
          <AdminProductsIcon name="edit" />{editing ? "Close Edit" : "Edit"}
        </button>
        <button type="button" className="danger-button" disabled={busy} onClick={() => runAction("deleteBanner", item)}>
          <AdminProductsIcon name="delete" />Delete
        </button>
      </div>
      {editing ? (
        <div className="admin-banners-desktop-row__edit">
          <BannerForm initial={item} submitLabel="Update Banner" busy={busy} onSubmit={(event) => runAction("updateBanner", item, event)} />
        </div>
      ) : null}
    </article>
  );
}

function BannerMobileCard({ item, busy, linkLabel, runAction }) {
  const [editing, setEditing] = useState(false);
  return (
    <article className="admin-banners-mobile-card">
      <div className="admin-banners-mobile-card__media">
        {item.imageUrl ? <StableImage src={item.imageUrl} alt={item.title || "Banner"} width={358} height={201} /> : <span>No image</span>}
        <span className="admin-banners-mobile-card__order">ORDER: {String(item.order ?? 0).padStart(2, "0")}</span>
      </div>
      <div className="admin-banners-mobile-card__body">
        <h3>{item.title || "DEETECH Banner"}</h3>
        <p>{linkLabel}</p>
        <div className="admin-banners-mobile-card__actions">
          <button type="button" className="ghost-button" onClick={() => setEditing((current) => !current)}>
            <AdminProductsIcon name="edit" />{editing ? "Close" : "Edit"}
          </button>
          <button type="button" className="danger-button" disabled={busy} onClick={() => runAction("deleteBanner", item)}>
            <AdminProductsIcon name="delete" />Delete
          </button>
        </div>
        {editing ? (
          <div className="admin-banners-mobile-card__edit">
            <BannerForm initial={item} submitLabel="Update Banner" busy={busy} onSubmit={(event) => runAction("updateBanner", item, event)} />
          </div>
        ) : null}
      </div>
    </article>
  );
}

function ReviewsWorkspace({
  items,
  stats,
  query,
  setQuery,
  reviewStatusFilter,
  setReviewStatusFilter,
  reviewRatingFilter,
  setReviewRatingFilter,
  reviewSort,
  setReviewSort,
  toolbarOpen,
  setToolbarOpen,
  selectedReviewIds,
  setSelectedReviewIds,
  refreshing,
  busyAction,
  loadData,
  resetReviewFilters,
  exportCsv,
  exportJson,
  exportSql,
  runAction,
}) {
  const pendingCount = Math.max(0, Number(stats?.total || 0) - Number(stats?.approved || 0));
  const visibleSelectedIds = items
    .map((item) => String(item?._id || item?.id || ""))
    .filter((reviewId) => selectedReviewIds.includes(reviewId));
  const allSelected = items.length > 0 && visibleSelectedIds.length === items.length;

  const toggleSelected = (reviewId) => {
    setSelectedReviewIds((current) => {
      if (current.includes(reviewId)) {
        return current.filter((entry) => entry !== reviewId);
      }
      return [...current, reviewId];
    });
  };

  const toggleSelectAll = () => {
    setSelectedReviewIds(allSelected ? [] : items.map((item) => String(item?._id || item?.id || "")));
  };

  const handleBatchApprove = async () => {
    const targets = items.filter((item) => visibleSelectedIds.includes(String(item?._id || item?.id || "")) && !item?.approved);
    for (const target of targets) {
      await runAction("moderateReview", target, null, true);
    }
    setSelectedReviewIds([]);
  };

  return (
    <section className="admin-reviews-workspace">
      <header className="admin-reviews-mobile-topbar">
        <div className="admin-reviews-mobile-topbar__title">
          <h1>Reviews</h1>
        </div>
        <button type="button" className="admin-reviews-mobile-topbar__filter" onClick={() => setToolbarOpen(true)} aria-label="Open review filters">
          Filter
        </button>
      </header>

      <section className="admin-reviews-desktop-toolbar">
        <div className="admin-reviews-search">
          <input
            className="field"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search reviews, products or users..."
            aria-label="Search reviews"
          />
        </div>
        <div className="admin-reviews-filters">
          <select className="field" value={reviewStatusFilter} onChange={(event) => setReviewStatusFilter(event.target.value)}>
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select className="field" value={reviewRatingFilter} onChange={(event) => setReviewRatingFilter(event.target.value)}>
            <option value="all">Rating: All</option>
            <option value="5">5 Stars</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
          </select>
          <select className="field" value={reviewSort} onChange={(event) => setReviewSort(event.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating-desc">Highest Rated</option>
            <option value="rating-asc">Lowest Rated</option>
          </select>
        </div>
        <div className="admin-reviews-desktop-toolbar__actions">
          <button type="button" className="ghost-button" onClick={() => loadData({ background: true })}>
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
          <button type="button" className="ghost-button" onClick={exportCsv}>Export CSV</button>
          <button type="button" className="ghost-button" onClick={exportJson}>Export JSON</button>
          <button type="button" className="ghost-button" onClick={exportSql}>Export SQL</button>
        </div>
      </section>

      <section className="admin-reviews-stats admin-reviews-stats--desktop">
        <article className="admin-reviews-stat-card">
          <span>TOTAL REVIEWS</span>
          <strong>{formatCount(stats?.total || 0)}</strong>
          <small>{items.length ? `${formatCount(items.length)} visible` : "No filtered results"}</small>
        </article>
        <article className="admin-reviews-stat-card">
          <span>APPROVED</span>
          <strong>{formatCount(stats?.approved || 0)}</strong>
          <div className="admin-reviews-stat-bar"><i style={{ width: `${Math.min(100, stats?.total ? (stats.approved / stats.total) * 100 : 0)}%` }} /></div>
        </article>
        <article className="admin-reviews-stat-card">
          <span>REJECTED</span>
          <strong>{formatCount(stats?.rejected || 0)}</strong>
          <div className="admin-reviews-stat-bar is-danger"><i style={{ width: `${Math.min(100, stats?.total ? (stats.rejected / stats.total) * 100 : 0)}%` }} /></div>
        </article>
        <article className="admin-reviews-stat-card">
          <span>AVERAGE RATING</span>
          <div className="admin-reviews-stat-rating">
            <strong>{Number(stats?.avgRating || 0).toFixed(1)}</strong>
            <div aria-hidden="true">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={star <= Math.round(Number(stats?.avgRating || 0)) ? "is-filled" : ""}>★</span>
              ))}
            </div>
          </div>
        </article>
      </section>

      <section className="admin-reviews-stats admin-reviews-stats--mobile">
        <article className="admin-reviews-stat-card">
          <span>TOTAL REVIEWS</span>
          <strong>{formatCount(stats?.total || 0)}</strong>
        </article>
        <article className="admin-reviews-stat-card">
          <span>PENDING MOD</span>
          <strong>{formatCount(pendingCount)}</strong>
        </article>
      </section>

      <section className="admin-reviews-queue">
        <header className="admin-reviews-queue__head">
          <h2>Moderation Queue</h2>
          <div className="admin-reviews-queue__batch">
            <button type="button" className="ghost-button" onClick={toggleSelectAll}>
              {allSelected ? "Clear Selection" : "Select All"}
            </button>
            <button type="button" className="primary-button" disabled={!visibleSelectedIds.length || !!busyAction} onClick={handleBatchApprove}>
              Batch Approve
            </button>
          </div>
        </header>

        {!items.length ? (
          <div className="admin-reviews-empty">
            <div className="admin-reviews-empty__icon" aria-hidden="true">★</div>
            <h3>No reviews to moderate</h3>
            <p>New customer feedback will appear here for approval, rejection, or removal.</p>
          </div>
        ) : (
          <>
            <div className="admin-reviews-list">
              {items.map((item) => {
                const reviewId = String(item?._id || item?.id || "");
                const productId = item?.product?._id || item?.product?.id || item?.productId || "";
                const reviewerName = item?.user?.name || item?.user?.email || "Customer";
                const productName = item?.product?.name || "Product";
                const isApproved = Boolean(item?.approved);
                const isBusy = busyAction === reviewId;
                const roundedRating = Math.max(0, Math.min(5, Math.round(Number(item?.rating || 0))));

                return (
                  <article key={reviewId} className={`admin-reviews-row ${selectedReviewIds.includes(reviewId) ? "is-selected" : ""}`}>
                    <div className="admin-reviews-row__check">
                      <input
                        type="checkbox"
                        checked={selectedReviewIds.includes(reviewId)}
                        onChange={() => toggleSelected(reviewId)}
                        aria-label={`Select review by ${reviewerName}`}
                      />
                    </div>
                    <div className="admin-reviews-row__meta">
                      <div className="admin-reviews-row__stars" aria-hidden="true">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={star <= roundedRating ? "is-filled" : ""}>★</span>
                        ))}
                      </div>
                      <span className={`admin-reviews-row__status ${isApproved ? "is-approved" : "is-pending"}`}>
                        {isApproved ? "Approved" : "Pending"}
                      </span>
                      <p>{formatDateTime(item?.createdAt)}</p>
                    </div>
                    <div className="admin-reviews-row__body">
                      <h3>
                        <span>{reviewerName}</span>
                        <i>on</i>
                        {productId ? <Link href={`/products/${productId}`}>{productName}</Link> : <strong>{productName}</strong>}
                      </h3>
                      <p>{item?.comment || "No review text."}</p>
                    </div>
                    <div className="admin-reviews-row__actions">
                      <div className="admin-reviews-row__action-buttons">
                        {!isApproved ? (
                          <button type="button" className="primary-button" disabled={isBusy} onClick={() => runAction("moderateReview", item, null, true)}>
                            Approve
                          </button>
                        ) : null}
                        <button type="button" className="ghost-button is-review-reject" disabled={isBusy} onClick={() => runAction("moderateReview", item, null, false)}>
                          {isApproved ? "Reject" : "Reject"}
                        </button>
                      </div>
                      <div className="admin-reviews-row__links">
                        {productId ? (
                          <Link className="admin-reviews-row__link" href={`/products/${productId}`}>
                            Open Product
                          </Link>
                        ) : null}
                        <button type="button" className="admin-reviews-row__delete" disabled={isBusy} onClick={() => runAction("deleteReview", item)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            <footer className="admin-reviews-pagination">
              <p>Showing {items.length ? `1-${items.length}` : 0} of {formatCount(stats?.total || 0)} reviews</p>
              <div>
                <button type="button" className="ghost-button" disabled>1</button>
              </div>
            </footer>
          </>
        )}
      </section>

      <div className={`admin-reviews-mobile-sheet ${toolbarOpen ? "is-open" : ""}`} aria-hidden={!toolbarOpen}>
        <button type="button" className={`admin-reviews-mobile-sheet__overlay ${toolbarOpen ? "is-open" : ""}`} onClick={() => setToolbarOpen(false)} aria-label="Close review filters" />
        <section className="admin-reviews-mobile-sheet__panel">
          <div className="admin-reviews-mobile-sheet__handle" />
          <div className="admin-reviews-mobile-sheet__head">
            <h2>Filter Reviews</h2>
            <button type="button" onClick={() => setToolbarOpen(false)}>Done</button>
          </div>
          <div className="admin-reviews-mobile-sheet__content">
            <label>
              <span>Search</span>
              <input className="field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by product or user..." />
            </label>
            <label>
              <span>Moderation Status</span>
              <select className="field" value={reviewStatusFilter} onChange={(event) => setReviewStatusFilter(event.target.value)}>
                <option value="all">All</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </label>
            <label>
              <span>Minimum Rating</span>
              <select className="field" value={reviewRatingFilter} onChange={(event) => setReviewRatingFilter(event.target.value)}>
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
              </select>
            </label>
            <label>
              <span>Sort Order</span>
              <select className="field" value={reviewSort} onChange={(event) => setReviewSort(event.target.value)}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="rating-desc">Highest Rated</option>
                <option value="rating-asc">Lowest Rated</option>
              </select>
            </label>
            <div className="admin-reviews-mobile-sheet__actions">
              <button type="button" className="ghost-button" onClick={resetReviewFilters}>Reset</button>
              <button type="button" className="ghost-button" onClick={() => loadData({ background: true })}>{refreshing ? "Refreshing..." : "Refresh"}</button>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

function buildPageChips(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const keep = new Set([1, 2, total - 1, total, current - 1, current, current + 1]);
  const sorted = [...keep].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
  const chips = [];
  let previous = 0;
  for (const page of sorted) {
    if (previous && page - previous > 1) chips.push("...");
    chips.push(page);
    previous = page;
  }
  return chips;
}

function ReviewsWorkspaceStitch({
  items,
  stats,
  query,
  setQuery,
  reviewStatusFilter,
  setReviewStatusFilter,
  reviewRatingFilter,
  setReviewRatingFilter,
  reviewSort,
  setReviewSort,
  toolbarOpen,
  setToolbarOpen,
  selectedReviewIds,
  setSelectedReviewIds,
  refreshing,
  busyAction,
  loadData,
  resetReviewFilters,
  exportCsv,
  exportJson,
  exportSql,
  runAction,
}) {
  const totalReviews = Number(stats?.total || 0);
  const approvedReviews = Number(stats?.approved || 0);
  const rejectedReviews = Number(stats?.rejected || 0);
  const averageRating = Number(stats?.avgRating || 0);
  const pendingCount = Math.max(0, totalReviews - approvedReviews);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const pageSize = 15;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pagedItems = items.slice((safePage - 1) * pageSize, safePage * pageSize);
  const pageChips = buildPageChips(safePage, totalPages);

  const visibleSelectedIds = pagedItems
    .map((item) => String(item?._id || item?.id || ""))
    .filter((reviewId) => selectedReviewIds.includes(reviewId));
  const allSelected = pagedItems.length > 0 && visibleSelectedIds.length === pagedItems.length;

  const toggleSelected = (reviewId) => {
    setSelectedReviewIds((current) => {
      if (current.includes(reviewId)) {
        return current.filter((entry) => entry !== reviewId);
      }
      return [...current, reviewId];
    });
  };

  const toggleSelectAll = () => {
    setSelectedReviewIds(allSelected ? [] : pagedItems.map((item) => String(item?._id || item?.id || "")));
  };

  const handleBatchApprove = async () => {
    const targets = pagedItems.filter((item) => visibleSelectedIds.includes(String(item?._id || item?.id || "")) && !item?.approved);
    for (const target of targets) {
      await runAction("moderateReview", target, null, true);
    }
    setSelectedReviewIds([]);
  };

  const renderStars = (rating, className = "") => {
    const rounded = Math.max(0, Math.min(5, Math.round(Number(rating || 0))));
    return (
      <div className={className} aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rounded ? "is-filled" : ""}>★</span>
        ))}
      </div>
    );
  };

  return (
    <section className="admin-reviews-workspace">
      <section className="admin-reviews-desktop-shell">
        <header className="admin-reviews-desktop-head">
          <h1>Reviews</h1>
          <p>Moderate and manage customer product reviews.</p>
        </header>
        <header className="admin-reviews-desktop-toolbar">
          <div className="admin-reviews-desktop-toolbar__search">
            <input
              className="field"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search reviews..."
              aria-label="Search reviews"
            />
          </div>
          <div className="admin-reviews-desktop-toolbar__filters">
            <select className="field" value={reviewStatusFilter} onChange={(event) => setReviewStatusFilter(event.target.value)}>
              <option value="all">All moderation</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select className="field" value={reviewRatingFilter} onChange={(event) => setReviewRatingFilter(event.target.value)}>
              <option value="all">All ratings</option>
              <option value="5">5 stars</option>
              <option value="4">4+ stars</option>
              <option value="3">3+ stars</option>
              <option value="2">2+ stars</option>
            </select>
            <select className="field" value={reviewSort} onChange={(event) => setReviewSort(event.target.value)}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="rating-desc">Rating high-low</option>
              <option value="rating-asc">Rating low-high</option>
            </select>
          </div>
          <div className="admin-reviews-desktop-toolbar__actions">
            <button type="button" className="admin-reviews-icon-button" disabled={refreshing} onClick={() => loadData({ background: true })} aria-label="Refresh reviews">
              <AdminProductsIcon name="refresh" />
            </button>
            <div className="admin-reviews-export-group">
              <button type="button" onClick={exportCsv}>CSV</button>
              <button type="button" onClick={exportJson}>JSON</button>
              <button type="button" onClick={exportSql}>SQL</button>
            </div>
          </div>
        </header>

        <section className="admin-reviews-desktop-stats">
          <article className="admin-reviews-desktop-stat">
            <span>Total Reviews</span>
            <strong>{formatCount(totalReviews)}</strong>
            <small>{items.length ? `${formatCount(items.length)} visible` : "No filtered records"}</small>
          </article>
          <article className="admin-reviews-desktop-stat">
            <span>Approved</span>
            <strong>{formatCount(approvedReviews)}</strong>
            <div className="admin-reviews-progress"><i style={{ width: `${totalReviews ? (approvedReviews / totalReviews) * 100 : 0}%` }} /></div>
          </article>
          <article className="admin-reviews-desktop-stat">
            <span>Rejected</span>
            <strong>{formatCount(rejectedReviews)}</strong>
            <div className="admin-reviews-progress is-danger"><i style={{ width: `${totalReviews ? (rejectedReviews / totalReviews) * 100 : 0}%` }} /></div>
          </article>
          <article className="admin-reviews-desktop-stat">
            <span>Average Rating</span>
            <strong>{averageRating.toFixed(1)}</strong>
            {renderStars(averageRating, "admin-reviews-stars")}
          </article>
        </section>

        <section className="admin-reviews-desktop-queue">
          <header className="admin-reviews-desktop-queue__head">
            <h2><AdminProductsIcon name="tune" />Moderation Queue</h2>
            <div className="admin-reviews-desktop-queue__tools">
              <button type="button" className="ghost-button" onClick={toggleSelectAll}>
                {allSelected ? "Clear Selection" : "Select All"}
              </button>
              <button type="button" className="primary-button" disabled={!visibleSelectedIds.length || !!busyAction} onClick={handleBatchApprove}>
                Batch Approve
              </button>
            </div>
          </header>

          {!items.length ? (
            <div className="admin-reviews-empty-state">
              <h3>No records yet</h3>
              <p>When data is available, it will appear here for admin management.</p>
            </div>
          ) : (
            <>
              <div className="admin-reviews-desktop-list">
                {pagedItems.map((item) => {
                  const reviewId = String(item?._id || item?.id || "");
                  const productId = item?.product?._id || item?.product?.id || item?.productId || "";
                  const reviewerName = item?.user?.name || item?.user?.email || "Customer";
                  const productName = item?.product?.name || "Product";
                  const isApproved = Boolean(item?.approved);
                  const isBusy = busyAction === reviewId;

                  return (
                    <article key={reviewId} className="admin-reviews-desktop-row">
                      <div className="admin-reviews-desktop-row__toggle">
                        <input
                          type="checkbox"
                          checked={selectedReviewIds.includes(reviewId)}
                          onChange={() => toggleSelected(reviewId)}
                          aria-label={`Select review by ${reviewerName}`}
                        />
                      </div>
                      <div className="admin-reviews-desktop-row__content">
                        <div className="admin-reviews-desktop-row__meta">
                          {renderStars(item?.rating, "admin-reviews-stars")}
                          <span className={`admin-reviews-status-pill ${isApproved ? "is-approved" : "is-rejected"}`}>
                            {isApproved ? "Approved" : "Pending"}
                          </span>
                          <time>{formatDateTime(item?.createdAt)}</time>
                        </div>
                        <div className="admin-reviews-desktop-row__body">
                          <h3>
                            {reviewerName}
                            <i> on </i>
                            {productId ? <Link href={`/products/${productId}`}>{productName}</Link> : <strong>{productName}</strong>}
                          </h3>
                          <blockquote>{item?.comment || "No review text."}</blockquote>
                        </div>
                      </div>
                      <div className="admin-reviews-desktop-row__actions">
                        <div className="admin-reviews-desktop-row__buttons">
                          <button
                            type="button"
                            className="admin-reviews-row-button is-reject"
                            disabled={isBusy}
                            onClick={() => runAction("moderateReview", item, null, false)}
                          >
                            Reject
                          </button>
                          {!isApproved ? (
                            <button
                              type="button"
                              className="admin-reviews-row-button is-approve"
                              disabled={isBusy}
                              onClick={() => runAction("moderateReview", item, null, true)}
                            >
                              Approve
                            </button>
                          ) : null}
                        </div>
                        <div className="admin-reviews-desktop-row__links">
                          {productId ? <Link className="admin-reviews-inline-link" href={`/products/${productId}`}><AdminProductsIcon name="external" />Open Product</Link> : null}
                          <button type="button" className="admin-reviews-inline-link is-danger" disabled={isBusy} onClick={() => runAction("deleteReview", item)}>
                            <AdminProductsIcon name="delete" />Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
              <footer className="admin-reviews-desktop-pagination">
                <p>
                  Showing {items.length ? `${(safePage - 1) * pageSize + 1}-${Math.min(safePage * pageSize, items.length)}` : 0} of {formatCount(items.length)} reviews
                </p>
                <div className="admin-reviews-pagination-nav">
                  <button type="button" className="admin-reviews-page-chip is-nav" disabled={safePage <= 1} onClick={() => setPage(safePage - 1)} aria-label="Previous page">
                    <AdminProductsIcon name="back" />
                  </button>
                  {pageChips.map((chip, index) => (
                    chip === "..." ? (
                      <span key={`ellipsis-${index}`} className="admin-reviews-page-ellipsis">...</span>
                    ) : (
                      <button
                        key={chip}
                        type="button"
                        className={`admin-reviews-page-chip ${chip === safePage ? "is-active" : ""}`}
                        onClick={() => setPage(chip)}
                      >
                        {chip}
                      </button>
                    )
                  ))}
                  <button type="button" className="admin-reviews-page-chip is-nav" disabled={safePage >= totalPages} onClick={() => setPage(safePage + 1)} aria-label="Next page">
                    <AdminProductsIcon name="chevron" />
                  </button>
                </div>
              </footer>
            </>
          )}
        </section>
      </section>

      <section className="admin-reviews-mobile-shell">
        <header className="admin-reviews-mobile-topbar">
          <button type="button" onClick={() => setDrawerOpen(true)} aria-label="Open navigation menu"><AdminProductsIcon name="menu" /></button>
          <h1>Reviews</h1>
          <button type="button" className="admin-reviews-mobile-topbar__filter" onClick={() => setToolbarOpen(true)} aria-label="Open review filters">
            <AdminProductsIcon name="tune" />
          </button>
        </header>

        <section className="admin-reviews-mobile-stats">
          <article className="admin-reviews-mobile-stat">
            <span>Total Reviews</span>
            <strong>{formatCount(totalReviews)}</strong>
          </article>
          <article className="admin-reviews-mobile-stat">
            <span>Pending Mod</span>
            <strong>{formatCount(pendingCount)}</strong>
          </article>
        </section>

        <div className="admin-reviews-mobile-search">
          <input
            className="field"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search reviews..."
            aria-label="Search reviews"
          />
        </div>

        {!items.length ? (
          <div className="admin-reviews-empty-state is-mobile">
            <h3>No records yet</h3>
            <p>When data is available, it will appear here for admin management.</p>
          </div>
        ) : (
          <div className="admin-reviews-mobile-list">
            {items.map((item) => {
              const reviewId = String(item?._id || item?.id || "");
              const productId = item?.product?._id || item?.product?.id || item?.productId || "";
              const reviewerName = item?.user?.name || item?.user?.email || "Customer";
              const productName = item?.product?.name || "Product";
              const isApproved = Boolean(item?.approved);
              const isBusy = busyAction === reviewId;

              return (
                <article key={reviewId} className="admin-reviews-mobile-card">
                  <div className="admin-reviews-mobile-card__head">
                    <div>
                      <h3>{productName}</h3>
                      <p>{reviewerName}</p>
                    </div>
                    <span className={`admin-reviews-status-pill ${isApproved ? "is-approved" : "is-rejected"}`}>
                      {isApproved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <div className="admin-reviews-mobile-card__rating">
                    {renderStars(item?.rating, "admin-reviews-stars")}
                    <time>{formatDate(item?.createdAt)}</time>
                  </div>
                  <blockquote>{item?.comment || "No review text."}</blockquote>
                  <div className="admin-reviews-mobile-card__actions">
                    {!isApproved ? (
                      <>
                        <div className="admin-reviews-mobile-card__buttons">
                          <button
                            type="button"
                            className="admin-reviews-row-button is-approve"
                            disabled={isBusy}
                            onClick={() => runAction("moderateReview", item, null, true)}
                          >
                            <AdminProductsIcon name="check" />Approve
                          </button>
                          <button
                            type="button"
                            className="admin-reviews-row-button is-reject"
                            disabled={isBusy}
                            onClick={() => runAction("moderateReview", item, null, false)}
                          >
                            <AdminProductsIcon name="delete" />Reject
                          </button>
                        </div>
                        {productId ? (
                          <Link className="admin-reviews-mobile-card__open" href={`/products/${productId}`}>
                            <AdminProductsIcon name="external" />Open Product
                          </Link>
                        ) : null}
                      </>
                    ) : (
                      <div className="admin-reviews-mobile-card__links">
                        {productId ? <Link className="admin-reviews-inline-link" href={`/products/${productId}`}>Product Details</Link> : null}
                        <button type="button" className="admin-reviews-inline-link is-danger" disabled={isBusy} onClick={() => runAction("deleteReview", item)}>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <div className={`admin-reviews-mobile-sheet ${toolbarOpen ? "is-open" : ""}`} aria-hidden={!toolbarOpen}>
        <button type="button" className={`admin-reviews-mobile-sheet__overlay ${toolbarOpen ? "is-open" : ""}`} onClick={() => setToolbarOpen(false)} aria-label="Close review filters" />
        <section className="admin-reviews-mobile-sheet__panel">
          <div className="admin-reviews-mobile-sheet__handle" />
          <div className="admin-reviews-mobile-sheet__head">
            <h2>Filter Reviews</h2>
            <button type="button" onClick={() => setToolbarOpen(false)}>Done</button>
          </div>
          <div className="admin-reviews-mobile-sheet__content">
            <label>
              <span>Search</span>
              <input className="field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by product or user..." />
            </label>
            <label>
              <span>Moderation Status</span>
              <select className="field" value={reviewStatusFilter} onChange={(event) => setReviewStatusFilter(event.target.value)}>
                <option value="all">All</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </label>
            <label>
              <span>Minimum Rating</span>
              <div className="admin-reviews-mobile-sheet__ratings">
                {[
                  ["all", "All"],
                  ["5", "5★"],
                  ["4", "4+"],
                  ["3", "3+"],
                  ["2", "2+"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={reviewRatingFilter === value ? "is-active" : ""}
                    onClick={() => setReviewRatingFilter(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </label>
            <label>
              <span>Sort Order</span>
              <select className="field" value={reviewSort} onChange={(event) => setReviewSort(event.target.value)}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="rating-desc">Highest Rated</option>
                <option value="rating-asc">Lowest Rated</option>
              </select>
            </label>
            <div className="admin-reviews-mobile-sheet__actions">
              <button type="button" className="ghost-button" onClick={resetReviewFilters}>Reset</button>
              <button type="button" className="ghost-button" onClick={() => loadData({ background: true })}>{refreshing ? "Refreshing..." : "Refresh"}</button>
            </div>
          </div>
        </section>
      </div>

      <MobileNavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </section>
  );
}

function ProductForm({ initial, onSubmit, submitLabel, busy }) {
  const [category, setCategory] = useState(initial?.category || "laptops");
  const subCategories = SUBCATEGORY_BY_CATEGORY[category] || SUBCATEGORY_BY_CATEGORY.laptops;
  const [subCategory, setSubCategory] = useState(initial?.subCategory || initial?.brand || subCategories[0]);
  const [imageUrlSlots, setImageUrlSlots] = useState(() => buildInitialImageUrlSlots(initial));
  const [uploadSlotCount, setUploadSlotCount] = useState(2);
  const resolvedSubCategory = subCategories.includes(subCategory) ? subCategory : subCategories[0];
  const [selectedSections, setSelectedSections] = useState(() => {
    const existing = Array.isArray(initial?.homeSections) ? initial.homeSections : [];
    return [...new Set(existing.filter(Boolean).map(canonicalHomeSectionKey).filter(Boolean))];
  });
  const [discountPreset, setDiscountPreset] = useState(resolveDiscountPreset(initial));
  const initialUpgradeSpecs = useMemo(() => normalizeProductUpgradeSpecs(initial?.upgradeSpecs), [initial?.upgradeSpecs]);
  const [upgradeEditorOpen, setUpgradeEditorOpen] = useState(false);
  const [upgradeEnabled, setUpgradeEnabled] = useState(Boolean(initialUpgradeSpecs.enabled));
  const [ramOptions, setRamOptions] = useState(() => buildUpgradeDraft(initialUpgradeSpecs.ramOptions));
  const [storageOptions, setStorageOptions] = useState(() => buildUpgradeDraft(initialUpgradeSpecs.storageOptions));
  const currentProductImages = useMemo(() => buildCurrentProductImages(initial), [initial]);

  function toggleHomeSection(key) {
    setSelectedSections((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key]
    );
  }

  function updateImageUrlSlot(index, value) {
    setImageUrlSlots((current) => current.map((entry, slotIndex) => (slotIndex === index ? value : entry)));
  }

  function addImageUrlSlot() {
    setImageUrlSlots((current) => (current.length >= MAX_PRODUCT_IMAGES ? current : [...current, ""]));
  }

  function addUploadSlot() {
    setUploadSlotCount((current) => (current >= MAX_PRODUCT_IMAGES ? current : current + 1));
  }

  const normalizedImageSlots = imageUrlSlots
    .map((value) => String(value || "").trim())
    .slice(0, MAX_PRODUCT_IMAGES);
  const mainImageUrl = normalizedImageSlots[0] || "";
  const galleryImageUrls = normalizedImageSlots.slice(1).filter(Boolean);
  const retainedImageUrls = normalizedImageSlots.filter(Boolean);

  return (
    <form id="admin-product-editor-form" className="admin-form admin-product-editor-form" onSubmit={onSubmit}>
      <ProductEditorSection title="Product Basics" icon="box">
        <div className="admin-product-editor-fields admin-product-editor-fields--basics">
          <label><span>Product Name <b>*</b></span><input className="field" name="name" defaultValue={initial?.name || ""} placeholder="e.g. MacBook Pro 14-inch M3" required /></label>
          <label><span>Card Description (Short)</span><input className="field" name="short_description" defaultValue={initial?.short_description || ""} placeholder="Brief summary for catalog cards..." /></label>
          <label className="is-wide"><span>Full Product Description <b>*</b></span><textarea className="field" name="description" defaultValue={initial?.description || ""} placeholder="Detailed technical specifications, condition, performance, included accessories and warranty..." rows={6} required /></label>
          <label><span>Category</span><select className="field" name="category" value={category} onChange={(event) => setCategory(event.target.value)}>{PRODUCT_CATEGORIES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label><span>Brand / Subcategory</span><select className="field" name="subCategory" value={resolvedSubCategory} onChange={(event) => setSubCategory(event.target.value)}>{subCategories.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
        </div>
        <input type="hidden" name="brand" value={resolvedSubCategory} />
      </ProductEditorSection>

      <ProductEditorSection title="Pricing & Stock" icon="payment">
        <div className="admin-product-editor-fields admin-product-editor-fields--pricing">
          <label><span>Base Price (GH₵) <b>*</b></span><input className="field" name="price" defaultValue={initial?.price || ""} placeholder="0.00" type="number" min="0" step="0.01" required /></label>
          <label><span>Stock Count <b>*</b></span><input className="field" name="countInStock" defaultValue={initial?.countInStock ?? ""} placeholder="0" type="number" min="0" required /></label>
          <label><span>Discount Price</span><input className="field" name="discountPrice" defaultValue={initial?.discountPrice ?? ""} placeholder="Optional" type="number" min="0" step="0.01" /></label>
          <label><span>Discount Duration</span><select className="field" name="discountPreset" value={discountPreset} onChange={(event) => setDiscountPreset(event.target.value)}>{PRODUCT_DISCOUNT_PRESET_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        </div>
      </ProductEditorSection>

      <ProductEditorSection title="Product Images" meta={`${Math.min(currentProductImages.length, MAX_PRODUCT_IMAGES)} of ${MAX_PRODUCT_IMAGES}`} icon="image">
        <input type="hidden" name="imageUrls" value={galleryImageUrls.join(",")} />
        {initial ? <input type="hidden" name="existingImages" value={retainedImageUrls.join(",")} /> : null}
        <section className="admin-product-images">
          <div className="admin-product-images__head"><div><h3>Web Image URLs</h3><p>Main image stays first. Add up to {MAX_PRODUCT_IMAGES} product images total.</p></div>{imageUrlSlots.length < MAX_PRODUCT_IMAGES ? <button type="button" className="ghost-button" onClick={addImageUrlSlot}>+ Add Image URL</button> : null}</div>
          <div className="admin-product-images__grid">
            {imageUrlSlots.map((value, index) => <label key={`image-url-${index}`} className="admin-image-slot"><span>{index === 0 ? "Main Image URL" : `Image ${index + 1} URL`}</span><input className="field" name={index === 0 ? "image_url" : undefined} value={value} onChange={(event) => updateImageUrlSlot(index, event.target.value)} placeholder={index === 0 ? "https://..." : `Additional image ${index + 1} URL`} /></label>)}
          </div>
          {currentProductImages.length ? <div className="admin-product-images__current"><strong>Current Saved Images</strong><div className="admin-product-images__preview-grid">{currentProductImages.map((image, index) => <div key={`${image}-${index}`} className="admin-product-images__preview-card"><StableImage src={resolveProductImage(image)} alt={`Product image ${index + 1}`} width={120} height={120} /><small>{index === 0 ? "Current main image" : `Current image ${index + 1}`}</small><code>{image}</code></div>)}</div></div> : null}
        </section>
        <section className="admin-product-images admin-product-images--uploads">
          <div className="admin-product-images__head"><div><h3>Image Uploads</h3><p>JPG, PNG, WEBP, GIF, BMP, HEIC or HEIF. Maximum {MAX_PRODUCT_IMAGES} files.</p></div>{uploadSlotCount < MAX_PRODUCT_IMAGES ? <button type="button" className="ghost-button" onClick={addUploadSlot}>+ Add More Images</button> : null}</div>
          <div className="admin-product-images__grid">{Array.from({ length: uploadSlotCount }).map((_, index) => <label key={`image-upload-${index}`} className="admin-image-upload"><AdminProductsIcon name="image" /><span>{index === 0 ? "Main image upload" : `Image ${index + 1} upload`}</span><input className="field" name="images" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/bmp,image/heic,image/heif" /></label>)}</div>
        </section>
      </ProductEditorSection>

      <ProductEditorSection title="Homepage Placement" icon="grid">
        <input type="hidden" name="homeSections" value={selectedSections.join(",")} />
        <fieldset className="admin-check-group"><legend>Select every homepage collection where this product should appear.</legend><div className="admin-check-grid">{HOME_SECTION_OPTIONS.map(([key, label]) => <label key={key} className="admin-check admin-check--box"><input type="checkbox" checked={selectedSections.includes(key)} onChange={() => toggleHomeSection(key)} /><span>{label}</span></label>)}</div></fieldset>
      </ProductEditorSection>

      <ProductEditorSection title="Specifications & Upgrades" icon="settings">
        <label className="admin-product-editor-specs"><span>Technical Specifications (Comma Separated)</span><textarea className="field" name="specs" defaultValue={initial?.specs ? Object.entries(initial.specs).map(([key, value]) => `${key}:${value}`).join(", ") : ""} placeholder="Processor:i5, RAM:8GB, Storage:512GB SSD, Display:14-inch FHD" rows={5} /></label>
        <label className="admin-check admin-product-editor-featured"><input type="checkbox" name="isFeatured" defaultChecked={Boolean(initial?.isFeatured)} /><span><strong>Feature this product</strong><small>Highlight this product in catalog and promotional surfaces.</small></span></label>
        <section className="admin-collapsible admin-upgrade-panel">
        <button
          type="button"
          className="admin-collapsible__header"
          onClick={() => setUpgradeEditorOpen((current) => !current)}
          aria-expanded={upgradeEditorOpen}
        >
          <h2>Upgrade Specs (Optional)</h2>
          <span className="admin-collapsible__icon">{upgradeEditorOpen ? "-" : "+"}</span>
        </button>
        {upgradeEditorOpen ? (
          <div className="admin-collapsible__body admin-upgrade-panel__body">
            <label className="admin-check">
              <input
                type="checkbox"
                checked={upgradeEnabled}
                onChange={(event) => setUpgradeEnabled(event.target.checked)}
              />
              <span>Enable upgrade options for this product</span>
            </label>
            <p className="admin-upgrade-panel__hint">
              Use this only when a product has optional RAM or storage upgrades. Price changes are added on top of the current live product price.
            </p>
            <input
              type="hidden"
              name="upgradeSpecs"
              value={serializeUpgradeSpecs(upgradeEnabled, ramOptions, storageOptions)}
            />
            {upgradeEnabled ? (
              <div className="admin-upgrade-panel__grid">
                <UpgradeOptionsEditor
                  title="RAM options"
                  items={ramOptions}
                  onChange={setRamOptions}
                  addLabel="Add RAM option"
                />
                <UpgradeOptionsEditor
                  title="Storage options"
                  items={storageOptions}
                  onChange={setStorageOptions}
                  addLabel="Add storage option"
                />
              </div>
            ) : null}
          </div>
        ) : (
          <input
            type="hidden"
            name="upgradeSpecs"
            value={serializeUpgradeSpecs(upgradeEnabled, ramOptions, storageOptions)}
          />
        )}
        </section>
      </ProductEditorSection>

      <footer className="admin-product-editor-submit"><p>Changes are saved to the live catalog.</p><button className="primary-button" disabled={busy}><AdminProductsIcon name="check" />{busy ? "Saving..." : submitLabel}</button></footer>
    </form>
  );
}

function BannerForm({ initial, onSubmit, busy, submitLabel = "Create Banner" }) {
  const categoryOptions = useMemo(() => PRODUCT_CATEGORIES.map(([value, label]) => ({ value, label })), []);
  const initialCategory = normalizeText(initial?.linkCategory).toLowerCase();
  const hasInitialCategory = categoryOptions.some((option) => option.value === initialCategory);
  const [linkMode, setLinkMode] = useState(() => {
    if (normalizeText(initial?.link)) return "custom";
    if (normalizeText(initial?.linkCategory)) return "category";
    return "none";
  });
  const [selectedCategory, setSelectedCategory] = useState(hasInitialCategory ? initialCategory : "laptops");
  const [selectedSubCategory, setSelectedSubCategory] = useState(() => {
    const value = normalizeText(initial?.linkSubCategory).toLowerCase();
    return value || "all";
  });
  const subCategoryOptions = useMemo(() => {
    const options = BRANDS_BY_CATEGORY[normalizeText(selectedCategory)] || [];
    const normalized = options
      .map((option) => String(option || "").trim())
      .filter(Boolean)
      .map((option) => ({ value: option.toLowerCase(), label: option }));
    return [{ value: "all", label: "All subcategories" }, ...normalized];
  }, [selectedCategory]);
  const resolvedSubCategory = subCategoryOptions.some((option) => option.value === selectedSubCategory)
    ? selectedSubCategory
    : "all";

  return (
    <form className="admin-form admin-banner-form" onSubmit={onSubmit}>
      <div className="admin-banner-form__group">
        <label className="admin-banner-form__label">Banner Image Assets</label>
        <input className="field" name="imageUrl" defaultValue={initial?.imageUrl || ""} placeholder="Image URL (e.g. https://cdn.deetech.gh/hero.jpg)" />
        <label className="admin-banner-form__dropzone">
          <AdminProductsIcon name="upload" />
          <span>Click to upload image (16:9 recommended)</span>
          <input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/bmp,image/heic,image/heif" />
        </label>
      </div>

      <div className="admin-banner-form__group">
        <label className="admin-banner-form__label">Link Destination</label>
        <div className="admin-banner-form__segmented" role="group" aria-label="Banner link mode">
          <button type="button" className={linkMode === "none" ? "is-active" : ""} onClick={() => setLinkMode("none")}>None</button>
          <button type="button" className={linkMode === "category" ? "is-active" : ""} onClick={() => setLinkMode("category")}>Category</button>
          <button type="button" className={linkMode === "custom" ? "is-active" : ""} onClick={() => setLinkMode("custom")}>Custom URL</button>
        </div>

        {linkMode === "category" ? (
          <div className="admin-banner-form__category-row">
            <select className="field" name="linkCategory" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <select
              className="field"
              name="linkSubCategory"
              value={resolvedSubCategory}
              onChange={(event) => setSelectedSubCategory(event.target.value)}
            >
              {subCategoryOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        ) : null}

        {linkMode === "custom" ? (
          <input className="field" name="link" defaultValue={initial?.link || ""} placeholder="https://external-link.com" />
        ) : null}
        {linkMode !== "category" ? <input type="hidden" name="linkCategory" value="" /> : null}
        {linkMode !== "category" ? <input type="hidden" name="linkSubCategory" value="" /> : null}
        {linkMode !== "custom" ? <input type="hidden" name="link" value="" /> : null}
      </div>

      <div className="admin-banner-form__group">
        <label className="admin-banner-form__label">Display Settings</label>
        <input className="field admin-banner-form__order" name="order" placeholder="Order Number (e.g. 01)" type="number" defaultValue={initial?.order ?? 0} />
      </div>

      <button className="primary-button admin-banner-form__submit" disabled={busy}>{busy ? "Saving..." : submitLabel}</button>
    </form>
  );
}

function DiscountForm({ onSubmit, busy }) {
  return (
    <form className="admin-form admin-form--inline" onSubmit={onSubmit}>
      <input className="field" name="percent" placeholder="Percent 2-10" type="number" min="2" max="10" required />
      <input className="field" name="count" placeholder="How many" type="number" min="1" max="50" defaultValue="1" />
      <button className="primary-button" disabled={busy}>{busy ? "Generating..." : "Generate Codes"}</button>
    </form>
  );
}

function AffiliateSettingsForm({ settings, onSubmit, busy }) {
  const thresholds = settings?.tierThresholds || {};
  return (
    <form className="admin-form admin-form--inline admin-affiliate-settings-form" onSubmit={onSubmit}>
      <label><span>Default Commission Rate</span><input className="field" name="defaultCommissionRate" type="number" min="0" max="100" step="0.1" defaultValue={settings?.defaultCommissionRate ?? 5} /></label>
      <div className="admin-affiliate-thresholds">
        <span>Tier Thresholds (deals)</span>
        <label><small>Bronze</small><input className="field" name="bronze" type="number" min="1" defaultValue={thresholds.bronze ?? 5} /></label>
        <label><small>Silver</small><input className="field" name="silver" type="number" min="2" defaultValue={thresholds.silver ?? 15} /></label>
        <label><small>Gold</small><input className="field" name="gold" type="number" min="3" defaultValue={thresholds.gold ?? 30} /></label>
      </div>
      <button className="primary-button" disabled={busy}>{busy ? "Saving..." : "Update Affiliate Settings"}</button>
    </form>
  );
}

function DashboardView({ payload }) {
  const stats = [
    ["Total Users", payload?.totalUsers || 0],
    ["Products", payload?.totalProducts || 0],
    ["Orders", payload?.totalOrders || 0],
    ["Paid Revenue", formatCurrency(Number(payload?.totalRevenue || 0))],
  ];
  return (
    <div className="admin-stat-grid">
      {stats.map(([label, value]) => (
        <article key={label} className="admin-stat-card panel">
          <span>{label}</span>
          <strong>{value}</strong>
          <p>Live backend summary</p>
        </article>
      ))}
    </div>
  );
}

function AdminStatusSelect({ value, options, onChange, label }) {
  return (
    <label className="admin-inline-control">
      <span>{label}</span>
      <select className="field" value={value || ""} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function AdminOrdersIcon({ name }) {
  const paths = {
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></>,
    refresh: <><path d="M20 11a8 8 0 1 0-2.3 5.7" /><path d="M20 5v6h-6" /></>,
    download: <><path d="M12 3v12" /><path d="m8 11 4 4 4-4" /><path d="M5 20h14" /></>,
    sync: <><path d="M7 7h9l-2.5-2.5" /><path d="M17 17H8l2.5 2.5" /><path d="M18 7a7 7 0 0 1 1 7" /><path d="M6 17a7 7 0 0 1-1-7" /></>,
    tune: <><path d="M4 7h10" /><path d="M18 7h2" /><circle cx="16" cy="7" r="2" /><path d="M4 17h2" /><path d="M10 17h10" /><circle cx="8" cy="17" r="2" /></>,
    bag: <><path d="M6 8h12l-1 12H7L6 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
    payment: <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18" /><path d="M7 15h3" /></>,
  };
  return (
    <svg className="admin-orders-icon" viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {paths[name] || paths.search}
      </g>
    </svg>
  );
}

function AdminProductsIcon({ name }) {
  const paths = {
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></>,
    tune: <><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></>,
    refresh: <><path d="M20 11a8 8 0 1 0-2.3 5.7" /><path d="M20 5v6h-6" /></>,
    download: <><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 20h14" /></>,
    edit: <><path d="M4 20h4l11-11-4-4L4 16v4Z" /><path d="m13.5 6.5 4 4" /></>,
    delete: <><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" /></>,
    chevron: <><path d="m9 6 6 6-6 6" /></>,
    box: <><path d="m4 8 8-4 8 4v9l-8 4-8-4V8Z" /><path d="m4 8 8 4 8-4M12 12v9" /></>,
    image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m5 17 4.5-4.5 3 3 2-2L19 18" /></>,
    grid: <><rect x="4" y="4" width="6" height="6" /><rect x="14" y="4" width="6" height="6" /><rect x="4" y="14" width="6" height="6" /><rect x="14" y="14" width="6" height="6" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1A7 7 0 0 0 15 6l-.3-2.6h-4L10.5 6A7 7 0 0 0 9 7.1l-2.4-1-2 3.4L6.7 11a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1A7 7 0 0 0 10.5 18l.3 2.6h4L15 18a7 7 0 0 0 1.5-1.1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1Z" /></>,
    check: <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></>,
    copy: <><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></>,
    person: <><circle cx="12" cy="8" r="3.5" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></>,
    external: <><path d="M9 6H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-4" /><path d="M13 4h7v7M20 4 11 13" /></>,
    upload: <><path d="M7 18a4 4 0 0 1-1-7.9A5 5 0 0 1 16 7a4.5 4.5 0 0 1 1 8.9" /><path d="M12 11v8M9 14l3-3 3 3" /></>,
    back: <><path d="m15 18-6-6 6-6" /></>,
    sync: <><path d="M7 7h9l-2.5-2.5M17 17H8l2.5 2.5M18 7a7 7 0 0 1 1 7M6 17a7 7 0 0 1-1-7" /></>,
  };
  return (
    <svg className="admin-products-icon" viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {paths[name] || paths.box}
      </g>
    </svg>
  );
}

function AdminUsersIcon({ name }) {
  const paths = {
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></>,
    filter: <><path d="M4 6h16l-6 7v5l-4 2v-7L4 6Z" /></>,
    refresh: <><path d="M20 11a8 8 0 1 0-2.3 5.7" /><path d="M20 5v6h-6" /></>,
    download: <><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 20h14" /></>,
    eye: <><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></>,
    status: <><path d="M8 5h8M8 19h8M12 5v14" /><circle cx="12" cy="12" r="3" /></>,
    delete: <><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" /></>,
    chevron: <><path d="m9 6 6 6-6 6" /></>,
  };
  return (
    <svg className="admin-users-icon" viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name] || paths.eye}</g>
    </svg>
  );
}

function AdminAffiliatesIcon({ name }) {
  const paths = {
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    back: <path d="m15 18-6-6 6-6" />,
    refresh: <><path d="M20 11a8 8 0 1 0-2.3 5.7" /><path d="M20 5v6h-6" /></>,
    search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></>,
    filter: <><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></>,
    download: <><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 20h14" /></>,
    copy: <><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>,
    shield: <><path d="M12 3 4.5 6v5.5c0 4.5 3 7.7 7.5 9.5 4.5-1.8 7.5-5 7.5-9.5V6L12 3Z" /><path d="m8.5 12 2.2 2.2 4.8-4.8" /></>,
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.7-4 3-6 7-6s6.3 2 7 6" /></>,
    trophy: <><path d="M8 4h8v4c0 3-1.5 5-4 6-2.5-1-4-3-4-6V4Z" /><path d="M8 6H4v2c0 2 1.3 3.3 4 3.8M16 6h4v2c0 2-1.3 3.3-4 3.8M12 14v4M8 21h8M9 18h6" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1A7 7 0 0 0 15 6l-.3-2.6h-4L10.5 6A7 7 0 0 0 9 7.1l-2.4-1-2 3.4L6.7 11a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1A7 7 0 0 0 10.5 18l.3 2.6h4L15 18a7 7 0 0 0 1.5-1.1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1Z" /></>,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></>,
    chevron: <path d="m8 10 4 4 4-4" />,
    trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" /></>,
  };
  return (
    <svg className="admin-affiliates-icon" viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name] || paths.user}</g>
    </svg>
  );
}

function AdminCards({ type, items, onAction, busyAction, userInsights }) {
  if (!items.length) {
    if (type === "reviews") {
      return (
        <div className="admin-reviews-empty">
          <div className="admin-reviews-empty__icon" aria-hidden="true">
            <span>*</span>
          </div>
          <h2>No reviews to moderate</h2>
          <p>New customer feedback will appear here for approval, rejection, or removal.</p>
        </div>
      );
    }
    return (
      <div className="panel admin-state">
        <h2>No records yet</h2>
        <p>When data is available, it will appear here for admin management.</p>
      </div>
    );
  }

  return (
    <div className={`admin-record-list admin-record-list--${type}`}>
      {type === "orders" ? (
        <div className="admin-orders-table-head" aria-hidden="true">
          <span>Order #</span>
          <span>Customer</span>
          <span>Status</span>
          <span>Total</span>
          <span>Payment</span>
          <span>Date</span>
          <span />
        </div>
      ) : null}
      {type === "products" ? (
        <div className="admin-products-table-head" aria-hidden="true">
          <span>Product</span>
          <span>Category</span>
          <span>Brand</span>
          <span>Price</span>
          <span>Stock</span>
          <span>Featured</span>
          <span>Actions</span>
        </div>
      ) : null}
      {type === "users" ? (
        <div className="admin-users-table-head" aria-hidden="true">
          <span>Identity</span><span>Role</span><span>Status</span><span>Orders</span><span>Total Spent</span><span>Engagement</span><span>Actions</span>
        </div>
      ) : null}
      {items.map((item, index) => {
        const baseId = String(item?._id || item?.id || item?.code || `${type}-row-${index}`);
        const versionedBase =
          type === "messages"
            ? `${baseId}-${item?.status || "new"}-${item?.updatedAt || ""}`
            : `${baseId}-${item?.updatedAt || item?.createdAt || ""}`;
        const key = `${type}-${versionedBase}`;
        return (
        <AdminRecordCard
          key={key}
          type={type}
          item={item}
          onAction={onAction}
          busyAction={busyAction}
          userInsights={userInsights}
          defaultExpanded={(type === "orders" || type === "products") && index === 0}
        />
        );
      })}
    </div>
  );
}

function AffiliateWorkspace({
  stats,
  items,
  leaderboard,
  settings,
  query,
  setQuery,
  tierFilter,
  setTierFilter,
  statusFilter,
  setStatusFilter,
  sort,
  setSort,
  toolbarOpen,
  setToolbarOpen,
  leaderboardOpen,
  setLeaderboardOpen,
  settingsOpen,
  setSettingsOpen,
  loading,
  refreshing,
  busyAction,
  loadData,
  resetFilters,
  exportCsv,
  exportJson,
  exportSql,
  runAction,
}) {
  const settingsBusy = busyAction === "updateAffiliateSettings";
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <div className="admin-affiliates-workspace">
      <header className="admin-affiliates-mobile-head">
        <button type="button" onClick={() => setDrawerOpen(true)} aria-label="Open navigation menu"><AdminAffiliatesIcon name="menu" /></button>
        <h1>Affiliates</h1>
        <button type="button" onClick={() => setToolbarOpen(true)} aria-label="Search and filter affiliates"><AdminAffiliatesIcon name="search" /></button>
      </header>
      <MobileNavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <header className="admin-affiliates-head">
        <h1>Affiliates</h1>
        <p>Manage affiliate accounts, payouts, and program settings.</p>
      </header>

      <section className="admin-affiliates-topbar" aria-label="Affiliate search, filters and export">
        <label><AdminAffiliatesIcon name="search" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search affiliates by name, code or number..." /></label>
        <select value={tierFilter} onChange={(event) => setTierFilter(event.target.value)} aria-label="Affiliate tier"><option value="all">Tier: All</option><option value="starter">Starter</option><option value="bronze">Bronze</option><option value="silver">Silver</option><option value="gold">Gold</option></select>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Affiliate status"><option value="all">Status: All</option><option value="active">Active</option><option value="inactive">Inactive</option></select>
        <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort affiliates">{AFFILIATE_SORT_OPTIONS.map(([value, label]) => <option key={value} value={value}>Sort: {label}</option>)}</select>
        <button type="button" className="admin-affiliates-clear" onClick={resetFilters}>Clear Filters</button>
        <button type="button" className="admin-affiliates-refresh" disabled={loading || refreshing} onClick={() => loadData({ background: true })} aria-label="Refresh affiliates"><AdminAffiliatesIcon name="refresh" />Refresh</button>
        <details className="admin-affiliates-export"><summary><AdminAffiliatesIcon name="download" />Export</summary><div><button type="button" onClick={exportCsv}>CSV</button><button type="button" onClick={exportJson}>JSON</button><button type="button" onClick={exportSql}>SQL</button></div></details>
      </section>

      <section className="admin-affiliates-stats" aria-label="Affiliate summary">
        <article><span>Total</span><strong>{stats?.total || 0}</strong></article>
        <article><span>Showing</span><strong>{stats?.filtered || 0}</strong></article>
        <article><span>Active</span><strong>{stats?.active || 0}</strong></article>
        <article className="is-inactive"><span>Inactive</span><strong>{stats?.inactive || 0}</strong></article>
        <article><span>Referrals</span><strong>{formatCount(stats?.totalReferrals || 0)}</strong></article>
        <article><span>Pending</span><strong>{formatCurrency(stats?.totalPending || 0)}</strong></article>
        <article><span>Earned</span><strong>{formatCurrency(stats?.totalEarned || 0)}</strong></article>
      </section>

      <section className="admin-affiliates-mobile-stats" aria-label="Affiliate summary">
        <article><span>Referrals</span><strong>{formatCount(stats?.totalReferrals || 0)}</strong></article>
        <article><span>Pending</span><strong>{formatCurrency(stats?.totalPending || 0)}</strong></article>
        <article><span>Earned</span><strong>{formatCurrency(stats?.totalEarned || 0)}</strong></article>
      </section>

      <section className="admin-affiliates-mobile-panels">
        <button type="button" onClick={() => setLeaderboardOpen((current) => !current)}><AdminAffiliatesIcon name="trophy" /><span>Top Performers</span><AdminAffiliatesIcon name="chevron" /></button>
        {leaderboardOpen ? <div className="admin-affiliates-mobile-ranking">{leaderboard.slice(0, 5).map((affiliate, index) => <a key={affiliate._id || affiliate.code} href={`#admin-affiliate-${affiliate._id}`}><b>{index + 1}</b><span><strong>{affiliate.user?.name || affiliate.code}</strong><small>{affiliate.code}</small></span><em>{formatCurrency(Number(affiliate.stats?.earnedCommission || 0))}</em></a>)}</div> : null}
        <button type="button" onClick={() => setSettingsOpen((current) => !current)}><AdminAffiliatesIcon name="settings" /><span>Program Tiers</span><AdminAffiliatesIcon name="chevron" /></button>
        {settingsOpen && settings ? <AffiliateSettingsForm settings={settings} busy={settingsBusy} onSubmit={(event) => runAction("updateAffiliateSettings", { _id: "updateAffiliateSettings" }, event)} /> : null}
      </section>

      <div className="admin-affiliates-content">
        <aside>
          <section className="admin-affiliates-leaderboard">
            <button type="button" onClick={() => setLeaderboardOpen((current) => !current)}><span><AdminAffiliatesIcon name="trophy" />Top 5 Affiliates</span><AdminAffiliatesIcon name="chevron" /></button>
            {leaderboardOpen ? <div>{leaderboard.slice(0, 5).map((affiliate, index) => <a key={affiliate._id || affiliate.code} href={`#admin-affiliate-${affiliate._id}`}><b>{index + 1}</b><span><strong>{affiliate.user?.name || affiliate.code}</strong><small>{affiliate.code}</small></span><em>{formatCurrency(Number(affiliate.stats?.earnedCommission || 0))}<small>{affiliate.stats?.totalReferrals || 0} referrals</small></em></a>)}</div> : null}
          </section>
          {settings ? <section className="admin-affiliates-settings"><header><h2>Program Settings</h2><AdminAffiliatesIcon name="settings" /></header><AffiliateSettingsForm settings={settings} busy={settingsBusy} onSubmit={(event) => runAction("updateAffiliateSettings", { _id: "updateAffiliateSettings" }, event)} /></section> : null}
        </aside>
        <main>
          <div className="admin-affiliates-list-head" aria-hidden="true"><span>Code</span><span>User</span><span>Tier</span><span>Referrals</span><span>Pending</span><span>Earned</span><span>MoMo Details</span><span>Actions</span></div>
          <div className="admin-affiliates-mobile-section-title"><span>Manage Affiliates</span><small>{stats?.active || 0} Active</small></div>
          <AdminCards type="affiliates" items={items} onAction={runAction} busyAction={busyAction} />
        </main>
      </div>

      {toolbarOpen ? <div className="admin-affiliates-filter-sheet" role="dialog" aria-modal="true" aria-label="Affiliate filters"><button className="admin-affiliates-filter-sheet__backdrop" type="button" onClick={() => setToolbarOpen(false)} aria-label="Close filters" /><section><header><h2>Search &amp; Filter</h2><button type="button" onClick={() => setToolbarOpen(false)}>&times;</button></header><label>Search<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, code or number" /></label><label>Tier<select value={tierFilter} onChange={(event) => setTierFilter(event.target.value)}><option value="all">All tiers</option><option value="starter">Starter</option><option value="bronze">Bronze</option><option value="silver">Silver</option><option value="gold">Gold</option></select></label><label>Status<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">All status</option><option value="active">Active</option><option value="inactive">Inactive</option></select></label><label>Sort<select value={sort} onChange={(event) => setSort(event.target.value)}>{AFFILIATE_SORT_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><div><button type="button" onClick={resetFilters}>Reset</button><button type="button" onClick={() => setToolbarOpen(false)}>Apply</button></div></section></div> : null}
    </div>
  );
}

function AdminRecordCard({ type, item, onAction, busyAction, userInsights, defaultExpanded = false }) {
  const [editing, setEditing] = useState(false);
  const id = item._id || item.id;
  const busy = busyAction === id;
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [threadExpanded, setThreadExpanded] = useState(false);
  const [supportStatusDraft, setSupportStatusDraft] = useState(() => item?.status || "new");
  const [supportResponseDraft, setSupportResponseDraft] = useState("");
  const [etaDraft, setEtaDraft] = useState(() => toDateTimeLocalValue(item?.estimatedDeliveryDate));
  const collapsibleIdBase = String(id || item?.email || item?.code || item?.title || item?.name || "record").replace(/[^a-zA-Z0-9_-]+/g, "-");

  if (type === "products") {
    const image = resolveProductImage(item.images?.[0] || item.image_url || item.image);
    const productPricing = getProductPricing(item);
    const productBodyId = `admin-product-body-${collapsibleIdBase}`;
    const stock = Number(item.countInStock || 0);
    return (
      <article className={`admin-record admin-product-record ${stock <= 0 ? "is-out-of-stock" : ""} ${isExpanded ? "is-expanded" : ""}`}>
        <div className="admin-product-record__row">
          <button
            type="button"
            className="admin-product-record__toggle"
            onClick={() => setIsExpanded((current) => !current)}
            aria-expanded={isExpanded}
            aria-controls={productBodyId}
          >
            <span className="admin-product-record__identity">
              <span className="admin-product-record__image">
                {image ? <StableImage src={image} alt={item.name} width={80} height={80} /> : <AdminProductsIcon name="box" />}
              </span>
              <span className="admin-product-record__name">
                <strong>{item.name}</strong>
                <small>{item.cardDescription || item.description || "Product inventory item"}</small>
              </span>
            </span>
            <span className="admin-product-record__category">{item.category || "Uncategorised"}</span>
            <span className="admin-product-record__brand">{item.subCategory || item.brand || "No brand"}</span>
            <span className="admin-product-record__price">
              <strong>{formatCurrency(productPricing.currentPrice)}</strong>
              {productPricing.isDiscountActive ? <del>{formatCurrency(productPricing.originalPrice)}</del> : null}
            </span>
            <span className={`admin-product-record__stock ${stock > 0 ? "is-in" : "is-out"}`}>{stock > 0 ? `${stock} in stock` : "Out of stock"}</span>
            <span className={`admin-product-record__featured ${item.isFeatured ? "is-featured" : ""}`}>{item.isFeatured ? "Featured" : "Regular"}</span>
            <span className="admin-product-record__chevron"><AdminProductsIcon name="chevron" /></span>
          </button>
          <div className="admin-product-record__desktop-actions">
            <Link href={`/admin/products/${id}/edit`} aria-label={`Edit ${item.name}`}><AdminProductsIcon name="edit" /></Link>
            <button type="button" disabled={busy} onClick={() => onAction("deleteProduct", item)} aria-label={`Delete ${item.name}`}><AdminProductsIcon name="delete" /></button>
          </div>
        </div>
        {isExpanded ? (
          <div id={productBodyId} className="admin-product-record__body">
            <div className="admin-product-record__mobile-meta">
              <span><small>Category</small><strong>{item.category || "Uncategorised"}</strong></span>
              <span><small>Brand</small><strong>{item.subCategory || item.brand || "No brand"}</strong></span>
            </div>
            {Array.isArray(item.homeSections) && item.homeSections.length ? (
              <div className="admin-product-record__sections">
                <small>Homepage placement</small>
                <div>
                  {item.homeSections.map((section) => (
                    <span key={section}>{HOME_SECTION_LABELS.get(canonicalHomeSectionKey(section)) || String(section).replace(/_/g, " ")}</span>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="admin-product-record__mobile-actions">
              <Link href={`/admin/products/${id}/edit`}><AdminProductsIcon name="edit" /><span>Edit Product</span></Link>
              <button type="button" disabled={busy} onClick={() => onAction("deleteProduct", item)}><AdminProductsIcon name="delete" /><span>Delete</span></button>
            </div>
          </div>
        ) : null}
      </article>
    );
  }

  if (type === "orders") {
    const customer = item.shippingName || item.guestName || item.user?.name || item.shippingEmail || "Customer";
    const paymentProofUrl = resolvePaymentProofUrl(item);
    const orderId = item.orderNumber || item._id;
    const productSavings = getLinesDiscountTotal(item.orderItems || []);
    const shippingPhone = item.mobileNumber || item.shippingPhone || item.user?.phone || "No phone";
    const shippingAddress = [item.shippingAddress, item.shippingCity, item.deliveryRegion].filter(Boolean).join(", ");
    const affiliateCodeEntered = normalizeText(item.affiliateCodeEntered);
    const affiliateCodeApplied = normalizeText(item.affiliateCode);
    const affiliateCommissionRate = Number(item.affiliateCommissionRate || 0);
    const affiliateCommissionAmount = Number(item.affiliateCommissionAmount || 0);
    const affiliateUsed = Boolean(affiliateCodeApplied);
    const affiliateAttemptedOnly = !affiliateUsed && Boolean(affiliateCodeEntered);
    const orderBodyId = `admin-order-body-${String(orderId || id || "order").replace(/[^a-zA-Z0-9_-]+/g, "-")}`;
    const orderStatus = item.orderStatus || "pending";
    const paymentStatus = item.paymentStatus || "pending";
    const itemCount = (item.orderItems || []).reduce((total, line) => total + Number(line?.qty || 1), 0);
    return (
      <article className="admin-record admin-record--order panel admin-collapsible">
        <button
          type="button"
          className="admin-collapsible__header admin-order-card__toggle"
          onClick={() => setIsExpanded((current) => !current)}
          aria-expanded={isExpanded}
          aria-controls={orderBodyId}
        >
          <div className="admin-order-row admin-order-row--summary">
            <span className="admin-order-id">{orderId}</span>
            <span className="admin-order-customer">{customer}</span>
            <span className={`admin-order-status ${statusClass(orderStatus)}`}>{orderStatus}</span>
            <span className="admin-order-total">{formatCurrency(Number(item.totalPrice || 0))}</span>
            <span className={`admin-order-payment ${statusClass(paymentStatus)}`}>{paymentStatus}</span>
            <span className="admin-order-date">{formatDate(item.createdAt)}</span>
            <span className="admin-collapsible__icon" aria-hidden="true">{isExpanded ? "-" : "+"}</span>
          </div>
        </button>
        {isExpanded ? (
          <div id={orderBodyId} className="admin-collapsible__body admin-order-detail">
            <div className="admin-order-mobile-summary">
              <div>
                <strong>{orderId}</strong>
                <span>{customer}</span>
              </div>
              <div>
                <span className={`admin-order-status ${statusClass(orderStatus)}`}>{orderStatus}</span>
                <strong>{formatCurrency(Number(item.totalPrice || 0))}</strong>
              </div>
            </div>

            <div className="admin-order-detail-grid">
              <section className="admin-order-info">
                <h4>Customer & Delivery</h4>
                <dl>
                  <div><dt>Email</dt><dd>{item.shippingEmail || item.guestEmail || item.user?.email || "No email"}</dd></div>
                  <div><dt>Phone</dt><dd>{shippingPhone}</dd></div>
                  <div><dt>Location</dt><dd>{shippingAddress || "No address provided"}</dd></div>
                  <div><dt>Region</dt><dd>{item.deliveryRegion || "N/A"}</dd></div>
                </dl>
                <a href={paymentProofUrl || "#"} target={paymentProofUrl ? "_blank" : undefined} rel="noreferrer" className={`admin-order-proof-link ${paymentProofUrl ? "" : "is-disabled"}`}>
                  View Payment Proof
                </a>
              </section>

              <section className="admin-order-items">
                <h4>Items <span>{itemCount}</span></h4>
                <div className="admin-order-items__table">
                  {(item.orderItems || []).map((line) => {
                    const upgradeLabel = formatSelectedUpgrades({
                      ram: line?.selectedUpgrades?.ram?.label || "",
                      storage: line?.selectedUpgrades?.storage?.label || "",
                    });
                    const upgradeDelta =
                      Number(line?.selectedUpgrades?.ram?.priceDelta || 0) +
                      Number(line?.selectedUpgrades?.storage?.priceDelta || 0);
                    const lineTotal = Number(line.price || 0) * Number(line.qty || 1);
                    const lineImage = resolveProductImage(
                      line?.product?.images?.[0] ||
                        line?.productSnapshot?.images?.[0] ||
                        line?.product?.imageUrl ||
                        line?.product?.image_url ||
                        line?.productSnapshot?.image_url ||
                        line?.productSnapshot?.imageUrl ||
                        line?.product?.thumbnail ||
                        line?.product?.image ||
                        line?.product?.photos?.[0] ||
                        line?.images?.[0] ||
                        line?.productImage ||
                        line?.thumbnail ||
                        line?.imageUrl ||
                        line?.image_url ||
                        line?.image
                    );
                    return (
                      <div key={line._id || line.product?._id || line.product} className="admin-order-line-item">
                        <span className="admin-order-line-item__icon" aria-hidden="true">
                          {lineImage ? (
                            <StableImage src={lineImage} alt={line.product?.name || "Product"} width={56} height={56} />
                          ) : (
                            <svg viewBox="0 0 24 24">
                              <path d="M5 6h14v10H5zM8 20h8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        <div>
                          <strong>{line.product?.name || "Product"}</strong>
                          <small>{upgradeLabel ? `Upgrade: ${upgradeLabel}` : "Base option"}</small>
                          {upgradeDelta > 0 ? <small>Includes {formatCurrency(upgradeDelta)} upgrade</small> : null}
                        </div>
                        <span>Qty {line.qty || 1}</span>
                        <strong>{formatCurrency(lineTotal)}</strong>
                      </div>
                    );
                  })}
                </div>
                <div className="admin-order-subtotal">
                  <span>Order subtotal</span>
                  <strong>{formatCurrency(Number(item.itemsPrice || 0))}</strong>
                </div>
              </section>
            </div>

            <div className="admin-order-finance-grid">
              <span>Product savings <strong>{productSavings > 0 ? `-${formatCurrency(productSavings)}` : formatCurrency(0)}</strong></span>
              <span>Delivery <strong>{Number(item.shippingPrice || 0) > 0 ? formatCurrency(Number(item.shippingPrice || 0)) : "FREE"}</strong></span>
              <span>Discount <strong>-{formatCurrency(Number(item.discountAmount || 0))}</strong></span>
              <span>Payment method <strong>{item.paymentMethod || "N/A"}</strong></span>
              <span>Estimated delivery <strong>{item.estimatedDeliveryDate ? formatDateTime(item.estimatedDeliveryDate) : "Auto after paid"}</strong></span>
              <span>Affiliate <strong>{affiliateUsed ? `${affiliateCodeApplied} / ${formatCurrency(affiliateCommissionAmount)} at ${affiliateCommissionRate}%` : affiliateAttemptedOnly ? `${affiliateCodeEntered} entered` : "Not used"}</strong></span>
            </div>

            <div className="admin-actions admin-actions--wrap admin-order-actions">
              <AdminStatusSelect label="Order Status" value={orderStatus} options={["pending", "processing", "shipped", "delivered", "cancelled"]} onChange={(value) => onAction("orderStatus", item, null, value)} />
              <AdminStatusSelect label="Payment Status" value={paymentStatus} options={["pending", "paid", "failed"]} onChange={(value) => onAction("paymentStatus", item, null, value)} />
              <label className="admin-inline-control admin-order-eta">
                <span>Expected Delivery ETA</span>
                <input
                  type="datetime-local"
                  className="field"
                  value={etaDraft}
                  onChange={(event) => setEtaDraft(event.target.value)}
                />
              </label>
              <button className="ghost-button admin-order-save-eta" type="button" disabled={busy || !etaDraft} onClick={() => onAction("updateEta", item, null, etaDraft)}>
                Save ETA
              </button>
              <button className="primary-button admin-order-mark-paid" type="button" disabled={busy} onClick={() => onAction("markPaid", item)}>Mark Paid</button>
              <button className="ghost-button admin-order-delivered" type="button" disabled={busy} onClick={() => onAction("markDelivered", item)}>Delivered</button>
              <button className="danger-button admin-order-delete" type="button" disabled={busy} onClick={() => onAction("deleteOrder", item)}>Delete Order</button>
            </div>
          </div>
        ) : null}
      </article>
    );
  }

  if (type === "messages") {
    const thread = Array.isArray(item.messages) ? item.messages : [];
    const primaryImage = resolveAssetUrl(item.imageUrl);
    const sortedThread = [...thread].sort((a, b) => new Date(a?.createdAt || 0).getTime() - new Date(b?.createdAt || 0).getTime());
    const hasStatusChanged = supportStatusDraft !== (item.status || "new");
    const hasResponseChanged = supportResponseDraft.trim().length > 0;
    const canSubmit = hasStatusChanged || hasResponseChanged;
    const supportBodyId = `admin-support-body-${String(id || item.email || item.subject || "ticket").replace(/[^a-zA-Z0-9_-]+/g, "-")}`;
    const supportThreadId = `admin-support-thread-${String(id || item.email || item.subject || "ticket").replace(/[^a-zA-Z0-9_-]+/g, "-")}`;

    return (
      <article className="admin-record panel admin-support-ticket admin-collapsible">
        <button
          type="button"
          className="admin-support-ticket__summary admin-collapsible__header"
          onClick={() => setIsExpanded((current) => !current)}
          aria-expanded={isExpanded}
          aria-controls={supportBodyId}
        >
          <div className="admin-support-ticket__summary-copy">
            <strong>{item.name || "Customer Support"}</strong>
            <p>{item.name || "Customer"} / {item.email || "No email"}</p>
          </div>
          <div className="admin-support-ticket__summary-meta">
            <span className={`admin-chip ${statusClass(item.status)}`}>{item.status || "new"}</span>
            <small>{formatDateTime(item.updatedAt)}</small>
            <span className="admin-collapsible__icon" aria-hidden="true">{isExpanded ? "-" : "+"}</span>
          </div>
        </button>

        {isExpanded ? (
        <div id={supportBodyId} className="admin-support-ticket__body admin-collapsible__body">
          <div className="admin-record__head">
            <div>
              <h3>{item.subject || "Support request"}</h3>
              <p>Created {formatDateTime(item.createdAt)}</p>
            </div>
            <span className={`admin-chip ${statusClass(item.status)}`}>{item.status || "new"}</span>
          </div>

          <div className="admin-support-ticket__meta admin-chip-row">
            <span className="admin-chip is-neutral">Created {formatDateTime(item.createdAt)}</span>
            <span className="admin-chip is-neutral">Updated {formatDateTime(item.updatedAt)}</span>
            {sortedThread.length ? <span className="admin-chip is-warning">{sortedThread.length} thread updates</span> : null}
          </div>

          <div className="admin-support-ticket__message panel">
            <h4>Customer Request</h4>
            <p>{item.subject || "General support request"}</p>
            {primaryImage ? (
              <a href={primaryImage} target="_blank" rel="noreferrer" className="admin-support-ticket__image">
                <StableImage src={primaryImage} alt={`Attachment for ${item.subject || "support ticket"}`} width={280} height={170} />
              </a>
            ) : null}
          </div>

          {sortedThread.length ? (
            <div className="admin-support-ticket__thread">
              <button
                type="button"
                className="admin-support-ticket__thread-toggle"
                onClick={() => setThreadExpanded((current) => !current)}
                aria-expanded={threadExpanded}
                aria-controls={supportThreadId}
              >
                <span>Conversation thread</span>
                <div className="admin-support-ticket__thread-toggle-meta">
                  <span>{sortedThread.length} messages</span>
                  <span className="admin-collapsible__icon" aria-hidden="true">{threadExpanded ? "-" : "+"}</span>
                </div>
              </button>
              {threadExpanded ? (
              <div id={supportThreadId} className="admin-support-ticket__thread-list" role="log" aria-live="polite">
                {sortedThread.map((entry, index) => {
                  const imageUrl = resolveAssetUrl(entry?.imageUrl);
                  const sender = String(entry?.sender || "").toLowerCase() === "admin" ? "admin" : "user";
                  return (
                    <article key={`${entry?.createdAt || "entry"}-${index}`} className={`admin-support-ticket__thread-item is-${sender}`}>
                      <div className="admin-support-ticket__thread-head">
                        <strong>{sender === "admin" ? "Support" : "Customer"}</strong>
                        <span>{formatDateTime(entry?.createdAt)}</span>
                      </div>
                      {entry?.text ? <p>{entry.text}</p> : null}
                      {imageUrl ? (
                        <a href={imageUrl} target="_blank" rel="noreferrer" className="admin-support-ticket__thread-image">
                          <StableImage src={imageUrl} alt={`${sender} attachment`} width={220} height={140} />
                        </a>
                      ) : null}
                    </article>
                  );
                })}
              </div>
              ) : null}
            </div>
          ) : null}

          <form className="admin-form admin-support-ticket__form" onSubmit={(event) => onAction("updateSupport", item, event)}>
            <label className="admin-inline-control">
              <span>Ticket status</span>
              <select className="field" name="status" value={supportStatusDraft} onChange={(event) => setSupportStatusDraft(event.target.value)}>
                <option value="new">new</option>
                <option value="in-progress">in-progress</option>
                <option value="resolved">resolved</option>
              </select>
            </label>

            <div className="admin-support-ticket__composer-row">
              <textarea
                className="field admin-support-ticket__composer-input"
                name="response"
                value={supportResponseDraft}
                onChange={(event) => setSupportResponseDraft(event.target.value)}
                placeholder="Type your reply..."
                rows={4}
              />
            </div>
            <p className="admin-support-ticket__hint">
              Reply length: {supportResponseDraft.trim().length} / 2000 characters
            </p>

            <button className="primary-button admin-support-ticket__submit" disabled={busy || !canSubmit}>
              {busy ? "Saving..." : "Update Ticket"}
            </button>
          </form>
        </div>
        ) : null}
      </article>
    );
  }

  if (type === "users") {
    const active = item.isActive !== false;
    const isAdminUser = String(item?.role || "").toLowerCase() === "admin";
    const email = normalizeEmail(item?.email);
    const insight = email ? userInsights?.[email] : null;
    const wishlistCount = Array.isArray(item?.wishlist) ? item.wishlist.length : 0;
    const initials = normalizeText(item?.name || item?.email || "U").split(/\s+/).map((part) => part[0] || "").join("").slice(0, 2).toUpperCase();
    const orders = Number(insight?.totalOrders || 0);
    const spent = Number(insight?.totalSpent || 0);
    const engagement = Math.min(100, Math.max(4, orders * 6 + Number(insight?.reviewCount || 0) * 8 + Number(insight?.supportTickets || 0) * 4 + wishlistCount * 3));

    return (
      <article className={`admin-record admin-user-record ${active ? "is-active" : "is-inactive"}`}>
        <div className="admin-user-record__identity">
          <span className="admin-user-record__avatar">
            <StableImage src={item.avatarUrl || ""} alt="" width={44} height={44} fallback={initials} />
          </span>
          <span><strong>{item.name || item.email}</strong><small>{item.email}</small><em>{item.region || "No region"} &bull; Joined {formatDate(item.createdAt)}</em></span>
        </div>
        <span className={`admin-user-record__role ${isAdminUser ? "is-admin" : ""}`}>{item.role || "user"}</span>
        <span className={`admin-user-record__status ${active ? "is-active" : "is-inactive"}`}><i />{active ? "Active" : "Inactive"}</span>
        <strong className="admin-user-record__orders">{orders}</strong>
        <strong className="admin-user-record__spent">{formatCurrency(spent)}</strong>
        <span className="admin-user-record__engagement"><i><b style={{ width: `${engagement}%` }} /></i><small>{engagement}%</small></span>
        <div className="admin-user-record__actions">
          <button type="button" onClick={() => onAction("openUser360", item)} aria-label={`View ${item.name || item.email} profile`}><AdminUsersIcon name="eye" /></button>
          <button type="button" disabled={busy} onClick={() => onAction("userStatus", item, null, !active)} aria-label={active ? "Deactivate user" : "Activate user"}><AdminUsersIcon name="status" /></button>
          {isAdminUser ? <span title="Protected admin account">P</span> : <button type="button" disabled={busy} onClick={() => onAction("deleteUser", item)} aria-label="Delete user"><AdminUsersIcon name="delete" /></button>}
        </div>
        <div className="admin-user-record__mobile-summary">
          <span className={`admin-user-record__status ${active ? "is-active" : "is-inactive"}`}>{active ? "Active" : "Inactive"}</span>
          <strong>{formatCurrency(spent)}</strong>
          <button type="button" onClick={() => onAction("openUser360", item)}>View User 360 <AdminUsersIcon name="chevron" /></button>
        </div>
      </article>
    );
  }

    if (type === "reviews") {
      const productId = item?.product?._id || item?.product?.id || item?.productId || "";
      const reviewerName = item.user?.name || item.user?.email || "Customer";
      const productName = item.product?.name || "Product";
      const rating = Math.max(0, Math.min(5, Number(item.rating || 0)));
      const roundedRating = Math.round(rating);
      const createdAtLabel = formatDateTime(item.createdAt);

      return (
        <article className="admin-record panel admin-review-record">
          <div className="admin-review-record__summary">
            <div className="admin-review-record__aside">
              <div className="admin-review-record__stars" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={star <= roundedRating ? "is-filled" : ""}>*</span>
                ))}
              </div>
              <span className={`admin-review-record__status admin-chip ${item.approved ? "is-success" : "is-warning"}`}>
                {item.approved ? "Approved" : "Pending"}
              </span>
              <p className="admin-review-record__date">{createdAtLabel}</p>
            </div>
            <div className="admin-review-record__content">
              <h3>
                <span>{reviewerName}</span>
                <i>on</i>
                {productId ? (
                  <Link href={`/products/${productId}`}>{productName}</Link>
                ) : (
                  <strong>{productName}</strong>
                )}
              </h3>
              <p className="admin-review-record__comment">{item.comment || "No review text."}</p>
            </div>
            <div className="admin-review-record__actions">
              {!item.approved ? (
                <button className="ghost-button admin-review-record__approve" disabled={busy} onClick={() => onAction("moderateReview", item, null, true)}>Approve</button>
              ) : null}
              <button className="ghost-button admin-review-record__reject" disabled={busy} onClick={() => onAction("moderateReview", item, null, false)}>
                {item.approved ? "Reject" : "Reject"}
              </button>
              {productId ? (
                <Link className="ghost-button admin-review-record__link" href={`/products/${productId}`}>
                  Open Product
                </Link>
              ) : null}
              <button className="danger-button admin-review-record__delete" disabled={busy} onClick={() => onAction("deleteReview", item)}>Delete</button>
            </div>
          </div>
        </article>
      );
    }

  if (type === "affiliates") {
    const active = item.isActive !== false;
    return (
      <article id={`admin-affiliate-${item._id}`} className={`admin-affiliate-record ${active ? "is-active" : "is-inactive"}`}>
        <div className="admin-affiliate-record__identity">
          <span className="admin-affiliate-record__avatar"><AdminAffiliatesIcon name="user" /></span>
          <div>
            <strong>{item.user?.name || "Affiliate user"}</strong>
            <small>{item.user?.email || "No email provided"}</small>
          </div>
        </div>
        <div className="admin-affiliate-record__code"><small>Code</small><strong>{item.code || "Not assigned"}</strong></div>
        <span className={`admin-affiliate-tier is-${String(item.tier || "starter").toLowerCase()}`}>{item.tier || "Starter"}</span>
        <div className="admin-affiliate-record__metric"><small>Referrals</small><strong>{item.stats?.totalReferrals || 0}</strong></div>
        <div className="admin-affiliate-record__metric"><small>Pending</small><strong>{formatCurrency(Number(item.stats?.pendingCommission || 0))}</strong></div>
        <div className="admin-affiliate-record__metric is-earned"><small>Total Payout</small><strong>{formatCurrency(Number(item.stats?.earnedCommission || 0))}</strong></div>
        <div className="admin-affiliate-record__momo">
          <small>MoMo Details</small>
          <strong>{item.momoNumber || item.user?.phone || "Not provided"}</strong>
          <span className={item.momoNumberVerified ? "is-verified" : "is-unverified"}>{item.momoNumberVerified ? "Verified" : "Unverified"}</span>
        </div>
        <div className="admin-affiliate-record__actions">
          <button type="button" className="admin-affiliate-copy" disabled={busy || !item.code} onClick={() => onAction("copyAffiliateCode", item)}><AdminAffiliatesIcon name="copy" /><span>Copy Code</span></button>
          <button type="button" className="admin-affiliate-verify" disabled={busy || !item.momoNumber} onClick={() => onAction("affiliateMomoVerification", item, null, !item.momoNumberVerified)}><AdminAffiliatesIcon name="shield" /><span>{item.momoNumberVerified ? "Unverify MoMo" : "Verify MoMo"}</span></button>
          <details className="admin-affiliate-more">
            <summary aria-label="More affiliate actions"><AdminAffiliatesIcon name="more" /></summary>
            <div>
              <button type="button" disabled={busy} onClick={() => onAction("affiliateStatus", item, null, !active)}>{active ? "Deactivate" : "Activate"}</button>
              <button type="button" className="is-danger" disabled={busy} onClick={() => onAction("deleteAffiliate", item)}><AdminAffiliatesIcon name="trash" />Delete</button>
            </div>
          </details>
          <span className={`admin-affiliate-active-state ${active ? "is-active" : "is-inactive"}`}>{active ? "Active" : "Inactive"}</span>
        </div>
        <div className="admin-affiliate-record__mobile-code">
          <span><small>Code</small><strong>{item.code || "Not assigned"}</strong></span>
          <span><small>Total Payout</small><strong>{formatCurrency(Number(item.stats?.earnedCommission || 0))}</strong></span>
        </div>
        <div className="admin-affiliate-record__mobile-status">
          <span className={`admin-affiliate-tier is-${String(item.tier || "starter").toLowerCase()}`}>{item.tier || "Starter"} tier</span>
          <span className={item.momoNumberVerified ? "is-verified" : "is-unverified"}>{item.momoNumberVerified ? "MoMo verified" : "Unverified MoMo"}</span>
        </div>
      </article>
    );
  }

  if (type === "discounts") {
    const usedByName = normalizeText(item?.usedBy?.name);
    const usedByEmail = normalizeText(item?.usedBy?.email);
    const usedBy = usedByName || usedByEmail;
    const orderRef = normalizeText(item?.order?._id || item?.order);
    const discountBodyId = `admin-discount-body-${collapsibleIdBase}`;
    return (
      <article className="admin-record panel admin-collapsible">
        <button
          type="button"
          className="admin-collapsible__header admin-record-card__toggle"
          onClick={() => setIsExpanded((current) => !current)}
          aria-expanded={isExpanded}
          aria-controls={discountBodyId}
        >
          <div className="admin-record-card__summary">
            <h3>{item.code || "Discount"}</h3>
            <p>{Number(item.percent || 0)}% off / created {formatDate(item.createdAt)}</p>
            <div className="admin-chip-row">
              <span className={`admin-chip ${item.used ? "is-danger" : "is-success"}`}>{item.used ? "Used" : "Available"}</span>
              <span className="admin-chip is-neutral">{Number(item.percent || 0)}%</span>
              <span className="admin-chip is-neutral">{usedBy || "No user linked"}</span>
            </div>
          </div>
          <span className="admin-collapsible__icon" aria-hidden="true">{isExpanded ? "-" : "+"}</span>
        </button>
        {isExpanded ? (
          <div id={discountBodyId} className="admin-collapsible__body">
            <div className="admin-meta-grid">
              <span>Percent <strong>{Number(item.percent || 0)}%</strong></span>
              <span>Created <strong>{formatDateTime(item.createdAt)}</strong></span>
              <span>Used At <strong>{item.usedAt ? formatDateTime(item.usedAt) : "Not used yet"}</strong></span>
              <span>Used By <strong>{usedBy || "No user linked"}</strong></span>
              {orderRef ? <span>Order Ref <strong>{orderRef}</strong></span> : null}
            </div>
            <div className="admin-actions">
              <button className="ghost-button" disabled={busy} onClick={() => onAction("copyDiscountCode", item)}>Copy Code</button>
              <button className="danger-button" disabled={busy} onClick={() => onAction("deleteDiscount", item)}>Delete</button>
            </div>
          </div>
        ) : null}
      </article>
    );
  }

  if (type === "banners") {
    const bannerBodyId = `admin-banner-body-${collapsibleIdBase}`;
    const bannerLinkLabel = item.linkCategory
      ? `Category link: ${item.linkCategory}${item.linkSubCategory ? ` / ${item.linkSubCategory}` : " / all"}`
      : item.link
        ? `Custom link: ${item.link}`
        : "No click link (plain banner)";
    return (
      <article className="admin-record admin-banner-record panel admin-collapsible">
        <button
          type="button"
          className="admin-collapsible__header admin-record-card__toggle admin-banner-record__toggle"
          onClick={() => setIsExpanded((current) => !current)}
          aria-expanded={isExpanded}
          aria-controls={bannerBodyId}
        >
          <div className="admin-record__main admin-record-card__summary admin-banner-record__summary">
            <div className="admin-record__image admin-banner-record__image">
              {item.imageUrl ? (
                <StableImage src={item.imageUrl} alt={item.title} width={96} height={96} />
              ) : (
                <span>No image</span>
              )}
            </div>
            <div className="admin-banner-record__content">
              <p className="admin-banner-record__eyebrow">Homepage Campaign</p>
              <h3>{item.title || "DEETECH Banner"}</h3>
              <p className="admin-banner-record__link">{bannerLinkLabel}</p>
              <div className="admin-chip-row admin-banner-record__chips">
                <span className="admin-chip">Display Order {item.order || 0}</span>
              </div>
            </div>
          </div>
          <span className="admin-collapsible__icon" aria-hidden="true">{isExpanded ? "-" : "+"}</span>
        </button>
        {isExpanded ? (
          <div id={bannerBodyId} className="admin-collapsible__body admin-banner-record__body">
            {editing ? <BannerForm initial={item} submitLabel="Update Banner" busy={busy} onSubmit={(event) => onAction("updateBanner", item, event)} /> : null}
            <div className="admin-actions admin-banner-record__actions">
              <button className="ghost-button" type="button" onClick={() => setEditing((current) => !current)}>{editing ? "Close Edit" : "Edit"}</button>
              <button className="danger-button" disabled={busy} onClick={() => onAction("deleteBanner", item)}>Delete</button>
            </div>
          </div>
        ) : null}
      </article>
    );
  }

  return (
    <article className="admin-record panel">
      <pre>{JSON.stringify(item, null, 2)}</pre>
    </article>
  );  return (
    <article className="admin-record panel">
      <pre>{JSON.stringify(item, null, 2)}</pre>
    </article>
  );
}

function ticketInitials(name, email) {
  const source = normalizeText(name) || normalizeText(email) || "Customer Support";
  const parts = source.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

function MessageTicketDetailBody({ item, busy, runAction }) {
  const [threadExpanded, setThreadExpanded] = useState(true);
  const [statusDraft, setStatusDraft] = useState(() => item?.status || "new");
  const [responseDraft, setResponseDraft] = useState("");
  const thread = Array.isArray(item.messages) ? item.messages : [];
  const sortedThread = [...thread].sort((a, b) => new Date(a?.createdAt || 0).getTime() - new Date(b?.createdAt || 0).getTime());
  const primaryImage = resolveAssetUrl(item.imageUrl);
  const hasStatusChanged = statusDraft !== (item.status || "new");
  const hasResponseChanged = responseDraft.trim().length > 0;
  const canSubmit = hasStatusChanged || hasResponseChanged;

  return (
    <div className="admin-messages-ticket-body">
      <div className="admin-messages-ticket-body__chips">
        <span className={`admin-messages-status-pill ${statusClass(item.status)}`}>{item.status || "new"}</span>
        {sortedThread.length ? (
          <span className="admin-messages-meta-chip">{sortedThread.length} thread{sortedThread.length === 1 ? "" : "s"}</span>
        ) : null}
        <span className="admin-messages-meta-chip">Created {formatDateTime(item.createdAt)}</span>
        <span className="admin-messages-meta-chip">Updated {formatDateTime(item.updatedAt)}</span>
      </div>

      <div className="admin-messages-customer-request">
        <div className="admin-messages-customer-request__icon"><AdminProductsIcon name="person" /></div>
        <div className="admin-messages-customer-request__content">
          <blockquote>{item.subject || "General support request"}</blockquote>
          {primaryImage ? (
            <a href={primaryImage} target="_blank" rel="noreferrer" className="admin-messages-attachment">
              <span>Attachment</span>
              <StableImage src={primaryImage} alt={`Attachment for ${item.subject || "support ticket"}`} width={140} height={88} />
            </a>
          ) : null}
        </div>
      </div>

      {sortedThread.length ? (
        <div className="admin-messages-thread">
          <button
            type="button"
            className="admin-messages-thread__toggle"
            onClick={() => setThreadExpanded((current) => !current)}
            aria-expanded={threadExpanded}
          >
            <span>Conversation thread</span>
            <AdminProductsIcon name="chevron" />
          </button>
          {threadExpanded ? (
            <div className="admin-messages-thread__list">
              {sortedThread.map((entry, index) => {
                const imageUrl = resolveAssetUrl(entry?.imageUrl);
                const sender = String(entry?.sender || "").toLowerCase() === "admin" ? "admin" : "user";
                return (
                  <div key={`${entry?.createdAt || "entry"}-${index}`} className={`admin-messages-thread__row is-${sender}`}>
                    <span className="admin-messages-thread__sender">[{sender === "admin" ? "Support" : "Customer"}]</span>
                    {entry?.text ? <p>{entry.text}</p> : null}
                    {imageUrl ? (
                      <a href={imageUrl} target="_blank" rel="noreferrer" className="admin-messages-thread__image">
                        <StableImage src={imageUrl} alt={`${sender} attachment`} width={120} height={80} />
                      </a>
                    ) : null}
                    <time>{formatDateTime(entry?.createdAt)}</time>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : null}

      <form className="admin-messages-composer" onSubmit={(event) => runAction("updateSupport", item, event)}>
        <div className="admin-messages-composer__head">
          <label className="admin-messages-composer__status">
            <span>Update Status:</span>
            <select name="status" value={statusDraft} onChange={(event) => setStatusDraft(event.target.value)}>
              <option value="new">New</option>
              <option value="in-progress">In-Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </label>
          <span className="admin-messages-composer__count">{responseDraft.trim().length} / 2000 characters</span>
        </div>
        <textarea
          name="response"
          value={responseDraft}
          onChange={(event) => setResponseDraft(event.target.value)}
          placeholder="Type your reply..."
          rows={4}
        />
        <button type="submit" className="admin-messages-composer__submit" disabled={busy || !canSubmit}>
          <AdminProductsIcon name="check" />{busy ? "Saving..." : "Update Ticket"}
        </button>
      </form>
    </div>
  );
}

function MessageDesktopRow({ item, busy, runAction }) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <article className={`admin-messages-desktop-row ${isExpanded ? "is-expanded" : ""}`}>
      <button type="button" className="admin-messages-desktop-row__summary" onClick={() => setIsExpanded((current) => !current)} aria-expanded={isExpanded}>
        <span className="admin-messages-avatar">{ticketInitials(item.name, item.email)}</span>
        <span className="admin-messages-desktop-row__identity">
          <strong>{item.name || "Customer Support"}</strong>
          <small>{item.email || "No email"}</small>
        </span>
        <span className={`admin-messages-status-pill ${statusClass(item.status)}`}>{item.status || "new"}</span>
        <span className="admin-messages-desktop-row__updated">
          <small>Updated</small>
          <strong>{formatDateTime(item.updatedAt)}</strong>
        </span>
        <AdminProductsIcon name="chevron" />
      </button>
      {isExpanded ? (
        <div className="admin-messages-desktop-row__detail">
          <header>
            <h3>{item.subject || "Support request"}</h3>
            <span>Created {formatDateTime(item.createdAt)}</span>
          </header>
          <MessageTicketDetailBody item={item} busy={busy} runAction={runAction} />
        </div>
      ) : null}
    </article>
  );
}

function MessageMobileListItem({ item, isActive, onOpen }) {
  return (
    <button type="button" className={`admin-messages-mobile-item ${isActive ? "is-active" : ""}`} onClick={onOpen}>
      <span className="admin-messages-avatar">{ticketInitials(item.name, item.email)}</span>
      <span className="admin-messages-mobile-item__content">
        <span className="admin-messages-mobile-item__head">
          <strong>{item.name || "Customer Support"}</strong>
          <span className={`admin-messages-status-pill ${statusClass(item.status)}`}>{item.status || "new"}</span>
        </span>
        <small>{item.email || "No email"}</small>
        <span className="admin-messages-mobile-item__foot">
          <time>{formatDateTime(item.updatedAt)}</time>
          <AdminProductsIcon name="chevron" />
        </span>
      </span>
    </button>
  );
}

function MessagesWorkspaceStitch({
  items,
  stats,
  query,
  setQuery,
  refreshing,
  loading,
  busyAction,
  loadData,
  exportCsv,
  exportJson,
  exportSql,
  runAction,
}) {
  const [activeTicketId, setActiveTicketId] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const activeTicket = items.find((item) => String(item?._id || item?.id || "") === activeTicketId) || null;

  return (
    <section className="admin-messages-workspace">
      <section className="admin-messages-desktop-shell">
        <header className="admin-messages-desktop-head">
          <h1>Messages</h1>
          <p>Support Terminal &mdash; reply to tickets and manage status.</p>
        </header>
        <header className="admin-messages-desktop-toolbar">
          <label className="admin-messages-desktop-search">
            <AdminProductsIcon name="search" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search support tickets..." aria-label="Search support tickets" />
          </label>
          <div className="admin-messages-desktop-toolbar__actions">
            <button type="button" className="admin-messages-icon-button" disabled={loading || refreshing} onClick={() => loadData({ background: true })} aria-label="Refresh tickets">
              <AdminProductsIcon name="refresh" />
            </button>
            <div className="admin-messages-export-group">
              <button type="button" onClick={exportCsv}>CSV</button>
              <button type="button" onClick={exportJson}>JSON</button>
              <button type="button" onClick={exportSql}>SQL</button>
            </div>
          </div>
        </header>

        <section className="admin-messages-desktop-stats">
          <article><span>Total Tickets</span><strong>{formatCount(stats?.total || 0)}</strong></article>
          <article><span>Showing</span><strong>{formatCount(items.length)}</strong></article>
          <article className="is-open"><span>Open</span><strong>{formatCount(stats?.open || 0)}</strong></article>
          <article className="is-resolved"><span>Resolved</span><strong>{formatCount(stats?.resolved || 0)}</strong></article>
        </section>

        {!items.length ? (
          <div className="admin-messages-empty-state">
            <h3>No support tickets yet</h3>
            <p>Customer support requests will appear here for reply and status updates.</p>
          </div>
        ) : (
          <div className="admin-messages-desktop-list">
            {items.map((item) => {
              const id = String(item?._id || item?.id || "");
              return <MessageDesktopRow key={id} item={item} busy={busyAction === id} runAction={runAction} />;
            })}
          </div>
        )}
      </section>

      <section className="admin-messages-mobile-shell">
        <header className="admin-messages-mobile-topbar">
          <button type="button" onClick={() => setDrawerOpen(true)} aria-label="Open navigation menu"><AdminProductsIcon name="menu" /></button>
          <h1>Messages</h1>
          <button type="button" onClick={() => loadData({ background: true })} aria-label="Refresh tickets">
            <AdminProductsIcon name="refresh" />
          </button>
        </header>

        <section className="admin-messages-mobile-stats">
          <article><span>Total</span><strong>{formatCount(stats?.total || 0)}</strong></article>
          <article className="is-open"><span>Open</span><strong>{formatCount(stats?.open || 0)}</strong></article>
          <article><span>Done</span><strong>{formatCount(stats?.resolved || 0)}</strong></article>
        </section>

        <label className="admin-messages-mobile-search">
          <AdminProductsIcon name="search" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tickets..." aria-label="Search support tickets" />
        </label>

        <div className="admin-messages-mobile-list-head">
          <h2>Recent Tickets</h2>
        </div>

        {!items.length ? (
          <div className="admin-messages-empty-state is-mobile">
            <h3>No support tickets yet</h3>
            <p>Customer support requests will appear here for reply and status updates.</p>
          </div>
        ) : (
          <div className="admin-messages-mobile-list">
            {items.map((item) => {
              const id = String(item?._id || item?.id || "");
              return (
                <MessageMobileListItem
                  key={id}
                  item={item}
                  isActive={id === activeTicketId}
                  onOpen={() => setActiveTicketId(id)}
                />
              );
            })}
          </div>
        )}

        <div className={`admin-messages-mobile-detail ${activeTicket ? "is-active" : ""}`}>
          {activeTicket ? (
            <>
              <header className="admin-messages-mobile-detail__head">
                <button type="button" onClick={() => setActiveTicketId("")} aria-label="Back to ticket list"><AdminProductsIcon name="back" /></button>
                <div>
                  <h3>{activeTicket.subject || "Support request"}</h3>
                  <span>{activeTicket.name || "Customer Support"}</span>
                </div>
              </header>
              <div className="admin-messages-mobile-detail__body">
                <MessageTicketDetailBody item={activeTicket} busy={busyAction === activeTicketId} runAction={runAction} />
              </div>
            </>
          ) : null}
        </div>

        <MobileNavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </section>
    </section>
  );
}

function DiscountGeneratorForm({ busy, runAction }) {
  return (
    <form
      className="admin-discounts-generator-form"
      onSubmit={(event) => runAction("generateDiscount", { _id: "generateDiscount" }, event)}
    >
      <label>
        <span>Percent Discount (2-10%)</span>
        <input name="percent" type="number" min="2" max="10" placeholder="10" required />
      </label>
      <label>
        <span>Code Count (1-50)</span>
        <input name="count" type="number" min="1" max="50" defaultValue="1" placeholder="25" />
      </label>
      <button type="submit" disabled={busy}>
        <AdminProductsIcon name="plus" />{busy ? "Generating..." : "Generate Codes"}
      </button>
    </form>
  );
}

function DiscountDesktopRow({ item, busy, runAction }) {
  const usedByName = normalizeText(item?.usedBy?.name);
  const usedByEmail = normalizeText(item?.usedBy?.email);
  const usedBy = usedByName || usedByEmail;
  const orderRef = normalizeText(item?.order?._id || item?.order);
  const isUsed = Boolean(item.used);
  return (
    <tr className={`admin-discounts-row ${isUsed ? "is-used" : "is-available"}`}>
      <td><span className="admin-discounts-code-chip">{item.code || "—"}</span></td>
      <td className="admin-discounts-row__percent"><span>{Number(item.percent || 0)}%</span></td>
      <td>
        <span className={`admin-discounts-status ${isUsed ? "is-used" : "is-available"}`}>
          <i />{isUsed ? "Used" : "Available"}
        </span>
      </td>
      <td>
        {isUsed ? (
          <div className="admin-discounts-details">
            {usedBy ? <p><span>Used by:</span> {usedBy}</p> : null}
            {orderRef ? <p><span>Order:</span> {orderRef}</p> : null}
            <p><span>Created:</span> {formatDate(item.createdAt)}</p>
          </div>
        ) : (
          <div className="admin-discounts-details">
            <p><span>Created:</span> {formatDate(item.createdAt)}</p>
            <p className="is-muted">No usage recorded</p>
          </div>
        )}
      </td>
      <td className="admin-discounts-row__actions">
        <button type="button" className="admin-discounts-copy" disabled={busy} onClick={() => runAction("copyDiscountCode", item)}>
          <AdminProductsIcon name="copy" />COPY
        </button>
        <button type="button" className="admin-discounts-delete" disabled={busy} onClick={() => runAction("deleteDiscount", item)} aria-label="Delete discount code">
          <AdminProductsIcon name="delete" />
        </button>
      </td>
    </tr>
  );
}

function DiscountMobileCard({ item, busy, runAction }) {
  const usedByName = normalizeText(item?.usedBy?.name);
  const usedByEmail = normalizeText(item?.usedBy?.email);
  const usedBy = usedByName || usedByEmail;
  const orderRef = normalizeText(item?.order?._id || item?.order);
  const isUsed = Boolean(item.used);
  return (
    <article className={`admin-discounts-mobile-card ${isUsed ? "is-used" : "is-available"}`}>
      <div className="admin-discounts-mobile-card__head">
        <div>
          <span className="admin-discounts-code-chip">{item.code || "—"}</span>
          <span className="admin-discounts-mobile-card__meta">
            <span className={`admin-discounts-mini-pill ${isUsed ? "is-used" : "is-available"}`}>{isUsed ? "Used" : "Available"}</span>
            <small>· Created {formatDate(item.createdAt)}</small>
          </span>
        </div>
        <span className="admin-discounts-percent-chip">{Number(item.percent || 0)}%</span>
      </div>

      {isUsed && (usedBy || orderRef) ? (
        <div className="admin-discounts-mobile-card__used-by">
          <AdminProductsIcon name="person" />
          <div>
            <strong>{usedBy || "Customer"}</strong>
            {orderRef ? <small>Order {orderRef}</small> : null}
          </div>
        </div>
      ) : null}

      <div className="admin-discounts-mobile-card__actions">
        <button type="button" className="admin-discounts-mobile-copy" disabled={busy} onClick={() => runAction("copyDiscountCode", item)}>
          <AdminProductsIcon name="copy" />Copy Code
        </button>
        <button type="button" className="admin-discounts-mobile-delete" disabled={busy} onClick={() => runAction("deleteDiscount", item)}>
          <AdminProductsIcon name="delete" />Delete Code
        </button>
      </div>
    </article>
  );
}

function DiscountsWorkspaceStitch({
  items,
  stats,
  query,
  setQuery,
  discountStatusFilter,
  setDiscountStatusFilter,
  discountPercentFilter,
  setDiscountPercentFilter,
  discountSort,
  setDiscountSort,
  resetDiscountFilters,
  refreshing,
  loading,
  busyAction,
  loadData,
  exportCsv,
  exportJson,
  exportSql,
  runAction,
}) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const total = Number(stats?.total || 0);
  const available = Number(stats?.available || 0);
  const used = Number(stats?.used || 0);
  const avgPercent = Number(stats?.avgPercent || 0);

  return (
    <section className="admin-discounts-workspace">
      <section className="admin-discounts-desktop-shell">
        <header className="admin-discounts-desktop-header">
          <div>
            <h1>Discounts Management</h1>
            <p>Generate, monitor, and manage promotional codes for enterprise procurement.</p>
          </div>
          <button type="button" className="ghost-button" disabled={loading || refreshing} onClick={() => loadData({ background: true })}>
            <AdminProductsIcon name="refresh" />Refresh
          </button>
        </header>

        <section className="admin-discounts-generator">
          <div className="admin-discounts-generator__head">
            <AdminProductsIcon name="settings" />
            <h2>Generator Panel</h2>
          </div>
          <DiscountGeneratorForm busy={busyAction === "generateDiscount"} runAction={runAction} />
        </section>

        <section className="admin-discounts-desktop-stats">
          <article><span>Total Codes</span><strong>{formatCount(total)}</strong></article>
          <article><span>Showing</span><strong>{formatCount(items.length)}</strong></article>
          <article className="is-available"><span>Available</span><strong>{formatCount(available)}</strong></article>
          <article className="is-used"><span>Used</span><strong>{formatCount(used)}</strong></article>
          <article><span>Avg Percent</span><strong>{avgPercent.toFixed(1)}%</strong></article>
        </section>

        <section className="admin-discounts-toolbar">
          <label className="admin-discounts-search">
            <AdminProductsIcon name="search" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search codes..." aria-label="Search discount codes" />
          </label>
          <label className="admin-discounts-toolbar__filter">
            <span>Status</span>
            <select value={discountStatusFilter} onChange={(event) => setDiscountStatusFilter(event.target.value)}>
              <option value="all">All</option>
              <option value="available">Available</option>
              <option value="used">Used</option>
            </select>
          </label>
          <label className="admin-discounts-toolbar__filter">
            <span>Percent</span>
            <select value={discountPercentFilter} onChange={(event) => setDiscountPercentFilter(event.target.value)}>
              <option value="all">2-10%</option>
              {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((percent) => (
                <option key={percent} value={percent}>{percent}%</option>
              ))}
            </select>
          </label>
          <label className="admin-discounts-toolbar__filter">
            <span>Sort</span>
            <select value={discountSort} onChange={(event) => setDiscountSort(event.target.value)}>
              {DISCOUNT_SORT_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <button type="button" className="ghost-button" onClick={resetDiscountFilters}>Clear Filters</button>
          <div className="admin-discounts-export-group">
            <button type="button" onClick={exportCsv}>CSV</button>
            <button type="button" onClick={exportJson}>JSON</button>
            <button type="button" onClick={exportSql}>SQL</button>
          </div>
        </section>

        <section className="admin-discounts-table-panel">
          {!items.length ? (
            <div className="admin-discounts-empty-state">
              <h3>No discount codes yet</h3>
              <p>Generated codes will appear here for copy, tracking, and removal.</p>
            </div>
          ) : (
            <>
              <table className="admin-discounts-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Percent</th>
                    <th>Status</th>
                    <th>Details</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const id = item._id || item.id;
                    return <DiscountDesktopRow key={id} item={item} busy={busyAction === id} runAction={runAction} />;
                  })}
                </tbody>
              </table>
              <footer className="admin-discounts-table-footer">
                <p>Showing {items.length} of {formatCount(total)} codes</p>
              </footer>
            </>
          )}
        </section>
      </section>

      <section className="admin-discounts-mobile-shell">
        <header className="admin-discounts-mobile-topbar">
          <button type="button" onClick={() => setDrawerOpen(true)} aria-label="Open navigation menu"><AdminProductsIcon name="menu" /></button>
          <h1>Discounts</h1>
          <button type="button" onClick={() => setMobileFiltersOpen((current) => !current)} aria-label="Toggle filters" aria-expanded={mobileFiltersOpen}>
            <AdminProductsIcon name="tune" />
          </button>
        </header>

        {mobileFiltersOpen ? (
          <section className="admin-discounts-mobile-filters">
            <label>
              <span>Search</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search codes..." />
            </label>
            <label>
              <span>Status</span>
              <select value={discountStatusFilter} onChange={(event) => setDiscountStatusFilter(event.target.value)}>
                <option value="all">All</option>
                <option value="available">Available</option>
                <option value="used">Used</option>
              </select>
            </label>
            <label>
              <span>Percent</span>
              <select value={discountPercentFilter} onChange={(event) => setDiscountPercentFilter(event.target.value)}>
                <option value="all">2-10%</option>
                {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((percent) => (
                  <option key={percent} value={percent}>{percent}%</option>
                ))}
              </select>
            </label>
            <label>
              <span>Sort</span>
              <select value={discountSort} onChange={(event) => setDiscountSort(event.target.value)}>
                {DISCOUNT_SORT_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <div className="admin-discounts-mobile-filters__actions">
              <button type="button" onClick={resetDiscountFilters}>Reset</button>
              <button type="button" onClick={() => setMobileFiltersOpen(false)}>Apply</button>
            </div>
          </section>
        ) : null}

        <section className="admin-discounts-mobile-stats">
          <article><span>Total</span><strong>{formatCount(total)}</strong></article>
          <article className="is-available"><span>Available</span><strong>{formatCount(available)}</strong></article>
          <article className="is-used"><span>Used</span><strong>{formatCount(used)}</strong></article>
        </section>

        <section className="admin-discounts-mobile-generator">
          <div className="admin-discounts-generator__head">
            <AdminProductsIcon name="settings" />
            <h2>Generator</h2>
          </div>
          <DiscountGeneratorForm busy={busyAction === "generateDiscount"} runAction={runAction} />
        </section>

        <div className="admin-discounts-mobile-list-head">
          <h2>Codes</h2>
          <button type="button" className="admin-discounts-icon-button" disabled={loading || refreshing} onClick={() => loadData({ background: true })} aria-label="Refresh codes">
            <AdminProductsIcon name="refresh" />
          </button>
        </div>

        {!items.length ? (
          <div className="admin-discounts-empty-state is-mobile">
            <h3>No discount codes yet</h3>
            <p>Generated codes will appear here for copy, tracking, and removal.</p>
          </div>
        ) : (
          <div className="admin-discounts-mobile-list">
            {items.map((item) => {
              const id = item._id || item.id;
              return <DiscountMobileCard key={id} item={item} busy={busyAction === id} runAction={runAction} />;
            })}
          </div>
        )}

        <MobileNavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </section>
    </section>
  );
}

export default function AdminManager({ type, productMode = "list", productId = "" }) {
  const config = ADMIN_CONFIG[type] || ADMIN_CONFIG.dashboard;
  const { token, user } = useAuth();
  const { pushToast } = useToast();
  const router = useRouter();
  const [payload, setPayload] = useState(type === "dashboard" ? {} : []);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [busyAction, setBusyAction] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [toolbarOpen, setToolbarOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [productBrandFilter, setProductBrandFilter] = useState("all");
  const [productStockFilter, setProductStockFilter] = useState("all");
  const [productFeaturedFilter, setProductFeaturedFilter] = useState("all");
  const [productSort, setProductSort] = useState("newest");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [userStatusFilter, setUserStatusFilter] = useState("all");
  const [userSort, setUserSort] = useState("newest");
  const [affiliateTierFilter, setAffiliateTierFilter] = useState("all");
  const [affiliateStatusFilter, setAffiliateStatusFilter] = useState("all");
  const [affiliateSort, setAffiliateSort] = useState("earned-desc");
  const [affiliateSettingsOpen, setAffiliateSettingsOpen] = useState(false);
  const [affiliateLeaderboardOpen, setAffiliateLeaderboardOpen] = useState(false);
  const [reviewStatusFilter, setReviewStatusFilter] = useState("all");
  const [reviewRatingFilter, setReviewRatingFilter] = useState("all");
  const [reviewSort, setReviewSort] = useState("newest");
  const [selectedReviewIds, setSelectedReviewIds] = useState([]);
  const [discountStatusFilter, setDiscountStatusFilter] = useState("all");
  const [discountPercentFilter, setDiscountPercentFilter] = useState("all");
  const [discountSort, setDiscountSort] = useState("newest");
  const [userInsights, setUserInsights] = useState({});
  const [userActivityMap, setUserActivityMap] = useState({});
  const [selectedUser360, setSelectedUser360] = useState(null);
  const isAdmin = user?.role === "admin";
  const isProductCreatePage = type === "products" && productMode === "create";
  const isProductEditPage = type === "products" && productMode === "edit";
  const isProductDedicatedPage = isProductCreatePage || isProductEditPage;

  const loadData = useCallback(async ({ background = false } = {}) => {
    if (!token || !isAdmin) return;
    if (!background) setLoading(true);
    if (background) setRefreshing(true);
    try {
      const data = await requestWithToken(config.endpoint, token);
      setPayload(pickList(type, data));
      setSettings(data?.settings || null);
      if (type === "users") {
        const [ordersResult, reviewsResult, ticketsResult] = await Promise.allSettled([
          requestWithToken(API_BASE_ORDERS, token),
          requestWithToken(`${API_BASE}/reviews`, token),
          requestWithToken(API_BASE_SUPPORT, token),
        ]);
        const users = pickList(type, data);
        const orders = ordersResult.status === "fulfilled" ? asArray(ordersResult.value) : [];
        const reviews = reviewsResult.status === "fulfilled" ? asArray(reviewsResult.value) : [];
        const tickets = ticketsResult.status === "fulfilled" ? asArray(ticketsResult.value?.tickets || ticketsResult.value) : [];
        setUserInsights(buildUserInsights(users, orders, reviews, tickets));
        const nextActivity = {};
        for (const account of users) {
          const emailKey = normalizeEmail(account?.email);
          if (!emailKey) continue;
          nextActivity[emailKey] = {
            wishlistCount: Array.isArray(account?.wishlist) ? account.wishlist.length : 0,
            searchTerms: [...(Array.isArray(account?.behavior?.searchTerms) ? account.behavior.searchTerms : [])]
              .sort((a, b) => Number(b?.count || 0) - Number(a?.count || 0))
              .slice(0, 10),
            interests: [...(Array.isArray(account?.behavior?.categoryInterests) ? account.behavior.categoryInterests : [])]
              .sort((a, b) => Number(b?.count || 0) - Number(a?.count || 0))
              .slice(0, 10),
            orders: orders.filter((order) => {
              const orderEmail = normalizeEmail(order?.shippingEmail || order?.guestEmail || order?.user?.email);
              return orderEmail === emailKey;
            }),
            reviews: reviews.filter((review) => normalizeEmail(review?.user?.email) === emailKey),
            tickets: tickets.filter((ticket) => normalizeEmail(ticket?.email) === emailKey),
          };
        }
        setUserActivityMap(nextActivity);
      } else {
        setUserInsights({});
        setUserActivityMap({});
        setSelectedUser360(null);
      }
      setError("");
    } catch (err) {
      setError(err.message || "Could not load admin data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [config.endpoint, isAdmin, token, type]);

  useEffect(() => {
    if (!token || !isAdmin) return;
    const timer = window.setTimeout(() => {
      loadData();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [isAdmin, loadData, token]);

  useEffect(() => {
    if (!token || !isAdmin || type !== "orders") return undefined;
    const timer = window.setInterval(() => {
      loadData({ background: true });
    }, 20000);
    return () => window.clearInterval(timer);
  }, [isAdmin, loadData, token, type]);

  const allRecords = useMemo(() => {
    if (type === "dashboard") return [];
    const list = Array.isArray(payload) ? payload : [];
    const q = query.trim().toLowerCase();
    return q ? list.filter((item) => itemSearchText(item).includes(q)) : list;
  }, [payload, query, type]);

  const productBrands = useMemo(() => {
    if (type !== "products") return [];
    const unique = new Set();
    for (const item of allRecords) {
      const brand = normalizeText(item?.subCategory || item?.brand);
      if (brand) unique.add(brand);
    }
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [allRecords, type]);

  const items = useMemo(() => {
    if (type === "reviews") {
      let list = [...allRecords];
      if (reviewStatusFilter === "approved") {
        list = list.filter((item) => Boolean(item?.approved));
      }
      if (reviewStatusFilter === "rejected") {
        list = list.filter((item) => !Boolean(item?.approved));
      }
      if (reviewRatingFilter !== "all") {
        const min = Number(reviewRatingFilter);
        if (Number.isFinite(min)) {
          list = list.filter((item) => Number(item?.rating || 0) >= min);
        }
      }
      const toTime = (value) => {
        const date = new Date(value || 0).getTime();
        return Number.isFinite(date) ? date : 0;
      };
      list.sort((a, b) => {
        if (reviewSort === "oldest") return toTime(a?.createdAt) - toTime(b?.createdAt);
        if (reviewSort === "rating-desc") return Number(b?.rating || 0) - Number(a?.rating || 0);
        if (reviewSort === "rating-asc") return Number(a?.rating || 0) - Number(b?.rating || 0);
        return toTime(b?.createdAt) - toTime(a?.createdAt);
      });
      return list;
    }

    if (type === "affiliates") {
      let list = [...allRecords];
      if (affiliateTierFilter !== "all") {
        list = list.filter((item) => String(item?.tier || "starter").toLowerCase() === affiliateTierFilter);
      }
      if (affiliateStatusFilter === "active") {
        list = list.filter((item) => item?.isActive !== false);
      }
      if (affiliateStatusFilter === "inactive") {
        list = list.filter((item) => item?.isActive === false);
      }
      const toTime = (value) => {
        const date = new Date(value || 0).getTime();
        return Number.isFinite(date) ? date : 0;
      };
      list.sort((a, b) => {
        const aReferrals = Number(a?.stats?.totalReferrals || 0);
        const bReferrals = Number(b?.stats?.totalReferrals || 0);
        const aPending = Number(a?.stats?.pendingCommission || 0);
        const bPending = Number(b?.stats?.pendingCommission || 0);
        const aEarned = Number(a?.stats?.earnedCommission || 0);
        const bEarned = Number(b?.stats?.earnedCommission || 0);
        if (affiliateSort === "pending-desc") return bPending - aPending;
        if (affiliateSort === "referrals-desc") return bReferrals - aReferrals;
        if (affiliateSort === "newest") return toTime(b?.createdAt) - toTime(a?.createdAt);
        if (affiliateSort === "oldest") return toTime(a?.createdAt) - toTime(b?.createdAt);
        if (affiliateSort === "code-asc") return String(a?.code || "").localeCompare(String(b?.code || ""));
        if (affiliateSort === "code-desc") return String(b?.code || "").localeCompare(String(a?.code || ""));
        return bEarned - aEarned;
      });
      return list;
    }

    if (type === "users") {
      let list = [...allRecords];
      if (userRoleFilter !== "all") {
        list = list.filter((item) => String(item?.role || "user").toLowerCase() === userRoleFilter);
      }
      if (userStatusFilter === "active") {
        list = list.filter((item) => item?.isActive !== false);
      }
      if (userStatusFilter === "inactive") {
        list = list.filter((item) => item?.isActive === false);
      }
      const toTime = (value) => {
        const date = new Date(value || 0).getTime();
        return Number.isFinite(date) ? date : 0;
      };
      list.sort((a, b) => {
        if (userSort === "oldest") return toTime(a?.createdAt) - toTime(b?.createdAt);
        if (userSort === "name-asc") return String(a?.name || "").localeCompare(String(b?.name || ""));
        if (userSort === "name-desc") return String(b?.name || "").localeCompare(String(a?.name || ""));
        if (userSort === "email-asc") return String(a?.email || "").localeCompare(String(b?.email || ""));
        if (userSort === "email-desc") return String(b?.email || "").localeCompare(String(a?.email || ""));
        return toTime(b?.createdAt) - toTime(a?.createdAt);
      });
      return list;
    }

    if (type === "discounts") {
      let list = [...allRecords];
      if (discountStatusFilter === "available") {
        list = list.filter((item) => !Boolean(item?.used));
      }
      if (discountStatusFilter === "used") {
        list = list.filter((item) => Boolean(item?.used));
      }
      if (discountPercentFilter !== "all") {
        const percent = Number(discountPercentFilter);
        if (Number.isFinite(percent)) {
          list = list.filter((item) => Number(item?.percent || 0) === percent);
        }
      }
      const toTime = (value) => {
        const date = new Date(value || 0).getTime();
        return Number.isFinite(date) ? date : 0;
      };
      list.sort((a, b) => {
        if (discountSort === "oldest") return toTime(a?.createdAt) - toTime(b?.createdAt);
        if (discountSort === "percent-desc") return Number(b?.percent || 0) - Number(a?.percent || 0);
        if (discountSort === "percent-asc") return Number(a?.percent || 0) - Number(b?.percent || 0);
        if (discountSort === "code-asc") return String(a?.code || "").localeCompare(String(b?.code || ""));
        if (discountSort === "code-desc") return String(b?.code || "").localeCompare(String(a?.code || ""));
        return toTime(b?.createdAt) - toTime(a?.createdAt);
      });
      return list;
    }

    if (type !== "products") return allRecords;
    let list = [...allRecords];

    if (productCategoryFilter !== "all") {
      list = list.filter((item) => String(item?.category || "").toLowerCase() === productCategoryFilter);
    }
    if (productBrandFilter !== "all") {
      list = list.filter((item) => {
        const brand = String(item?.subCategory || item?.brand || "").toLowerCase();
        return brand === productBrandFilter;
      });
    }
    if (productStockFilter === "in") {
      list = list.filter((item) => Number(item?.countInStock || 0) > 0);
    }
    if (productStockFilter === "out") {
      list = list.filter((item) => Number(item?.countInStock || 0) <= 0);
    }
    if (productFeaturedFilter === "yes") {
      list = list.filter((item) => Boolean(item?.isFeatured));
    }
    if (productFeaturedFilter === "no") {
      list = list.filter((item) => !Boolean(item?.isFeatured));
    }

    const toTime = (value) => {
      const date = new Date(value || 0).getTime();
      return Number.isFinite(date) ? date : 0;
    };
    list.sort((a, b) => {
      if (productSort === "oldest") return toTime(a?.createdAt) - toTime(b?.createdAt);
      if (productSort === "name-asc") return String(a?.name || "").localeCompare(String(b?.name || ""));
      if (productSort === "name-desc") return String(b?.name || "").localeCompare(String(a?.name || ""));
      if (productSort === "price-asc") return Number(a?.price || 0) - Number(b?.price || 0);
      if (productSort === "price-desc") return Number(b?.price || 0) - Number(a?.price || 0);
      if (productSort === "stock-asc") return Number(a?.countInStock || 0) - Number(b?.countInStock || 0);
      if (productSort === "stock-desc") return Number(b?.countInStock || 0) - Number(a?.countInStock || 0);
      return toTime(b?.createdAt) - toTime(a?.createdAt);
    });

    return list;
  }, [
    allRecords,
    productBrandFilter,
    productCategoryFilter,
    productFeaturedFilter,
    productSort,
    productStockFilter,
    userRoleFilter,
    userSort,
    userStatusFilter,
    affiliateSort,
    affiliateStatusFilter,
    affiliateTierFilter,
    reviewStatusFilter,
    reviewRatingFilter,
    reviewSort,
    discountStatusFilter,
    discountPercentFilter,
    discountSort,
    type,
  ]);

  const editingProduct = useMemo(() => {
    if (!isProductEditPage) return null;
    const list = Array.isArray(payload) ? payload : [];
    return list.find((entry) => String(entry?._id || entry?.id || "") === String(productId || "")) || null;
  }, [isProductEditPage, payload, productId]);

  const productStats = useMemo(() => {
    if (type !== "products") return null;
    const all = Array.isArray(payload) ? payload : [];
    return {
      total: all.length,
      filtered: items.length,
      featured: all.filter((item) => Boolean(item?.isFeatured)).length,
      outOfStock: all.filter((item) => Number(item?.countInStock || 0) <= 0).length,
    };
  }, [items.length, payload, type]);
  const productTopCategory = useMemo(() => {
    if (type !== "products") return { label: "None", count: 0 };
    const counts = new Map();
    for (const item of Array.isArray(payload) ? payload : []) {
      const label = normalizeText(item?.category) || "Uncategorised";
      counts.set(label, (counts.get(label) || 0) + 1);
    }
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    return top ? { label: top[0], count: top[1] } : { label: "None", count: 0 };
  }, [payload, type]);
  const userStats = useMemo(() => {
    if (type !== "users") return null;
    const all = Array.isArray(payload) ? payload : [];
    return {
      total: all.length,
      filtered: items.length,
      admins: all.filter((item) => String(item?.role || "").toLowerCase() === "admin").length,
      active: all.filter((item) => item?.isActive !== false).length,
      inactive: all.filter((item) => item?.isActive === false).length,
    };
  }, [items.length, payload, type]);
  const affiliateStats = useMemo(() => {
    if (type !== "affiliates") return null;
    const all = Array.isArray(payload) ? payload : [];
    const totalPending = all.reduce((sum, item) => sum + Number(item?.stats?.pendingCommission || 0), 0);
    const totalEarned = all.reduce((sum, item) => sum + Number(item?.stats?.earnedCommission || 0), 0);
    const totalReferrals = all.reduce((sum, item) => sum + Number(item?.stats?.totalReferrals || 0), 0);
    return {
      total: all.length,
      filtered: items.length,
      active: all.filter((item) => item?.isActive !== false).length,
      inactive: all.filter((item) => item?.isActive === false).length,
      totalPending,
      totalEarned,
      totalReferrals,
    };
  }, [items.length, payload, type]);
  const affiliateLeaderboard = useMemo(() => {
    if (type !== "affiliates") return [];
    return [...(Array.isArray(payload) ? payload : [])]
      .sort((a, b) => {
        const earnedDiff = Number(b?.stats?.earnedCommission || 0) - Number(a?.stats?.earnedCommission || 0);
        if (earnedDiff) return earnedDiff;
        const referralDiff = Number(b?.stats?.totalReferrals || 0) - Number(a?.stats?.totalReferrals || 0);
        if (referralDiff) return referralDiff;
        return String(a?.code || "").localeCompare(String(b?.code || ""));
      })
      .slice(0, 10);
  }, [payload, type]);
  const reviewStats = useMemo(() => {
    if (type !== "reviews") return null;
    const all = Array.isArray(payload) ? payload : [];
    const approved = all.filter((item) => Boolean(item?.approved)).length;
    const rejected = all.length - approved;
    const avgRating = all.length
      ? all.reduce((sum, item) => sum + Number(item?.rating || 0), 0) / all.length
      : 0;
    return {
      total: all.length,
      filtered: items.length,
      approved,
      rejected,
      avgRating,
    };
  }, [items.length, payload, type]);
  const discountStats = useMemo(() => {
    if (type !== "discounts") return null;
    const all = Array.isArray(payload) ? payload : [];
    const used = all.filter((item) => Boolean(item?.used)).length;
    const available = all.length - used;
    const avgPercent = all.length
      ? all.reduce((sum, item) => sum + Number(item?.percent || 0), 0) / all.length
      : 0;
    return {
      total: all.length,
      filtered: items.length,
      used,
      available,
      avgPercent,
    };
  }, [items.length, payload, type]);
  const messageStats = useMemo(() => {
    if (type !== "messages") return null;
    const all = Array.isArray(payload) ? payload : [];
    const open = all.filter((item) => ["new", "pending"].includes(String(item?.status || "").toLowerCase())).length;
    const resolved = all.filter((item) => String(item?.status || "").toLowerCase() === "resolved").length;
    const statusRows = summarizeCounts(all.map((item) => String(item?.status || "new").toLowerCase()), 8);
    const topicRows = summarizeCounts(all.map((item) => item?.subject || "Support"), 8);
    return {
      total: all.length,
      filtered: items.length,
      open,
      resolved,
      statusRows,
      topicRows,
    };
  }, [items.length, payload, type]);
  const orderStats = useMemo(() => {
    if (type !== "orders") return null;
    const all = Array.isArray(payload) ? payload : [];
    const statusRows = summarizeCounts(all.map((order) => String(order?.orderStatus || "pending").toLowerCase()), 8);
    const paymentMethodRows = summarizeCounts(all.map((order) => String(order?.paymentMethod || "unknown").toLowerCase()), 8);
    const flowRows = summarizeCounts(all.map((order) => String(order?.paymentFlow || "manual").toLowerCase()), 5);
    return {
      total: all.length,
      filtered: items.length,
      statusRows,
      paymentMethodRows,
      flowRows,
      revenue: all.reduce((sum, order) => {
        const delivered = String(order?.orderStatus || "").toLowerCase() === "delivered" || Boolean(order?.isDelivered);
        return delivered ? sum + Number(order?.totalPrice || 0) : sum;
      }, 0),
    };
  }, [items.length, payload, type]);

  const exportRows = useMemo(() => {
    if (!Array.isArray(items)) return [];
    if (type === "orders") {
      return items.map((item) => ({
        id: item?._id || "",
        order_number: item?.orderNumber || "",
        customer_name: item?.shippingName || item?.guestName || item?.user?.name || "",
        customer_email: item?.shippingEmail || item?.guestEmail || item?.user?.email || "",
        total_price: Number(item?.totalPrice || 0),
        payment_method: item?.paymentMethod || "",
        payment_flow: item?.paymentFlow || "",
        payment_status: item?.paymentStatus || "",
        order_status: item?.orderStatus || "",
        affiliate_code: item?.affiliateCode || "",
        affiliate_code_entered: item?.affiliateCodeEntered || "",
        created_at: item?.createdAt || "",
      }));
    }
    if (type === "products") {
      return items.map((item) => ({
        id: item?._id || "",
        name: item?.name || "",
        category: item?.category || "",
        sub_category: item?.subCategory || item?.brand || "",
        brand: item?.brand || "",
        price: Number(item?.price || 0),
        stock: Number(item?.countInStock || 0),
        featured: Boolean(item?.isFeatured),
        sections: Array.isArray(item?.homeSections) ? item.homeSections.join("|") : "",
        created_at: item?.createdAt || "",
      }));
    }
    if (type === "users") {
      return items.map((item) => {
        const email = normalizeEmail(item?.email);
        const insight = userInsights?.[email] || {};
        const searchTerms = Array.isArray(item?.behavior?.searchTerms) ? item.behavior.searchTerms : [];
        const interests = Array.isArray(item?.behavior?.categoryInterests) ? item.behavior.categoryInterests : [];
        const topSearch = [...searchTerms].sort((a, b) => Number(b?.count || 0) - Number(a?.count || 0))[0];
        const topInterest = [...interests].sort((a, b) => Number(b?.count || 0) - Number(a?.count || 0))[0];
        return {
          id: item?._id || "",
          name: item?.name || "",
          email: item?.email || "",
          role: item?.role || "user",
          active: item?.isActive !== false,
          region: item?.region || "",
          wishlist_items: Array.isArray(item?.wishlist) ? item.wishlist.length : 0,
          order_count: Number(insight?.totalOrders || 0),
          total_spent: Number(insight?.totalSpent || 0),
          review_count: Number(insight?.reviewCount || 0),
          avg_rating: Number(insight?.avgRating || 0).toFixed(2),
          support_tickets: Number(insight?.supportTickets || 0),
          top_search_term: topSearch?.term || "",
          top_interest_category: topInterest?.category || "",
          created_at: item?.createdAt || "",
        };
      });
    }
    if (type === "affiliates") {
      return items.map((item) => ({
        id: item?._id || "",
        code: item?.code || "",
        user_name: item?.user?.name || "",
        user_email: item?.user?.email || "",
        tier: item?.tier || "starter",
        active: item?.isActive !== false,
        commission_rate: Number(item?.commissionRate || 0),
        referrals: Number(item?.stats?.totalReferrals || 0),
        pending_commission: Number(item?.stats?.pendingCommission || 0),
        earned_commission: Number(item?.stats?.earnedCommission || 0),
        created_at: item?.createdAt || "",
      }));
    }
    if (type === "reviews") {
      return items.map((item) => ({
        id: item?._id || "",
        reviewer_name: item?.user?.name || "",
        reviewer_email: item?.user?.email || "",
        product_name: item?.product?.name || "",
        rating: Number(item?.rating || 0),
        approved: Boolean(item?.approved),
        title: item?.title || "",
        comment: item?.comment || "",
        created_at: item?.createdAt || "",
      }));
    }
    return items.map((item) => ({ id: item?._id || item?.id || "", raw: JSON.stringify(item) }));
  }, [items, type, userInsights]);

  const sqlTableName = useMemo(() => `admin_${toSlug(type)}`, [type]);

  const count = type === "dashboard" ? Object.keys(payload || {}).length : items.length;

  function resetProductFilters() {
    setProductCategoryFilter("all");
    setProductBrandFilter("all");
    setProductStockFilter("all");
    setProductFeaturedFilter("all");
    setProductSort("newest");
    setQuery("");
  }
  function resetUserFilters() {
    setUserRoleFilter("all");
    setUserStatusFilter("all");
    setUserSort("newest");
    setQuery("");
  }
  function resetAffiliateFilters() {
    setAffiliateTierFilter("all");
    setAffiliateStatusFilter("all");
    setAffiliateSort("earned-desc");
    setQuery("");
  }
  function resetReviewFilters() {
    setReviewStatusFilter("all");
    setReviewRatingFilter("all");
    setReviewSort("newest");
    setSelectedReviewIds([]);
    setQuery("");
  }
  function resetDiscountFilters() {
    setDiscountStatusFilter("all");
    setDiscountPercentFilter("all");
    setDiscountSort("newest");
    setQuery("");
  }

  function exportCsv() {
    const csv = toCsv(exportRows);
    if (!csv) {
      pushToast("No records to export", "warning");
      return;
    }
    downloadTextFile(`${toSlug(type)}_export.csv`, csv, "text/csv;charset=utf-8;");
    pushToast("CSV export downloaded", "success");
  }

  function exportJson() {
    const json = JSON.stringify(exportRows, null, 2);
    if (!exportRows.length) {
      pushToast("No records to export", "warning");
      return;
    }
    downloadTextFile(`${toSlug(type)}_export.json`, json, "application/json;charset=utf-8;");
    pushToast("JSON export downloaded", "success");
  }

  function exportSql() {
    const sql = toSqlInsert(sqlTableName, exportRows);
    if (!exportRows.length) {
      pushToast("No records to export", "warning");
      return;
    }
    downloadTextFile(`${toSlug(type)}_export.sql`, sql, "text/sql;charset=utf-8;");
    pushToast("SQL export downloaded", "success");
  }

  async function runAction(action, item, event, value) {
    event?.preventDefault?.();
    if (action === "openUser360") {
      setSelectedUser360(item || null);
      return;
    }
    if (
      action.toLowerCase().includes("delete") &&
      typeof window !== "undefined" &&
      !window.confirm("This admin action will delete this record. Continue?")
    ) {
      return;
    }
    const id = item?._id || item?.id || action;
    setBusyAction(id);
    try {
      if (action === "createProduct" || action === "updateProduct") {
        const form = new FormData(event.currentTarget);
        form.set("isFeatured", form.get("isFeatured") ? "true" : "false");
        const imageUrlValues = [
          normalizeText(form.get("image_url")),
          ...String(form.get("imageUrls") || "")
            .split(",")
            .map((value) => normalizeText(value))
            .filter(Boolean),
        ];
        const selectedFiles = form.getAll("images").filter((value) => value instanceof File && value.size > 0);
        if (imageUrlValues.filter(Boolean).length + selectedFiles.length > MAX_PRODUCT_IMAGES) {
          throw new Error(`A product can have at most ${MAX_PRODUCT_IMAGES} images in total.`);
        }
        const url = action === "createProduct" ? API_BASE_PRODUCTS : `${API_BASE_PRODUCTS}/${item._id}`;
        await requestWithToken(url, token, { method: action === "createProduct" ? "POST" : "PUT", body: form });
      }
      if (action === "deleteProduct") await requestWithToken(`${API_BASE_PRODUCTS}/${item._id}`, token, { method: "DELETE" });
      if (action === "orderStatus") await requestWithToken(`${API_BASE_ORDERS}/${item._id}/status`, token, { method: "PUT", body: JSON.stringify({ status: value }) });
      if (action === "paymentStatus") await requestWithToken(`${API_BASE_ORDERS}/${item._id}/payment-status`, token, { method: "PUT", body: JSON.stringify({ paymentStatus: value }) });
      if (action === "updateEta") {
        await requestWithToken(`${API_BASE_ORDERS}/${item._id}/status`, token, {
          method: "PUT",
          body: JSON.stringify({
            estimatedDeliveryDate: value,
          }),
        });
      }
      if (action === "markPaid") await requestWithToken(`${API_BASE_ORDERS}/${item._id}/pay`, token, { method: "PUT" });
      if (action === "markDelivered") await requestWithToken(`${API_BASE_ORDERS}/${item._id}/deliver`, token, { method: "PUT" });
      if (action === "deleteOrder") await requestWithToken(`${API_BASE_ORDERS}/${item._id}`, token, { method: "DELETE" });
      if (action === "resyncAffiliates") await requestWithToken(`${API_BASE_ORDERS}/admin/resync-affiliates`, token, { method: "POST" });
      if (action === "updateSupport") {
        const form = new FormData(event.currentTarget);
        const nextStatus = normalizeText(form.get("status")) || "new";
        const replyText = normalizeText(form.get("response"));
        const currentStatus = normalizeText(item?.status) || "new";
        if (nextStatus !== currentStatus) {
          await requestWithToken(`${API_BASE_SUPPORT}/${item._id}`, token, {
            method: "PUT",
            body: JSON.stringify({ status: nextStatus }),
          });
        }
        if (replyText) {
          await requestWithToken(`${API_BASE_SUPPORT}/${item._id}/reply`, token, {
            method: "POST",
            body: JSON.stringify({ message: replyText }),
          });
        }
      }
      if (action === "userStatus") await requestWithToken(`${API_BASE_USERS}/admin/users/${item._id}/status`, token, { method: "PUT", body: JSON.stringify({ isActive: value }) });
      if (action === "deleteUser") {
        if (String(item?.role || "").toLowerCase() === "admin") {
          throw new Error("Admin accounts cannot be deleted");
        }
        await requestWithToken(`${API_BASE_USERS}/admin/users/${item._id}`, token, { method: "DELETE" });
      }
      if (action === "moderateReview") await requestWithToken(`${API_BASE}/reviews/${item._id}/moderate`, token, { method: "PUT", body: JSON.stringify({ approved: value }) });
      if (action === "deleteReview") await requestWithToken(`${API_BASE}/reviews/${item._id}`, token, { method: "DELETE" });
      if (action === "affiliateStatus") await requestWithToken(`${API_BASE}/affiliates/admin/${item._id}/status`, token, { method: "PUT", body: JSON.stringify({ isActive: value }) });
      if (action === "affiliateMomoVerification") {
        await requestWithToken(`${API_BASE}/affiliates/admin/${item._id}/momo-verification`, token, {
          method: "PUT",
          body: JSON.stringify({ momoNumberVerified: value }),
        });
      }
      if (action === "deleteAffiliate") await requestWithToken(`${API_BASE}/affiliates/admin/${item._id}`, token, { method: "DELETE" });
      if (action === "copyAffiliateCode") {
        const code = normalizeText(item?.code);
        if (!code) throw new Error("No affiliate code found for this record.");
        if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(code);
          pushToast("Affiliate code copied", "success");
        } else {
          throw new Error("Clipboard is not available on this browser.");
        }
        return;
      }
      if (action === "copyDiscountCode") {
        const code = normalizeText(item?.code);
        if (!code) throw new Error("No discount code found for this record.");
        if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(code);
          pushToast("Discount code copied", "success");
        } else {
          throw new Error("Clipboard is not available on this browser.");
        }
        return;
      }
      if (action === "updateAffiliateSettings") {
        const form = new FormData(event.currentTarget);
        await requestWithToken(`${API_BASE}/affiliates/admin/settings`, token, {
          method: "PUT",
          body: JSON.stringify({
            defaultCommissionRate: Number(form.get("defaultCommissionRate")),
            tierThresholds: {
              bronze: Number(form.get("bronze")),
              silver: Number(form.get("silver")),
              gold: Number(form.get("gold")),
            },
          }),
        });
      }
      if (action === "generateDiscount") {
        const form = new FormData(event.currentTarget);
        await requestWithToken(`${API_BASE}/admin/discounts`, token, {
          method: "POST",
          body: JSON.stringify({ percent: Number(form.get("percent")), count: Number(form.get("count") || 1) }),
        });
      }
      if (action === "deleteDiscount") await requestWithToken(`${API_BASE}/admin/discounts/${item._id}`, token, { method: "DELETE" });
      if (action === "createBanner") {
        const form = new FormData(event.currentTarget);
        const linkCategory = normalizeText(form.get("linkCategory"));
        const linkSubCategory = normalizeText(form.get("linkSubCategory"));
        const link = normalizeText(form.get("link"));
        const payload = new FormData();
        payload.set("title", "");
        payload.set("imageUrl", normalizeText(form.get("imageUrl")));
        payload.set("link", linkCategory ? "" : link);
        payload.set("linkCategory", linkCategory);
        payload.set("linkSubCategory", linkCategory ? (linkSubCategory || "all") : "");
        payload.set("order", String(Number(form.get("order") || 0)));
        const file = form.get("image");
        if (file instanceof File && file.size > 0) {
          payload.set("image", file);
        }
        await requestWithToken(`${API_BASE}/banners`, token, {
          method: "POST",
          body: payload,
        });
      }
      if (action === "updateBanner") {
        const form = new FormData(event.currentTarget);
        const linkCategory = normalizeText(form.get("linkCategory"));
        const linkSubCategory = normalizeText(form.get("linkSubCategory"));
        const link = normalizeText(form.get("link"));
        const payload = new FormData();
        payload.set("title", "");
        payload.set("imageUrl", normalizeText(form.get("imageUrl")));
        payload.set("link", linkCategory ? "" : link);
        payload.set("linkCategory", linkCategory);
        payload.set("linkSubCategory", linkCategory ? (linkSubCategory || "all") : "");
        payload.set("order", String(Number(form.get("order") || 0)));
        const file = form.get("image");
        if (file instanceof File && file.size > 0) {
          payload.set("image", file);
        }
        await requestWithToken(`${API_BASE}/banners/${item._id}`, token, {
          method: "PUT",
          body: payload,
        });
      }
      if (action === "deleteBanner") await requestWithToken(`${API_BASE}/banners/${item._id}`, token, { method: "DELETE" });

      pushToast("Admin update saved", "success");
      if ((action === "createProduct" || action === "updateProduct") && isProductDedicatedPage) {
        router.push("/admin/products");
        return;
      }
      await loadData();
    } catch (err) {
      pushToast(err.message || "Admin action failed", "warning");
    } finally {
      setBusyAction("");
    }
  }

  return (
    <AdminGate title={config.title} subtitle={config.subtitle}>
      <div className={`admin-manager admin-manager--${type}`}>
        {type === "orders" ? (
          <header className="admin-orders-mobile-head">
            <button type="button" onClick={() => setDrawerOpen(true)} aria-label="Open navigation menu">
              <AdminOrdersIcon name="menu" />
            </button>
            <h1>Orders</h1>
            <button type="button" onClick={exportCsv} aria-label="Export orders CSV">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 19h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </header>
        ) : null}
        {type !== "orders" && type !== "products" && type !== "users" && type !== "affiliates" && type !== "reviews" && type !== "banners" && type !== "messages" && type !== "discounts" ? <AdminHero title={config.title} subtitle={config.subtitle} count={count} busy={loading} /> : null}

        {type === "products" && !isProductDedicatedPage ? (
          <>
            <header className="admin-products-mobile-head">
              <button type="button" onClick={() => setDrawerOpen(true)} aria-label="Open navigation menu"><AdminProductsIcon name="menu" /></button>
              <h1>Products</h1>
              <Link href="/admin/products/create" aria-label="Create product"><AdminProductsIcon name="plus" /></Link>
            </header>

            <header className="admin-products-head">
              <div>
                <h1>Products</h1>
                <p>Admin Desktop Workspace <span aria-hidden="true">&bull;</span> Management of {productStats?.total || 0} items</p>
              </div>
              <Link className="admin-products-create" href="/admin/products/create"><AdminProductsIcon name="plus" /><span>Create Product</span></Link>
            </header>

            <section className="admin-products-metrics" aria-label="Product inventory summary">
              <article><span>Total Products</span><strong>{productStats?.total || 0}</strong><small>Complete catalog</small></article>
              <article><span>Featured</span><strong>{productStats?.featured || 0}</strong><small>Homepage priority</small></article>
              <article className={(productStats?.outOfStock || 0) > 0 ? "is-alert" : ""}><span>Out of Stock</span><strong>{productStats?.outOfStock || 0}</strong><small>Needs attention</small></article>
              <article><span>Showing</span><strong>{productStats?.filtered || 0}</strong><small>Current filters</small></article>
              <article><span>Top Category</span><strong>{productTopCategory.label}</strong><small>{productTopCategory.count} products</small></article>
            </section>

            <section className="admin-products-mobile-summary" aria-label="Product inventory summary">
              <div><small>Total Inventory</small><strong>{productStats?.total || 0}</strong></div>
              <div><small>Out of Stock</small><strong>{productStats?.outOfStock || 0}</strong></div>
            </section>

            <label className="admin-products-mobile-search">
              <AdminProductsIcon name="search" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products..." />
            </label>

            <section className="admin-products-toolbar" aria-label="Product filters and exports">
              <label className="admin-products-search">
                <AdminProductsIcon name="search" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products..." />
              </label>
              <select value={productCategoryFilter} onChange={(event) => setProductCategoryFilter(event.target.value)} aria-label="Filter by category">
                <option value="all">All Categories</option>
                {PRODUCT_CATEGORIES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
              <select value={productStockFilter} onChange={(event) => setProductStockFilter(event.target.value)} aria-label="Filter by stock">
                <option value="all">All Stock</option><option value="in">In Stock</option><option value="out">Out of Stock</option>
              </select>
              <select value={productFeaturedFilter} onChange={(event) => setProductFeaturedFilter(event.target.value)} aria-label="Filter featured products">
                <option value="all">All Products</option><option value="yes">Featured</option><option value="no">Regular</option>
              </select>
              <select value={productBrandFilter} onChange={(event) => setProductBrandFilter(event.target.value)} aria-label="Filter by brand">
                <option value="all">All Brands</option>
                {productBrands.map((brand) => <option key={brand} value={brand.toLowerCase()}>{brand}</option>)}
              </select>
              <select value={productSort} onChange={(event) => setProductSort(event.target.value)} aria-label="Sort products">
                {PRODUCT_SORT_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
              <button type="button" className="admin-products-clear" onClick={resetProductFilters}>Clear Filters</button>
              <button type="button" className="admin-products-refresh" disabled={loading || refreshing} onClick={() => loadData({ background: true })} aria-label="Refresh products"><AdminProductsIcon name="refresh" /></button>
              <details className="admin-products-export">
                <summary><AdminProductsIcon name="download" /><span>Export</span></summary>
                <div><button type="button" onClick={exportCsv}>CSV</button><button type="button" onClick={exportJson}>JSON</button><button type="button" onClick={exportSql}>SQL</button></div>
              </details>
            </section>

            <button className="admin-products-mobile-filter" type="button" onClick={() => setToolbarOpen(true)}><AdminProductsIcon name="tune" /><span>Filter &amp; Sort</span></button>
            {toolbarOpen ? (
              <div className="admin-products-filter-sheet" role="dialog" aria-modal="true" aria-label="Product filters">
                <button className="admin-products-filter-sheet__backdrop" type="button" aria-label="Close filters" onClick={() => setToolbarOpen(false)} />
                <section>
                  <header><h2>Filter &amp; Sort</h2><button type="button" onClick={() => setToolbarOpen(false)} aria-label="Close">&times;</button></header>
                  <label>Category<select value={productCategoryFilter} onChange={(event) => setProductCategoryFilter(event.target.value)}><option value="all">All Categories</option>{PRODUCT_CATEGORIES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                  <label>Stock<select value={productStockFilter} onChange={(event) => setProductStockFilter(event.target.value)}><option value="all">All Stock</option><option value="in">In Stock</option><option value="out">Out of Stock</option></select></label>
                  <label>Featured<select value={productFeaturedFilter} onChange={(event) => setProductFeaturedFilter(event.target.value)}><option value="all">Featured + Regular</option><option value="yes">Featured Only</option><option value="no">Regular Only</option></select></label>
                  <label>Brand<select value={productBrandFilter} onChange={(event) => setProductBrandFilter(event.target.value)}><option value="all">All Brands</option>{productBrands.map((brand) => <option key={brand} value={brand.toLowerCase()}>{brand}</option>)}</select></label>
                  <label>Sort By<select value={productSort} onChange={(event) => setProductSort(event.target.value)}>{PRODUCT_SORT_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                  <div><button type="button" onClick={resetProductFilters}>Reset</button><button type="button" onClick={() => setToolbarOpen(false)}>Apply Filters</button></div>
                </section>
              </div>
            ) : null}
          </>
        ) : null}

        {type === "users" ? (
          <>
            <header className="admin-users-mobile-head">
              <button type="button" onClick={() => setDrawerOpen(true)} aria-label="Open navigation menu"><AdminUsersIcon name="menu" /></button>
              <h1>Users</h1>
              <button type="button" onClick={() => setToolbarOpen(true)} aria-label="Filter users"><AdminUsersIcon name="filter" /></button>
            </header>
            <header className="admin-users-head">
              <div>
                <h1>User Management</h1>
                <p>View, activate, and inspect customer and admin accounts.</p>
              </div>
              <details className="admin-users-export"><summary><AdminUsersIcon name="download" />Export Reports</summary><div><button type="button" onClick={exportCsv}>CSV</button><button type="button" onClick={exportJson}>JSON</button><button type="button" onClick={exportSql}>SQL</button></div></details>
            </header>
            <section className="admin-users-toolbar" aria-label="User search and filters">
              <label className="admin-users-search"><AdminUsersIcon name="search" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search users by name or email..." /></label>
              <select value={userRoleFilter} onChange={(event) => setUserRoleFilter(event.target.value)} aria-label="Filter user role"><option value="all">All Roles</option><option value="user">Users</option><option value="admin">Admins</option></select>
              <select value={userStatusFilter} onChange={(event) => setUserStatusFilter(event.target.value)} aria-label="Filter account status"><option value="all">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option></select>
              <select value={userSort} onChange={(event) => setUserSort(event.target.value)} aria-label="Sort users">{USER_SORT_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
              <button type="button" className="admin-users-refresh" disabled={loading || refreshing} onClick={() => loadData({ background: true })} aria-label="Refresh users"><AdminUsersIcon name="refresh" /></button>
              <details className="admin-users-toolbar-export"><summary><AdminUsersIcon name="download" />Export</summary><div><button type="button" onClick={exportCsv}>CSV</button><button type="button" onClick={exportJson}>JSON</button><button type="button" onClick={exportSql}>SQL</button></div></details>
              <button type="button" className="admin-users-clear" onClick={resetUserFilters}>Clear Filters</button>
            </section>
            <label className="admin-users-mobile-search"><AdminUsersIcon name="search" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search customers..." /></label>
            <div className="admin-users-result-count"><strong>{userStats?.filtered || 0}</strong><span>of {userStats?.total || 0} users</span></div>
            {toolbarOpen ? (
              <div className="admin-users-filter-sheet" role="dialog" aria-modal="true" aria-label="User filters">
                <button type="button" className="admin-users-filter-sheet__backdrop" onClick={() => setToolbarOpen(false)} aria-label="Close filters" />
                <section><header><h2>Filter Users</h2><button type="button" onClick={() => setToolbarOpen(false)} aria-label="Close">&times;</button></header><label>Role<select value={userRoleFilter} onChange={(event) => setUserRoleFilter(event.target.value)}><option value="all">All Roles</option><option value="user">Users</option><option value="admin">Admins</option></select></label><label>Status<select value={userStatusFilter} onChange={(event) => setUserStatusFilter(event.target.value)}><option value="all">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option></select></label><label>Sort By<select value={userSort} onChange={(event) => setUserSort(event.target.value)}>{USER_SORT_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><div><button type="button" onClick={resetUserFilters}>Reset</button><button type="button" onClick={() => setToolbarOpen(false)}>Apply Filters</button></div></section>
              </div>
            ) : null}
          </>
        ) : null}

        {type === "orders" ? (
          <section className="admin-orders-toolbar" aria-label="Order management tools">
            <div className="admin-orders-toolbar__title">
              <h1>Orders</h1>
              <span>{loading ? "..." : count}</span>
            </div>
            <div className="admin-orders-toolbar__controls">
              <label className="admin-orders-search">
                <AdminOrdersIcon name="search" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search orders..." />
              </label>
              <button className="admin-orders-refresh" type="button" disabled={loading || refreshing} onClick={() => loadData({ background: true })} aria-label="Refresh orders">
                <AdminOrdersIcon name="refresh" />
              </button>
              <details className="admin-orders-export">
                <summary><AdminOrdersIcon name="download" /><span>Export</span></summary>
                <div>
                  <button type="button" onClick={exportCsv}>Export CSV</button>
                  <button type="button" onClick={exportJson}>Export JSON</button>
                  <button type="button" onClick={exportSql}>Export SQL</button>
                </div>
              </details>
              <button className="admin-orders-resync" type="button" onClick={() => runAction("resyncAffiliates")}>
                <AdminOrdersIcon name="sync" />
                <span>Resync Affiliates</span>
              </button>
              <details className="admin-orders-mobile-tools">
                <summary aria-label="Order tools"><AdminOrdersIcon name="tune" /></summary>
                <div>
                  <button type="button" onClick={() => loadData({ background: true })}>Refresh</button>
                  <button type="button" onClick={exportCsv}>Export CSV</button>
                  <button type="button" onClick={exportJson}>Export JSON</button>
                  <button type="button" onClick={exportSql}>Export SQL</button>
                  <button type="button" onClick={() => runAction("resyncAffiliates")}>Resync Affiliates</button>
                </div>
              </details>
            </div>
          </section>
        ) : null}

        {type !== "dashboard" && type !== "orders" && type !== "products" && type !== "users" && type !== "affiliates" && type !== "reviews" && type !== "banners" && type !== "messages" && type !== "discounts" ? (
          <section className="panel admin-collapsible">
            <button
              type="button"
              className="admin-collapsible__header"
              onClick={() => setToolbarOpen((current) => !current)}
              aria-expanded={toolbarOpen}
              aria-controls="admin-filters-toolbar-body"
            >
              <h2>Search, Filters & Exports</h2>
              <span className="admin-collapsible__icon" aria-hidden="true">{toolbarOpen ? "-" : "+"}</span>
            </button>
            {toolbarOpen ? (
              <div id="admin-filters-toolbar-body" className="admin-collapsible__body">
                <section className="admin-toolbar">
            <input className="field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${config.title.toLowerCase()}...`} />
            {type === "products" ? (
              <>
                <select className="field admin-toolbar__filter" value={productCategoryFilter} onChange={(event) => setProductCategoryFilter(event.target.value)}>
                  <option value="all">All categories</option>
                  {PRODUCT_CATEGORIES.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <select className="field admin-toolbar__filter" value={productBrandFilter} onChange={(event) => setProductBrandFilter(event.target.value)}>
                  <option value="all">All brands</option>
                  {productBrands.map((brand) => (
                    <option key={brand} value={brand.toLowerCase()}>{brand}</option>
                  ))}
                </select>
                <select className="field admin-toolbar__filter" value={productStockFilter} onChange={(event) => setProductStockFilter(event.target.value)}>
                  <option value="all">All stock</option>
                  <option value="in">In stock</option>
                  <option value="out">Out of stock</option>
                </select>
                <select className="field admin-toolbar__filter" value={productFeaturedFilter} onChange={(event) => setProductFeaturedFilter(event.target.value)}>
                  <option value="all">Featured + regular</option>
                  <option value="yes">Featured only</option>
                  <option value="no">Regular only</option>
                </select>
                <select className="field admin-toolbar__filter" value={productSort} onChange={(event) => setProductSort(event.target.value)}>
                  {PRODUCT_SORT_OPTIONS.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </>
            ) : null}
            {type === "users" ? (
              <>
                <select className="field admin-toolbar__filter" value={userRoleFilter} onChange={(event) => setUserRoleFilter(event.target.value)}>
                  <option value="all">All roles</option>
                  <option value="user">Users</option>
                  <option value="admin">Admins</option>
                </select>
                <select className="field admin-toolbar__filter" value={userStatusFilter} onChange={(event) => setUserStatusFilter(event.target.value)}>
                  <option value="all">All status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <select className="field admin-toolbar__filter" value={userSort} onChange={(event) => setUserSort(event.target.value)}>
                  {USER_SORT_OPTIONS.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </>
            ) : null}
            {type === "affiliates" ? (
              <>
                <select className="field admin-toolbar__filter" value={affiliateTierFilter} onChange={(event) => setAffiliateTierFilter(event.target.value)}>
                  <option value="all">All tiers</option>
                  <option value="starter">Starter</option>
                  <option value="bronze">Bronze</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                </select>
                <select className="field admin-toolbar__filter" value={affiliateStatusFilter} onChange={(event) => setAffiliateStatusFilter(event.target.value)}>
                  <option value="all">All status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <select className="field admin-toolbar__filter" value={affiliateSort} onChange={(event) => setAffiliateSort(event.target.value)}>
                  {AFFILIATE_SORT_OPTIONS.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </>
            ) : null}
            {type === "reviews" ? (
              <>
                <select className="field admin-toolbar__filter" value={reviewStatusFilter} onChange={(event) => setReviewStatusFilter(event.target.value)}>
                  <option value="all">All moderation</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select className="field admin-toolbar__filter" value={reviewRatingFilter} onChange={(event) => setReviewRatingFilter(event.target.value)}>
                  <option value="all">All ratings</option>
                  <option value="5">5 stars</option>
                  <option value="4">4+ stars</option>
                  <option value="3">3+ stars</option>
                  <option value="2">2+ stars</option>
                </select>
                <select className="field admin-toolbar__filter" value={reviewSort} onChange={(event) => setReviewSort(event.target.value)}>
                  {REVIEW_SORT_OPTIONS.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </>
            ) : null}
            {type === "discounts" ? (
              <>
                <select className="field admin-toolbar__filter" value={discountStatusFilter} onChange={(event) => setDiscountStatusFilter(event.target.value)}>
                  <option value="all">All status</option>
                  <option value="available">Available</option>
                  <option value="used">Used</option>
                </select>
                <select className="field admin-toolbar__filter" value={discountPercentFilter} onChange={(event) => setDiscountPercentFilter(event.target.value)}>
                  <option value="all">All percents</option>
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((percent) => (
                    <option key={percent} value={percent}>{percent}%</option>
                  ))}
                </select>
                <select className="field admin-toolbar__filter" value={discountSort} onChange={(event) => setDiscountSort(event.target.value)}>
                  {DISCOUNT_SORT_OPTIONS.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </>
            ) : null}
            <button type="button" className="ghost-button" disabled={loading || refreshing} onClick={() => loadData({ background: true })}>
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
            {type !== "dashboard" ? (
              <>
                <button type="button" className="ghost-button" onClick={exportCsv}>Export CSV</button>
                <button type="button" className="ghost-button" onClick={exportJson}>Export JSON</button>
                <button type="button" className="ghost-button" onClick={exportSql}>Export SQL</button>
              </>
            ) : null}
            {type === "products" ? (
              <button type="button" className="ghost-button" onClick={resetProductFilters}>
                Clear Filters
              </button>
            ) : null}
            {type === "users" ? (
              <button type="button" className="ghost-button" onClick={resetUserFilters}>
                Clear Filters
              </button>
            ) : null}
            {type === "affiliates" ? (
              <button type="button" className="ghost-button" onClick={resetAffiliateFilters}>
                Clear Filters
              </button>
            ) : null}
            {type === "reviews" ? (
              <button type="button" className="ghost-button" onClick={resetReviewFilters}>
                Clear Filters
              </button>
            ) : null}
            {type === "discounts" ? (
              <button type="button" className="ghost-button" onClick={resetDiscountFilters}>
                Clear Filters
              </button>
            ) : null}
            {type === "orders" ? <button type="button" className="ghost-button" onClick={() => runAction("resyncAffiliates")}>Resync Affiliates</button> : null}
                </section>
              </div>
            ) : null}
          </section>
        ) : null}

        {false && type === "affiliates" && affiliateStats ? (
          <section className="panel admin-toolbar admin-toolbar--stats">
            <span className="admin-chip">Total: {affiliateStats.total}</span>
            <span className="admin-chip is-neutral">Showing: {affiliateStats.filtered}</span>
            <span className="admin-chip is-success">Active: {affiliateStats.active}</span>
            <span className={`admin-chip ${affiliateStats.inactive > 0 ? "is-warning" : "is-success"}`}>
              Inactive: {affiliateStats.inactive}
            </span>
            <span className="admin-chip is-warning">Referrals: {affiliateStats.totalReferrals}</span>
            <span className="admin-chip is-warning">Pending: {formatCurrency(affiliateStats.totalPending)}</span>
            <span className="admin-chip is-success">Earned: {formatCurrency(affiliateStats.totalEarned)}</span>
          </section>
        ) : null}
        {false && type === "reviews" && reviewStats ? (
          <section className="panel admin-toolbar admin-toolbar--stats">
            <span className="admin-chip">Total: {reviewStats.total}</span>
            <span className="admin-chip is-neutral">Showing: {reviewStats.filtered}</span>
            <span className="admin-chip is-success">Approved: {reviewStats.approved}</span>
            <span className={`admin-chip ${reviewStats.rejected > 0 ? "is-warning" : "is-success"}`}>
              Rejected: {reviewStats.rejected}
            </span>
            <span className="admin-chip is-warning">Avg rating: {reviewStats.avgRating.toFixed(1)} stars</span>
          </section>
        ) : null}
        {false && type === "discounts" && discountStats ? (
          <section className="panel admin-toolbar admin-toolbar--stats">
            <span className="admin-chip">Total: {discountStats.total}</span>
            <span className="admin-chip is-neutral">Showing: {discountStats.filtered}</span>
            <span className="admin-chip is-success">Available: {discountStats.available}</span>
            <span className={`admin-chip ${discountStats.used > 0 ? "is-warning" : "is-success"}`}>
              Used: {discountStats.used}
            </span>
            <span className="admin-chip is-warning">Avg percent: {discountStats.avgPercent.toFixed(1)}%</span>
          </section>
        ) : null}
        {false && type === "messages" && messageStats ? (
          <section className="panel admin-toolbar admin-toolbar--stats">
            <span className="admin-chip">Total: {messageStats.total}</span>
            <span className="admin-chip is-neutral">Showing: {messageStats.filtered}</span>
            <span className={`admin-chip ${messageStats.open > 0 ? "is-warning" : "is-success"}`}>Open: {messageStats.open}</span>
            <span className="admin-chip is-success">Resolved: {messageStats.resolved}</span>
          </section>
        ) : null}
        {type === "orders" && orderStats ? (
          <section className="admin-orders-metrics">
            <article className="admin-orders-metric">
              <span>Total Orders</span>
              <strong>{orderStats.total.toLocaleString("en-GB")}</strong>
              <small>Showing {orderStats.filtered.toLocaleString("en-GB")}</small>
            </article>
            <article className="admin-orders-metric">
              <span>Revenue</span>
              <strong>{formatCurrency(orderStats.revenue)}</strong>
              <small>Delivered orders</small>
            </article>
            <article className="admin-orders-metric admin-orders-metric--bars">
              <span>Order Status</span>
              <div>
                {orderStats.statusRows.slice(0, 4).map((row) => (
                  <i
                    key={row.label}
                    title={`${row.label}: ${formatCount(row.value)}`}
                    style={{
                      width: `${Math.max(12, (Number(row.value || 0) / Math.max(...orderStats.statusRows.map((entry) => Number(entry.value || 0)), 1)) * 100)}%`,
                    }}
                  />
                ))}
              </div>
            </article>
            <article className="admin-orders-metric admin-orders-metric--flow">
              <span>Payment Flow</span>
              <div>
                {orderStats.flowRows.slice(0, 3).map((row) => (
                  <i
                    key={row.label}
                    title={`${row.label}: ${formatCount(row.value)}`}
                    style={{
                      width: `${Math.max(8, (Number(row.value || 0) / Math.max(orderStats.flowRows.reduce((sum, entry) => sum + Number(entry.value || 0), 0), 1)) * 100)}%`,
                    }}
                  />
                ))}
              </div>
              <small>Paid / Manual / Failed</small>
            </article>
          </section>
        ) : null}



        {false && type === "affiliates" && affiliateStats ? (
          <section className="admin-viz-grid panel">
            <TinyBarChart
              title="Tier distribution"
              rows={summarizeCounts((Array.isArray(payload) ? payload : []).map((item) => item?.tier || "starter"), 5)}
              formatter={formatCount}
            />
            <DonutChart
              title="Affiliate status"
              segments={[
                { label: "Active", value: affiliateStats.active },
                { label: "Inactive", value: affiliateStats.inactive },
              ]}
              formatter={formatCount}
            />
            <TinyBarChart
              title="Top earning affiliates"
              rows={(Array.isArray(items) ? items : [])
                .slice(0, 6)
                .map((item) => ({
                  label: item?.code || "affiliate",
                  value: Number(item?.stats?.earnedCommission || 0),
                }))}
              formatter={(value) => formatCurrency(value)}
            />
          </section>
        ) : null}

        {false && type === "affiliates" && affiliateLeaderboard.length ? (
          <section className="panel admin-affiliate-leaderboard admin-collapsible">
            <button
              type="button"
              className="admin-collapsible__header admin-affiliate-leaderboard__head"
              onClick={() => setAffiliateLeaderboardOpen((current) => !current)}
              aria-expanded={affiliateLeaderboardOpen}
              aria-controls="affiliate-leaderboard-body"
            >
              <div>
                <p className="section-kicker">Affiliate leaderboard</p>
                <h2>Top affiliates by earnings and referrals</h2>
              </div>
              <span className="admin-collapsible__icon" aria-hidden="true">{affiliateLeaderboardOpen ? "-" : "+"}</span>
            </button>
            {affiliateLeaderboardOpen ? (
              <div id="affiliate-leaderboard-body" className="admin-collapsible__body">
                <div className="admin-chip-row">
                  <span className="admin-chip is-success">{affiliateLeaderboard.length} ranked</span>
                </div>
                <div className="admin-affiliate-leaderboard__list">
                  {affiliateLeaderboard.map((affiliate, index) => (
                    <a key={affiliate._id || affiliate.code} className="admin-affiliate-leaderboard__row" href={`#admin-affiliate-${affiliate._id}`}>
                      <span className="admin-affiliate-leaderboard__rank">#{index + 1}</span>
                      <span className="admin-affiliate-leaderboard__identity">
                        <strong>{affiliate.code || "Affiliate"}</strong>
                        <small>{affiliate.user?.name || affiliate.user?.email || affiliate.momoNumber || "Affiliate user"}</small>
                      </span>
                      <span>
                        <small>Earned</small>
                        <strong>{formatCurrency(Number(affiliate.stats?.earnedCommission || 0))}</strong>
                      </span>
                      <span>
                        <small>Referrals</small>
                        <strong>{affiliate.stats?.totalReferrals || 0}</strong>
                      </span>
                      <span>
                        <small>MoMo</small>
                        <strong>{affiliate.momoNumber || "Missing"}</strong>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        ) : null}

        {false && type === "reviews" && reviewStats ? (
          <section className="admin-viz-grid panel">
            <TinyBarChart
              title="Rating distribution"
              rows={[
                { label: "5 stars", value: (Array.isArray(payload) ? payload : []).filter((item) => Number(item?.rating || 0) >= 5).length },
                { label: "4 stars", value: (Array.isArray(payload) ? payload : []).filter((item) => Number(item?.rating || 0) >= 4 && Number(item?.rating || 0) < 5).length },
                { label: "3 stars", value: (Array.isArray(payload) ? payload : []).filter((item) => Number(item?.rating || 0) >= 3 && Number(item?.rating || 0) < 4).length },
                { label: "2 stars", value: (Array.isArray(payload) ? payload : []).filter((item) => Number(item?.rating || 0) >= 2 && Number(item?.rating || 0) < 3).length },
                { label: "1 star", value: (Array.isArray(payload) ? payload : []).filter((item) => Number(item?.rating || 0) < 2).length },
              ]}
              formatter={formatCount}
            />
            <DonutChart
              title="Moderation split"
              segments={[
                { label: "Approved", value: reviewStats.approved },
                { label: "Rejected", value: reviewStats.rejected },
              ]}
              formatter={formatCount}
            />
          </section>
        ) : null}

        {false && type === "discounts" && discountStats ? (
          <section className="admin-viz-grid panel">
            <TinyBarChart
              title="Discount percent distribution"
              rows={summarizeCounts((Array.isArray(payload) ? payload : []).map((item) => `${Number(item?.percent || 0)}%`), 8)}
              formatter={formatCount}
            />
            <DonutChart
              title="Code usage split"
              segments={[
                { label: "Available", value: discountStats.available },
                { label: "Used", value: discountStats.used },
              ]}
              formatter={formatCount}
            />
          </section>
        ) : null}
        {type === "products" && isProductDedicatedPage ? (
          <section className="admin-product-editor">
            <header className="admin-product-editor-mobile-head">
              <Link href="/admin/products" aria-label="Back to Products"><AdminProductsIcon name="back" /></Link>
              <h1>{isProductCreatePage ? "Create Product" : "Edit Product"}</h1>
              <span><AdminProductsIcon name="sync" /></span>
            </header>
            <header className="admin-product-editor-head">
              <div>
                <Link href="/admin/products"><AdminProductsIcon name="back" />Back to Products</Link>
                <h1>{isProductCreatePage ? "Create New Product" : "Edit Product"}</h1>
                <p>{isProductCreatePage ? "Add a complete product to the DEETECH catalog." : "Update this product while preserving its catalog history."}</p>
              </div>
              <button form="admin-product-editor-form" className="admin-product-editor-head__save" disabled={busyAction === (isProductCreatePage ? "createProduct" : (editingProduct?._id || editingProduct?.id))}>{isProductCreatePage ? "Create Product" : "Update Product"}</button>
            </header>
            {isProductCreatePage ? (
              <ProductForm
                submitLabel="Create Product"
                busy={busyAction === "createProduct"}
                onSubmit={(event) => runAction("createProduct", { _id: "createProduct" }, event)}
              />
            ) : null}
            {isProductEditPage && !loading && !editingProduct ? (
              <div className="panel admin-state form-error">Could not find this product. It may have been deleted.</div>
            ) : null}
            {isProductEditPage && editingProduct ? (
              <ProductForm
                initial={editingProduct}
                submitLabel="Update Product"
                busy={busyAction === (editingProduct?._id || editingProduct?.id)}
                onSubmit={(event) => runAction("updateProduct", editingProduct, event)}
              />
            ) : null}
          </section>
        ) : null}
        {false && type === "discounts" ? (
          <section className="panel admin-create-panel admin-collapsible">
            <button
              type="button"
              className="admin-collapsible__header"
              onClick={() => setFormOpen((current) => !current)}
              aria-expanded={formOpen}
              aria-controls="discount-create-body"
            >
              <h2>Generate Discount Codes</h2>
              <span className="admin-collapsible__icon" aria-hidden="true">{formOpen ? "-" : "+"}</span>
            </button>
            {formOpen ? (
              <div id="discount-create-body" className="admin-collapsible__body">
                <DiscountForm busy={busyAction === "generateDiscount"} onSubmit={(event) => runAction("generateDiscount", { _id: "generateDiscount" }, event)} />
              </div>
            ) : null}
          </section>
        ) : null}
        {false && type === "affiliates" && settings ? (
          <section className="panel admin-create-panel admin-collapsible">
            <button
              type="button"
              className="admin-collapsible__header"
              onClick={() => setAffiliateSettingsOpen((current) => !current)}
              aria-expanded={affiliateSettingsOpen}
              aria-controls="affiliate-settings-body"
            >
              <h2>Affiliate Program Settings</h2>
              <span className="admin-collapsible__icon" aria-hidden="true">{affiliateSettingsOpen ? "-" : "+"}</span>
            </button>
            {affiliateSettingsOpen ? (
              <div id="affiliate-settings-body" className="admin-collapsible__body">
                <AffiliateSettingsForm settings={settings} busy={busyAction === "updateAffiliateSettings"} onSubmit={(event) => runAction("updateAffiliateSettings", { _id: "updateAffiliateSettings" }, event)} />
              </div>
            ) : null}
          </section>
        ) : null}

        {error ? <section className="panel admin-state form-error">{error}</section> : null}
        {loading ? <section className="panel admin-state">Loading {config.title.toLowerCase()}...</section> : null}
        {!loading && !error && type === "affiliates" ? (
          <AffiliateWorkspace
            stats={affiliateStats}
            items={items}
            leaderboard={affiliateLeaderboard}
            settings={settings}
            query={query}
            setQuery={setQuery}
            tierFilter={affiliateTierFilter}
            setTierFilter={setAffiliateTierFilter}
            statusFilter={affiliateStatusFilter}
            setStatusFilter={setAffiliateStatusFilter}
            sort={affiliateSort}
            setSort={setAffiliateSort}
            toolbarOpen={toolbarOpen}
            setToolbarOpen={setToolbarOpen}
            leaderboardOpen={affiliateLeaderboardOpen}
            setLeaderboardOpen={setAffiliateLeaderboardOpen}
            settingsOpen={affiliateSettingsOpen}
            setSettingsOpen={setAffiliateSettingsOpen}
            loading={loading}
            refreshing={refreshing}
            busyAction={busyAction}
            loadData={loadData}
            resetFilters={resetAffiliateFilters}
            exportCsv={exportCsv}
            exportJson={exportJson}
            exportSql={exportSql}
            runAction={runAction}
          />
        ) : null}
        {!loading && !error && type === "reviews" ? (
          <ReviewsWorkspaceStitch
            items={items}
            stats={reviewStats}
            query={query}
            setQuery={setQuery}
            reviewStatusFilter={reviewStatusFilter}
            setReviewStatusFilter={setReviewStatusFilter}
            reviewRatingFilter={reviewRatingFilter}
            setReviewRatingFilter={setReviewRatingFilter}
            reviewSort={reviewSort}
            setReviewSort={setReviewSort}
            toolbarOpen={toolbarOpen}
            setToolbarOpen={setToolbarOpen}
            selectedReviewIds={selectedReviewIds}
            setSelectedReviewIds={setSelectedReviewIds}
            refreshing={refreshing}
            busyAction={busyAction}
            loadData={loadData}
            resetReviewFilters={resetReviewFilters}
            exportCsv={exportCsv}
            exportJson={exportJson}
            exportSql={exportSql}
            runAction={runAction}
          />
        ) : null}
        {!loading && !error && type === "banners" ? (
          <BannersWorkspace
            items={items}
            query={query}
            setQuery={setQuery}
            toolbarOpen={toolbarOpen}
            setToolbarOpen={setToolbarOpen}
            formOpen={formOpen}
            setFormOpen={setFormOpen}
            count={count}
            loading={loading}
            refreshing={refreshing}
            busyAction={busyAction}
            loadData={loadData}
            exportCsv={exportCsv}
            exportJson={exportJson}
            exportSql={exportSql}
            runAction={runAction}
          />
        ) : null}
        {!loading && !error && type === "dashboard" ? <DashboardView payload={payload} /> : null}
        {!loading && !error && type === "messages" ? (
          <MessagesWorkspaceStitch
            items={items}
            stats={messageStats}
            query={query}
            setQuery={setQuery}
            refreshing={refreshing}
            loading={loading}
            busyAction={busyAction}
            loadData={loadData}
            exportCsv={exportCsv}
            exportJson={exportJson}
            exportSql={exportSql}
            runAction={runAction}
          />
        ) : null}
        {!loading && !error && type === "discounts" ? (
          <DiscountsWorkspaceStitch
            items={items}
            stats={discountStats}
            query={query}
            setQuery={setQuery}
            discountStatusFilter={discountStatusFilter}
            setDiscountStatusFilter={setDiscountStatusFilter}
            discountPercentFilter={discountPercentFilter}
            setDiscountPercentFilter={setDiscountPercentFilter}
            discountSort={discountSort}
            setDiscountSort={setDiscountSort}
            resetDiscountFilters={resetDiscountFilters}
            refreshing={refreshing}
            loading={loading}
            busyAction={busyAction}
            loadData={loadData}
            exportCsv={exportCsv}
            exportJson={exportJson}
            exportSql={exportSql}
            runAction={runAction}
          />
        ) : null}
        {!loading && !error && type !== "dashboard" && type !== "affiliates" && type !== "reviews" && type !== "banners" && type !== "messages" && type !== "discounts" && !(type === "products" && isProductDedicatedPage) ? (
          <AdminCards type={type} items={items} onAction={runAction} busyAction={busyAction} userInsights={userInsights} />
        ) : null}
        {type === "users" && selectedUser360 ? (
          <User360Modal
            user={selectedUser360}
            insight={userInsights?.[normalizeEmail(selectedUser360?.email)] || null}
            activity={userActivityMap?.[normalizeEmail(selectedUser360?.email)] || null}
            onClose={() => setSelectedUser360(null)}
            onAction={runAction}
            busy={busyAction === (selectedUser360?._id || selectedUser360?.id)}
          />
        ) : null}
        <MobileNavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </div>
    </AdminGate>
  );
}
