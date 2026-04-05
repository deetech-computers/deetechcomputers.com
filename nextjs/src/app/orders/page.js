"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AccountNav from "@/components/account/account-nav";
import { useAuth } from "@/hooks/use-auth";
import { API_BASE_ORDERS } from "@/lib/config";
import { formatCurrency } from "@/lib/format";
import { formatCategoryLabel, resolveProductImage } from "@/lib/products";
import { requestWithToken } from "@/lib/resource";

function formatDate(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "Recently";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function paymentLabel(value) {
  if (value === "mtn") return "MTN";
  if (value === "vodafone") return "Telecel";
  if (value === "bank") return "Bank Transfer";
  if (value === "hubtel") return "Hubtel";
  return value || "Payment";
}

function statusLabel(order) {
  if (order?.orderStatus === "cancelled" || order?.paymentStatus === "failed") {
    return "Cancelled";
  }
  if (order?.orderStatus === "delivered" || order?.isDelivered) {
    return "Delivered";
  }
  if (order?.orderStatus === "shipped") {
    return "On the way";
  }
  if (order?.orderStatus === "processing" || order?.paymentStatus === "paid") {
    return "Accepted";
  }
  return "Order placed";
}

function ProductPreview({ item }) {
  const product = item?.product || {};
  const image = resolveProductImage(product?.images?.[0] || product?.image);

  return (
    <div className="order-list__product-chip">
      <div className="order-list__product-thumb">
        {image ? <img src={image} alt={product?.name || "Product"} /> : <div className="product-card__placeholder">No image</div>}
      </div>
      <div className="order-list__product-copy">
        <strong>{product?.name || "Product"}</strong>
        <span>{formatCategoryLabel(product?.category || product?.brand || "Product")}</span>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const { token, isAuthenticated, status } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status !== "ready") return;
    if (!isAuthenticated || !token) {
      setLoading(false);
      return;
    }

    requestWithToken(`${API_BASE_ORDERS}/myorders`, token)
      .then((payload) => {
        setOrders(Array.isArray(payload) ? payload : []);
        setError("");
      })
      .catch((err) => {
        setError(err.message || "Could not load your orders");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isAuthenticated, status, token]);

  const summaryCount = useMemo(() => orders.reduce((sum, order) => sum + Number(order?.orderItems?.length || 0), 0), [orders]);

  return (
    <main className="shell page-section">
      <section className="cart-hero orders-hero">
        <h1>Orders</h1>
        <p className="cart-hero__crumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Orders</span>
        </p>
      </section>

      <section className="panel">
        <AccountNav />
      </section>

      {status === "loading" || loading ? (
        <section className="panel wishlist-empty">
          <h2>Loading your orders...</h2>
        </section>
      ) : !isAuthenticated ? (
        <section className="panel wishlist-empty">
          <h2>Login required</h2>
          <p className="hero-copy">Sign in to view and track every product you have purchased.</p>
          <Link href="/login" className="primary-link">Go to login</Link>
        </section>
      ) : error ? (
        <section className="panel wishlist-empty">
          <h2>Could not load your orders</h2>
          <p className="hero-copy">{error}</p>
        </section>
      ) : !orders.length ? (
        <section className="panel wishlist-empty">
          <h2>No orders yet</h2>
          <p className="hero-copy">Once you complete a purchase, your order history and tracking details will appear here.</p>
          <Link href="/products" className="primary-link">Browse products</Link>
        </section>
      ) : (
        <section className="orders-shell">
          <div className="orders-summary panel">
            <div>
              <span>Total Orders</span>
              <strong>{orders.length}</strong>
            </div>
            <div>
              <span>Products Purchased</span>
              <strong>{summaryCount}</strong>
            </div>
          </div>

          <div className="orders-list">
            {orders.map((order) => {
              const firstItems = Array.isArray(order?.orderItems) ? order.orderItems.slice(0, 4) : [];
              const totalItems = Number(order?.orderItems?.length || 0);

              return (
                <article key={order._id} className="panel order-list__card">
                  <div className="order-list__head">
                    <div>
                      <strong>#{order.orderNumber || order._id}</strong>
                      <p>{formatDate(order.createdAt)} • {paymentLabel(order.paymentMethod)}</p>
                    </div>
                    <span className={`order-list__status order-list__status--${String(order.orderStatus || "pending").toLowerCase()}`}>
                      {statusLabel(order)}
                    </span>
                  </div>

                  <div className="order-list__products">
                    <h3>Products</h3>
                    <div className="order-list__product-grid">
                      {firstItems.map((item, index) => (
                        <ProductPreview key={`${order._id}-${item?.product?._id || index}`} item={item} />
                      ))}
                    </div>
                    {totalItems > firstItems.length ? (
                      <p className="order-list__more">+{totalItems - firstItems.length} more item{totalItems - firstItems.length === 1 ? "" : "s"}</p>
                    ) : null}
                  </div>

                  <div className="order-list__meta">
                    <div>
                      <span>Payment</span>
                      <strong>{order.paymentStatus === "paid" ? "Confirmed" : "Pending review"}</strong>
                    </div>
                    <div>
                      <span>Total</span>
                      <strong>{formatCurrency(Number(order.totalPrice || 0))}</strong>
                    </div>
                  </div>

                  <div className="order-list__actions">
                    <Link href={`/orders/${order._id}`} className="primary-link">
                      Track Order
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
