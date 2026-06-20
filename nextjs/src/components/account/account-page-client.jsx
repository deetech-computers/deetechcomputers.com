"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import MobileAddress from "@/components/account/account-mobile-address";
import MobileAffiliates from "@/components/account/account-mobile-affiliates";
import MobileAccountHome from "@/components/account/account-mobile-home";
import MobileMessages from "@/components/account/account-mobile-messages";
import MobileNotifications from "@/components/account/account-mobile-notifications";
import MobileOrders from "@/components/account/account-mobile-orders";
import MobilePasswordManager from "@/components/account/account-mobile-password";
import MobilePersonalInfo from "@/components/account/account-mobile-personal";
import MobileReviews from "@/components/account/account-mobile-reviews";
import MobileWishlist from "@/components/account/account-mobile-wishlist";
import { useAuth } from "@/hooks/use-auth";
import StableImage from "@/components/ui/stable-image";
import EmptyState from "@/components/ui/empty-state";
import { useToast } from "@/components/providers/toast-provider";
import { API_BASE, API_BASE_AUTH, API_BASE_ORDERS } from "@/lib/config";
import { requestJson } from "@/lib/http";
import { requestWithToken } from "@/lib/resource";
import { fetchProducts, formatCategoryLabel, getProductPrice, getProductStock, resolveProductImage } from "@/lib/products";
import { formatCurrency } from "@/lib/format";
import { getLinesDiscountTotal } from "@/lib/order-line-pricing";
import {
  buildAdminNotifications,
  buildNotificationScope,
  buildUserNotifications,
  formatNotificationTime,
  HEADER_NOTIFICATIONS_UPDATED_EVENT,
  markNotificationsAsRead,
  readNotificationReadIds,
} from "@/lib/header-notifications";
import { downloadInvoiceHtml } from "@/lib/invoice";
import { readWishlistEntries } from "@/lib/wishlist";
import { GHANA_REGIONS, syncCheckoutDraftProfile } from "@/lib/checkout";

const ACCOUNT_SECTIONS = [
  { id: "personal", label: "Personal Information", icon: "person" },
  { id: "orders", label: "Orders", icon: "bag" },
  { id: "address", label: "Address Book", icon: "pin" },
  { id: "messages", label: "Messages", icon: "mail" },
  { id: "notifications", label: "Notifications", icon: "bell" },
  { id: "admin", label: "Admin", href: "/admin", adminOnly: true, icon: "shield" },
  { id: "affiliates", label: "Affiliates", icon: "users" },
  { id: "wishlist", label: "Wishlist", icon: "heart" },
  { id: "reviews", label: "Reviews", icon: "review" },
  { id: "password", label: "Password Manager", icon: "lock" },
  { id: "logout", label: "Logout", icon: "logout" },
];

const ALLOWED_ACCOUNT_TABS = new Set([
  "personal",
  "notifications",
  "orders",
  "address",
  "messages",
  "affiliates",
  "wishlist",
  "reviews",
  "password",
  "logout",
]);

const SUPPORT_WHATSAPP_LINK = "https://wa.me/message/WEYXKNNA6KXXL1";

function normalizeAccountTab(value) {
  return ALLOWED_ACCOUNT_TABS.has(value) ? value : "personal";
}

function formatDate(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "Recently";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
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

function resolveSupportImageUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw) || raw.startsWith("data:")) return raw;
  if (raw.startsWith("/")) return `${API_BASE}${raw}`;
  return `${API_BASE}/${raw.replace(/^\/+/, "")}`;
}

function paymentLabel(value) {
  if (value === "mtn") return "MTN";
  if (value === "vodafone") return "Telecel";
  if (value === "bank") return "Bank Transfer";
  if (value === "hubtel") return "Hubtel";
  return value || "Payment";
}

function orderStatusLabel(order) {
  if (order?.orderStatus === "cancelled" || order?.paymentStatus === "failed") return "Cancelled";
  if (order?.orderStatus === "delivered" || order?.isDelivered) return "Delivered";
  if (order?.orderStatus === "shipped") return "On the Way";
  if (order?.orderStatus === "processing" || order?.paymentStatus === "paid") return "Accepted";
  return "Order Placed";
}

function orderStatusMessage(order) {
  const status = orderStatusLabel(order);
  if (status === "Delivered") return "Your order has been delivered";
  if (status === "On the Way") return "Your order is on the way";
  if (status === "Accepted") return "Your order has been accepted";
  if (status === "Cancelled") return "This order was cancelled";
  return "Your order has been received";
}

function statusTone(order) {
  const status = orderStatusLabel(order);
  if (status === "Delivered") return "is-success";
  if (status === "Accepted") return "is-warning";
  if (status === "Cancelled") return "is-danger";
  return "is-neutral";
}

function getOrderLineItems(order) {
  return Array.isArray(order?.orderItems) ? order.orderItems : [];
}

function getOrderItemImage(item) {
  const product = item?.product || {};
  return resolveProductImage(
    product?.images?.[0] ||
      product?.image ||
      item?.image ||
      item?.imageUrl ||
      ""
  );
}

function getOrderItemsPrice(order) {
  const persisted = Number(order?.itemsPrice || 0);
  if (persisted > 0) return persisted;
  return getOrderLineItems(order).reduce(
    (sum, item) => sum + Number(item?.price || 0) * Number(item?.qty || 0),
    0
  );
}

function getOrderDiscountAmount(order) {
  return Math.max(0, Number(order?.discountAmount || 0));
}

function getOrderShippingPrice(order) {
  const persisted = Number(order?.shippingPrice || 0);
  if (persisted > 0) return persisted;
  const total = Number(order?.totalPrice || 0);
  const itemsPrice = getOrderItemsPrice(order);
  const discountAmount = getOrderDiscountAmount(order);
  return Math.max(0, Number((total - Math.max(0, itemsPrice - discountAmount)).toFixed(2)));
}

function getOrderProductSavings(order) {
  return getLinesDiscountTotal(getOrderLineItems(order));
}

function getReviewStars(rating) {
  const value = Math.max(0, Math.min(5, Number(rating || 0)));
  return Array.from({ length: 5 }, (_, index) => (
    <span key={index} className={index < value ? "is-filled" : ""}>★</span>
  ));
}

