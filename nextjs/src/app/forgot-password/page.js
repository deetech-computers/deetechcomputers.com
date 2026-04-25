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
    <main className="auth-hp-page">
      <section className="auth-hp-card auth-hp-card--forgot">
        <div className="auth-hp-frame">
          <header className="auth-hp-head">
            <span className="auth-hp-logo-wrap" aria-hidden="true">
              <img className="auth-hp-logo" src="/logo.png" alt="" width="40" height="40" />
            </span>
          </header>
          <h1>Recover username</h1>
          <p className="auth-hp-copy">What email address is associated with your account?</p>
          <form className="auth-hp-form" onSubmit={onSubmit}>
            <label className="field-group">
              <span>Email address</span>
              <input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" autoComplete="email" required />
            </label>
            {message ? <p className="auth-message">{message}</p> : null}
            <button className="auth-hp-btn auth-hp-btn--primary" type="submit" disabled={submitting}>
              {submitting ? "Sending..." : "Next"}
            </button>
          </form>
          <Link href="/login" className="auth-hp-link-row">Back</Link>
        </div>
        <Link href="/privacy-policy" className="auth-hp-privacy">Privacy</Link>
      </section>
    </main>
  );
}
