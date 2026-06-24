"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import StableImage from "@/components/ui/stable-image";
import { useAuth } from "@/hooks/use-auth";
import { API_BASE_ORDERS } from "@/lib/config";
import { formatCurrency } from "@/lib/format";
import { requestJson } from "@/lib/http";
import { getLinePricing, getLinesDiscountTotal } from "@/lib/order-line-pricing";
import { formatCategoryLabel, resolveProductImage } from "@/lib/products";
import { requestWithToken } from "@/lib/resource";
import "../../track-order/track-order-desktop.css";
import "../../track-order/track-order-mobile.css";

const TRACK_STEPS = [
  { key: "placed", label: "Order Placed", icon: "placed" },
  { key: "accepted", label: "Accepted", icon: "accepted" },
  { key: "processing", label: "In Progress", icon: "processing" },
  { key: "shipped", label: "On the Way", icon: "shipped" },
  { key: "delivered", label: "Delivered", icon: "delivered" },
];

function formatDate(value, withTime = false) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "Expected";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

function paymentLabel(value) {
  if (value === "mtn") return "MTN Mobile Money";
  if (value === "vodafone") return "Telecel Cash";
  if (value === "bank") return "Bank Transfer";
  if (value === "hubtel") return "Hubtel";
  return value || "N/A";
}

function OrderTrackIcon({ name }) {
  if (name === "placed") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm7 1v4h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12h6M9 16h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "accepted") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="3" width="14" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 7h6M9 11h6M9 15l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "processing") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="m4 7.5 8 4.5 8-4.5M12 12v9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "shipped") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 7h10v8H3zM13 10h4l3 3v2h-7z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="7" cy="18" r="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="18" cy="18" r="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3 10H1m2 3H2m1-6H2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h10v8H4zM14 10h4l2 2v3h-6z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m17 6 2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8" cy="18" r="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17" cy="18" r="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function buildTrackingState(order) {
  const status = String(order?.orderStatus || "pending").toLowerCase();
  const paymentStatus = String(order?.paymentStatus || "pending").toLowerCase();
  const createdAt = order?.createdAt ? new Date(order.createdAt) : new Date();
  const paidAt = order?.paidAt ? new Date(order.paidAt) : null;
  const deliveredAt = order?.deliveredAt ? new Date(order.deliveredAt) : null;

  const acceptedDone = paymentStatus === "paid" || ["processing", "shipped", "delivered"].includes(status);
  const processingDone = ["processing", "shipped", "delivered"].includes(status);
  const shippedDone = ["shipped", "delivered"].includes(status);
  const deliveredDone = status === "delivered" || order?.isDelivered === true;

  const expectedDelivery = order?.estimatedDeliveryDate
    ? new Date(order.estimatedDeliveryDate)
    : new Date((paidAt || createdAt).getTime() + 24 * 60 * 60 * 1000);

  return [
    { key: "placed", done: true, active: !acceptedDone, caption: formatDate(createdAt, true) },
    {
      key: "accepted",
      done: acceptedDone,
      active: acceptedDone && !processingDone,
      caption: acceptedDone ? formatDate(paidAt || createdAt, true) : "Awaiting payment review",
    },
    {
      key: "processing",
      done: processingDone,
      active: processingDone && !shippedDone,
      caption: processingDone ? formatDate(expectedDelivery, true) : `Expected ${formatDate(expectedDelivery, true)}`,
    },
    {
      key: "shipped",
      done: shippedDone,
      active: shippedDone && !deliveredDone,
      caption: shippedDone ? formatDate(expectedDelivery, true) : `Expected ${formatDate(expectedDelivery, true)}`,
    },
    {
      key: "delivered",
      done: deliveredDone,
      active: deliveredDone,
      caption: deliveredDone ? formatDate(deliveredAt || expectedDelivery, true) : `Expected ${formatDate(expectedDelivery, true)}`,
    },
  ];
}

