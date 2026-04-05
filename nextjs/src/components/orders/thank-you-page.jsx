"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { clearLastOrder, readLastOrder } from "@/lib/order-confirmation";
import { formatCurrency } from "@/lib/format";
import { formatCategoryLabel, resolveProductImage } from "@/lib/products";

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

function downloadInvoice(order, summary) {
  if (typeof window === "undefined" || !order || !summary) return;
  const lines = [
    "DEETECH COMPUTERS INVOICE",
    `Order ID: ${order.orderId || order.reference || "N/A"}`,
    `Transaction ID: ${order.transactionId || "N/A"}`,
    `Payment Method: ${paymentLabel(order.paymentMethod)}`,
    `Order Date: ${formatDate(order.date)}`,
    `Estimated Delivery: ${formatDate(order.estimatedDeliveryDate)}`,
    "",
    "Items:",
    ...summary.items.map((item) => {
      const qty = Number(item.quantity || item.qty || 1);
      const price = Number(item.price || 0);
      return `- ${item.name || "Product"} x${qty}: ${formatCurrency(qty * price)}`;
    }),
    "",
    `Subtotal: ${formatCurrency(summary.subtotal)}`,
    `Shipping: ${summary.shipping === 0 ? "FREE" : formatCurrency(summary.shipping)}`,
    `Total: ${formatCurrency(summary.total)}`,
    "",
    `Customer Email: ${order.email || "N/A"}`,
    `Customer Phone: ${order.phone || "N/A"}`,
    `Delivery Address: ${[order.address, order.city].filter(Boolean).join(", ") || "N/A"}`,
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `deetech-invoice-${order.orderId || order.reference || "order"}.txt`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
}

export default function ThankYouPage() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    setOrder(readLastOrder());
    return () => {
      clearLastOrder();
    };
  }, []);

  const summary = useMemo(() => {
    if (!order) return null;
    const items = Array.isArray(order.items) ? order.items : [];
    const shipping = Number(order.shipping || 0);
    const subtotal =
      Number(order.subtotal || 0) > 0
        ? Number(order.subtotal || 0)
        : Math.max(0, Number(order.total || 0) - shipping);
    return {
      items,
      shipping,
      subtotal,
      total: Number(order.total || 0),
    };
  }, [order]);

  return (
    <main className="shell page-section">
      <section className="checkout-hero">
        <h1>Order Completed</h1>
        <p className="checkout-hero__crumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Order Completed</span>
        </p>
      </section>

      <section className="order-complete shellless">
        <section className="order-complete__intro">
          <div className="order-complete__check" aria-hidden="true">✓</div>
          <h2>Your order is completed!</h2>
          <p>Thank you. Your order has been received.</p>
        </section>

        {order && summary ? (
          <>
            <section className="order-complete__meta">
              <div>
                <span>Order ID</span>
                <strong>#{order.orderId || order.reference || "N/A"}</strong>
              </div>
              <div>
                <span>Payment Method</span>
                <strong>{paymentLabel(order.paymentMethod)}</strong>
              </div>
              <div>
                <span>Transaction ID</span>
                <strong>{order.transactionId || "N/A"}</strong>
              </div>
              <div>
                <span>Estimated Delivery Date</span>
                <strong>{formatDate(order.estimatedDeliveryDate)}</strong>
              </div>
              <button
                type="button"
                className="order-complete__invoice"
                onClick={() => downloadInvoice(order, summary)}
              >
                Download Invoice
              </button>
            </section>

            <section className="panel order-complete__details">
              <div className="order-complete__details-head">
                <h2>Order Details</h2>
              </div>

              <div className="order-complete__table-head">
                <span>Products</span>
                <span>Sub Total</span>
              </div>

              <div className="order-complete__items">
                {summary.items.map((item, index) => {
                  const qty = Number(item.quantity || item.qty || 1);
                  const price = Number(item.price || 0);
                  return (
                    <article key={`${item.name}-${index}`} className="order-complete__item">
                      <div className="order-complete__product">
                        <div className="order-complete__thumb">
                          {resolveProductImage(item.image) ? (
                            <img src={resolveProductImage(item.image)} alt={item.name || "Product"} />
                          ) : (
                            <div className="product-card__placeholder">No image</div>
                          )}
                        </div>
                        <div className="order-complete__product-copy">
                          <strong>{item.name || "Product"}</strong>
                          <small>{formatCategoryLabel(item.category || "Product")}</small>
                        </div>
                      </div>
                      <strong className="order-complete__price">{formatCurrency(qty * price)}</strong>
                    </article>
                  );
                })}
              </div>

              <div className="order-complete__totals">
                <div className="order-complete__totals-line">
                  <span>Shipping</span>
                  <strong>{summary.shipping === 0 ? formatCurrency(0) : formatCurrency(summary.shipping)}</strong>
                </div>
                <div className="order-complete__totals-line">
                  <span>Taxes</span>
                  <strong>{formatCurrency(0)}</strong>
                </div>
                <div className="order-complete__totals-line">
                  <span>Coupon Discount</span>
                  <strong>{formatCurrency(Math.max(0, summary.subtotal + summary.shipping - summary.total) * -1)}</strong>
                </div>
              </div>

              <div className="order-complete__total">
                <span>Total</span>
                <strong>{formatCurrency(summary.total)}</strong>
              </div>
            </section>
          </>
        ) : (
          <section className="panel order-complete__details">
            <div className="order-complete__details-head">
              <h2>Order Details</h2>
            </div>
            <p className="hero-copy">Your order has already been processed. Please check your email for the confirmation details.</p>
          </section>
        )}

        <div className="hero-actions">
          <Link href="/products" className="primary-link">Continue Shopping</Link>
          <Link href="/" className="ghost-link">Go Home</Link>
        </div>
      </section>
    </main>
  );
}
