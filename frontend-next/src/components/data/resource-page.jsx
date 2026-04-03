"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { asArray, requestWithToken } from "@/lib/resource";

export default function ResourcePage({
  title,
  subtitle,
  endpoint,
  emptyText,
  mapItem,
  requireAdmin = false,
}) {
  const { token, user, isAuthenticated, status } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status !== "ready") return;
    if (!isAuthenticated || !token) {
      setLoading(false);
      return;
    }
    if (requireAdmin && user?.role !== "admin") {
      setLoading(false);
      return;
    }

    requestWithToken(endpoint, token)
      .then((payload) => {
        setItems(asArray(payload));
        setError("");
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [endpoint, isAuthenticated, requireAdmin, status, token, user?.role]);

  if (status === "loading" || loading) {
    return <section className="panel">Loading {title.toLowerCase()}...</section>;
  }

  if (!isAuthenticated) {
    return (
      <section className="panel">
        <h1>{title}</h1>
        <p className="hero-copy">{subtitle}</p>
        <p className="hero-copy">Login is required to access this page.</p>
        <Link href="/login" className="primary-link">Go to login</Link>
      </section>
    );
  }

  if (requireAdmin && user?.role !== "admin") {
    return (
      <section className="panel">
        <h1>{title}</h1>
        <p className="hero-copy">Admin access is required for this page.</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <p className="section-kicker">{title}</p>
      <h1>{subtitle}</h1>
      {error ? <p className="form-error">{error}</p> : null}
      {!error && !items.length ? <p className="hero-copy">{emptyText}</p> : null}
      {!error && items.length ? <div className="data-list">{items.map(mapItem)}</div> : null}
    </section>
  );
}
