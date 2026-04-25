"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { API_BASE, API_BASE_ORDERS, API_BASE_PRODUCTS, API_BASE_SUPPORT, API_BASE_USERS } from "@/lib/config";
import { formatCurrency } from "@/lib/format";
import { requestWithToken } from "@/lib/resource";

const REFRESH_MS = 30_000;

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

function paymentMethodLabel(value) {
  const key = String(value || "").toLowerCase();
  if (key === "mtn") return "MTN";
  if (key === "vodafone") return "Telecel";
  if (key === "bank") return "Bank";
  return value || "N/A";
}

function getStatusTone(status) {
  const value = String(status || "").toLowerCase();
  if (["resolved", "delivered", "paid", "approved", "active"].includes(value)) return "is-success";
  if (["pending", "processing", "new", "starter", "in-progress"].includes(value)) return "is-warning";
  if (["failed", "cancelled", "rejected", "inactive"].includes(value)) return "is-danger";
  return "is-neutral";
}

function normalizeList(payload, key) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.[key])) return payload[key];
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function DashboardCard({ label, value, helper, tone = "" }) {
  return (
    <article className={`admin-dash-card panel ${tone}`.trim()}>
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{helper}</span>
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

function AdminDashboardGate({ children }) {
  const { status, isAuthenticated, user } = useAuth();

  if (status === "loading") {
    return <section className="panel admin-state">Loading admin dashboard...</section>;
  }

  if (!isAuthenticated) {
    return (
      <section className="panel admin-state">
        <p className="section-kicker">Admin Dashboard</p>
        <h1>Admin access required</h1>
        <p>Login to monitor orders, messages, users, products, and affiliates in real time.</p>
        <Link href="/login" className="primary-link">Go to login</Link>
      </section>
    );
  }

  if (user?.role !== "admin") {
    return (
      <section className="panel admin-state">
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

    loadDashboard();
    const interval = window.setInterval(() => loadDashboard({ background: true }), REFRESH_MS);
    const onFocus = () => loadDashboard({ background: true });
    window.addEventListener("focus", onFocus);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [token, user?.role]);

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
        .slice(0, 1),
    [snapshot.orders]
  );

  const recentMessages = useMemo(
    () =>
      [...snapshot.messages]
        .sort((a, b) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime())
        .slice(0, 1),
    [snapshot.messages]
  );

  const recentUsers = useMemo(
    () =>
      [...snapshot.users]
        .sort((a, b) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime())
        .slice(0, 1),
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

  return (
    <AdminDashboardGate>
      <div className="admin-dashboard">
        <section className="admin-dashboard__hero panel">
          <div>
            <p className="section-kicker">Admin Dashboard</p>
            <h1>Operations Overview</h1>
            <p>
              Monitor live platform activity before diving into each admin section.
              Sync runs every {Math.round(REFRESH_MS / 1000)} seconds and on window focus.
            </p>
          </div>
          <div className="admin-dashboard__sync">
            <span>{refreshing ? "Syncing..." : "Live"}</span>
            <strong>{snapshot.lastSyncAt ? formatDateTime(snapshot.lastSyncAt) : "Waiting..."}</strong>
          </div>
        </section>

        {error ? <section className="panel admin-state form-error">{error}</section> : null}
        {loading ? <section className="panel admin-state">Loading full dashboard snapshot...</section> : null}

        {!loading ? (
          <>
            <section className="admin-dash-grid">
              <DashboardCard label="Total Orders" value={summary.totalOrders} helper={`${summary.pendingOrders} pending/processing`} />
              <DashboardCard label="Unread Messages" value={summary.unreadMessages} helper="Need support response" tone={summary.unreadMessages > 0 ? "is-warning" : "is-success"} />
              <DashboardCard label="Total Users" value={summary.totalUsers} helper={`${summary.inactiveUsers} inactive accounts`} />
              <DashboardCard label="Products" value={summary.totalProducts} helper={`${summary.lowStockProducts} low stock alerts`} tone={summary.lowStockProducts > 0 ? "is-warning" : "is-success"} />
              <DashboardCard label="Active Affiliates" value={summary.activeAffiliates} helper={`${snapshot.affiliates.length} total records`} />
              <DashboardCard label="Revenue" value={formatCurrency(summary.revenue)} helper="Delivered orders total" tone="is-success" />
            </section>

            <section className="admin-viz-grid panel">
              <TinyBars title="Order Status Overview" rows={dashboardViz.orderStatusRows} />
              <TinyBars title="Payment Method Mix" rows={dashboardViz.paymentMethodRows} />
              <TinyBars title="Top User Regions" rows={dashboardViz.userRegionRows} />
            </section>

            <section className="admin-dash-panels admin-dash-panels--overview">
              <article className="admin-dash-panel panel">
                <div className="admin-dash-panel__head">
                  <h2>Recent Orders</h2>
                  <Link href="/admin/orders" className="ghost-link">Open Orders</Link>
                </div>
                <div className="admin-dash-list">
                  {recentOrders.length ? (
                    recentOrders.map((order) => (
                      <div key={order?._id} className="admin-dash-row">
                        <div>
                          <strong>#{order?.orderNumber || order?._id}</strong>
                          <p>{order?.shippingName || order?.guestName || order?.shippingEmail || "Customer"}</p>
                        </div>
                        <div>
                          <span className={`admin-chip ${getStatusTone(order?.orderStatus)}`}>{order?.orderStatus || "pending"}</span>
                          <p>{paymentMethodLabel(order?.paymentMethod)} • {formatCurrency(Number(order?.totalPrice || 0))}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No orders available yet.</p>
                  )}
                </div>
              </article>

              <article className="admin-dash-panel panel">
                <div className="admin-dash-panel__head">
                  <h2>New Messages</h2>
                  <Link href="/admin/messages" className="ghost-link">Open Messages</Link>
                </div>
                <div className="admin-dash-list">
                  {recentMessages.length ? (
                    recentMessages.map((message) => (
                      <div key={message?._id} className="admin-dash-row">
                        <div>
                          <strong>{message?.subject || "Support request"}</strong>
                          <p>{message?.name || "Customer"} • {message?.email || "No email"}</p>
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

              <article className="admin-dash-panel admin-dash-panel--users panel">
                <div className="admin-dash-panel__head">
                  <h2>Recent Users</h2>
                  <Link href="/admin/users" className="ghost-link">Open Users</Link>
                </div>
                <div className="admin-dash-list admin-dash-list--users">
                  {recentUsers.length ? (
                    recentUsers.map((account) => (
                      <div key={account?._id || account?.email} className="admin-dash-row admin-dash-row--users">
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
              </article>
            </section>

            <section className="admin-dash-shortcuts panel">
              <h2>Admin Sections</h2>
              <div className="admin-dash-shortcuts__grid">
                <Link href="/admin/products" className="admin-dash-shortcut">
                  <strong>Products</strong>
                  <span>Manage inventory, pricing, and stock levels.</span>
                </Link>
                <Link href="/admin/orders" className="admin-dash-shortcut">
                  <strong>Orders</strong>
                  <span>Update payment and delivery workflow.</span>
                </Link>
                <Link href="/admin/messages" className="admin-dash-shortcut">
                  <strong>Messages</strong>
                  <span>Reply to support tickets quickly.</span>
                </Link>
                <Link href="/admin/users" className="admin-dash-shortcut">
                  <strong>Users</strong>
                  <span>Review account status and role access.</span>
                </Link>
                <Link href="/admin/affiliates" className="admin-dash-shortcut">
                  <strong>Affiliates</strong>
                  <span>Track referrals, tiers, and payouts.</span>
                </Link>
                <Link href="/admin/reviews" className="admin-dash-shortcut">
                  <strong>Reviews</strong>
                  <span>Moderate customer review quality.</span>
                </Link>
              </div>
            </section>
          </>
        ) : null}
      </div>
    </AdminDashboardGate>
  );
}
