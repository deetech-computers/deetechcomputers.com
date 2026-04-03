"use client";

import Link from "next/link";
import { useState } from "react";
import { API_BASE_AUTH } from "@/lib/config";
import { requestJson } from "@/lib/http";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      await requestJson(`${API_BASE_AUTH}/forgot-password`, {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setMessage("Reset link sent. Check your email.");
      setEmail("");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="shell page-section narrow-shell">
      <section className="panel">
        <p className="section-kicker">Password reset</p>
        <h1>Request a reset link</h1>
        <form className="auth-form" onSubmit={onSubmit}>
          <input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" required />
          {message ? <p className="hero-copy">{message}</p> : null}
          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? "Sending..." : "Send reset link"}
          </button>
        </form>
        <div className="hero-actions">
          <Link href="/login" className="ghost-link">Back to login</Link>
          <Link href="/register" className="ghost-link">Create account</Link>
        </div>
      </section>
    </main>
  );
}