export default function TrackOrderPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const guestToken = String(searchParams.get("token") || "").trim();
  const { token, isAuthenticated, status } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.classList.add("has-track-order-page");
    return () => document.body.classList.remove("has-track-order-page");
  }, []);

  useEffect(() => {
    if (status !== "ready") return;
    if (guestToken) {
      setLoading(true);
      requestJson(
        `${API_BASE_ORDERS}/guest-track/${encodeURIComponent(id)}?token=${encodeURIComponent(guestToken)}`,
        { retries: 1 }
      )
        .then((payload) => {
          setOrder(payload || null);
          setError("");
        })
        .catch((err) => {
          setError(err.message || "Could not load this guest order");
        })
        .finally(() => {
          setLoading(false);
        });
      return;
    }

    if (!isAuthenticated || !token) {
      setLoading(false);
      return;
    }

    requestWithToken(`${API_BASE_ORDERS}/myorders/${id}`, token)
      .then((payload) => {
        setOrder(payload || null);
        setError("");
      })
      .catch((err) => {
        setError(err.message || "Could not load this order");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [guestToken, id, isAuthenticated, status, token]);

  const steps = useMemo(() => buildTrackingState(order), [order]);
  const progressRatio = Math.max(0, (steps.filter((step) => step.done).length - 1) / (steps.length - 1));
  const productSavings = useMemo(() => getLinesDiscountTotal(order?.orderItems || []), [order]);
  const backHref = guestToken ? "/" : "/account?tab=orders";
  const backLabel = guestToken ? "Home" : "Orders";
  const activeStep = steps.find((step) => step.active) || steps[steps.length - 1];
  const currentStepLabel = TRACK_STEPS.find((step) => step.key === activeStep?.key)?.label || "Order Status";

  return (
    <main className="track-order-page">
      <div className="shell track-order-page__shell">
        <section className="track-order-hero">
          <p className="track-order-hero__crumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            {guestToken ? <span>Guest Tracking</span> : <Link href="/account?tab=orders">My Orders</Link>}
            <span>/</span>
            <span>Track Your Order</span>
          </p>
          <h1>Track Your Order</h1>
          <p>Follow payment review, processing, dispatch, and delivery progress from one clean view.</p>
        </section>

      {status === "loading" || loading ? (
        <section className="panel track-order-state">
          <div className="track-order-state__mark" aria-hidden="true">
            <OrderTrackIcon name="processing" />
          </div>
          <h2>Loading tracking details...</h2>
          <p>Retrieving the latest order status from your DEETECH account.</p>
        </section>
      ) : !guestToken && !isAuthenticated ? (
        <section className="panel track-order-state">
          <div className="track-order-state__mark" aria-hidden="true">
            <OrderTrackIcon name="accepted" />
          </div>
          <h2>Login required</h2>
          <p>Sign in to track account orders, or look up a guest order with your order ID and checkout email.</p>
          <div className="track-order-state__actions">
            <Link href="/login" className="primary-link">Go to login</Link>
            <Link href="/track-order" className="ghost-link">Track a guest order</Link>
          </div>
        </section>
      ) : error || !order ? (
        <section className="panel track-order-state">
          <div className="track-order-state__mark" aria-hidden="true">
            <OrderTrackIcon name="placed" />
          </div>
          <h2>Order not available</h2>
          <p>{error || "We could not load this order right now."}</p>
          <button type="button" className="ghost-button" onClick={() => router.push(backHref)}>
            {guestToken ? "Back to Home" : "Back to My Orders"}
          </button>
        </section>
      ) : (
        <section className="track-order-shell">
          <div className="track-order-top panel">
            <div className="track-order-top__header">
              <div>
                {guestToken ? (
                  <Link href="/" className="ghost-link track-order-top__back">
                    Back to Home
                  </Link>
                ) : (
                  <Link href="/account?tab=orders" className="ghost-link track-order-top__back">
                    Back to My Orders
                  </Link>
                )}
                <h2>Order Status</h2>
                <p>Order ID : #{order.orderNumber || order._id}</p>
                <span className={`track-order-status-pill is-${String(order.orderStatus || "pending").toLowerCase()}`}>
                  {currentStepLabel}
                </span>
              </div>
              <div className="track-order-top__meta">
                <span>Payment method</span>
                <em>{paymentLabel(order.paymentMethod)}</em>
                <strong>{formatCurrency(Number(order.totalPrice || 0))}</strong>
                <small>
                  {Number(order.shippingPrice || 0) > 0
                    ? `Subtotal ${formatCurrency(Number(order.itemsPrice || 0))} + Delivery ${formatCurrency(Number(order.shippingPrice || 0))}`
                    : `Subtotal ${formatCurrency(Number(order.itemsPrice || 0))} + Free Delivery`}
                </small>
                {productSavings > 0 ? <small>Product savings {formatCurrency(productSavings)}</small> : null}
              </div>
            </div>

            <div className="track-order-progress">
              {steps.map((step, index) => (
                <div
                  key={step.key}
                  className={[
                    "track-order-step",
                    step.done ? "is-done" : "",
                    step.active ? "is-active" : "",
                    order.orderStatus === "cancelled" ? "is-muted" : "",
                  ].filter(Boolean).join(" ")}
                >
                  <div className="track-order-step__icon">
                    <OrderTrackIcon name={step.key} />
                  </div>
                  <div className="track-order-step__copy">
                    <strong>{TRACK_STEPS[index].label}</strong>
                    <span>{step.caption}</span>
                  </div>
                </div>
              ))}
              <div className="track-order-progress__line" aria-hidden="true">
                <span
                  className="track-order-progress__fill"
                  style={{
                    "--track-progress": progressRatio,
                  }}
                />
              </div>
            </div>
          </div>

          <section className="panel track-order-products">
            <div className="track-order-products__head">
              <h2>Products</h2>
              <span>{(order.orderItems || []).length} item{(order.orderItems || []).length === 1 ? "" : "s"}</span>
            </div>

            <div className="track-order-products__list">
              {(order.orderItems || []).map((item, index) => {
                const product = item?.product || {};
                const image = resolveProductImage(product?.images?.[0] || product?.image);
                const productHref = product?._id ? `/products/${product._id}` : "/products";
                const pricing = getLinePricing(item);
                return (
                  <article key={`${product?._id || index}`} className="track-order-product">
                    <Link href={productHref} className="track-order-product__link">
                      <div className="track-order-product__thumb">
                        {image ? (
                          <StableImage
                            src={image}
                            alt={product?.name || "Product"}
                            width={112}
                            height={112}
                          />
                        ) : (
                          <div className="product-card__placeholder">No image</div>
                        )}
                      </div>
                      <div className="track-order-product__copy">
                        <strong>{product?.name || "Product"}</strong>
                        <span>{formatCategoryLabel(product?.category || product?.brand || "Product")}</span>
                      </div>
                    </Link>
                    <div className="track-order-product__meta">
                      <span>Qty {Number(item?.qty || 1)}</span>
                      {pricing.hasDiscount ? <small>{formatCurrency(pricing.originalLineTotal)}</small> : null}
                      <strong>{formatCurrency(pricing.currentLineTotal)}</strong>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </section>
      )}
      </div>
    </main>
  );
}
