"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { API_BASE } from "@/lib/config";
import { requestWithToken } from "@/lib/resource";
import { MobileNavDrawer } from "./admin-nav";

const ACTOR_TYPE_LABELS = {
  user: "Customer",
  guest: "Guest",
  admin: "Admin",
  system: "System",
};

function formatDateTime(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function actionLabel(action) {
  return String(action || "")
    .replace(/[._]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function LogsIcon({ name }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  if (name === "menu") return <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" {...common} /></svg>;
  if (name === "refresh") return <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7" {...common} /><path d="M20 5v6h-6" {...common} /></svg>;
  return <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 5h16v14H4zM4 9h16M9 5v4" {...common} /></svg>;
}

export default function AdminLogs() {
  const { token, user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [actions, setActions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [actorTypeFilter, setActorTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || user?.role !== "admin") return undefined;
    let cancelled = false;

    async function loadLogs({ background = false } = {}) {
      if (!background) setLoading(true);
      if (background) setRefreshing(true);
      setError("");

      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "25");
      if (search.trim()) params.set("search", search.trim());
      if (actionFilter !== "all") params.set("action", actionFilter);
      if (actorTypeFilter !== "all") params.set("actorType", actorTypeFilter);

      try {
        const data = await requestWithToken(`${API_BASE}/admin/activity-logs?${params.toString()}`, token);
        if (cancelled) return;
        setLogs(Array.isArray(data?.logs) ? data.logs : []);
        setTotalPages(Number(data?.totalPages) || 1);
        setTotal(Number(data?.total) || 0);
        setActions(Array.isArray(data?.actions) ? data.actions : []);
      } catch (err) {
        if (cancelled) return;
        setError(err.message || "Could not load activity logs");
      } finally {
        if (cancelled) return;
        setLoading(false);
        setRefreshing(false);
      }
    }

    loadLogs();
    return () => {
      cancelled = true;
    };
  }, [token, user?.role, page, search, actionFilter, actorTypeFilter]);

  if (!token || user?.role !== "admin") {
    return (
      <section className="admin-state">
        <p className="section-kicker">Admin Logs</p>
        <h1>Admin access required</h1>
        <p>Login as an admin to view site activity.</p>
      </section>
    );
  }

  return (
    <section className="admin-logs-workspace">
      <header className="admin-logs-mobile-topbar">
        <button type="button" onClick={() => setDrawerOpen(true)} aria-label="Open navigation menu"><LogsIcon name="menu" /></button>
        <h1>Activity Logs</h1>
        <button type="button" onClick={() => setPage(1)} aria-label="Refresh logs"><LogsIcon name="refresh" /></button>
      </header>
      <MobileNavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <header className="admin-logs-head">
        <h1>Activity Logs</h1>
        <p>Monitor real activity across the site - registrations, logins, orders, reviews, and more.</p>
      </header>

      <section className="admin-logs-toolbar" aria-label="Activity log search and filters">
        <label className="admin-logs-search">
          <LogsIcon name="search" />
          <input
            value={search}
            onChange={(event) => { setPage(1); setSearch(event.target.value); }}
            placeholder="Search by name, email, or description..."
          />
        </label>
        <select value={actorTypeFilter} onChange={(event) => { setPage(1); setActorTypeFilter(event.target.value); }} aria-label="Filter by actor type">
          <option value="all">Everyone</option>
          <option value="user">Customers</option>
          <option value="guest">Guests</option>
          <option value="admin">Admins</option>
          <option value="system">System</option>
        </select>
        <select value={actionFilter} onChange={(event) => { setPage(1); setActionFilter(event.target.value); }} aria-label="Filter by action">
          <option value="all">All Actions</option>
          {actions.map((action) => (
            <option key={action} value={action}>{actionLabel(action)}</option>
          ))}
        </select>
        <button type="button" className="admin-logs-refresh" disabled={loading || refreshing} onClick={() => setPage((current) => current)}>
          <LogsIcon name="refresh" />
          Refresh
        </button>
      </section>

      <section className="admin-logs-stats" aria-label="Activity log summary">
        <article><span>Total Events</span><strong>{total.toLocaleString("en-GB")}</strong></article>
        <article><span>Page</span><strong>{page} / {totalPages}</strong></article>
      </section>

      {loading ? (
        <div className="admin-logs-empty">Loading activity...</div>
      ) : error ? (
        <div className="admin-logs-empty is-error">{error}</div>
      ) : !logs.length ? (
        <div className="admin-logs-empty">No activity matches these filters yet.</div>
      ) : (
        <>
          <div className="admin-logs-table-head" aria-hidden="true">
            <span>Actor</span>
            <span>Action</span>
            <span>Target</span>
            <span>When</span>
          </div>
          <div className="admin-record-list admin-record-list--logs">
            {logs.map((log) => (
              <article key={log._id} className="admin-log-record">
                <div className="admin-log-record__actor">
                  <span className={`admin-log-record__badge is-${log.actorType || "user"}`}>
                    {ACTOR_TYPE_LABELS[log.actorType] || "Customer"}
                  </span>
                  <div>
                    <strong>{log.actorName || log.actorEmail || "Unknown"}</strong>
                    {log.actorEmail ? <small>{log.actorEmail}</small> : null}
                  </div>
                </div>
                <div className="admin-log-record__action">
                  <strong>{actionLabel(log.action)}</strong>
                  {log.description ? <p>{log.description}</p> : null}
                </div>
                <div className="admin-log-record__target">
                  {log.targetLabel ? <span>{log.targetLabel}</span> : <span className="is-muted">—</span>}
                  {log.targetType ? <small>{log.targetType}</small> : null}
                </div>
                <div className="admin-log-record__time">
                  <time>{formatDateTime(log.createdAt)}</time>
                  {log.ipAddress ? <small>{log.ipAddress}</small> : null}
                </div>
              </article>
            ))}
          </div>

          <div className="admin-logs-pagination">
            <button type="button" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button type="button" disabled={page >= totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}
