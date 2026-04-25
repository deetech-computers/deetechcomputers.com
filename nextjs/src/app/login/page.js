"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await login({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      router.push("/account");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-hp-page">
      <section className="auth-hp-card auth-hp-card--login">
        <div className="auth-hp-frame">
          <header className="auth-hp-head">
            <span className="auth-hp-logo-wrap" aria-hidden="true">
              <img className="auth-hp-logo" src="/logo.png" alt="" width="40" height="40" />
            </span>
            <Link href="/register">Create account</Link>
          </header>
          <h1>Sign in</h1>
          <form className="auth-hp-form" onSubmit={onSubmit}>
            <label className="field-group">
              <span>Email address</span>
              <input
                className="field"
                type="email"
                placeholder="Username or Email Address"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                autoComplete="email"
                required
              />
            </label>
            <label className="field-group">
              <span>Password</span>
              <input
                className="field"
                type="password"
                placeholder="Use your password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                autoComplete="current-password"
                required
              />
            </label>
            {error ? <p className="form-error">{error}</p> : null}
            <button type="submit" className="auth-hp-btn auth-hp-btn--primary" disabled={submitting}>
              {submitting ? "Logging in..." : "Login"}
            </button>
            <Link href="/forgot-password" className="auth-hp-link-row">Forgot password?</Link>
          </form>
        </div>
        <Link href="/privacy-policy" className="auth-hp-privacy">Privacy</Link>
      </section>
    </main>
  );
}
