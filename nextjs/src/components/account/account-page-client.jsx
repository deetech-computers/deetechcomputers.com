"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import StableImage from "@/components/ui/stable-image";
import EmptyState from "@/components/ui/empty-state";
import { useToast } from "@/components/providers/toast-provider";
import { API_BASE, API_BASE_AUTH, API_BASE_ORDERS } from "@/lib/config";
import { requestJson } from "@/lib/http";
import { requestWithToken } from "@/lib/resource";
import { fetchProducts, formatCategoryLabel, getProductPrice, getProductStock, resolveProductImage } from "@/lib/products";
import { formatCurrency } from "@/lib/format";
import { downloadInvoiceHtml } from "@/lib/invoice";
import { readWishlistEntries } from "@/lib/wishlist";
import { GHANA_REGIONS, readCheckoutDraft, writeCheckoutDraft } from "@/lib/checkout";

const ACCOUNT_SECTIONS = [
  { id: "personal", label: "Personal Information" },
  { id: "orders", label: "My Orders" },
  { id: "address", label: "Manage Address" },
  { id: "messages", label: "Messages / Requests" },
  { id: "admin", label: "Admin", href: "/admin", adminOnly: true },
  { id: "affiliates", label: "Affiliates" },
  { id: "wishlist", label: "Wishlist" },
  { id: "reviews", label: "Reviews" },
  { id: "password", label: "Password Manager" },
  { id: "logout", label: "Logout" },
];

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

function getReviewStars(rating) {
  const value = Math.max(0, Math.min(5, Number(rating || 0)));
  return Array.from({ length: 5 }, (_, index) => (
    <span key={index} className={index < value ? "is-filled" : ""}>★</span>
  ));
}

function AccountSidebar({ activeSection, onChange, isAdmin, hasSupportTickets, onMobileItemSelect, suppressActive = false }) {
  const sections = ACCOUNT_SECTIONS.filter((item) => {
    if (item.id === "messages" && !hasSupportTickets) return false;
    return !item.adminOnly || isAdmin;
  });
  return (
    <aside className="account-dashboard__sidebar" aria-label="Account sections">
      <div className="account-mobile-sidebar-head">
        <strong>Account Sections</strong>
      </div>
      {sections.map((item) => {
        if (item.href) {
          return (
            <Link
              key={item.id}
              href={item.href}
              className="account-dashboard__nav"
              onClick={onMobileItemSelect}
            >
              {item.label}
            </Link>
          );
        }
        return (
          <button
            key={item.id}
            type="button"
            className={!suppressActive && activeSection === item.id ? "account-dashboard__nav is-active" : "account-dashboard__nav"}
            onClick={() => {
              onChange(item.id);
              onMobileItemSelect?.();
            }}
          >
            {item.label}
          </button>
        );
      })}
    </aside>
  );
}

function PersonalSection({ form, onFieldChange, onSubmit, submitting }) {
  return (
    <section className="account-dashboard__section">
      <div className="account-dashboard__section-head">
        <h2>Personal Information</h2>
        <p>Update the main details tied to your DEETECH account.</p>
      </div>
      <form className="account-dashboard__form" onSubmit={onSubmit}>
        <label className="account-dashboard__field">
          <span>First Name *</span>
          <input className="field" value={form.firstName} onChange={(event) => onFieldChange("firstName", event.target.value)} required />
        </label>
        <label className="account-dashboard__field">
          <span>Last Name *</span>
          <input className="field" value={form.lastName} onChange={(event) => onFieldChange("lastName", event.target.value)} required />
        </label>
        <label className="account-dashboard__field account-dashboard__field--full">
          <span>Email *</span>
          <input className="field disabled-field" value={form.email} disabled />
        </label>
        <label className="account-dashboard__field account-dashboard__field--full">
          <span>Phone *</span>
          <input className="field" value={form.phone} onChange={(event) => onFieldChange("phone", event.target.value)} placeholder="Enter Phone Number" required />
        </label>
        <button type="submit" className="primary-button account-dashboard__submit" disabled={submitting}>
          {submitting ? "Updating..." : "Update Changes"}
        </button>
      </form>
    </section>
  );
}

