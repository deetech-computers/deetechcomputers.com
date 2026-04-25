"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/providers/toast-provider";
import { API_BASE, API_BASE_ORDERS, API_BASE_PRODUCTS, API_BASE_SUPPORT, API_BASE_USERS } from "@/lib/config";
import StableImage from "@/components/ui/stable-image";
import { formatCurrency } from "@/lib/format";
import { requestWithToken, asArray } from "@/lib/resource";
import { resolveProductImage } from "@/lib/products";

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
  monitors: ["Dell", "HP", "Samsung", "LG", "Acer", "Asus", "BenQ", "ViewSonic", "Philips", "AOC", "Other"],
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
const SUPPORT_REPLY_TEMPLATES = [
  {
    label: "Acknowledge",
    text: "Thanks for contacting DEETECH support. We are reviewing your request and will update you shortly.",
  },
  {
    label: "Escalate",
    text: "We have received your request and escalated it to the technical team for action.",
  },
  {
    label: "Resolved",
    text: "Your request has been resolved. Please confirm if everything is now working as expected.",
  },
];
const SUPPORT_REPLY_EMOJIS = [
  "\u{1F642}",
  "\u{1F44D}",
  "\u{1F64F}",
  "\u{2705}",
  "\u{1F4E6}",
  "\u{1F527}",
  "\u{1F4DE}",
];

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
  let offset = 0;
  return (
    <article className="admin-viz-card">
      <h3>{title}</h3>
      <div className="admin-viz-donut-wrap">
        <svg viewBox="0 0 120 120" className="admin-viz-donut" aria-hidden="true">
          <circle cx="60" cy="60" r="42" className="admin-viz-donut__base" />
          {valid.map((segment, index) => {
            const value = Number(segment.value || 0);
            const slice = total > 0 ? (value / total) * 264 : 0;
            const currentOffset = offset;
            offset += slice;
            return (
              <circle
                key={`${segment.label}-${index}`}
                cx="60"
                cy="60"
                r="42"
                className={`admin-viz-donut__slice is-${index % 5}`}
                strokeDasharray={`${slice} 264`}
                strokeDashoffset={-currentOffset}
              />
            );
          })}
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

function User360Modal({ user, insight, activity, onClose }) {
  const orders = Array.isArray(activity?.orders) ? activity.orders : [];
  const reviews = Array.isArray(activity?.reviews) ? activity.reviews : [];
  const tickets = Array.isArray(activity?.tickets) ? activity.tickets : [];
  const wishlistCount = Number(activity?.wishlistCount || 0);
  const searchTerms = Array.isArray(activity?.searchTerms) ? activity.searchTerms : [];
  const interests = Array.isArray(activity?.interests) ? activity.interests : [];

  const timeline = useMemo(() => {
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
  }, [orders, reviews, tickets]);

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

function ProductForm({ initial, onSubmit, submitLabel, busy }) {
  const [category, setCategory] = useState(initial?.category || "laptops");
  const subCategories = SUBCATEGORY_BY_CATEGORY[category] || SUBCATEGORY_BY_CATEGORY.laptops;
  const [subCategory, setSubCategory] = useState(initial?.subCategory || initial?.brand || subCategories[0]);
  const resolvedSubCategory = subCategories.includes(subCategory) ? subCategory : subCategories[0];
  const [selectedSections, setSelectedSections] = useState(() => {
    const existing = Array.isArray(initial?.homeSections) ? initial.homeSections : [];
    return [...new Set(existing.filter(Boolean).map(canonicalHomeSectionKey).filter(Boolean))];
  });

  function toggleHomeSection(key) {
    setSelectedSections((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key]
    );
  }

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <input className="field" name="name" defaultValue={initial?.name || ""} placeholder="Product name" required />
      <input
        className="field"
        name="short_description"
        defaultValue={initial?.short_description || ""}
        placeholder="Card description (short): e.g. Lightweight 14-inch laptop, 8GB RAM, 512GB SSD"
      />
      <textarea
        className="field"
        name="description"
        defaultValue={initial?.description || ""}
        placeholder="Full product description: include condition, performance, key features, included accessories, warranty, and best use case."
        rows={2}
        required
      />
      <div className="admin-form__split">
        <select className="field" name="category" value={category} onChange={(event) => setCategory(event.target.value)}>
          {PRODUCT_CATEGORIES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <select className="field" name="subCategory" value={resolvedSubCategory} onChange={(event) => setSubCategory(event.target.value)}>
          {subCategories.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </div>
      <input type="hidden" name="brand" value={resolvedSubCategory} />
      <div className="admin-form__split">
        <input className="field" name="price" defaultValue={initial?.price || ""} placeholder="Price" type="number" min="0" step="0.01" required />
        <input className="field" name="countInStock" defaultValue={initial?.countInStock ?? ""} placeholder="Stock" type="number" min="0" required />
      </div>
      <div className="admin-form__split">
        <input className="field" name="image_url" defaultValue={initial?.image_url || initial?.images?.[0] || ""} placeholder="Main image URL" />
        <input className="field" name="imageUrls" defaultValue={Array.isArray(initial?.images) ? initial.images.join(",") : ""} placeholder="Gallery image URLs, comma separated" />
      </div>
      <label className="admin-inline-control">
        <span>Or upload product images (JPG/PNG/WEBP)</span>
        <input className="field" name="images" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/bmp,image/heic,image/heif" multiple />
      </label>
      <input type="hidden" name="homeSections" value={selectedSections.join(",")} />
      <fieldset className="admin-check-group">
        <legend>Home sections</legend>
        <div className="admin-check-grid">
          {HOME_SECTION_OPTIONS.map(([key, label]) => (
            <label key={key} className="admin-check admin-check--box">
              <input
                type="checkbox"
                checked={selectedSections.includes(key)}
                onChange={() => toggleHomeSection(key)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <textarea
        className="field"
        name="specs"
        defaultValue={initial?.specs ? Object.entries(initial.specs).map(([key, value]) => `${key}:${value}`).join(", ") : ""}
        placeholder="Specs (comma separated), e.g. Processor:i5, RAM:8GB, Storage:512GB SSD, Display:14-inch FHD"
        rows={4}
      />
      <label className="admin-check">
        <input type="checkbox" name="isFeatured" defaultChecked={Boolean(initial?.isFeatured)} />
        <span>Feature this product</span>
      </label>
      <button className="primary-button" disabled={busy}>{busy ? "Saving..." : submitLabel}</button>
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
    <form className="admin-form" onSubmit={onSubmit}>
      <input className="field" name="imageUrl" defaultValue={initial?.imageUrl || ""} placeholder="Banner image URL (optional when uploading file)" />
      <label className="admin-inline-control">
        <span>Or upload banner image (JPG/PNG/WEBP)</span>
        <input className="field" name="image" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/bmp,image/heic,image/heif" />
      </label>

      <select className="field" value={linkMode} onChange={(event) => setLinkMode(event.target.value)} aria-label="Banner link mode">
        <option value="none">No banner link (plain image)</option>
        <option value="category">Link to a product category</option>
        <option value="custom">Use a custom URL</option>
      </select>

      {linkMode === "category" ? (
        <>
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
        </>
      ) : null}

      {linkMode === "custom" ? (
        <input className="field" name="link" defaultValue={initial?.link || ""} placeholder="Custom link URL (e.g. /products/laptops or https://...)" />
      ) : null}
      {linkMode !== "category" ? <input type="hidden" name="linkCategory" value="" /> : null}
      {linkMode !== "category" ? <input type="hidden" name="linkSubCategory" value="" /> : null}
      {linkMode !== "custom" ? <input type="hidden" name="link" value="" /> : null}

      <input className="field" name="order" placeholder="Display order" type="number" defaultValue={initial?.order ?? 0} />
      <button className="primary-button" disabled={busy}>{busy ? "Saving..." : submitLabel}</button>
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
    <form className="admin-form admin-form--inline" onSubmit={onSubmit}>
      <input className="field" name="defaultCommissionRate" type="number" min="0" max="100" step="0.1" defaultValue={settings?.defaultCommissionRate ?? 5} placeholder="Commission %" />
      <input className="field" name="bronze" type="number" min="1" defaultValue={thresholds.bronze ?? 5} placeholder="Bronze" />
      <input className="field" name="silver" type="number" min="2" defaultValue={thresholds.silver ?? 15} placeholder="Silver" />
      <input className="field" name="gold" type="number" min="3" defaultValue={thresholds.gold ?? 30} placeholder="Gold" />
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

function AdminCards({ type, items, onAction, busyAction, userInsights }) {
  if (!items.length) {
    return (
      <div className="panel admin-state">
        <h2>No records yet</h2>
        <p>When data is available, it will appear here for admin management.</p>
      </div>
    );
  }

  return (
    <div className="admin-record-list">
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
        />
        );
      })}
    </div>
  );
}

function AdminRecordCard({ type, item, onAction, busyAction, userInsights }) {
  const [editing, setEditing] = useState(false);
  const id = item._id || item.id;
  const busy = busyAction === id;
  const [supportStatusDraft, setSupportStatusDraft] = useState(() => item?.status || "new");
  const [supportResponseDraft, setSupportResponseDraft] = useState("");
  const [etaDraft, setEtaDraft] = useState(() => toDateTimeLocalValue(item?.estimatedDeliveryDate));

  if (type === "products") {
    const image = resolveProductImage(item.images?.[0] || item.image_url || item.image);
    return (
      <article className="admin-record panel">
        <div className="admin-record__main">
          <div className="admin-record__image">
            {image ? (
              <StableImage src={image} alt={item.name} width={96} height={96} />
            ) : (
              <span>No image</span>
            )}
          </div>
          <div>
            <h3>{item.name}</h3>
            <p>
              {item.category || "Category"} / {item.subCategory || item.brand || "Subcategory"}
            </p>
            <div className="admin-chip-row">
              <span className="admin-chip">{item.brand || "Brand"}</span>
              <span className="admin-chip">{formatCurrency(Number(item.price || 0))}</span>
              <span className={`admin-chip ${Number(item.countInStock || 0) > 0 ? "is-success" : "is-danger"}`}>{Number(item.countInStock || 0)} in stock</span>
              {item.isFeatured ? <span className="admin-chip is-warning">Featured</span> : null}
            </div>
            {Array.isArray(item.homeSections) && item.homeSections.length ? (
              <div className="admin-chip-row">
                {item.homeSections.map((section) => (
                  <span key={section} className="admin-chip is-neutral">
                    {HOME_SECTION_LABELS.get(canonicalHomeSectionKey(section)) || String(section).replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <div className="admin-actions">
          <Link className="ghost-button" href={`/admin/products/${id}/edit`}>Edit</Link>
          <button className="danger-button" type="button" disabled={busy} onClick={() => onAction("deleteProduct", item)}>Delete</button>
        </div>
      </article>
    );
  }

  if (type === "orders") {
    const customer = item.shippingName || item.guestName || item.user?.name || item.shippingEmail || "Customer";
    const paymentProofUrl = resolvePaymentProofUrl(item);
    const orderId = item.orderNumber || item._id;
    const shippingPhone = item.mobileNumber || item.shippingPhone || item.user?.phone || "No phone";
    const shippingAddress = [item.shippingAddress, item.shippingCity, item.deliveryRegion].filter(Boolean).join(", ");
    const affiliateCodeEntered = normalizeText(item.affiliateCodeEntered);
    const affiliateCodeApplied = normalizeText(item.affiliateCode);
    const affiliateCommissionRate = Number(item.affiliateCommissionRate || 0);
    const affiliateCommissionAmount = Number(item.affiliateCommissionAmount || 0);
    const affiliateUsed = Boolean(affiliateCodeApplied);
    const affiliateAttemptedOnly = !affiliateUsed && Boolean(affiliateCodeEntered);
    return (
      <article className="admin-record admin-record--order panel">
        <div className="admin-record__head">
          <div>
            <h3>{orderId}</h3>
            <p>{customer} / {formatDateTime(item.createdAt)}</p>
          </div>
          <span className={`admin-chip ${statusClass(item.orderStatus)}`}>{item.orderStatus || "pending"}</span>
        </div>
        <div className="admin-meta-grid">
          <span>Total <strong>{formatCurrency(Number(item.totalPrice || 0))}</strong></span>
          <span>Payment <strong>{item.paymentMethod || "N/A"}</strong></span>
          <span>Status <strong>{item.paymentStatus || "pending"}</strong></span>
          <span>Region <strong>{item.deliveryRegion || "N/A"}</strong></span>
          <span>Estimated Delivery <strong>{item.estimatedDeliveryDate ? formatDateTime(item.estimatedDeliveryDate) : "Auto (24h from paid)"}</strong></span>
        </div>
        <div className="admin-order-detail-grid">
          <div className="admin-order-info panel">
            <h4>Customer & Delivery</h4>
            <p><strong>Email:</strong> {item.shippingEmail || item.guestEmail || item.user?.email || "No email"}</p>
            <p><strong>Phone:</strong> {shippingPhone}</p>
            <p><strong>Address:</strong> {shippingAddress || "No address provided"}</p>
            <h4>Affiliate Tracking</h4>
            <p>
              <strong>Affiliate usage:</strong>{" "}
              <span className={`admin-chip ${affiliateUsed ? "is-success" : affiliateAttemptedOnly ? "is-warning" : "is-neutral"}`}>
                {affiliateUsed ? "Used" : affiliateAttemptedOnly ? "Entered (not applied)" : "Not used"}
              </span>
            </p>
            <p><strong>Code entered:</strong> {affiliateCodeEntered || "None"}</p>
            <p><strong>Code applied:</strong> {affiliateCodeApplied || "None"}</p>
            <p><strong>Commission:</strong> {affiliateUsed ? `${affiliateCommissionRate}% (${formatCurrency(affiliateCommissionAmount)})` : "N/A"}</p>
          </div>
          <div className="admin-order-proof panel">
            <h4>Payment Proof</h4>
            {paymentProofUrl ? (
              <>
                <a href={paymentProofUrl} target="_blank" rel="noreferrer" className="admin-order-proof__image">
                  <StableImage src={paymentProofUrl} alt={`Payment proof for order ${orderId}`} width={240} height={140} />
                </a>
                <a href={paymentProofUrl} target="_blank" rel="noreferrer" className="ghost-link">Open full proof</a>
              </>
            ) : (
              <p>No payment proof uploaded yet.</p>
            )}
          </div>
        </div>
        <div className="admin-record__items admin-record__items--order">
          {(item.orderItems || []).map((line) => (
            <span key={line._id || line.product?._id || line.product}>
              {line.product?.name || "Product"} x {line.qty || 1} • {formatCurrency(Number(line.price || 0))}
            </span>
          ))}
        </div>
        <div className="admin-actions admin-actions--wrap">
          <AdminStatusSelect label="Order" value={item.orderStatus || "pending"} options={["pending", "processing", "shipped", "delivered", "cancelled"]} onChange={(value) => onAction("orderStatus", item, null, value)} />
          <AdminStatusSelect label="Payment" value={item.paymentStatus || "pending"} options={["pending", "paid", "failed"]} onChange={(value) => onAction("paymentStatus", item, null, value)} />
          <label className="admin-inline-control">
            <span>Expected Delivery</span>
            <input
              type="datetime-local"
              className="field"
              value={etaDraft}
              onChange={(event) => setEtaDraft(event.target.value)}
            />
          </label>
          <button className="ghost-button" type="button" disabled={busy || !etaDraft} onClick={() => onAction("updateEta", item, null, etaDraft)}>
            Save ETA
          </button>
          <button className="ghost-button" type="button" disabled={busy} onClick={() => onAction("markPaid", item)}>Mark Paid</button>
          <button className="ghost-button" type="button" disabled={busy} onClick={() => onAction("markDelivered", item)}>Delivered</button>
          <button className="danger-button" type="button" disabled={busy} onClick={() => onAction("deleteOrder", item)}>Delete</button>
        </div>
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

    function addTemplateReply(template) {
      const base = supportResponseDraft.trim();
      setSupportResponseDraft(base ? `${base}\n\n${template}` : template);
    }
    function appendReplyEmoji(emoji) {
      setSupportResponseDraft((current) => `${current}${emoji}`);
    }

    return (
      <details className="admin-record panel admin-support-ticket">
        <summary className="admin-support-ticket__summary">
          <div className="admin-support-ticket__summary-copy">
            <strong>{item.name || "Customer Support"}</strong>
            <p>{item.name || "Customer"} / {item.email || "No email"}</p>
          </div>
          <div className="admin-support-ticket__summary-meta">
            <span className={`admin-chip ${statusClass(item.status)}`}>{item.status || "new"}</span>
            <small>{formatDateTime(item.updatedAt)}</small>
          </div>
        </summary>

        <div className="admin-support-ticket__body">
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
            <details className="admin-support-ticket__thread">
              <summary>
                Conversation thread
                <span>{sortedThread.length} messages</span>
              </summary>
              <div className="admin-support-ticket__thread-list" role="log" aria-live="polite">
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
            </details>
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

            <div className="admin-support-ticket__quick-replies">
              {SUPPORT_REPLY_TEMPLATES.map((template) => (
                <button key={template.label} type="button" className="ghost-button" onClick={() => addTemplateReply(template.text)}>
                  {template.label}
                </button>
              ))}
              {SUPPORT_REPLY_EMOJIS.map((emoji) => (
                <button key={emoji} type="button" className="ghost-button" onClick={() => appendReplyEmoji(emoji)}>
                  {emoji}
                </button>
              ))}
            </div>
            <div className="admin-support-ticket__composer-row">
              <textarea
                className="field admin-support-ticket__composer-input"
                name="response"
                value={supportResponseDraft}
                onChange={(event) => setSupportResponseDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder="Type your reply..."
                rows={1}
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
      </details>
    );
  }

  if (type === "users") {
    const active = item.isActive !== false;
    const email = normalizeEmail(item?.email);
    const insight = email ? userInsights?.[email] : null;
    const wishlistCount = Array.isArray(item?.wishlist) ? item.wishlist.length : 0;
    const searchTerms = Array.isArray(item?.behavior?.searchTerms) ? item.behavior.searchTerms : [];
    const topSearch = [...searchTerms]
      .sort((a, b) => Number(b?.count || 0) - Number(a?.count || 0))
      .find((entry) => normalizeText(entry?.term));
    const interests = Array.isArray(item?.behavior?.categoryInterests) ? item.behavior.categoryInterests : [];
    const topInterest = [...interests]
      .sort((a, b) => Number(b?.count || 0) - Number(a?.count || 0))
      .find((entry) => normalizeText(entry?.category));

    return (
      <article className="admin-record panel">
        <div className="admin-record__head">
          <div>
            <h3>{item.name || item.email}</h3>
            <p>{item.email} / {item.phone || "No phone"}</p>
          </div>
          <span className={`admin-chip ${item.role === "admin" ? "is-success" : "is-neutral"}`}>{item.role || "user"}</span>
        </div>
        <div className="admin-meta-grid">
          <span>Region <strong>{item.region || "N/A"}</strong></span>
          <span>Status <strong>{active ? "Active" : "Inactive"}</strong></span>
          <span>Joined <strong>{formatDate(item.createdAt)}</strong></span>
          <span>Wishlist <strong>{wishlistCount}</strong></span>
          <span>Orders <strong>{insight?.totalOrders || 0}</strong></span>
          <span>Spent <strong>{formatCurrency(Number(insight?.totalSpent || 0))}</strong></span>
          <span>Reviews <strong>{insight?.reviewCount || 0}</strong></span>
          <span>Support Tickets <strong>{insight?.supportTickets || 0}</strong></span>
          <span>Avg Rating <strong>{Number(insight?.avgRating || 0).toFixed(1)}</strong></span>
          <span>Top Search <strong>{topSearch?.term || "None yet"}</strong></span>
          <span>Top Interest <strong>{topInterest?.category || "None yet"}</strong></span>
        </div>
        <div className="admin-actions">
          <button className="ghost-button" type="button" onClick={() => onAction("openUser360", item)}>View User 360</button>
          <button className="ghost-button" disabled={busy} onClick={() => onAction("userStatus", item, null, !active)}>{active ? "Deactivate" : "Activate"}</button>
          <button className="danger-button" disabled={busy} onClick={() => onAction("deleteUser", item)}>Delete</button>
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

    return (
      <article className="admin-record panel">
        <div className="admin-record__head">
          <div>
            <h3>{item.title || "Product Review"}</h3>
            <p>{reviewerName} / {productName}</p>
          </div>
          <span className={`admin-chip ${item.approved ? "is-success" : "is-danger"}`}>{item.approved ? "Approved" : "Rejected"}</span>
        </div>
        <div className="admin-review-rating" aria-label={`Rating ${rating.toFixed(1)} out of 5`}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className={star <= roundedRating ? "is-filled" : ""} aria-hidden="true">★</span>
          ))}
          <strong>{rating.toFixed(1)} / 5</strong>
        </div>
        <p>{item.comment || "No review text"}</p>
        <div className="admin-review-meta">
          <span className="admin-chip is-neutral">Created {formatDateTime(item.createdAt)}</span>
          {productId ? (
            <Link className="ghost-button" href={`/products/${productId}`}>
              Open product
            </Link>
          ) : null}
        </div>
        <div className="admin-actions">
          {!item.approved ? (
            <button className="ghost-button" disabled={busy} onClick={() => onAction("moderateReview", item, null, true)}>Approve</button>
          ) : null}
          {item.approved ? (
            <button className="ghost-button" disabled={busy} onClick={() => onAction("moderateReview", item, null, false)}>Reject</button>
          ) : null}
          <button className="danger-button" disabled={busy} onClick={() => onAction("deleteReview", item)}>Delete</button>
        </div>
      </article>
    );
  }

  if (type === "affiliates") {
    const active = item.isActive !== false;
    return (
      <article className="admin-record panel">
        <div className="admin-record__head">
          <div>
            <h3>{item.code || "Affiliate"}</h3>
            <p>{item.user?.name || item.user?.email || "Affiliate user"} / {item.tier || "starter"}</p>
          </div>
          <span className={`admin-chip ${active ? "is-success" : "is-danger"}`}>{active ? "Active" : "Inactive"}</span>
        </div>
        <div className="admin-meta-grid">
          <span>Referrals <strong>{item.stats?.totalReferrals || 0}</strong></span>
          <span>Pending <strong>{formatCurrency(Number(item.stats?.pendingCommission || 0))}</strong></span>
          <span>Earned <strong>{formatCurrency(Number(item.stats?.earnedCommission || 0))}</strong></span>
          <span>Rate <strong>{Number(item.commissionRate || 0)}%</strong></span>
        </div>
        <div className="admin-actions">
          <button className="ghost-button" disabled={busy} onClick={() => onAction("copyAffiliateCode", item)}>Copy Code</button>
          <button className="ghost-button" disabled={busy} onClick={() => onAction("affiliateStatus", item, null, !active)}>{active ? "Deactivate" : "Activate"}</button>
          <button className="danger-button" disabled={busy} onClick={() => onAction("deleteAffiliate", item)}>Delete</button>
        </div>
      </article>
    );
  }

  if (type === "discounts") {
    const usedByName = normalizeText(item?.usedBy?.name);
    const usedByEmail = normalizeText(item?.usedBy?.email);
    const usedBy = usedByName || usedByEmail;
    const orderRef = normalizeText(item?.order?._id || item?.order);
    return (
      <article className="admin-record panel">
        <div className="admin-record__head">
          <div>
            <h3>{item.code || "Discount"}</h3>
            <p>{Number(item.percent || 0)}% off / created {formatDate(item.createdAt)}</p>
          </div>
          <span className={`admin-chip ${item.used ? "is-danger" : "is-success"}`}>{item.used ? "Used" : "Available"}</span>
        </div>
        <div className="admin-meta-grid">
          <span>
            Percent
            <strong>{Number(item.percent || 0)}%</strong>
          </span>
          <span>
            Created
            <strong>{formatDateTime(item.createdAt)}</strong>
          </span>
          <span>
            Used At
            <strong>{item.usedAt ? formatDateTime(item.usedAt) : "Not used yet"}</strong>
          </span>
          <span>
            Used By
            <strong>{usedBy || "No user linked"}</strong>
          </span>
          {orderRef ? (
            <span>
              Order Ref
              <strong>{orderRef}</strong>
            </span>
          ) : null}
        </div>
        <div className="admin-actions">
          <button className="ghost-button" disabled={busy} onClick={() => onAction("copyDiscountCode", item)}>Copy Code</button>
          <button className="danger-button" disabled={busy} onClick={() => onAction("deleteDiscount", item)}>Delete</button>
        </div>
      </article>
    );
  }

  if (type === "banners") {
    return (
      <article className="admin-record panel">
        <div className="admin-record__main">
          <div className="admin-record__image">
            {item.imageUrl ? (
              <StableImage src={item.imageUrl} alt={item.title} width={96} height={96} />
            ) : (
              <span>No image</span>
            )}
          </div>
          <div>
            <h3>Homepage Banner</h3>
            <p>
              {item.linkCategory
                ? `Category link: ${item.linkCategory}${item.linkSubCategory ? ` / ${item.linkSubCategory}` : " / all"}`
                : item.link
                  ? `Custom link: ${item.link}`
                  : "No click link (plain banner)"}
            </p>
            <div className="admin-chip-row"><span className="admin-chip">Order {item.order || 0}</span></div>
          </div>
        </div>
        {editing ? <BannerForm initial={item} submitLabel="Update Banner" busy={busy} onSubmit={(event) => onAction("updateBanner", item, event)} /> : null}
        <div className="admin-actions">
          <button className="ghost-button" type="button" onClick={() => setEditing((current) => !current)}>{editing ? "Close Edit" : "Edit"}</button>
          <button className="danger-button" disabled={busy} onClick={() => onAction("deleteBanner", item)}>Delete</button>
        </div>
      </article>
    );
  }

  return (
    <article className="admin-record panel">
      <pre>{JSON.stringify(item, null, 2)}</pre>
    </article>
  );
}

export default function AdminManager({ type, productMode = "list", productId = "" }) {
  const config = ADMIN_CONFIG[type] || ADMIN_CONFIG.dashboard;
  const { token, user } = useAuth();
  const { pushToast } = useToast();
  const router = useRouter();
  const [payload, setPayload] = useState(type === "dashboard" ? {} : []);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [busyAction, setBusyAction] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [toolbarOpen, setToolbarOpen] = useState(false);
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
  const [reviewStatusFilter, setReviewStatusFilter] = useState("all");
  const [reviewRatingFilter, setReviewRatingFilter] = useState("all");
  const [reviewSort, setReviewSort] = useState("newest");
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
    if (!token || !isAdmin) {
      setLoading(false);
      return;
    }
    loadData();
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
      if (action === "deleteUser") await requestWithToken(`${API_BASE_USERS}/admin/users/${item._id}`, token, { method: "DELETE" });
      if (action === "moderateReview") await requestWithToken(`${API_BASE}/reviews/${item._id}/moderate`, token, { method: "PUT", body: JSON.stringify({ approved: value }) });
      if (action === "deleteReview") await requestWithToken(`${API_BASE}/reviews/${item._id}`, token, { method: "DELETE" });
      if (action === "affiliateStatus") await requestWithToken(`${API_BASE}/affiliates/admin/${item._id}/status`, token, { method: "PUT", body: JSON.stringify({ isActive: value }) });
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
      <div className="admin-manager">
        <AdminHero title={config.title} subtitle={config.subtitle} count={count} busy={loading} />

        {type !== "dashboard" && !(type === "products" && isProductDedicatedPage) ? (
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

        {type === "products" && productStats && !isProductDedicatedPage ? (
          <section className="panel admin-toolbar admin-toolbar--stats">
            <span className="admin-chip">Total: {productStats.total}</span>
            <span className="admin-chip is-success">Featured: {productStats.featured}</span>
            <span className={`admin-chip ${productStats.outOfStock > 0 ? "is-danger" : "is-success"}`}>
              Out of stock: {productStats.outOfStock}
            </span>
            <span className="admin-chip is-neutral">Showing: {productStats.filtered}</span>
          </section>
        ) : null}
        {type === "users" && userStats ? (
          <section className="panel admin-toolbar admin-toolbar--stats">
            <span className="admin-chip">Total: {userStats.total}</span>
            <span className="admin-chip is-neutral">Showing: {userStats.filtered}</span>
            <span className="admin-chip is-success">Admins: {userStats.admins}</span>
            <span className="admin-chip is-success">Active: {userStats.active}</span>
            <span className={`admin-chip ${userStats.inactive > 0 ? "is-warning" : "is-success"}`}>
              Inactive: {userStats.inactive}
            </span>
          </section>
        ) : null}
        {type === "affiliates" && affiliateStats ? (
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
        {type === "reviews" && reviewStats ? (
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
        {type === "discounts" && discountStats ? (
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
        {type === "messages" && messageStats ? (
          <section className="panel admin-toolbar admin-toolbar--stats">
            <span className="admin-chip">Total: {messageStats.total}</span>
            <span className="admin-chip is-neutral">Showing: {messageStats.filtered}</span>
            <span className={`admin-chip ${messageStats.open > 0 ? "is-warning" : "is-success"}`}>Open: {messageStats.open}</span>
            <span className="admin-chip is-success">Resolved: {messageStats.resolved}</span>
          </section>
        ) : null}
        {type === "orders" && orderStats ? (
          <section className="panel admin-toolbar admin-toolbar--stats">
            <span className="admin-chip">Total: {orderStats.total}</span>
            <span className="admin-chip is-neutral">Showing: {orderStats.filtered}</span>
            <span className="admin-chip is-success">Revenue: {formatCurrency(orderStats.revenue)}</span>
          </section>
        ) : null}

        {type === "products" && productStats ? (
          <section className="admin-viz-grid panel">
            <TinyBarChart
              title="Category distribution"
              rows={summarizeCounts((Array.isArray(payload) ? payload : []).map((item) => item?.category || "unknown"), 8)}
              formatter={formatCount}
            />
            <DonutChart
              title="Stock health"
              segments={[
                { label: "In stock", value: (Array.isArray(payload) ? payload : []).filter((item) => Number(item?.countInStock || 0) > 0).length },
                { label: "Out of stock", value: productStats.outOfStock },
                { label: "Featured", value: productStats.featured },
              ]}
              formatter={formatCount}
            />
          </section>
        ) : null}

        {type === "orders" && orderStats ? (
          <section className="admin-viz-grid panel">
            <TinyBarChart title="Order status" rows={orderStats.statusRows} formatter={formatCount} />
            <TinyBarChart title="Payment methods" rows={orderStats.paymentMethodRows} formatter={formatCount} />
            <DonutChart title="Payment flow split" segments={orderStats.flowRows} formatter={formatCount} />
          </section>
        ) : null}

        {type === "users" && userStats ? (
          <section className="admin-viz-grid panel">
            <DonutChart
              title="Role & status"
              segments={[
                { label: "Admins", value: userStats.admins },
                { label: "Active", value: userStats.active },
                { label: "Inactive", value: userStats.inactive },
              ]}
              formatter={formatCount}
            />
            <TinyBarChart
              title="Top searched terms"
              rows={summarizeWeighted(
                (Array.isArray(payload) ? payload : []).flatMap((user) => {
                  const terms = Array.isArray(user?.behavior?.searchTerms) ? user.behavior.searchTerms : [];
                  return terms.map((entry) => ({ label: entry?.term || "", weight: Number(entry?.count || 0) }));
                }),
                7
              )}
              formatter={formatCount}
            />
            <TinyBarChart
              title="Top interests"
              rows={summarizeWeighted(
                (Array.isArray(payload) ? payload : []).flatMap((user) => {
                  const interests = Array.isArray(user?.behavior?.categoryInterests) ? user.behavior.categoryInterests : [];
                  return interests.map((entry) => ({ label: entry?.category || "", weight: Number(entry?.count || 0) }));
                }),
                7
              )}
              formatter={formatCount}
            />
          </section>
        ) : null}

        {type === "affiliates" && affiliateStats ? (
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

        {type === "reviews" && reviewStats ? (
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

        {type === "discounts" && discountStats ? (
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
          <section className="panel admin-create-panel">
            <div className="admin-create-panel__head">
              <h2>{isProductCreatePage ? "Create Product" : "Edit Product"}</h2>
              <p>
                {isProductCreatePage
                  ? "Use this dedicated page to create a product without distraction."
                  : "Update this product in a dedicated editor, then return to your products list."}
              </p>
            </div>
            <div className="admin-actions">
              <Link className="ghost-button" href="/admin/products">Back to Products</Link>
            </div>
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
        {type === "products" && !isProductDedicatedPage ? (
          <section className="panel admin-create-panel admin-collapsible">
            <button
              type="button"
              className="admin-collapsible__header"
              onClick={() => setFormOpen((current) => !current)}
              aria-expanded={formOpen}
              aria-controls="product-create-body"
            >
              <h2>Create Product</h2>
              <span className="admin-collapsible__icon" aria-hidden="true">{formOpen ? "-" : "+"}</span>
            </button>
            {formOpen ? (
              <div id="product-create-body" className="admin-collapsible__body">
                <p>Open the dedicated create page for a focused product workflow.</p>
                <div className="admin-actions">
                  <Link className="primary-button" href="/admin/products/create">Open Product Creator</Link>
                </div>
              </div>
            ) : null}
          </section>
        ) : null}
        {type === "discounts" ? (
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
        {type === "banners" ? (
          <section className="panel admin-create-panel admin-collapsible">
            <button
              type="button"
              className="admin-collapsible__header"
              onClick={() => setFormOpen((current) => !current)}
              aria-expanded={formOpen}
              aria-controls="banner-create-body"
            >
              <h2>Create Banner</h2>
              <span className="admin-collapsible__icon" aria-hidden="true">{formOpen ? "-" : "+"}</span>
            </button>
            {formOpen ? (
              <div id="banner-create-body" className="admin-collapsible__body">
                <BannerForm busy={busyAction === "createBanner"} onSubmit={(event) => runAction("createBanner", { _id: "createBanner" }, event)} submitLabel="Create Banner" />
              </div>
            ) : null}
          </section>
        ) : null}
        {type === "affiliates" && settings ? (
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
        {!loading && !error && type === "dashboard" ? <DashboardView payload={payload} /> : null}
        {!loading && !error && type !== "dashboard" && !(type === "products" && isProductDedicatedPage) ? (
          <AdminCards type={type} items={items} onAction={runAction} busyAction={busyAction} userInsights={userInsights} />
        ) : null}
        {type === "users" && selectedUser360 ? (
          <User360Modal
            user={selectedUser360}
            insight={userInsights?.[normalizeEmail(selectedUser360?.email)] || null}
            activity={userActivityMap?.[normalizeEmail(selectedUser360?.email)] || null}
            onClose={() => setSelectedUser360(null)}
          />
        ) : null}
      </div>
    </AdminGate>
  );
}
