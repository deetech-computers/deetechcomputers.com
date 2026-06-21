"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { API_BASE, API_BASE_ORDERS, API_BASE_PRODUCTS, API_BASE_SUPPORT, API_BASE_USERS } from "@/lib/config";
import { formatCurrency } from "@/lib/format";
import { requestWithToken } from "@/lib/resource";

const REFRESH_MS = 30_000;
const MOBILE_ADMIN_LINKS = [
  ["/admin", "Dashboard", "dashboard"],
  ["/admin/orders", "Orders", "orders"],
  ["/admin/products", "Products", "products"],
  ["/admin/users", "Users", "users"],
  ["/admin/affiliates", "Affiliates", "affiliates"],
  ["/admin/reviews", "Reviews", "messages"],
  ["/admin/banners", "Banners", "banner"],
  ["/admin/messages", "Messages", "messages"],
  ["/admin/discounts", "Discounts", "discounts"],
];

function formatDateTime(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "Just now";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getStatusTone(status) {
  const value = String(status || "").toLowerCase();
  if (["resolved", "delivered", "paid", "approved", "active"].includes(value)) return "is-success";
  if (["pending", "processing", "new", "starter", "in-progress"].includes(value)) return "is-warning";
  if (["failed", "cancelled", "rejected", "inactive"].includes(value)) return "is-danger";
  return "is-neutral";
}

function AdminDashIcon({ name }) {
  const svgProps = { viewBox: "0 0 24 24", width: 24, height: 24, className: "admin-icon", "aria-hidden": "true", focusable: "false" };
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round" };
  if (name === "dashboard") return <svg {...svgProps}><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" {...common} /></svg>;
  if (name === "orders") return <svg {...svgProps}><path d="M4 6h3l2 10h9l2-7H8" {...common} /><path d="M10 20h.01M17 20h.01" {...common} /></svg>;
  if (name === "messages") return <svg {...svgProps}><path d="M4 5h16v12H8l-4 4z" {...common} /><path d="M8 9h8M8 13h5" {...common} /></svg>;
  if (name === "users") return <svg {...svgProps}><path d="M16 19c0-2.2-1.8-4-4-4s-4 1.8-4 4" {...common} /><path d="M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM20 19c0-1.7-1-3.1-2.4-3.7" {...common} /></svg>;
  if (name === "products") return <svg {...svgProps}><path d="M5 7h14v13H5zM8 4h8l3 3H5zM8 11h8" {...common} /></svg>;
  if (name === "affiliates") return <svg {...svgProps}><path d="M8.5 12.5 6 15a3 3 0 1 0 4.2 4.2l2.3-2.3M15.5 11.5 18 9a3 3 0 1 0-4.2-4.2l-2.3 2.3M9 15l6-6" {...common} /></svg>;
  if (name === "revenue") return <svg {...svgProps}><path d="M4 7h16v10H4z" {...common} /><path d="M8 12h.01M16 12h.01M12 15a3 3 0 0 0 0-6 3 3 0 0 0 0 6Z" {...common} /></svg>;
  if (name === "sync") return <svg {...svgProps}><path d="M20 7v5h-5M4 17v-5h5" {...common} /><path d="M18.5 9A7 7 0 0 0 6.2 6.2M5.5 15A7 7 0 0 0 17.8 17.8" {...common} /></svg>;
  if (name === "menu") return <svg {...svgProps}><path d="M4 7h16M4 12h16M4 17h16" {...common} /></svg>;
  if (name === "account") return <svg {...svgProps}><path d="M16 18a4 4 0 0 0-8 0" {...common} /><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0Z" {...common} /></svg>;
  if (name === "banner") return <svg {...svgProps}><path d="M6 3h12v18l-6-3-6 3z" {...common} /><path d="M9 8h6M9 12h4" {...common} /></svg>;
  if (name === "discounts") return <svg {...svgProps}><path d="M20 7 7 20l-3-3L17 4zM7 7h.01M17 17h.01" {...common} /></svg>;
  if (name === "settings") return <svg {...svgProps}><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" {...common} /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2 3-.2-.1a1.7 1.7 0 0 0-2 .1 1.7 1.7 0 0 0-.8 1.7V22h-3.6v-.3a1.7 1.7 0 0 0-.8-1.7 1.7 1.7 0 0 0-2-.1l-.2.1-2-3 .1-.1A1.7 1.7 0 0 0 6.6 15a1.7 1.7 0 0 0-1.5-1H5v-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2-3 .2.1a1.7 1.7 0 0 0 2-.1 1.7 1.7 0 0 0 .8-1.7V2h3.6v.3a1.7 1.7 0 0 0 .8 1.7 1.7 1.7 0 0 0 2 .1l.2-.1 2 3-.1.1A1.7 1.7 0 0 0 17.4 9a1.7 1.7 0 0 0 1.5 1h.1v4h-.1a1.7 1.7 0 0 0-1.5 1Z" {...common} /></svg>;
  if (name === "reviews") return <svg {...svgProps}><path d="M4 5h16v12H8l-4 4z" {...common} /><path d="m10 13 2-5 2 5M10.8 11h2.4" {...common} /></svg>;
  if (name === "plus") return <svg {...svgProps}><path d="M12 5v14M5 12h14" {...common} /></svg>;
  if (name === "bell") return <svg {...svgProps}><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7M10 21h4" {...common} /></svg>;
  return <svg {...svgProps}><path d="M4 12h16M12 4v16" {...common} /></svg>;
}

function normalizeList(payload, key) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.[key])) return payload[key];
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function DashboardCard({ label, mobileLabel, value, helper, icon, tone = "" }) {
  return (
    <article className={`admin-dash-card ${tone}`.trim()}>
      <div className="admin-dash-card__top">
        <p>
          <span className="admin-dash-card__label-desktop">{label}</span>
          <span className="admin-dash-card__label-mobile">{mobileLabel || label}</span>
        </p>
        <span className="admin-dash-card__icon" aria-hidden="true"><AdminDashIcon name={icon} /></span>
      </div>
      <strong>{value}</strong>
      <span className="admin-dash-card__helper">{helper}</span>
    </article>
  );
}

