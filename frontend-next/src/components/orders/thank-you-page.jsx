"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { clearLastOrder, readLastOrder } from "@/lib/order-confirmation";
import { formatCurrency } from "@/lib/format";

function paymentLabel(value) {
  if (value === "mtn") return "MTN Mobile Money";
  if (value === "vodafone") return "Telecel/Vodafone Cash";
  if (value === "bank") return "Bank Transfer";
  if (value === "hubtel") return "Hubtel";
  if (value === "momo") return "Mobile Money";
  if (value === "cash") return "Cash on delivery";
  return value || "N/A";
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
      date: order.date ? new Date(order.date) : new Date(),
    };
  }, [order]);

  return (
    <main className="shell page-section narrow-shell">
      <section className="panel thankyou-panel">
        <p className="section-kicker">Order placed successfully</p>
        <h1>{order?.reference ? `Order Confirmed #${order.reference}` : "Order Successful!"}</h1>
        <p className="hero-copy">
          {order
            ? "We'll contact you soon. Your reference number and order summary are below."
            : "Your order has already been processed. Thank you."}
        </p>

        {summary ? (
          <div className="thankyou-summary">
            <div className="thankyou-meta-grid">
              <div className="data-item">
                <strong>Reference</strong>
                <p>#{order.reference || "N/A"}</p>
              </div>
              <div className="data-item">
                <strong>Date</strong>
                <p>{Number.isNaN(summary.date.getTime()) ? "-" : summary.date.toLocaleDateString("en-GB")}</p>
              </div>
              <div className="data-item">
                <strong>Payment</strong>
                <p>{paymentLabel(order.paymentMethod)}</p>
              </div>
            </div>

            <div className="panel thankyou-items-panel">
              <h2>Order Items</h2>
              <div className="data-list">
                {summary.items.map((item, index) => {
                  const qty = Number(item.quantity || item.qty || 1);
                  const price = Number(item.price || 0);
                  return (
                    <div key={`${item.name}-${index}`} className="data-item thankyou-item-row">
                      <div>
                        <strong>{item.name || "Product"}</strong>
                        <p className="hero-copy">Qty {qty}</p>
                      </div>
                      <strong>{formatCurrency(qty * price)}</strong>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="panel thankyou-items-panel">
              <h2>Order Summary</h2>
              <div className="data-list">
                <div className="data-item thankyou-line"><span>Subtotal</span><strong>{formatCurrency(summary.subtotal)}</strong></div>
                <div className="data-item thankyou-line"><span>Delivery</span><strong>{summary.shipping === 0 ? "FREE" : formatCurrency(summary.shipping)}</strong></div>
                <div className="data-item thankyou-line"><span>Total</span><strong>{formatCurrency(summary.total)}</strong></div>
                <div className="data-item thankyou-line"><span>Email</span><strong>{order.email || "N/A"}</strong></div>
                <div className="data-item thankyou-line"><span>Phone</span><strong>{order.phone || "N/A"}</strong></div>
                <div className="data-item thankyou-line"><span>Address</span><strong>{[order.address, order.city].filter(Boolean).join(", ") || "N/A"}</strong></div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="hero-actions">
          <Link href="/products" className="primary-link">Continue Shopping</Link>
          <Link href="/" className="ghost-link">Go Home</Link>
        </div>
      </section>
    </main>
  );
}
