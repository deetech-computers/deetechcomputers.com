"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_ORDERS } from "@/lib/config";
import { requestJson } from "@/lib/http";

export default function TrackOrderEntryPage() {
  const router = useRouter();
  const [form, setForm] = useState({ orderId: "", email: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  function handleChange(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const payload = await requestJson(`${API_BASE_ORDERS}/guest-track-lookup`, {
        method: "POST",
        body: JSON.stringify({
          orderId: form.orderId.trim(),
          email: form.email.trim(),
        }),
      });
      router.push(`/orders/${payload.orderId}?token=${encodeURIComponent(payload.token)}`);
    } catch (err) {
      setError(err.message || "We couldn't find an order matching those details.");
      setStatus("idle");
    }
  }

  return (
    <main className="shell page-section track-order-entry-page">
      <section className="track-order-hero">
        <p className="track-order-hero__crumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Track Your Order</span>
        </p>
        <h1>Track Your Order</h1>
        <p>Enter the order ID and email used at checkout to see your delivery status.</p>
      </section>

      <section className="panel track-order-entry-card">
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Order ID</span>
            <input
              className="field"
              value={form.orderId}
              onChange={(event) => handleChange("orderId", event.target.value)}
              placeholder="e.g. 6a284c1b4cfc53c81da9f715"
              required
            />
            <small>Found on your order confirmation page or email.</small>
          </label>
          <label>
            <span>Email used at checkout</span>
            <input
              className="field"
              type="email"
              value={form.email}
              onChange={(event) => handleChange("email", event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>
          {error ? <p className="track-order-entry-card__error" role="alert">{error}</p> : null}
          <button type="submit" className="primary-button" disabled={status === "loading"}>
            {status === "loading" ? "Searching..." : "Track Order"}
          </button>
        </form>
        <p className="track-order-entry-card__note">
          Already signed in? <Link href="/account?tab=orders">View your order history</Link> instead.
        </p>
      </section>
    </main>
  );
}