function TinyBars({ title, rows }) {
  const valid = (rows || []).filter((row) => Number(row?.value || 0) > 0);
  const max = Math.max(...valid.map((row) => Number(row.value || 0)), 1);
  return (
    <article className="admin-viz-card">
      <h3>{title}</h3>
      <div className="admin-viz-bars">
        {valid.length ? valid.map((row) => (
          <div key={row.label} className="admin-viz-bar-row">
            <span>{row.label}</span>
            <div className="admin-viz-bar-track"><i style={{ width: `${Math.max(8, (Number(row.value || 0) / max) * 100)}%` }} /></div>
            <strong>{Number(row.value || 0).toLocaleString("en-GB")}</strong>
          </div>
        )) : <p>No data yet.</p>}
      </div>
    </article>
  );
}

function OrderStatusDonut({ rows }) {
  const total = rows.reduce((sum, row) => sum + Number(row.value || 0), 0) || 1;
  const delivered = rows.find((row) => String(row.label).toLowerCase().includes("delivered"))?.value || 0;
  const processing = rows.find((row) => String(row.label).toLowerCase().includes("processing"))?.value || 0;
  const cancelled = rows.find((row) => String(row.label).toLowerCase().includes("cancelled"))?.value || 0;
  const deliveredPercent = Math.round((Number(delivered) / total) * 100);
  const processingPercent = Math.round((Number(processing) / total) * 100);
  const cancelledPercent = Math.round((Number(cancelled) / total) * 100);
  return (
    <article className="admin-viz-card admin-viz-card--donut">
      <div className="admin-viz-card__head">
        <h3>Order Status</h3>
        <span aria-hidden="true">...</span>
      </div>
      <div className="admin-status-donut" style={{ "--delivered": `${Math.max(0, Math.min(100, deliveredPercent))}%` }}>
        <strong>{deliveredPercent}%</strong>
        <span>Delivered</span>
      </div>
      <div className="admin-status-donut__legend">
        <span><strong>{deliveredPercent}%</strong>Delivered</span>
        <span><strong>{processingPercent}%</strong>Processing</span>
        <span><strong>{cancelledPercent}%</strong>Cancelled</span>
      </div>
    </article>
  );
}

