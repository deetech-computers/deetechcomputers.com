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
    gear: (
      <>
        <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 1 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1A2 2 0 1 1 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6h.1a1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 1 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.6 1h.1a2 2 0 1 1 0 4H21a1.7 1.7 0 0 0-1.6 1Z" />
      </>
    ),
    bag: (
      <>
        <path d="M6 8h12l-1 13H7L6 8Z" />
        <path d="M9 8a3 3 0 0 1 6 0" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
    cart: (
      <>
        <path d="M6 6h15l-2 9H8L6 6Z" />
        <path d="M6 6 5 3H2" />
        <circle cx="9" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
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
  const hasOrders = orders.length > 0;

  return (
    <section className="account-mobile-orders" aria-label="My Orders">
      <header className="account-mobile-orders__head">
        <Link href="/account">
          <MobileOrdersIcon name="arrowLeft" />
        </Link>
        <div className="account-mobile-orders__title">
          <span>Account</span>
          <h1>Orders</h1>
        </div>
        <Link href="/account?tab=notifications" aria-label="Order settings">
          <MobileOrdersIcon name={hasOrders ? "bell" : "gear"} />
        </Link>
      </header>

      <div className={hasOrders ? "account-mobile-orders__body" : "account-mobile-orders__body is-empty"}>
        {hasOrders ? orders.map((order) => {
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
            <div className="account-mobile-orders__empty-mark" aria-hidden="true">
              <MobileOrdersIcon name="bag" />
              <i><MobileOrdersIcon name="search" /></i>
            </div>
            <h2>Your orders list is empty</h2>
            <p>Start exploring our premium hardware catalog to see your orders here.</p>
            <Link href="/products?promotion=just_landed#shop-results" className="account-mobile-orders__empty-action">
              <MobileOrdersIcon name="cart" />
              <span>Shop New Arrivals</span>
            </Link>
          </section>
        )}
      </div>
    </section>
  );
}