function getAccountDisplayName(profile) {
  const fullName = `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim();
  return fullName || profile?.email || "DEETECH Customer";
}

function getAccountInitials(profile) {
  const name = getAccountDisplayName(profile);
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "DC";
}

function getProfileCompletion(profile) {
  const fields = [profile?.firstName, profile?.lastName, profile?.email, profile?.phone];
  const complete = fields.filter((value) => String(value || "").trim()).length;
  return Math.round((complete / fields.length) * 100);
}

function AccountNavIcon({ name }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
  };
  const paths = {
    person: (
      <>
        <path d="M20 21a8 8 0 0 0-16 0" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    bag: (
      <>
        <path d="M6 8h12l-1 13H7L6 8Z" />
        <path d="M9 8a3 3 0 0 1 6 0" />
      </>
    ),
    pin: (
      <>
        <path d="M12 21s7-5.1 7-11a7 7 0 0 0-14 0c0 5.9 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 7 9-7" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-5" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />,
    review: (
      <>
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
        <path d="M8 8h8" />
        <path d="M8 12h5" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </>
    ),
    logout: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="M16 17l5-5-5-5" />
        <path d="M21 12H9" />
      </>
    ),
    campaign: (
      <>
        <path d="M4 13h3l9 4V7l-9 4H4v2Z" />
        <path d="M7 13v5" />
        <path d="M19 9a4 4 0 0 1 0 6" />
      </>
    ),
    map: (
      <>
        <path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z" />
        <path d="M9 3v15" />
        <path d="M15 6v15" />
      </>
    ),
    receipt: (
      <>
        <path d="M6 2h12v20l-3-2-3 2-3-2-3 2V2Z" />
        <path d="M9 7h6" />
        <path d="M9 11h6" />
        <path d="M9 15h4" />
      </>
    ),
    home: (
      <>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h14V10" />
        <path d="M9 20v-6h6v6" />
      </>
    ),
    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </>
    ),
    refresh: (
      <>
        <path d="M21 12a9 9 0 0 1-15.5 6.2" />
        <path d="M3 12A9 9 0 0 1 18.5 5.8" />
        <path d="M18 2v4h4" />
        <path d="M6 22v-4H2" />
      </>
    ),
    send: (
      <>
        <path d="M22 2 11 13" />
        <path d="m22 2-7 20-4-9-9-4 20-7Z" />
      </>
    ),
    check: (
      <>
        <path d="m20 6-11 11-5-5" />
        <path d="M16 6h4v4" />
      </>
    ),
    arrowRight: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    archive: (
      <>
        <rect x="3" y="4" width="18" height="5" rx="1" />
        <path d="M5 9v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9" />
        <path d="M10 13h4" />
        <path d="m12 17 3-3" />
        <path d="m12 17-3-3" />
      </>
    ),
    copy: (
      <>
        <rect x="9" y="9" width="11" height="11" rx="2" />
        <rect x="4" y="4" width="11" height="11" rx="2" />
      </>
    ),
    money: (
      <>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <circle cx="12" cy="12" r="3" />
        <path d="M6 9v.01" />
        <path d="M18 15v.01" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </>
    ),
    bank: (
      <>
        <path d="m3 10 9-6 9 6" />
        <path d="M5 10h14" />
        <path d="M6 10v8" />
        <path d="M10 10v8" />
        <path d="M14 10v8" />
        <path d="M18 10v8" />
        <path d="M4 18h16" />
      </>
    ),
    trend: (
      <>
        <path d="m3 17 6-6 4 4 7-8" />
        <path d="M14 7h6v6" />
      </>
    ),
    xCircle: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    device: (
      <>
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M8 22h8" />
        <path d="M12 18v4" />
      </>
    ),
    phoneDevice: (
      <>
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <path d="M11 18h2" />
      </>
    ),
  };
  return (
    <svg className="account-dashboard__nav-icon" viewBox="0 0 24 24" aria-hidden="true" {...common}>
      {paths[name] || paths.person}
    </svg>
  );
}

function AccountSidebar({ activeSection, onChange, isAdmin, hasSupportTickets, profile }) {
  const sections = ACCOUNT_SECTIONS.filter((item) => {
    if (item.id === "messages" && !hasSupportTickets) return false;
    if (item.id === "logout") return false;
    return !item.adminOnly || isAdmin;
  });
  const logoutItem = ACCOUNT_SECTIONS.find((item) => item.id === "logout");
  const displayName = getAccountDisplayName(profile);
  const completion = getProfileCompletion(profile);
  return (
    <aside className="account-dashboard__sidebar" aria-label="Account sections">
      <div className="account-dashboard__sidebar-scroll">
        <div className="account-sidebar-brand">
          <strong>DEETECH Computers</strong>
          <span>Premium Hardware Solutions</span>
        </div>
        <div className="account-sidebar-profile">
          <div className="account-sidebar-profile__avatar" aria-hidden="true">
            {getAccountInitials(profile)}
          </div>
          <div className="account-sidebar-profile__copy">
            <strong>{displayName}</strong>
            <span>{profile?.email || "Customer account"}</span>
          </div>
          <div className="account-sidebar-profile__progress" aria-label={`Profile ${completion}% complete`}>
            <div>
              <span>Profile</span>
              <strong>{completion}%</strong>
            </div>
            <i style={{ width: `${completion}%` }} />
          </div>
        </div>
        {sections.map((item) => {
          if (item.href) {
            return (
              <Link
                key={item.id}
                href={item.href}
                className="account-dashboard__nav"
              >
                <AccountNavIcon name={item.icon} />
                <span>{item.label}</span>
              </Link>
            );
          }
          return (
            <button
              key={item.id}
              type="button"
              className={activeSection === item.id ? "account-dashboard__nav is-active" : "account-dashboard__nav"}
              onClick={() => {
                onChange(item.id);
              }}
            >
              <AccountNavIcon name={item.icon} />
              <span>{item.label}</span>
            </button>
          );
        })}
        {logoutItem ? (
          <button
            type="button"
            className={activeSection === "logout" ? "account-dashboard__nav account-dashboard__nav--logout is-active" : "account-dashboard__nav account-dashboard__nav--logout"}
            onClick={() => {
              onChange("logout");
            }}
          >
            <AccountNavIcon name={logoutItem.icon} />
            <span>{logoutItem.label}</span>
          </button>
        ) : null}
      </div>
    </aside>
  );
}

function PersonalSection({ form, onFieldChange, onSubmit, submitting }) {
  const displayName = getAccountDisplayName(form);
  return (
    <section className="account-dashboard__section account-personal-section">
      <div className="account-dashboard__section-head">
        <h2>Personal Information</h2>
        <p>Update the main details tied to your DEETECH account.</p>
      </div>
      <div className="account-personal-card account-personal-card--summary">
        <div className="account-personal-profile">
          <div className="account-personal-profile__avatar" aria-hidden="true">
            {getAccountInitials(form)}
          </div>
          <div>
            <span>Account owner</span>
            <strong>{displayName}</strong>
            <p>{form.email || "Email not available"}</p>
          </div>
        </div>
      </div>

      <form className="account-dashboard__form account-personal-form account-personal-card" onSubmit={onSubmit}>
        <label className="account-dashboard__field account-personal-field">
          <span>First Name <small>*</small></span>
          <input className="field" value={form.firstName} onChange={(event) => onFieldChange("firstName", event.target.value)} required />
        </label>
        <label className="account-dashboard__field account-personal-field">
          <span>Last Name <small>*</small></span>
          <input className="field" value={form.lastName} onChange={(event) => onFieldChange("lastName", event.target.value)} required />
        </label>
        <label className="account-dashboard__field account-dashboard__field--full account-personal-field account-personal-field--readonly">
          <span>Email Address <small>*</small></span>
          <div className="account-readonly-input">
            <input className="field disabled-field" value={form.email} disabled />
            <em aria-hidden="true">Lock</em>
          </div>
          <small>Email is read-only for account security.</small>
        </label>
        <label className="account-dashboard__field account-dashboard__field--full account-personal-field">
          <span>Phone Number <small>*</small></span>
          <div className="account-phone-input">
            <span className="account-phone-input__code">+233</span>
            <input className="field" value={form.phone} onChange={(event) => onFieldChange("phone", event.target.value)} placeholder="Enter Phone Number" required />
          </div>
        </label>
        <div className="account-personal-divider" />
        <div className="account-communication" aria-label="Communication Preferences">
          <h3>Communication Preferences</h3>
          <div className="account-communication__row">
            <span className="account-communication__icon"><AccountNavIcon name="campaign" /></span>
            <div>
              <strong>Marketing Communications</strong>
              <p>Receive updates on new hardware arrivals and tech deals.</p>
            </div>
            <label className="account-communication__toggle">
              <input type="checkbox" defaultChecked aria-label="Marketing communications" />
              <span />
            </label>
          </div>
        </div>
        <div className="account-personal-actions">
          <button type="submit" className="primary-button account-dashboard__submit" disabled={submitting}>
            {submitting ? "Updating..." : "Update Changes"}
          </button>
          <button type="button" className="account-personal-discard">Discard Changes</button>
        </div>
      </form>
      <div className="account-security-strip">
        <span><AccountNavIcon name="shield" /></span>
        <div>
          <strong>Account Security</strong>
          <p>Your account is currently protected with standard security.</p>
        </div>
      </div>
    </section>
  );
}

function OrdersSection({ orders, router, onDownloadInvoice }) {
  return (
    <section className="account-dashboard__section account-orders-section">
      <div className="account-dashboard__section-head account-dashboard__section-head--row">
        <div>
          <h2>Orders ({orders.length})</h2>
          <p>Track active purchases, invoice downloads, and review actions from one place.</p>
        </div>
      </div>
      <div className="account-dashboard__stack">
        {orders.length ? orders.map((order) => {
          const items = getOrderLineItems(order);
          const visibleItems = items.slice(0, 2);
          const overflowCount = Math.max(0, items.length - visibleItems.length);
          const itemsPrice = getOrderItemsPrice(order);
          const shippingPrice = getOrderShippingPrice(order);
          const discountAmount = getOrderDiscountAmount(order);
          const productSavings = getOrderProductSavings(order);
          return (
            <article key={order._id} className="account-order-card panel">
              <div className="account-order-card__summary">
                <div>
                  <span>Order ID</span>
                  <strong>#{order.orderNumber || order._id}</strong>
                </div>
                <div>
                  <span>Total Payment</span>
                  <strong>{formatCurrency(Number(order.totalPrice || 0))}</strong>
                  <small>
                    {shippingPrice > 0
                      ? `Subtotal ${formatCurrency(itemsPrice)} + Delivery ${formatCurrency(shippingPrice)}`
                      : `Subtotal ${formatCurrency(itemsPrice)} + Free Delivery`}
                  </small>
                </div>
                <div>
                  <span>Payment Method</span>
                  <strong>{paymentLabel(order.paymentMethod)}</strong>
                  {productSavings > 0 ? <small>Product savings {formatCurrency(productSavings)}</small> : null}
                  {discountAmount > 0 ? <small>Discount {formatCurrency(discountAmount)}</small> : null}
                </div>
                <div>
                  <span>{order?.isDelivered ? "Delivered Date" : "Order Date"}</span>
                  <strong>{formatDate(order?.deliveredAt || order?.createdAt)}</strong>
                </div>
              </div>

              <div className="account-order-card__items">
                {visibleItems.map((item, index) => {
                  const product = item?.product || {};
                  const image = getOrderItemImage(item);
                  return (
                    <Link
                      key={product?._id || index}
                      href={product?._id ? `/products/${product._id}` : "/products"}
                      className="account-order-card__item"
                    >
                      <div className="account-order-card__thumb">
                        <StableImage
                          src={image}
                          alt={product?.name || "Product"}
                          width={112}
                          height={112}
                        />
                      </div>
                      <div className="account-order-card__copy">
                        <strong>{product?.name || "Product"}</strong>
                        <span>Qty: {Number(item?.qty || item?.quantity || 1)}</span>
                      </div>
                    </Link>
                  );
                })}
                {overflowCount > 0 ? (
                  <div className="account-order-card__overflow" aria-label={`${overflowCount} more order items`}>
                    +{overflowCount}
                  </div>
                ) : null}
              </div>

              <div className="account-order-card__footer">
                <div className="account-order-card__status">
                  <span className={`account-order-card__pill ${statusTone(order)}`}>{orderStatusLabel(order)}</span>
                  <p>{orderStatusMessage(order)}</p>
                </div>
                <div className="account-order-card__actions">
                  <button type="button" className="primary-button" onClick={() => router.push(`/orders/${order._id}`)}>
                    <AccountNavIcon name="map" />
                    <span>Track Order</span>
                  </button>
                  <button type="button" className="ghost-button" onClick={() => onDownloadInvoice(order)}>
                    <AccountNavIcon name="receipt" />
                    <span>Invoice</span>
                  </button>
                  {items[0]?.product?._id ? (
                    <button type="button" className="ghost-button" onClick={() => router.push(`/products/${items[0].product._id}?tab=reviews#reviews`)}>
                      <AccountNavIcon name="review" />
                      <span>Add Review</span>
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
          );
        }) : (
          <EmptyState
            icon="orders"
            title="No orders yet"
            description="Your purchases will appear here once you complete checkout."
            actionHref="/products"
            actionLabel="Browse products"
          />
        )}
      </div>
    </section>
  );
}

