"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import StableImage from "@/components/ui/stable-image";
import { clearLastOrder, readLastOrder } from "@/lib/order-confirmation";
import { getLinePricing, getLinesDiscountTotal } from "@/lib/order-line-pricing";
import { formatCurrency } from "@/lib/format";
import { downloadInvoiceHtml } from "@/lib/invoice";
import { formatCategoryLabel, resolveProductImage } from "@/lib/products";
import "./order-completed-desktop.css";
import "./order-completed-mobile.css";

function paymentLabel(value) {
  if (value === "mtn") return "MTN Mobile Money";
  if (value === "vodafone") return "Telecel Cash";
  if (value === "bank") return "Bank Transfer";
  if (value === "hubtel") return "Hubtel";
  return value || "N/A";
}

function formatDate(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "TBD";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function OrderCompletedPage() {
  const [order, setOrder] = useState(null);
  const [arriving, setArriving] = useState(false);
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    if (typeof window !== "undefined") {
      const savedOrder = readLastOrder();
      clearLastOrder();
      setOrder(savedOrder);
      const shouldAnimate =
        window.sessionStorage.getItem("deetech-order-complete-animate") === "1";
      const shouldHold =
        window.sessionStorage.getItem("deetech-order-complete-pending") === "1";
      if (shouldAnimate) {
        setArriving(true);
        window.sessionStorage.removeItem("deetech-order-complete-animate");
      }

      const imageUrls = Array.isArray(savedOrder?.items)
        ? savedOrder.items
            .map((item) => resolveProductImage(item.image))
            .filter(Boolean)
        : [];

      let cancelled = false;

      const imageTasks = imageUrls.map(
        (url) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
          })
      );

      const settle = async () => {
        await Promise.allSettled(imageTasks);
        await new Promise((resolve) =>
          window.requestAnimationFrame(() =>
            window.requestAnimationFrame(resolve)
          )
        );
        await new Promise((resolve) => window.setTimeout(resolve, shouldHold ? 420 : 140));
        if (!cancelled) {
          setPageReady(true);
          window.sessionStorage.removeItem("deetech-order-complete-pending");
        }
      };

      settle();

      return () => {
        cancelled = true;
      };
    }
    const savedOrder = readLastOrder();
    clearLastOrder();
    setOrder(savedOrder);
    setPageReady(true);
  }, []);

  const summary = useMemo(() => {
    if (!order) return null;
    const items = Array.isArray(order.items) ? order.items : [];
    const shipping = Number(order.shipping || 0);
    const discountAmount = Number(order.discountAmount || 0);
    const subtotal =
      Number(order.subtotal || 0) > 0
        ? Number(order.subtotal || 0)
        : Math.max(0, Number(order.total || 0) + discountAmount - shipping);
    return {
      items,
      shipping,
      subtotal,
      productSavings: getLinesDiscountTotal(items),
      discountAmount,
      total: Number(order.total || 0),
    };
  }, [order]);
  const trackingHref = order?.guestTrackingUrl
    ? order.guestTrackingUrl
    : order?.guestTrackingToken && (order?.orderId || order?.reference)
      ? `/orders/${order.orderId || order.reference}?token=${encodeURIComponent(order.guestTrackingToken)}`
      : order?.orderId || order?.reference
        ? `/orders/${order.orderId || order.reference}`
        : "";

  if (!pageReady) {
    return (
      <main className="page-section order-completed-route">
        <section className="order-complete-pending" aria-live="polite">
          <div className="order-complete-pending__card">
            <div className="order-complete-pending__spinner" aria-hidden="true" />
            <h2>Preparing your completed order...</h2>
            <p>Final touches are loading before we reveal your receipt.</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="shell page-section order-completed-route">
      <section className="checkout-hero">
        <h1>Order Completed</h1>
        <p className="checkout-hero__crumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Order Completed</span>
        </p>
      </section>

      <section className={arriving ? "order-complete order-complete--arriving shellless" : "order-complete shellless"}>
        <section className="order-complete__intro">
          <div className="order-complete__check" aria-hidden="true">{"\u2713"}</div>
          <h2>Your order is completed!</h2>
          <p>Thank you. Your order has been received.</p>
        </section>

        {order && summary ? (
          <div className="order-complete__layout">
            <div className="order-complete__main">
              <section className="panel order-complete__meta">
                <div className="order-complete__meta-grid">
                  <div>
                    <span>Order ID</span>
                    <strong className="order-complete__mono">#{order.orderId || order.reference || "N/A"}</strong>
                  </div>
                  <div>
                    <span>Date</span>
                    <strong>{formatDate(order.date || order.createdAt)}</strong>
                  </div>
                  <div>
                    <span>Total</span>
                    <strong className="order-complete__mono">{formatCurrency(summary.total)}</strong>
                  </div>
                  <div>
                    <span>Payment</span>
                    <strong>{paymentLabel(order.paymentMethod)}</strong>
                  </div>
                </div>
                <button
                  type="button"
                  className="order-complete__invoice"
                  onClick={() => downloadInvoiceHtml(order, summary)}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 3v12m0 0-4-4m4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Download Invoice
                </button>
              </section>

              <section className="panel order-complete__details">
                <div className="order-complete__details-head">
                  <h2>Order Items</h2>
                </div>

                <div className="order-complete__items">
                  {summary.items.map((item, index) => {
                    const pricing = getLinePricing(item);
                    return (
                      <article key={`${item.name}-${index}`} className="order-complete__item">
                        <div className="order-complete__product">
                          <div className="order-complete__thumb">
                            {resolveProductImage(item.image) ? (
                              <StableImage
                                src={resolveProductImage(item.image)}
                                alt={item.name || "Product"}
                                width={110}
                                height={110}
                              />
                            ) : (
                              <div className="product-card__placeholder">No image</div>
                            )}
                          </div>
                          <div className="order-complete__product-copy">
                            <strong>{item.name || "Product"}</strong>
                            <small>{formatCategoryLabel(item.category || "Product")}</small>
                          </div>
                        </div>
                        <span className="order-complete__qty">{Number(item.qty || 1)}</span>
                        <div className="order-complete__price-stack">
                          {pricing.hasDiscount ? <small>{formatCurrency(pricing.originalLineTotal)}</small> : null}
                          <strong className="order-complete__price">{formatCurrency(pricing.currentLineTotal)}</strong>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            </div>

            <div className="order-complete__side">
              <section className="panel order-complete__summary">
                <h3>Summary</h3>
                <div className="order-complete__summary-rows">
                  <div>
                    <span>Subtotal</span>
                    <span className="order-complete__mono">{formatCurrency(summary.subtotal)}</span>
                  </div>
                  {Number(summary.productSavings || 0) > 0 ? (
                    <div>
                      <span>Product Savings</span>
                      <strong className="order-complete__free">-{formatCurrency(Number(summary.productSavings || 0))}</strong>
                    </div>
                  ) : null}
                  <div>
                    <span>Delivery Fee</span>
                    {summary.shipping === 0 ? (
                      <strong className="order-complete__free">Free</strong>
                    ) : (
                      <span className="order-complete__mono">{formatCurrency(summary.shipping)}</span>
                    )}
                  </div>
                  {Number(summary.discountAmount || 0) > 0 ? (
                    <div>
                      <span>Coupon Discount</span>
                      <strong className="order-complete__free">-{formatCurrency(Number(summary.discountAmount || 0))}</strong>
                    </div>
                  ) : null}
                </div>
                <div className="order-complete__summary-total">
                  <span>Total Amount</span>
                  <strong>{formatCurrency(summary.total)}</strong>
                </div>
                <div className="order-complete__actions">
                  {trackingHref ? (
                    <Link href={trackingHref} className="order-complete__primary">Track Order</Link>
                  ) : null}
                  <Link href="/products" className="order-complete__outline">Continue Shopping</Link>
                  <Link href="/" className="order-complete__text-link">Go Home</Link>
                </div>
              </section>

              <div className="order-complete__security">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                  <path d="m9 12 2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Guaranteed Security &amp; Support</span>
              </div>
            </div>
          </div>
        ) : (
          <section className="panel order-complete__empty">
            <div className="order-complete__empty-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <path d="M12 8v5M12 16h.01" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <h2>Order Details</h2>
            <p className="hero-copy">Your order has already been processed. Please check your email for the confirmation details.</p>
            <div className="order-complete__empty-actions">
              {trackingHref ? (
                <Link href={trackingHref} className="order-complete__primary">Track Order</Link>
              ) : null}
              <Link href="/products" className="order-complete__outline">Continue Shopping</Link>
            </div>
            <Link href="/" className="order-complete__text-link">Go Home</Link>
          </section>
        )}
      </section>
    </main>
  );
}
