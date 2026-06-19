"use client";

import Link from "next/link";
import StableImage from "@/components/ui/stable-image";
import { formatCurrency } from "@/lib/format";
import { resolveProductImage } from "@/lib/products";

function formatMobileOrderDate(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "Recently";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).format(date);
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

function orderStatusLabel(order) {
  if (order?.orderStatus === "cancelled" || order?.paymentStatus === "failed") return "Cancelled";
  if (order?.orderStatus === "delivered" || order?.isDelivered) return "Delivered";
  if (order?.orderStatus === "shipped") return "In Transit";
  if (order?.orderStatus === "processing" || order?.paymentStatus === "paid") return "Pending";
  return "Pending";
}

function orderStatusTone(order) {
  const status = orderStatusLabel(order);
  if (status === "Delivered") return "is-delivered";
  if (status === "In Transit") return "is-transit";
  if (status === "Cancelled") return "is-cancelled";
  return "is-pending";
}

function MobileOrdersIcon({ name }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
  };
  const paths = {
    arrowLeft: (
      <>
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
  };

  return (
    <svg className="account-mobile-orders__icon" viewBox="0 0 24 24" aria-hidden="true" {...common}>
      {paths[name] || paths.arrowLeft}
    </svg>
  );
}

export default function MobileOrders({ orders, router, onDownloadInvoice }) {
  return (
    <section className="account-mobile-orders" aria-label="My Orders">
      <header className="account-mobile-orders__head">
        <Link href="/account">
          <MobileOrdersIcon name="arrowLeft" />
          <span>Account</span>
        </Link>
        <h1>My Orders</h1>
        <Link href="/account?tab=notifications" aria-label="Open notifications">
          <MobileOrdersIcon name="bell" />
        </Link>
      </header>

      <div className="account-mobile-orders__body">
        {orders.length ? orders.map((order) => {
          const items = getOrderLineItems(order);
          const visibleItems = items.slice(0, 3);
          const firstProductId = items[0]?.product?._id;
          return (
            <article key={order._id} className="account-mobile-orders__card">
              <div className="account-mobile-orders__top">
                <strong>#{order.orderNumber || order._id}</strong>
                <span className={`account-mobile-orders__status ${orderStatusTone(order)}`}>
                  {orderStatusLabel(order)}
                </span>
              </div>

              <div className="account-mobile-orders__price">
                {formatCurrency(Number(order.totalPrice || 0))}
              </div>
              <p className="account-mobile-orders__date">
                Placed on {formatMobileOrderDate(order?.createdAt)}
              </p>

              <div className="account-mobile-orders__thumbs" aria-label="Order products">
                {visibleItems.length ? visibleItems.map((item, index) => {
                  const product = item?.product || {};
                  return (
                    <Link
                      key={product?._id || index}
                      href={product?._id ? `/products/${product._id}` : "/products"}
                      className="account-mobile-orders__thumb"
                    >
                      <StableImage
                        src={getOrderItemImage(item)}
                        alt={product?.name || "Order product"}
                        width={64}
                        height={64}
                      />
                    </Link>
                  );
                }) : (
                  <div className="account-mobile-orders__thumb is-empty">img</div>
                )}
              </div>

              <button
                type="button"
                className="account-mobile-orders__track"
                onClick={() => router.push(`/orders/${order._id}`)}
              >
                Track Order
              </button>
              <div className="account-mobile-orders__actions">
                <button type="button" onClick={() => onDownloadInvoice(order)}>
                  Invoice
                </button>
                {firstProductId ? (
                  <button type="button" onClick={() => router.push(`/products/${firstProductId}?tab=reviews#reviews`)}>
                    Add Review
                  </button>
                ) : (
                  <button type="button" disabled>
                    Add Review
                  </button>
                )}
              </div>
            </article>
          );
        }) : (
          <section className="account-mobile-orders__empty">
            <h2>No orders yet</h2>
            <p>Your purchases will appear here once you complete checkout.</p>
            <Link href="/products">Browse products</Link>
          </section>
        )}
      </div>
    </section>
  );
}