function AddressSection({ form, onFieldChange, onSubmit, submitting }) {
  const displayName = [form.firstName, form.lastName].filter(Boolean).join(" ") || "Account Holder";
  const cityRegion = [form.city, form.region].filter(Boolean).join(", ") || "Add your city and region.";
  return (
    <section className="account-dashboard__section account-address-section">
      <div className="account-dashboard__section-head">
        <h2>Manage Address</h2>
        <p>Update your default delivery address for faster checkout.</p>
      </div>

      <div className="account-address-preview">
        <span className="account-address-preview__icon" aria-hidden="true">
          <AccountNavIcon name="home" />
        </span>
        <div className="account-address-preview__copy">
          <span className="account-address-preview__badge">Default Address</span>
          <strong>{displayName}</strong>
          <p>{form.address || "No street address added yet."}</p>
          <p>{cityRegion}</p>
          <p>{form.phone || "Add your phone number."}</p>
        </div>
        <button type="button" className="account-address-preview__edit">
          <AccountNavIcon name="edit" />
          <span>Edit</span>
        </button>
      </div>

      <form className="account-dashboard__form account-address-form" onSubmit={onSubmit}>
        <h3>Add New Address</h3>
        <label className="account-dashboard__field">
          <span>First Name</span>
          <input className="field" value={form.firstName} onChange={(event) => onFieldChange("firstName", event.target.value)} placeholder="e.g. Kwame" required />
        </label>
        <label className="account-dashboard__field">
          <span>Last Name</span>
          <input className="field" value={form.lastName} onChange={(event) => onFieldChange("lastName", event.target.value)} placeholder="e.g. Mensah" required />
        </label>
        <label className="account-dashboard__field account-dashboard__field--full">
          <span>Street Address</span>
          <input className="field" value={form.address} onChange={(event) => onFieldChange("address", event.target.value)} placeholder="House No., Street Name, Landmark" required />
        </label>
        <label className="account-dashboard__field account-dashboard__field--full">
          <span>City</span>
          <input className="field" value={form.city} onChange={(event) => onFieldChange("city", event.target.value)} placeholder="Enter City" required />
        </label>
        <label className="account-dashboard__field account-dashboard__field--full">
          <span>Region</span>
          <select className="field" value={form.region} onChange={(event) => onFieldChange("region", event.target.value)} required>
            <option value="">Select Region</option>
            {GHANA_REGIONS.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </label>
        <label className="account-dashboard__field account-dashboard__field--full">
          <span>Phone Number</span>
          <input className="field" value={form.phone} onChange={(event) => onFieldChange("phone", event.target.value)} placeholder="+233 XX XXX XXXX" required />
        </label>
        <label className="account-dashboard__field account-dashboard__field--full">
          <span>Email Address (Read-only)</span>
          <input className="field disabled-field" value={form.email} disabled />
        </label>
        <div className="account-address-actions">
          <button type="submit" className="primary-button account-dashboard__submit" disabled={submitting}>
            {submitting ? "Saving..." : "Add Address"}
          </button>
          <button type="button" className="account-personal-discard">
            Clear Form
          </button>
        </div>
      </form>

      <div className="account-address-tip">
        <AccountNavIcon name="info" />
        <p><strong>Pro Tip:</strong> Setting a default address ensures that shipping costs are accurately calculated instantly when you add items to your cart.</p>
      </div>
    </section>
  );
}

function AffiliateSection({ summary }) {
  const totalReferrals = Number(summary.referrals || 0);
  const deliveredReferrals = Number(summary.deliveredReferrals || 0);
  const pendingReferrals = Number(summary.pendingReferrals || 0);
  const cancelledReferrals = Number(summary.cancelledReferrals || 0);
  const pendingCommission = Number(summary.pendingCommission || 0);
  const earnedCommission = Number(summary.earned || 0);
  const lifetimeGenerated = pendingCommission + earnedCommission;
  const successRate = totalReferrals ? Math.round((deliveredReferrals / totalReferrals) * 100) : 0;
  const commissionRate = Number(summary.commissionRate || 0);
  const tier = summary.tier || "starter";
  const statCards = [
    {
      tone: "green",
      icon: "users",
      label: "Total Referrals",
      value: totalReferrals,
      helper: `${deliveredReferrals} successful - ${pendingReferrals} pending`,
    },
    {
      tone: "gold",
      icon: "receipt",
      label: "Pending Commission",
      value: formatCurrency(pendingCommission),
      helper: "Awaiting delivery completion",
    },
    {
      tone: "emerald",
      icon: "money",
      label: "Total Paid Out",
      value: formatCurrency(earnedCommission),
      helper: "Approved commissions",
    },
    {
      tone: "green",
      icon: "trend",
      label: "Lifetime Generated",
      value: formatCurrency(lifetimeGenerated),
      helper: "Pending + paid-out orders",
    },
    {
      tone: "danger",
      icon: "xCircle",
      label: "Cancelled Referrals",
      value: cancelledReferrals,
      helper: "Orders not completed",
    },
    {
      tone: "green",
      icon: "check",
      label: "Success Rate",
      value: `${successRate}%`,
      helper: "Referral conversion",
    },
  ];
  const conversionRows = [
    {
      label: "Successful referrals",
      count: deliveredReferrals,
      commission: earnedCommission,
      status: "Settled",
      tone: "settled",
    },
    {
      label: "Pending referrals",
      count: pendingReferrals,
      commission: pendingCommission,
      status: "Pending",
      tone: "pending",
    },
    {
      label: "Cancelled referrals",
      count: cancelledReferrals,
      commission: 0,
      status: "Cancelled",
      tone: "cancelled",
    },
  ];

  return (
    <section className="account-dashboard__section account-affiliate-section">
      <div className="account-affiliate-section__head">
        <h2>Affiliates</h2>
        <p>Track your referral code, commissions, and payout progress from your account.</p>
      </div>

      <div className="account-affiliate-hero">
        <div className="account-affiliate-hero__copy">
          <span className={`account-affiliate-status ${summary.isAffiliate ? "is-active" : "is-inactive"}`}>
            {summary.isAffiliate ? "Active affiliate badge" : "Not active yet"}
          </span>
          <h3>{summary.isAffiliate ? "Your affiliate hub is ready." : "Start earning with DEETECH referrals."}</h3>
          <dl className="account-affiliate-hero__metrics">
            <div>
              <dt>Tier</dt>
              <dd>{tier}</dd>
            </div>
            <div>
              <dt>Commission Rate</dt>
              <dd>{commissionRate ? `${commissionRate}%` : "N/A"}</dd>
            </div>
          </dl>
        </div>
        <div className="account-affiliate-code-card">
          <span>Your Unique Referral Code</span>
          <div>
            <strong>{summary.code || "Not created"}</strong>
            <AccountNavIcon name="copy" />
          </div>
          <p>{summary.isAffiliate ? "Share this code with your network to earn rewards." : "Open the affiliate page to create your code."}</p>
        </div>
      </div>

      <div className="account-affiliate-stats">
        {statCards.map((card) => (
          <article key={card.label} className={`account-affiliate-stat is-${card.tone}`}>
            <AccountNavIcon name={card.icon} />
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <small>{card.helper}</small>
          </article>
        ))}
      </div>

      <div className="account-affiliate-panels">
        <article className="account-affiliate-panel">
          <div className="account-affiliate-panel__head">
            <h3>Next Payout</h3>
            <AccountNavIcon name="clock" />
          </div>
          <div className="account-affiliate-payout-box">
            <span>Pending Commission</span>
            <strong>{formatCurrency(pendingCommission)}</strong>
          </div>
          <p>Your earnings are verified after qualifying delivery completion. Pending referrals move into payout once the order is confirmed.</p>
          <span className={pendingCommission > 0 ? "account-affiliate-checkline is-ready" : "account-affiliate-checkline"}>
            <AccountNavIcon name={pendingCommission > 0 ? "check" : "clock"} />
            {pendingCommission > 0 ? "Threshold active" : "Awaiting qualified referrals"}
          </span>
        </article>

        <article className="account-affiliate-panel">
          <div className="account-affiliate-panel__head">
            <h3>Payout Method</h3>
            <AccountNavIcon name="bank" />
          </div>
          <div className="account-affiliate-method">
            <AccountNavIcon name="bank" />
            <div>
              <strong>Managed on Affiliate Page</strong>
              <span>Review payout settings and deeper referral history.</span>
            </div>
          </div>
          <p>Use the full affiliate page to manage account-level payout details and referral activity.</p>
          <Link href="/affiliates">Edit Method <AccountNavIcon name="edit" /></Link>
        </article>

        <article className="account-affiliate-panel account-affiliate-panel--summary">
          <div className="account-affiliate-panel__head">
            <h3>Lifetime Summary</h3>
            <AccountNavIcon name="trend" />
          </div>
          <dl>
            <div>
              <dt>Total Referrals</dt>
              <dd>{totalReferrals}</dd>
            </div>
            <div>
              <dt>Average Commission Rate</dt>
              <dd>{commissionRate ? `${commissionRate}%` : "N/A"}</dd>
            </div>
            <div>
              <dt>Successful Referrals</dt>
              <dd>{deliveredReferrals}</dd>
            </div>
            <div>
              <dt>Conversion Rate</dt>
              <dd>{successRate}%</dd>
            </div>
          </dl>
          <Link href="/affiliates" className="primary-link">Open Affiliate Page <AccountNavIcon name="arrowRight" /></Link>
        </article>
      </div>

      <div className="account-affiliate-conversions">
        <div className="account-affiliate-conversions__head">
          <h3>Recent Conversions</h3>
          <Link href="/affiliates">View All History</Link>
        </div>
        <div className="account-affiliate-conversions__table">
          <div className="account-affiliate-conversions__row account-affiliate-conversions__row--head">
            <span>Type</span>
            <span>Referrals</span>
            <span>Commission</span>
            <span>Status</span>
          </div>
          {conversionRows.map((row) => (
            <div key={row.label} className="account-affiliate-conversions__row">
              <span>{row.label}</span>
              <strong>{row.count}</strong>
              <strong>{formatCurrency(row.commission)}</strong>
              <em className={`is-${row.tone}`}>{row.status}</em>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WishlistSection({ items }) {
  return (
    <section className="account-dashboard__section account-wishlist-section">
      <div className="account-wishlist-section__head">
        <h2>Wishlist</h2>
        <p>A mini wishlist preview linked to your main saved-products page.</p>
      </div>

      {items.length ? (
        <div className="account-wishlist-list">
          {items.slice(0, 3).map((item) => (
            <article key={item.id} className="account-wishlist-row">
              <Link href={`/products/${item.id}`} className="account-wishlist-row__product">
                <div className="account-wishlist-row__thumb">
                  <StableImage
                    src={item.image}
                    alt={item.name}
                    width={112}
                    height={112}
                  />
                </div>
                <div className="account-wishlist-row__copy">
                  <span>{item.category || "Product"}</span>
                  <strong>{item.name}</strong>
                  <small>{formatCurrency(item.price)}</small>
                </div>
              </Link>
              <span className={item.inStock ? "account-wishlist-stock is-in-stock" : "account-wishlist-stock is-out"}>
                {item.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="wishlist"
          title="Your wishlist is empty"
          description="Save your favorite gadgets to compare and revisit them later."
        />
      )}

      <div className="account-wishlist-actions">
        <Link href="/wishlist" className="primary-link">
          <span>Open Wishlist</span>
          <AccountNavIcon name="arrowRight" />
        </Link>
      </div>
    </section>
  );
}

function ReviewsSection({ reviews }) {
  return (
    <section className="account-dashboard__section account-reviews-section">
      <div className="account-reviews-section__head">
        <h2>Reviews</h2>
        <p>Recent customer reviews you have submitted, with a quick jump back to the main product page.</p>
      </div>

      {reviews.length ? (
        <div className="account-reviews-list">
          {reviews.slice(0, 3).map((review) => {
            const product = review?.product || {};
            const image = resolveProductImage(product?.images?.[0] || product?.image);
            const productHref = product?._id ? `/products/${product._id}?tab=reviews#reviews` : "/products";
            const reviewedAt = review?.createdAt || review?.updatedAt || review?.date;
            return (
              <article key={review._id} className="account-review-row">
                <Link href={productHref} className="account-review-row__thumb">
                  <StableImage
                    src={image}
                    alt={product?.name || "Product"}
                    width={150}
                    height={150}
                  />
                </Link>
                <div className="account-review-row__content">
                  <Link href={productHref} className="account-review-row__title">{product?.name || "Product"}</Link>
                  <p className="account-review-row__stars">{getReviewStars(review?.rating)}</p>
                  <strong>&quot;{review?.title || "Customer review"}&quot;</strong>
                  {review?.comment || review?.review ? (
                    <p>{review?.comment || review?.review}</p>
                  ) : (
                    <p>Your submitted product feedback is saved with this purchase.</p>
                  )}
                </div>
                <div className="account-review-row__actions">
                  <span>Verified Purchase</span>
                  <Link href={productHref} className="ghost-link">Open Product</Link>
                  <small>Reviewed {formatNotificationTime(reviewedAt)}</small>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon="reviews"
          title="No reviews yet"
          description="Your submitted reviews will show up here after you post them from a product page."
        />
      )}

      <div className="account-reviews-cta">
        <div>
          <strong>Want to share more feedback?</strong>
          <p>Every review helps us improve the DEETECH experience for the Ghanaian tech community.</p>
        </div>
        <Link href="/products?sort=newest">
          Shop New Arrivals
        </Link>
      </div>
    </section>
  );
}

function PasswordSection({
  currentPassword,
  newPassword,
  confirmPassword,
  onChange,
  onSubmit,
  submitting,
}) {
  return (
    <section className="account-dashboard__section account-password-section">
      <div className="account-password-section__head">
        <h2>Password Manager</h2>
        <p>Update your password securely from your account dashboard.</p>
      </div>

      <form className="account-password-form" onSubmit={onSubmit}>
        <label className="account-password-field account-password-field--full">
          <span>Current Password</span>
          <div className="account-password-input">
            <input type="password" value={currentPassword} onChange={(event) => onChange("currentPassword", event.target.value)} placeholder="Enter current password" required />
            <AccountNavIcon name="eye" />
          </div>
        </label>
        <label className="account-password-field">
          <span>New Password</span>
          <div className="account-password-input">
            <input type="password" value={newPassword} onChange={(event) => onChange("newPassword", event.target.value)} placeholder="Create a strong password" required />
            <AccountNavIcon name="eye" />
          </div>
          <small>Min. 8 characters, 1 number, 1 symbol.</small>
        </label>
        <label className="account-password-field">
          <span>Confirm New Password</span>
          <div className="account-password-input">
            <input type="password" value={confirmPassword} onChange={(event) => onChange("confirmPassword", event.target.value)} placeholder="Repeat new password" required />
            <AccountNavIcon name="eye" />
          </div>
        </label>
        <div className="account-password-actions">
          <button type="submit" className="primary-button" disabled={submitting}>
            {submitting ? "Updating..." : "Update Password"}
          </button>
          <Link href="/forgot-password">Forgot Password?</Link>
          <span>
            <AccountNavIcon name="shield" />
            End-to-end encrypted
          </span>
        </div>
      </form>

      <div className="account-password-security-grid">
        <article className="account-password-security-card">
          <div className="account-password-security-card__head">
            <span aria-hidden="true">AUTHENTICATOR</span>
            <div>
              <h3>Two-Factor Authentication</h3>
              <small>Highly recommended</small>
            </div>
          </div>
          <p>Add an extra layer of security to your DEETECH account by requiring a code from your phone as well as your password.</p>
          <button type="button" className="ghost-button">Setup 2FA</button>
        </article>

        <article className="account-password-security-card account-password-security-card--sessions">
          <div className="account-password-security-card__head">
            <span aria-hidden="true"><AccountNavIcon name="device" /></span>
            <div>
              <h3>Active Sessions</h3>
              <small>2 devices logged in</small>
            </div>
          </div>
          <dl>
            <div>
              <dt>Current browser</dt>
              <dd>Current</dd>
            </div>
            <div>
              <dt>Mobile session</dt>
              <dd>Log out</dd>
            </div>
          </dl>
          <button type="button">Review all sessions</button>
        </article>
      </div>
    </section>
  );
}
function LogoutSection({ onLogout }) {
  return (
    <section className="account-dashboard__section">
      <div className="account-dashboard__section-head">
        <h2>Logout</h2>
        <p>Are you sure you want to log out?</p>
      </div>
      <button type="button" className="primary-button" onClick={onLogout}>
        Yes, Logout
      </button>
    </section>
  );
}

function AccountTransientState({ mode = "loading" }) {
  const isRedirect = mode === "redirect";
  return (
    <main className="shell page-section account-transient-page">
      <nav className="account-transient-crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <strong>My Account</strong>
      </nav>
      <div className="account-transient-kicker">My Account</div>

      <section className={`account-transient-card ${isRedirect ? "is-redirect" : "is-loading"}`} aria-live="polite">
        <div className="account-transient-card__orb" aria-hidden="true">
          <span />
        </div>
        <span className="account-transient-card__badge">{isRedirect ? "Secure redirect" : "Secure session check"}</span>
        <h1>{isRedirect ? "Redirecting to login" : "Account dashboard loading"}</h1>
        <p>
          {isRedirect
            ? "Taking you to the login page so your account details stay protected."
            : "Loading your profile, saved details, orders, messages, and account activity."}
        </p>
        <div className="account-transient-skeleton" aria-hidden="true">
          <span />
          <div>
            <i />
            <i />
            <i />
          </div>
        </div>
      </section>
    </main>
  );
}

function MessagesSection({
  tickets,
  replyDraft,
  sendingReply,
  onReplyDraftChange,
  onSendReply,
}) {
  const activeTicket = tickets[0] || null;
  const composerFormRef = useRef(null);

  const thread = Array.isArray(activeTicket?.messages) ? activeTicket.messages : [];
  const subject = activeTicket?.subject || "Support request";
  const status = String(activeTicket?.status || "open");

  return (
    <section className="account-dashboard__section account-messages-section">
      <div className="account-dashboard__section-head">
        <h2>Messages / Requests</h2>
        <p>Continue your support conversation with our team in real time.</p>
      </div>

      {!tickets.length ? (
        <EmptyState
          icon="reviews"
          title="No support requests yet"
          description="Start with the support page to open your first request."
          actionHref="/contact"
          actionLabel="Open support page"
        />
      ) : (
        <div className="account-support-chat">
          <div className="account-support-chat__thread-wrap">
            {activeTicket ? (
              <>
                <header className="account-support-chat__thread-head">
                  <div>
                    <strong>{subject}</strong>
                    <p>Ticket ID: #{activeTicket.ticketNumber || activeTicket._id || "request"} - Started {formatDateTime(activeTicket.createdAt)}</p>
                  </div>
                  <div className="account-support-chat__head-actions">
                    <span className={`account-order-card__pill ${status.toLowerCase() === "resolved" ? "is-success" : "is-warning"}`}>
                      {status}
                    </span>
                    <button type="button" className="account-support-chat__refresh">
                      <AccountNavIcon name="refresh" />
                      <span>Refresh</span>
                    </button>
                  </div>
                </header>

                <div className="account-support-chat__thread">
                  <div className="account-support-chat__date-pill">{formatDate(activeTicket.createdAt)}</div>
                  {thread.map((entry, index) => {
                    const sender = String(entry?.sender || "user").toLowerCase() === "admin" ? "admin" : "user";
                    const imageUrl = resolveSupportImageUrl(entry?.imageUrl);
                    const text = String(entry?.text || "").trim();
                    return (
                      <article key={`${entry?.createdAt || "msg"}-${index}`} className={`account-support-chat__bubble is-${sender}`}>
                        <div className="account-support-chat__bubble-meta">
                          <strong>{sender === "admin" ? "Support" : "You"}</strong>
                          <span>{formatDateTime(entry?.createdAt)}</span>
                        </div>
                        {text ? <p>{text}</p> : null}
                        {imageUrl ? (
                          <a href={imageUrl} target="_blank" rel="noreferrer" className="account-support-chat__image">
                            <StableImage src={imageUrl} alt="Support attachment" width={220} height={140} />
                          </a>
                        ) : null}
                      </article>
                    );
                  })}
                </div>

                <form ref={composerFormRef} className="account-support-chat__composer" onSubmit={onSendReply}>
                  <div className="account-support-chat__composer-row">
                    <textarea
                      className="field account-support-chat__input"
                      value={replyDraft}
                      onChange={(event) => onReplyDraftChange(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          composerFormRef.current?.requestSubmit();
                        }
                      }}
                      placeholder="Type a message..."
                      rows={1}
                    />
                    <button type="submit" className="primary-button account-support-chat__send" disabled={sendingReply || !replyDraft.trim()}>
                      <span>{sendingReply ? "..." : "Send"}</span>
                      {!sendingReply ? <AccountNavIcon name="send" /> : null}
                    </button>
                  </div>
                  <p className="account-support-chat__security"><AccountNavIcon name="lock" /> This conversation is encrypted and logged for quality assurance.</p>
                </form>
              </>
            ) : null}
          </div>
          <aside className="account-support-sidebar">
            <div className="contact-support-preview">
              <h3>Need another way to reach us?</h3>
              <p>
                If you need immediate assistance or prefer messaging apps, our team is active on social support channels.
              </p>
              <a
                href={SUPPORT_WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="primary-link"
              >
                Chat on WhatsApp
              </a>
            </div>
            <div className="account-support-side-card">
              <h3><AccountNavIcon name="info" /> Request Details</h3>
              <dl>
                <div>
                  <dt>Ticket</dt>
                  <dd>#{activeTicket?._id || "request"}</dd>
                </div>
                <div>
                  <dt>Subject</dt>
                  <dd>{subject}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd className={status.toLowerCase() === "resolved" ? "is-success" : "is-warning"}>{status}</dd>
                </div>
              </dl>
            </div>
            <div className="account-support-side-card">
              <h3>FAQ Quick Links</h3>
              <p>How to track my order?</p>
              <p>Ghana-wide delivery timelines</p>
              <p>Return and Refund policy</p>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

function NotificationsSection({ notifications, readIds, onOpenNotification, onMarkAllRead }) {
  return (
    <section className="account-dashboard__section account-notifications-section">
      <div className="account-notifications-header">
        <div>
          <h2>Notifications</h2>
          <p>Read your latest order and support updates here. The navbar only shows a quick preview, while the full history stays in this section.</p>
        </div>
        {notifications.length ? (
          <button type="button" className="account-notifications-mark-read" onClick={onMarkAllRead}>
            <AccountNavIcon name="check" />
            <span>Mark all as read</span>
          </button>
        ) : null}
      </div>

      {!notifications.length ? (
        <EmptyState
          icon="orders"
          title="No notifications yet"
          description="Order updates and support replies will appear here as soon as they arrive."
        />
      ) : (
        <div className="account-notification-history">
          {notifications.map((item) => {
            const itemId = String(item?.id || "");
            const isUnread = !readIds.includes(itemId);
            return (
              <article key={itemId} className={isUnread ? "account-notification-card is-unread" : "account-notification-card"}>
                <div className="account-notification-card__head">
                  <div className="account-notification-card__eyebrow-row">
                    <span className="account-notification-card__eyebrow">{item.kind === "message" ? "Support update" : "Order update"}</span>
                    <span className={isUnread ? "account-notification-card__pill is-unread" : "account-notification-card__pill"}>{isUnread ? "Unread" : "Read"}</span>
                  </div>
                  <time className="account-notification-card__time" dateTime={item.timestamp || undefined}>
                    {formatNotificationTime(item.timestamp)}
                  </time>
                </div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <Link
                  href={item.href}
                  className="account-notification-card__open"
                  onClick={() => onOpenNotification(itemId)}
                >
                  <span>Open update</span>
                  <AccountNavIcon name="arrowRight" />
                </Link>
              </article>
            );
          })}
          <div className="account-notification-older" aria-label="Older notifications">
            <AccountNavIcon name="archive" />
            <p>That's everything from the last 30 days.</p>
            <button type="button">View Older Notifications</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default function AccountPageClient({ initialTab = "" }) {
  const router = useRouter();
  const { pushToast } = useToast();
  const { isAuthenticated, logout, refreshProfile, saveProfile, status, token, user } = useAuth();
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    region: "",
    address: "",
  });
  const [orders, setOrders] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [affiliateSummary, setAffiliateSummary] = useState({
    isAffiliate: false,
    code: "",
    tier: "starter",
    commissionRate: 0,
    earned: 0,
    referrals: 0,
    pendingCommission: 0,
    pendingReferrals: 0,
    deliveredReferrals: 0,
    cancelledReferrals: 0,
  });
  const [reviews, setReviews] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [activeSupportTicketId, setActiveSupportTicketId] = useState("");
  const [supportReplyDraft, setSupportReplyDraft] = useState("");
  const [sendingSupportReply, setSendingSupportReply] = useState(false);
  const [notificationReadIds, setNotificationReadIds] = useState([]);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const profileHydratedRef = useRef(false);
  const [activeSection, setActiveSection] = useState(() =>
    normalizeAccountTab(String(initialTab || "").toLowerCase())
  );

  useEffect(() => {
    setActiveSection(normalizeAccountTab(String(initialTab || "").toLowerCase()));
  }, [initialTab]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeSection]);

  useEffect(() => {
    const notificationScope = buildNotificationScope(user);
    const syncNotificationStorage = (event) => {
      if (event?.type === "storage" && event.key && !event.key.includes("deetech:header-notifications:")) return;
      setNotificationReadIds(readNotificationReadIds(notificationScope));
    };

    syncNotificationStorage();
    window.addEventListener("storage", syncNotificationStorage);
    window.addEventListener(HEADER_NOTIFICATIONS_UPDATED_EVENT, syncNotificationStorage);
    return () => {
      window.removeEventListener("storage", syncNotificationStorage);
      window.removeEventListener(HEADER_NOTIFICATIONS_UPDATED_EVENT, syncNotificationStorage);
    };
  }, [user]);

  function fillProfileForm(profile) {
    const nextProfile = profile || {};
    setProfileForm({
      firstName: nextProfile?.firstName || nextProfile?.name?.split(" ")?.[0] || "",
      lastName: nextProfile?.lastName || nextProfile?.name?.split(" ")?.slice(1).join(" ") || "",
      email: nextProfile?.email || "",
      phone: nextProfile?.phone || "",
      city: nextProfile?.city || "",
      region: nextProfile?.region || "",
      address: nextProfile?.address || "",
    });
  }

  useEffect(() => {
    if (status !== "ready") return;
    if (!isAuthenticated || !token) {
      profileHydratedRef.current = false;
      return;
    }
    if (profileHydratedRef.current) return;

    profileHydratedRef.current = true;
    setLoadingProfile(true);

    refreshProfile()
      .then((profile) => {
        fillProfileForm(profile || user || {});
      })
      .finally(() => setLoadingProfile(false));
  }, [isAuthenticated, refreshProfile, status, token, user]);

  useEffect(() => {
    if (status !== "ready" || !isAuthenticated || !token) return;

    Promise.allSettled([
      requestWithToken(`${API_BASE_ORDERS}/myorders`, token),
      requestWithToken(`${API_BASE}/affiliates/me`, token),
      requestWithToken(`${API_BASE}/reviews/me`, token),
      requestWithToken(`${API_BASE}/support/my`, token),
      fetchProducts(),
    ]).then((results) => {
      const [ordersResult, affiliateResult, reviewsResult, supportResult, productsResult] = results;

      if (ordersResult.status === "fulfilled") {
        setOrders(Array.isArray(ordersResult.value) ? ordersResult.value : []);
      }

      if (affiliateResult.status === "fulfilled") {
        const payload = affiliateResult.value || {};
        setAffiliateSummary({
          isAffiliate: Boolean(payload?.isAffiliate),
          code: payload?.affiliate?.code || payload?.affiliate?.affiliateCode || "",
          tier: payload?.affiliate?.tier || "starter",
          commissionRate: Number(payload?.affiliate?.commissionRate || payload?.settings?.defaultCommissionRate || 0),
          earned: Number(payload?.stats?.earnedCommission || payload?.affiliate?.earnedCommission || 0),
          referrals: Number(payload?.stats?.totalReferrals || payload?.referrals?.length || 0),
          pendingCommission: Number(payload?.stats?.pendingCommission || 0),
          pendingReferrals: Number(payload?.stats?.pendingReferrals || 0),
          deliveredReferrals: Number(payload?.stats?.deliveredReferrals || 0),
          cancelledReferrals: Number(payload?.stats?.cancelledReferrals || 0),
        });
      }

      if (reviewsResult.status === "fulfilled") {
        setReviews(Array.isArray(reviewsResult.value) ? reviewsResult.value : []);
      }

      if (supportResult.status === "fulfilled") {
        const tickets = Array.isArray(supportResult.value) ? supportResult.value : [];
        setSupportTickets(tickets);
        setActiveSupportTicketId((current) => current || tickets[0]?._id || "");
      }

      if (productsResult.status === "fulfilled") {
        const products = Array.isArray(productsResult.value) ? productsResult.value : [];
        const productMap = new Map(products.map((product) => [String(product?._id || product?.id || ""), product]));
        const nextWishlistItems = readWishlistEntries()
          .map((entry) => {
            const product = productMap.get(entry.id);
            if (!product) return null;
            return {
              id: entry.id,
              name: product?.name || "Product",
              category: formatCategoryLabel(product?.category || "Product"),
              price: getProductPrice(product),
              image: resolveProductImage(product?.images?.[0] || product?.image),
              inStock: getProductStock(product) > 0,
            };
          })
          .filter(Boolean);
        setWishlistItems(nextWishlistItems);
      }
    });
  }, [isAuthenticated, status, token]);

  function handleProfileFieldChange(field, value) {
    setProfileForm((current) => ({ ...current, [field]: value }));
  }

  function handlePasswordFieldChange(field, value) {
    setPasswordForm((current) => ({ ...current, [field]: value }));
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();
    setSavingProfile(true);
    try {
      await saveProfile({
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
        phone: profileForm.phone.trim(),
      });
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleAddressSubmit(event) {
    event.preventDefault();
    setSavingAddress(true);
    try {
      const updatedProfile = await saveProfile({
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
        phone: profileForm.phone.trim(),
        address: profileForm.address.trim(),
        city: profileForm.city.trim(),
        region: profileForm.region.trim(),
      });
      fillProfileForm(updatedProfile);
      syncCheckoutDraftProfile(updatedProfile, updatedProfile);
      pushToast("Address updated successfully", "success");
    } finally {
      setSavingAddress(false);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    if (!token || !user?.email) return;
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      pushToast("New passwords do not match", "warning");
      return;
    }

    setSavingPassword(true);
    try {
      await requestJson(`${API_BASE_AUTH}/login`, {
        method: "POST",
        body: JSON.stringify({ email: user.email, password: passwordForm.currentPassword }),
      });
      await saveProfile({ password: passwordForm.newPassword });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      pushToast(error.message || "Could not update password", "warning");
    } finally {
      setSavingPassword(false);
    }
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  function handleSectionChange(section) {
    const nextSection = normalizeAccountTab(String(section || "").toLowerCase());
    const nextHref = nextSection === "personal" ? "/account" : `/account?tab=${encodeURIComponent(nextSection)}`;
    setActiveSection(nextSection);
    router.replace(nextHref, { scroll: false });
  }

  function handleNotificationOpen(notificationId) {
    if (!notificationId) return;
    const notificationScope = buildNotificationScope(user);
    markNotificationsAsRead(notificationScope, [notificationId]);
  }

  function handleMarkAllNotificationsRead() {
    const notificationScope = buildNotificationScope(user);
    markNotificationsAsRead(notificationScope, accountNotifications.map((item) => item?.id));
  }

  async function handleSupportReplySubmit(event) {
    event.preventDefault();
    const message = supportReplyDraft.trim();
    if (!token || !activeSupportTicketId || !message) return;
    setSendingSupportReply(true);
    try {
      await requestWithToken(`${API_BASE}/support/${activeSupportTicketId}/reply`, token, {
        method: "POST",
        body: JSON.stringify({ message }),
      });
      const refreshed = await requestWithToken(`${API_BASE}/support/my`, token);
      setSupportReplyDraft("");
      const nextTickets = Array.isArray(refreshed) ? refreshed : [];
      setSupportTickets(nextTickets);
      setActiveSupportTicketId((current) => current || nextTickets[0]?._id || "");
      pushToast("Message sent to support", "success");
    } catch (error) {
      pushToast(error.message || "Could not send message", "warning");
    } finally {
      setSendingSupportReply(false);
    }
  }

  const accountNotifications = user?.role === "admin"
    ? buildAdminNotifications(orders, supportTickets)
    : buildUserNotifications(orders, supportTickets);
  const hasExplicitAccountTab = Boolean(String(initialTab || "").trim());
  const shouldShowMobilePersonal = hasExplicitAccountTab && activeSection === "personal";
  const shouldShowMobileOrders = hasExplicitAccountTab && activeSection === "orders";
  const shouldShowMobileAddress = hasExplicitAccountTab && activeSection === "address";
  const shouldShowMobileMessages = hasExplicitAccountTab && activeSection === "messages";
  const shouldShowMobileNotifications = hasExplicitAccountTab && activeSection === "notifications";
  const shouldShowMobileAffiliates = hasExplicitAccountTab && activeSection === "affiliates";
  const shouldShowMobileReviews = hasExplicitAccountTab && activeSection === "reviews";
  const shouldShowMobilePassword = hasExplicitAccountTab && activeSection === "password";
  const shouldShowMobileWishlist = hasExplicitAccountTab && activeSection === "wishlist";
  const unreadAccountNotifications = accountNotifications.filter((item) => !notificationReadIds.includes(String(item?.id || ""))).length;

  const content = useMemo(() => {
    if (activeSection === "notifications") {
      return (
        <NotificationsSection
          notifications={accountNotifications}
          readIds={notificationReadIds}
          onOpenNotification={handleNotificationOpen}
          onMarkAllRead={handleMarkAllNotificationsRead}
        />
      );
    }
    if (activeSection === "orders") {
      return <OrdersSection orders={orders} router={router} onDownloadInvoice={downloadInvoiceHtml} />;
    }
    if (activeSection === "address") {
      return <AddressSection form={profileForm} onFieldChange={handleProfileFieldChange} onSubmit={handleAddressSubmit} submitting={savingAddress} />;
    }
    if (activeSection === "messages") {
      return (
        <MessagesSection
          tickets={supportTickets}
          replyDraft={supportReplyDraft}
          sendingReply={sendingSupportReply}
          onReplyDraftChange={setSupportReplyDraft}
          onSendReply={handleSupportReplySubmit}
        />
      );
    }
    if (activeSection === "affiliates") {
      return <AffiliateSection summary={affiliateSummary} />;
    }
    if (activeSection === "wishlist") {
      return <WishlistSection items={wishlistItems} />;
    }
    if (activeSection === "reviews") {
      return <ReviewsSection reviews={reviews} />;
    }
    if (activeSection === "password") {
      return (
        <PasswordSection
          currentPassword={passwordForm.currentPassword}
          newPassword={passwordForm.newPassword}
          confirmPassword={passwordForm.confirmPassword}
          onChange={handlePasswordFieldChange}
          onSubmit={handlePasswordSubmit}
          submitting={savingPassword}
        />
      );
    }
    if (activeSection === "logout") {
      return <LogoutSection onLogout={handleLogout} />;
    }
    return <PersonalSection form={profileForm} onFieldChange={handleProfileFieldChange} onSubmit={handleProfileSubmit} submitting={savingProfile} />;
  }, [accountNotifications, activeSection, activeSupportTicketId, affiliateSummary, handleAddressSubmit, handleLogout, handleMarkAllNotificationsRead, handleNotificationOpen, handlePasswordSubmit, handleProfileSubmit, handleSupportReplySubmit, notificationReadIds, orders, passwordForm.confirmPassword, passwordForm.currentPassword, passwordForm.newPassword, profileForm, reviews, router, savingAddress, savingPassword, savingProfile, sendingSupportReply, supportReplyDraft, supportTickets, wishlistItems]);

  useEffect(() => {
    if (status !== "loading" && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router, status]);

  if (status === "loading" || (isAuthenticated && loadingProfile)) {
    return <AccountTransientState mode="loading" />;
  }

  if (!isAuthenticated) {
    return <AccountTransientState mode="redirect" />;
  }

  return (
    <main className={[
      "shell page-section account-page-main",
      !hasExplicitAccountTab ? "has-mobile-home" : "",
      shouldShowMobilePersonal ? "has-mobile-personal" : "",
      shouldShowMobileOrders ? "has-mobile-orders" : "",
      shouldShowMobileAddress ? "has-mobile-address" : "",
      shouldShowMobileMessages ? "has-mobile-messages" : "",
      shouldShowMobileNotifications ? "has-mobile-notifications" : "",
      shouldShowMobileAffiliates ? "has-mobile-affiliates" : "",
      shouldShowMobileReviews ? "has-mobile-reviews" : "",
      shouldShowMobilePassword ? "has-mobile-password" : "",
      shouldShowMobileWishlist ? "has-mobile-wishlist" : "",
    ].filter(Boolean).join(" ")}>
      {!hasExplicitAccountTab ? (
        <MobileAccountHome
          profile={profileForm}
          isAdmin={user?.role === "admin"}
          hasSupportTickets={supportTickets.length > 0}
          supportTicketsCount={supportTickets.length}
          unreadNotifications={unreadAccountNotifications}
          onLogout={handleLogout}
        />
      ) : null}
      {shouldShowMobilePersonal ? (
        <MobilePersonalInfo
          form={profileForm}
          onFieldChange={handleProfileFieldChange}
          onSubmit={handleProfileSubmit}
          submitting={savingProfile}
        />
      ) : null}
      {shouldShowMobileOrders ? (
        <MobileOrders
          orders={orders}
          router={router}
          onDownloadInvoice={downloadInvoiceHtml}
        />
      ) : null}
      {shouldShowMobileAddress ? (
        <MobileAddress
          form={profileForm}
          onFieldChange={handleProfileFieldChange}
          onSubmit={handleAddressSubmit}
          submitting={savingAddress}
        />
      ) : null}
      {shouldShowMobileMessages ? (
        <MobileMessages
          tickets={supportTickets}
          replyDraft={supportReplyDraft}
          sendingReply={sendingSupportReply}
          onReplyDraftChange={setSupportReplyDraft}
          onSendReply={handleSupportReplySubmit}
        />
      ) : null}
      {shouldShowMobileNotifications ? (
        <MobileNotifications
          notifications={accountNotifications}
          readIds={notificationReadIds}
          onOpenNotification={handleNotificationOpen}
          onMarkAllRead={handleMarkAllNotificationsRead}
        />
      ) : null}
      {shouldShowMobileAffiliates ? (
        <MobileAffiliates summary={affiliateSummary} />
      ) : null}
      {shouldShowMobileReviews ? (
        <MobileReviews reviews={reviews} />
      ) : null}
      {shouldShowMobilePassword ? (
        <MobilePasswordManager
          currentPassword={passwordForm.currentPassword}
          newPassword={passwordForm.newPassword}
          confirmPassword={passwordForm.confirmPassword}
          onChange={handlePasswordFieldChange}
          onSubmit={handlePasswordSubmit}
          submitting={savingPassword}
        />
      ) : null}
      {shouldShowMobileWishlist ? (
        <MobileWishlist items={wishlistItems} />
      ) : null}
      <section className="account-dashboard-shell">
        <div className="account-dashboard">
          <AccountSidebar
            activeSection={activeSection}
            onChange={handleSectionChange}
            isAdmin={user?.role === "admin"}
            hasSupportTickets={supportTickets.length > 0}
            profile={profileForm}
          />
          <div className="account-dashboard__content">
            {content}
          </div>
        </div>
      </section>
    </main>
  );
}