function PercentBars({ title, icon, rows }) {
  const valid = (rows || []).filter((row) => Number(row?.value || 0) > 0).slice(0, 4);
  const total = valid.reduce((sum, row) => sum + Number(row.value || 0), 0) || 1;
  return (
    <article className="admin-viz-card admin-viz-card--percent">
      <div className="admin-viz-card__head">
        <h3>{title}</h3>
        <span aria-hidden="true"><AdminDashIcon name={icon} /></span>
      </div>
      <div className="admin-viz-bars">
        {valid.length ? valid.map((row) => {
          const percent = Math.round((Number(row.value || 0) / total) * 100);
          return (
            <div key={row.label} className="admin-viz-bar-row">
              <span>{row.label}</span>
              <div className="admin-viz-bar-track"><i style={{ width: `${Math.max(6, percent)}%` }} /></div>
              <strong>{percent}%</strong>
            </div>
          );
        }) : <p>No data yet.</p>}
      </div>
    </article>
  );
}

function AdminDashboardGate({ children }) {
  const { status, isAuthenticated, user } = useAuth();

  if (status === "loading") {
    return <section className="admin-state">Loading admin dashboard...</section>;
  }

  if (!isAuthenticated) {
    return (
      <section className="admin-state">
        <p className="section-kicker">Admin Dashboard</p>
        <h1>Admin access required</h1>
        <p>Login to monitor orders, messages, users, products, and affiliates in real time.</p>
        <Link href="/login" className="primary-link">Go to login</Link>
      </section>
    );
  }

  if (user?.role !== "admin") {
    return (
      <section className="admin-state">
        <p className="section-kicker">Admin Dashboard</p>
        <h1>Permission denied</h1>
        <p>This view is only available to admin accounts.</p>
      </section>
    );
  }

  return children;
}

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const [snapshot, setSnapshot] = useState({
    dashboard: {},
    orders: [],
    messages: [],
    users: [],
    products: [],
    affiliates: [],
    lastSyncAt: "",
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [manualSyncNonce, setManualSyncNonce] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!token || user?.role !== "admin") return undefined;
    let cancelled = false;

    async function loadDashboard({ background = false } = {}) {
      if (!background) setLoading(true);
      if (background) setRefreshing(true);

      const [dashboardResult, ordersResult, messagesResult, usersResult, productsResult, affiliatesResult] =
        await Promise.allSettled([
          requestWithToken(`${API_BASE}/dashboard`, token),
          requestWithToken(API_BASE_ORDERS, token),
          requestWithToken(API_BASE_SUPPORT, token),
          requestWithToken(`${API_BASE_USERS}/admin/users`, token),
          requestWithToken(API_BASE_PRODUCTS, token),
          requestWithToken(`${API_BASE}/affiliates/admin`, token),
        ]);

      if (cancelled) return;

      const dashboard = dashboardResult.status === "fulfilled" ? (dashboardResult.value || {}) : {};
      const ordersRaw = ordersResult.status === "fulfilled" ? ordersResult.value : [];
      const messagesRaw = messagesResult.status === "fulfilled" ? messagesResult.value : [];
      const usersRaw = usersResult.status === "fulfilled" ? usersResult.value : [];
      const productsRaw = productsResult.status === "fulfilled" ? productsResult.value : [];
      const affiliatesRaw = affiliatesResult.status === "fulfilled" ? affiliatesResult.value : [];

      const orders = normalizeList(ordersRaw, "orders");
      const messages = normalizeList(messagesRaw, "tickets");
      const users = normalizeList(usersRaw, "users");
      const products = normalizeList(productsRaw, "products");
      const affiliates = normalizeList(affiliatesRaw, "affiliates");

      setSnapshot({
        dashboard,
        orders,
        messages,
        users,
        products,
        affiliates,
        lastSyncAt: new Date().toISOString(),
      });

      const failed = [dashboardResult, ordersResult, messagesResult, usersResult, productsResult, affiliatesResult]
        .filter((result) => result.status === "rejected").length;
      setError(failed ? "Some dashboard widgets could not sync. Retrying automatically." : "");
      setLoading(false);
      setRefreshing(false);
    }

    loadDashboard({ background: manualSyncNonce > 0 });
    const interval = window.setInterval(() => loadDashboard({ background: true }), REFRESH_MS);
    const onFocus = () => loadDashboard({ background: true });
    window.addEventListener("focus", onFocus);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [manualSyncNonce, token, user?.role]);

  const summary = useMemo(() => {
    const dashboard = snapshot.dashboard || {};
    const deliveredRevenue = snapshot.orders.reduce((sum, order) => {
      const delivered = String(order?.orderStatus || "").toLowerCase() === "delivered" || Boolean(order?.isDelivered);
      return delivered ? sum + Number(order?.totalPrice || 0) : sum;
    }, 0);
    const pendingOrders = snapshot.orders.filter((order) =>
      ["pending", "processing"].includes(String(order?.orderStatus || "").toLowerCase())
    ).length;
    const unreadMessages = snapshot.messages.filter((ticket) =>
      ["new", "pending"].includes(String(ticket?.status || "").toLowerCase())
    ).length;
    const inactiveUsers = snapshot.users.filter((item) => item?.isActive === false).length;
    const lowStockProducts = snapshot.products.filter((item) => Number(item?.countInStock || 0) <= 2).length;
    const activeAffiliates = snapshot.affiliates.filter((item) => item?.isActive !== false).length;

    return {
      totalOrders: Number(dashboard.totalOrders || snapshot.orders.length || 0),
      totalUsers: Number(dashboard.totalUsers || snapshot.users.length || 0),
      totalProducts: Number(dashboard.totalProducts || snapshot.products.length || 0),
      revenue: deliveredRevenue,
      pendingOrders,
      unreadMessages,
      inactiveUsers,
      lowStockProducts,
      activeAffiliates,
    };
  }, [snapshot]);

  const recentOrders = useMemo(
    () =>
      [...snapshot.orders]
        .sort((a, b) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime())
        .slice(0, 3),
    [snapshot.orders]
  );

  const recentMessages = useMemo(
    () =>
      [...snapshot.messages]
        .sort((a, b) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime())
        .slice(0, 2),
    [snapshot.messages]
  );

  const recentUsers = useMemo(
    () =>
      [...snapshot.users]
        .sort((a, b) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime())
        .slice(0, 2),
    [snapshot.users]
  );

  const dashboardViz = useMemo(() => {
    const orderStatus = new Map();
    const paymentMethod = new Map();
    const userRegions = new Map();
    for (const order of snapshot.orders) {
      const status = String(order?.orderStatus || "pending").toLowerCase();
      const method = String(order?.paymentMethod || "unknown").toLowerCase();
      orderStatus.set(status, Number(orderStatus.get(status) || 0) + 1);
      paymentMethod.set(method, Number(paymentMethod.get(method) || 0) + 1);
    }
    for (const account of snapshot.users) {
      const region = String(account?.region || "unknown");
      userRegions.set(region, Number(userRegions.get(region) || 0) + 1);
    }
    return {
      orderStatusRows: [...orderStatus.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 6),
      paymentMethodRows: [...paymentMethod.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 6),
      userRegionRows: [...userRegions.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 6),
    };
  }, [snapshot.orders, snapshot.users]);

  const insights = useMemo(() => {
    const totalOrders = Math.max(snapshot.orders.length, 1);
    const delivered = snapshot.orders.filter((order) =>
      String(order?.orderStatus || "").toLowerCase() === "delivered" || Boolean(order?.isDelivered)
    ).length;
    const fulfillment = Math.round((delivered / totalOrders) * 100);
    const topRegion = dashboardViz.userRegionRows[0];
    const topRegionTotal = dashboardViz.userRegionRows.reduce((sum, row) => sum + Number(row.value || 0), 0) || 1;
    const regionPercent = topRegion ? Math.round((Number(topRegion.value || 0) / topRegionTotal) * 100) : 0;
    return {
      fulfillment,
      topRegionLabel: topRegion?.label || "No region",
      regionPercent,
    };
  }, [dashboardViz.userRegionRows, snapshot.orders]);

  return (
    <AdminDashboardGate>
      <div className="admin-dashboard">
        <header className="admin-dashboard-mobile-head">
          <button type="button" aria-label="Open admin menu" onClick={() => setMobileNavOpen(true)}>
            <AdminDashIcon name="menu" />
          </button>
          <h1>Operations Overview</h1>
          <button type="button" aria-label="Sync dashboard" onClick={() => setManualSyncNonce((value) => value + 1)} disabled={refreshing}>
            <AdminDashIcon name="sync" />
          </button>
          <Link href="/account" aria-label="Open account">
            <AdminDashIcon name="account" />
          </Link>
        </header>

        {mobileNavOpen ? (
          <div className="admin-dashboard-mobile-menu" role="dialog" aria-modal="true" aria-label="Admin navigation">
            <button type="button" className="admin-dashboard-mobile-menu__backdrop" aria-label="Close admin menu" onClick={() => setMobileNavOpen(false)} />
            <nav className="admin-dashboard-mobile-menu__panel" aria-label="Admin sections">
              <div className="admin-dashboard-mobile-menu__head">
                <strong>DEETECH Admin</strong>
                <button type="button" onClick={() => setMobileNavOpen(false)}>Close</button>
              </div>
              {MOBILE_ADMIN_LINKS.map(([href, label, icon]) => (
                <Link key={href} href={href} onClick={() => setMobileNavOpen(false)}>
                  <AdminDashIcon name={icon} />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        ) : null}

        <section className="admin-dashboard__topbar">
          <div>
            <h1>Operations Overview</h1>
            <p>
              <span aria-hidden="true" />
              Last synced: <strong>{snapshot.lastSyncAt ? formatDateTime(snapshot.lastSyncAt) : "Waiting..."}</strong>
            </p>
          </div>
          <div className="admin-dashboard__top-actions">
            <button
              type="button"
              className="admin-dashboard__sync-button"
              onClick={() => setManualSyncNonce((value) => value + 1)}
              disabled={refreshing}
            >
              <AdminDashIcon name="sync" />
              {refreshing ? "Syncing..." : "Sync Now"}
            </button>
            <span className="admin-dashboard__top-icon" aria-hidden="true"><AdminDashIcon name="bell" /></span>
            <span className="admin-dashboard__avatar" aria-hidden="true">{String(user?.name || user?.email || "A").slice(0, 1).toUpperCase()}</span>
          </div>
        </section>

        {error ? <section className="admin-state form-error">{error}</section> : null}
        {loading ? <section className="admin-state">Loading full dashboard snapshot...</section> : null}

        {!loading ? (
          <>
            <section className="admin-dash-grid">
              <DashboardCard label="Total Orders" mobileLabel="Orders" value={summary.totalOrders.toLocaleString("en-GB")} helper="+12%" icon="orders" />
              <DashboardCard label="Unread" mobileLabel="Messages" value={summary.unreadMessages.toLocaleString("en-GB")} helper={summary.unreadMessages > 0 ? "New" : "Clear"} icon="messages" tone={summary.unreadMessages > 0 ? "is-warning" : "is-success"} />
              <DashboardCard label="Total Users" mobileLabel="Users" value={summary.totalUsers.toLocaleString("en-GB")} helper={`${summary.inactiveUsers} inactive accounts`} icon="users" />
              <DashboardCard label="Products" value={summary.totalProducts.toLocaleString("en-GB")} helper={`${summary.lowStockProducts} low stock alerts`} icon="products" tone={summary.lowStockProducts > 0 ? "is-warning" : "is-success"} />
              <DashboardCard label="Affiliates" value={summary.activeAffiliates.toLocaleString("en-GB")} helper={`${snapshot.affiliates.length} total records`} icon="affiliates" />
              <DashboardCard label="Revenue" value={formatCurrency(summary.revenue)} helper="+12.4% vs Last Mo." icon="revenue" tone="is-success is-revenue" />
            </section>

            <section className="admin-dashboard__message-callout">
              <span aria-hidden="true"><AdminDashIcon name="messages" /></span>
              <div>
                <strong>New Messages ({summary.unreadMessages})</strong>
                <p>Support queries pending review</p>
              </div>
              <Link href="/admin/messages">Open</Link>
            </section>

            <section className="admin-viz-grid">
              <OrderStatusDonut rows={dashboardViz.orderStatusRows} />
              <PercentBars title="Payment Mix" icon="revenue" rows={dashboardViz.paymentMethodRows} />
              <PercentBars title="Top Regions" icon="banner" rows={dashboardViz.userRegionRows} />
            </section>

            <section className="admin-dash-panels admin-dash-panels--overview">
              <article className="admin-dash-panel admin-dash-panel--orders">
                <div className="admin-dash-panel__head">
                  <h2>Recent Orders</h2>
                  <span aria-hidden="true">ID: 9281-9279</span>
                </div>
                <div className="admin-dash-list">
                  {recentOrders.length ? (
                    recentOrders.map((order) => (
                      <div key={order?._id} className="admin-dash-row">
                        <div>
                          <strong>#{order?.orderNumber || order?._id}</strong>
                          <p>{formatDateTime(order?.createdAt)}</p>
                        </div>
                        <div>
                          <strong>{order?.shippingName || order?.guestName || order?.shippingEmail || "Customer"}</strong>
                        </div>
                        <div>
                          <span className={`admin-chip ${getStatusTone(order?.orderStatus)}`}>{order?.orderStatus || "pending"}</span>
                          <p>{formatCurrency(Number(order?.totalPrice || 0))}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No orders available yet.</p>
                  )}
                </div>
                <Link href="/admin/orders" className="admin-dash-panel__footer">Open Orders <span aria-hidden="true">-&gt;</span></Link>
              </article>

              <article className="admin-dash-panel admin-dash-panel--messages">
                <div className="admin-dash-panel__head">
                  <h2>New Messages</h2>
                  <span className="admin-dash-panel__count">{summary.unreadMessages}</span>
                  <Link href="/admin/messages" className="ghost-link">Open Messages</Link>
                </div>
                <div className="admin-dash-list">
                  {recentMessages.length ? (
                    recentMessages.map((message) => (
                      <div key={message?._id} className="admin-dash-row admin-dash-row--message">
                        <span className="admin-dash-message-icon" aria-hidden="true"><AdminDashIcon name="users" /></span>
                        <div>
                          <strong>{message?.subject || "Support request"}</strong>
                          <p>{message?.name || "Customer"} / {message?.email || "No email"}</p>
                        </div>
                        <div>
                          <span className={`admin-chip ${getStatusTone(message?.status)}`}>{message?.status || "new"}</span>
                          <p>{formatDateTime(message?.createdAt)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No messages available yet.</p>
                  )}
                </div>
              </article>

              <article className="admin-dash-panel admin-dash-panel--users">
                <div className="admin-dash-panel__head">
                  <h2>Recent Signups</h2>
                  <Link href="/admin/users" className="ghost-link">Open Users</Link>
                </div>
                <div className="admin-dash-list admin-dash-list--users">
                  {recentUsers.length ? (
                    recentUsers.map((account) => (
                      <div key={account?._id || account?.email} className="admin-dash-row admin-dash-row--users">
                        <span className="admin-dash-avatar" aria-hidden="true">
                          {String(account?.name || account?.email || "U").slice(0, 1).toUpperCase()}
                        </span>
                        <div>
                          <strong>{account?.name || "User account"}</strong>
                          <p>{account?.email || "No email"}</p>
                        </div>
                        <div>
                          <span className={`admin-chip ${getStatusTone(account?.isActive === false ? "inactive" : "active")}`}>
                            {account?.isActive === false ? "inactive" : "active"}
                          </span>
                          <p>{formatDateTime(account?.createdAt)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No users available yet.</p>
                  )}
                </div>
                <Link href="/admin/users" className="admin-dash-panel__footer">Open Users <span aria-hidden="true">-&gt;</span></Link>
              </article>
            </section>

            <section className="admin-dashboard__insights">
              <h2>Quick Insights</h2>
              <article>
                <div>
                  <strong>Order Fulfillment</strong>
                  <span>{insights.fulfillment}% Target</span>
                </div>
                <i aria-hidden="true"><b style={{ width: `${Math.min(100, insights.fulfillment)}%` }} /></i>
                <div>
                  <strong>{insights.topRegionLabel} Reach</strong>
                  <span>{insights.regionPercent}% Volume</span>
                </div>
                <i aria-hidden="true"><b style={{ width: `${Math.min(100, insights.regionPercent)}%` }} /></i>
              </article>
            </section>

            <section className="admin-dash-shortcuts">
              <h2>System Actions</h2>
              <div className="admin-dash-shortcuts__grid">
                <Link href="/admin/products" className="admin-dash-shortcut">
                  <AdminDashIcon name="products" />
                  <strong>Products</strong>
                  <span>Manage inventory, pricing, and stock levels.</span>
                </Link>
                <Link href="/admin/orders" className="admin-dash-shortcut">
                  <AdminDashIcon name="orders" />
                  <strong>Orders</strong>
                  <span>Update payment and delivery workflow.</span>
                </Link>
                <Link href="/admin/messages" className="admin-dash-shortcut">
                  <AdminDashIcon name="messages" />
                  <strong>Messages</strong>
                  <span>Reply to support tickets quickly.</span>
                </Link>
                <Link href="/admin/users" className="admin-dash-shortcut">
                  <AdminDashIcon name="users" />
                  <strong>Users</strong>
                  <span>Review account status and role access.</span>
                </Link>
                <Link href="/admin/affiliates" className="admin-dash-shortcut">
                  <AdminDashIcon name="affiliates" />
                  <strong>Affiliates</strong>
                  <span>Track referrals, tiers, and payouts.</span>
                </Link>
                <Link href="/admin/reviews" className="admin-dash-shortcut">
                  <AdminDashIcon name="reviews" />
                  <strong>Reviews</strong>
                  <span>Moderate customer review quality.</span>
                </Link>
                <Link href="/admin/banners" className="admin-dash-shortcut admin-dash-shortcut--mobile-only">
                  <AdminDashIcon name="banner" />
                  <strong>Set Banner</strong>
                  <span>Update homepage campaigns.</span>
                </Link>
                <Link href="/admin/discounts" className="admin-dash-shortcut admin-dash-shortcut--mobile-only">
                  <AdminDashIcon name="discounts" />
                  <strong>Discounts</strong>
                  <span>Create and inspect codes.</span>
                </Link>
                <Link href="/admin/products/create" className="admin-dash-shortcut admin-dash-shortcut--mobile-action">
                  <AdminDashIcon name="plus" />
                  <strong>Add Product</strong>
                  <span>Create a new listing.</span>
                </Link>
                <Link href="/admin/banners" className="admin-dash-shortcut admin-dash-shortcut--mobile-action">
                  <AdminDashIcon name="banner" />
                  <strong>Set Banner</strong>
                  <span>Update homepage campaigns.</span>
                </Link>
                <Link href="/admin/discounts" className="admin-dash-shortcut admin-dash-shortcut--mobile-action">
                  <AdminDashIcon name="discounts" />
                  <strong>Discounts</strong>
                  <span>Create codes.</span>
                </Link>
                <Link href="/admin" className="admin-dash-shortcut admin-dash-shortcut--mobile-action">
                  <AdminDashIcon name="settings" />
                  <strong>Settings</strong>
                  <span>Open admin preferences.</span>
                </Link>
              </div>
            </section>
          </>
        ) : null}
      </div>
    </AdminDashboardGate>
  );
}