function OrdersSection({ orders, router, onDownloadInvoice }) {
  return (
    <section className="account-dashboard__section">
      <div className="account-dashboard__section-head account-dashboard__section-head--row">
        <div>
          <h2>Orders ({orders.length})</h2>
          <p>Track active purchases, invoice downloads, and review actions from one place.</p>
        </div>
      </div>
      <div className="account-dashboard__stack">
        {orders.length ? orders.map((order) => {
          const items = getOrderLineItems(order);
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
                </div>
                <div>
                  <span>Payment Method</span>
                  <strong>{paymentLabel(order.paymentMethod)}</strong>
                </div>
                <div>
                  <span>{order?.isDelivered ? "Delivered Date" : "Order Date"}</span>
                  <strong>{formatDate(order?.deliveredAt || order?.createdAt)}</strong>
                </div>
              </div>

              <div className="account-order-card__items">
                {items.slice(0, 4).map((item, index) => {
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
                        <span>{formatCategoryLabel(product?.category || product?.brand || "Product")}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="account-order-card__footer">
                <div className="account-order-card__status">
                  <span className={`account-order-card__pill ${statusTone(order)}`}>{orderStatusLabel(order)}</span>
                  <p>{orderStatusMessage(order)}</p>
                </div>
                <div className="account-order-card__actions">
                  <button type="button" className="primary-button" onClick={() => router.push(`/orders/${order._id}`)}>
                    Track Order
                  </button>
                  <button type="button" className="ghost-button" onClick={() => onDownloadInvoice(order)}>
                    Invoice
                  </button>
                  {items[0]?.product?._id ? (
                    <button type="button" className="ghost-button" onClick={() => router.push(`/products/${items[0].product._id}?tab=reviews#reviews`)}>
                      Add Review
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
  return (
    <section className="account-dashboard__section">
      <div className="account-dashboard__section-head">
        <h2>Manage Address</h2>
        <p>Keep your default delivery address accurate for faster checkout.</p>
      </div>

      <div className="account-address-card panel">
        <strong>{[form.firstName, form.lastName].filter(Boolean).join(" ") || "Account Holder"}</strong>
        <p>{form.address || "No street address added yet."}</p>
        <p>{[form.city, form.region].filter(Boolean).join(", ") || "Add your city and region."}</p>
        <p>{form.phone || "Add your phone number."}</p>
      </div>

      <form className="account-dashboard__form" onSubmit={onSubmit}>
        <label className="account-dashboard__field">
          <span>First Name *</span>
          <input className="field" value={form.firstName} onChange={(event) => onFieldChange("firstName", event.target.value)} required />
        </label>
        <label className="account-dashboard__field">
          <span>Last Name *</span>
          <input className="field" value={form.lastName} onChange={(event) => onFieldChange("lastName", event.target.value)} required />
        </label>
        <label className="account-dashboard__field account-dashboard__field--full">
          <span>Street Address *</span>
          <input className="field" value={form.address} onChange={(event) => onFieldChange("address", event.target.value)} placeholder="Enter Street Address" required />
        </label>
        <label className="account-dashboard__field">
          <span>City *</span>
          <input className="field" value={form.city} onChange={(event) => onFieldChange("city", event.target.value)} placeholder="Enter City" required />
        </label>
        <label className="account-dashboard__field">
          <span>Region *</span>
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
          <span>Phone *</span>
          <input className="field" value={form.phone} onChange={(event) => onFieldChange("phone", event.target.value)} placeholder="Enter Phone Number" required />
        </label>
        <label className="account-dashboard__field account-dashboard__field--full">
          <span>Email *</span>
          <input className="field disabled-field" value={form.email} disabled />
        </label>
        <button type="submit" className="primary-button account-dashboard__submit" disabled={submitting}>
          {submitting ? "Saving..." : "Add Address"}
        </button>
      </form>
    </section>
  );
}

function AffiliateSection({ summary }) {
  return (
    <section className="account-dashboard__section">
      <div className="account-dashboard__section-head">
        <h2>Affiliates</h2>
        <p>A quick snapshot of your referral status before you open the full affiliate page.</p>
      </div>

      <div className="account-mini-grid">
        <div className="panel account-mini-card">
          <span>Affiliate Status</span>
          <strong>{summary.isAffiliate ? "Active" : "Not active yet"}</strong>
          <p>{summary.isAffiliate ? `Code: ${summary.code || "N/A"}` : "Create your affiliate profile to start earning commission on qualified sales."}</p>
        </div>
        <div className="panel account-mini-card">
          <span>Commission Earned</span>
          <strong>{formatCurrency(Number(summary.earned || 0))}</strong>
          <p>{summary.referrals} referral{summary.referrals === 1 ? "" : "s"} recorded so far.</p>
        </div>
      </div>

      <div className="account-dashboard__cta-row">
        <Link href="/affiliates" className="primary-link">Open Affiliate Page</Link>
      </div>
    </section>
  );
}

function WishlistSection({ items }) {
  return (
    <section className="account-dashboard__section">
      <div className="account-dashboard__section-head">
        <h2>Wishlist</h2>
        <p>A mini wishlist preview linked to your main saved-products page.</p>
      </div>

      {items.length ? (
        <div className="account-dashboard__stack">
          {items.slice(0, 3).map((item) => (
            <article key={item.id} className="account-mini-row panel">
              <Link href={`/products/${item.id}`} className="account-mini-row__product">
                <div className="account-mini-row__thumb">
                  <StableImage
                    src={item.image}
                    alt={item.name}
                    width={112}
                    height={112}
                  />
                </div>
                <div className="account-mini-row__copy">
                  <strong>{item.name}</strong>
                  <span>{item.category}</span>
                </div>
              </Link>
              <div className="account-mini-row__meta">
                <strong>{formatCurrency(item.price)}</strong>
                <span>{item.inStock ? "Instock" : "Out of stock"}</span>
              </div>
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

      <div className="account-dashboard__cta-row">
        <Link href="/wishlist" className="primary-link">Open Wishlist</Link>
      </div>
    </section>
  );
}

function ReviewsSection({ reviews }) {
  return (
    <section className="account-dashboard__section">
      <div className="account-dashboard__section-head">
        <h2>Reviews</h2>
        <p>Recent customer reviews you have submitted, with a quick jump back to the main product page.</p>
      </div>

      {reviews.length ? (
        <div className="account-dashboard__stack">
          {reviews.slice(0, 3).map((review) => {
            const product = review?.product || {};
            const image = resolveProductImage(product?.images?.[0] || product?.image);
            const productHref = product?._id ? `/products/${product._id}` : "/products";
            return (
              <article key={review._id} className="account-review-card panel">
                <Link href={productHref} className="account-review-card__product">
                  <div className="account-review-card__thumb">
                    <StableImage
                      src={image}
                      alt={product?.name || "Product"}
                      width={112}
                      height={112}
                    />
                  </div>
                  <div className="account-review-card__copy">
                    <strong>{product?.name || "Product"}</strong>
                    <span>{review?.title || "Customer review"}</span>
                    <p className="account-review-card__stars">{getReviewStars(review?.rating)} <small>{Number(review?.rating || 0).toFixed(1)}</small></p>
                  </div>
                </Link>
                <Link href={productHref} className="ghost-link">
                  Open Product
                </Link>
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
    <section className="account-dashboard__section">
      <div className="account-dashboard__section-head">
        <h2>Password Manager</h2>
        <p>Update your password securely from your account dashboard.</p>
      </div>

      <form className="account-dashboard__form" onSubmit={onSubmit}>
        <label className="account-dashboard__field account-dashboard__field--full">
          <span>Password *</span>
          <input className="field" type="password" value={currentPassword} onChange={(event) => onChange("currentPassword", event.target.value)} placeholder="Enter Password" required />
        </label>
        <label className="account-dashboard__field account-dashboard__field--full">
          <span>New Password</span>
          <input className="field" type="password" value={newPassword} onChange={(event) => onChange("newPassword", event.target.value)} placeholder="Enter Password" required />
        </label>
        <label className="account-dashboard__field account-dashboard__field--full">
          <span>Confirm New Password</span>
          <input className="field" type="password" value={confirmPassword} onChange={(event) => onChange("confirmPassword", event.target.value)} placeholder="Enter Password" required />
        </label>
        <div className="account-dashboard__actions">
          <button type="submit" className="primary-button" disabled={submitting}>
            {submitting ? "Updating..." : "Update Password"}
          </button>
          <Link href="/forgot-password" className="ghost-link">Forgot Password?</Link>
        </div>
      </form>
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

const SUPPORT_QUICK_REPLIES = [
  "Hello team, I need an update on my request.",
  "Thanks. Please confirm expected completion time.",
  "Issue resolved on my side. Thank you.",
];

function MessagesSection({
  tickets,
  replyDraft,
  sendingReply,
  onReplyDraftChange,
  onQuickReply,
  onSendReply,
}) {
  const activeTicket = tickets[0] || null;
  const composerFormRef = useRef(null);

  const thread = Array.isArray(activeTicket?.messages) ? activeTicket.messages : [];

  return (
    <section className="account-dashboard__section">
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
        <div className="account-support-chat panel">
          <div className="account-support-chat__thread-wrap">
            {activeTicket ? (
              <>
                <header className="account-support-chat__thread-head">
                  <div>
                    <strong>{activeTicket.subject || "Support request"}</strong>
                    <p>Started {formatDateTime(activeTicket.createdAt)} / Last update {formatDateTime(activeTicket.updatedAt)}</p>
                  </div>
                  <span className={`account-order-card__pill ${String(activeTicket?.status || "new").toLowerCase() === "resolved" ? "is-success" : "is-warning"}`}>
                    {activeTicket.status || "new"}
                  </span>
                </header>

                <div className="account-support-chat__thread">
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
                  <div className="account-support-chat__quick">
                    {SUPPORT_QUICK_REPLIES.map((text) => (
                      <button key={text} type="button" className="ghost-button" onClick={() => onQuickReply(text)}>
                        {text}
                      </button>
                    ))}
                  </div>
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
                      {sendingReply ? "..." : "Send"}
                    </button>
                  </div>
                </form>
              </>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
}

export default function AccountPageClient() {
  const router = useRouter();
  const { pushToast } = useToast();
  const { isAuthenticated, logout, refreshProfile, saveProfile, status, token, user } = useAuth();
  const normalizeTab = (value) => {
    const allowed = new Set(["personal", "orders", "address", "messages", "affiliates", "wishlist", "reviews", "password", "logout"]);
    return allowed.has(value) ? value : "personal";
  };
  const [activeSection, setActiveSection] = useState("personal");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
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
    earned: 0,
    referrals: 0,
  });
  const [reviews, setReviews] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [activeSupportTicketId, setActiveSupportTicketId] = useState("");
  const [supportReplyDraft, setSupportReplyDraft] = useState("");
  const [sendingSupportReply, setSendingSupportReply] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const profileHydratedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const syncTabFromUrl = () => {
      const params = new URLSearchParams(window.location.search || "");
      const requestedTab = (params.get("tab") || "").toLowerCase();
      setActiveSection(normalizeTab(requestedTab));
    };

    syncTabFromUrl();
    window.addEventListener("popstate", syncTabFromUrl);
    return () => window.removeEventListener("popstate", syncTabFromUrl);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mediaQuery = window.matchMedia("(max-width: 980px)");
    const syncMobileMenuState = () => {
      if (mediaQuery.matches) {
        setMobileNavOpen(true);
      } else {
        setMobileNavOpen(false);
      }
    };

    syncMobileMenuState();
    mediaQuery.addEventListener("change", syncMobileMenuState);
    return () => mediaQuery.removeEventListener("change", syncMobileMenuState);
  }, []);

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
      setLoadingProfile(false);
      return;
    }
    if (profileHydratedRef.current) return;

    profileHydratedRef.current = true;
    setLoadingProfile(true);

    if (user) {
      fillProfileForm(user);
    }

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
          earned: Number(payload?.stats?.earnedCommission || payload?.affiliate?.earnedCommission || 0),
          referrals: Number(payload?.stats?.totalReferrals || payload?.referrals?.length || 0),
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

  useEffect(() => {
    if (!supportTickets.length) {
      if (activeSection === "messages") setActiveSection("personal");
      return;
    }
    if (!activeSupportTicketId) {
      setActiveSupportTicketId(supportTickets[0]?._id || "");
    }
  }, [activeSection, activeSupportTicketId, supportTickets]);

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
      await saveProfile({
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
        phone: profileForm.phone.trim(),
        address: profileForm.address.trim(),
        city: profileForm.city.trim(),
        region: profileForm.region.trim(),
      });
      writeCheckoutDraft({
        ...(readCheckoutDraft() || {}),
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
        shippingAddress: profileForm.address.trim(),
        shippingCity: profileForm.city.trim(),
        deliveryRegion: profileForm.region.trim(),
        mobileNumber: profileForm.phone.trim(),
        shippingEmail: profileForm.email.trim(),
      });
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

  function handleMobileMenuBack() {
    setMobileNavOpen(true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleMobileSidebarItemSelect() {
    if (typeof window !== "undefined" && window.innerWidth <= 980) {
      setMobileNavOpen(false);
    }
  }

  function handleSupportQuickReply(text) {
    const base = supportReplyDraft.trim();
    setSupportReplyDraft(base ? `${base}\n${text}` : text);
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

  const content = useMemo(() => {
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
          onQuickReply={handleSupportQuickReply}
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
  }, [activeSection, activeSupportTicketId, affiliateSummary, orders, passwordForm.confirmPassword, passwordForm.currentPassword, passwordForm.newPassword, profileForm, reviews, router, savingAddress, savingPassword, savingProfile, sendingSupportReply, supportReplyDraft, supportTickets, wishlistItems]);

  const activeSectionLabel = useMemo(() => {
    const match = ACCOUNT_SECTIONS.find((item) => item.id === activeSection);
    return match?.label || "Account";
  }, [activeSection]);

  useEffect(() => {
    if (status !== "loading" && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router, status]);

  if (status === "loading" || loadingProfile) {
    return (
      <main className="shell page-section">
        <div className="panel">
          <h1>My Account</h1>
          <h2>Account dashboard loading</h2>
          <p>Loading account...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="shell page-section">
        <div className="panel">
          <h1>My Account</h1>
          <h2>Redirecting to login</h2>
          <p>Taking you to login...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="shell page-section">
      <section className="cart-hero account-hero">
        <h1>My Account</h1>
        <p className="cart-hero__crumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>My Account</span>
        </p>
      </section>

      <section className="account-dashboard-shell">
        <div className={mobileNavOpen ? "account-dashboard account-dashboard--mobile-nav-open" : "account-dashboard"}>
          <AccountSidebar
            activeSection={activeSection}
            onChange={setActiveSection}
            isAdmin={user?.role === "admin"}
            hasSupportTickets={supportTickets.length > 0}
            onMobileItemSelect={handleMobileSidebarItemSelect}
            suppressActive={mobileNavOpen}
          />
          <div className="account-dashboard__content">
            <div className="account-mobile-content-head">
              <button type="button" className="ghost-button" onClick={handleMobileMenuBack}>
                Back to menu
              </button>
              <strong>{activeSectionLabel}</strong>
            </div>
            {content}
          </div>
        </div>
      </section>
    </main>
  );
}
