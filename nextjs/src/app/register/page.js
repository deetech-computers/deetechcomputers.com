"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      await register({
        name: `${form.firstName} ${form.lastName}`.trim(),
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
      <section className="auth-hp-card auth-hp-card--register">
        <div className="auth-hp-frame">
          <header className="auth-hp-head">
            <span className="auth-hp-head-spacer" aria-hidden="true" />
            <Link href="/login">Sign in</Link>
          </header>
          <h1>Create account</h1>
          <form className="auth-hp-form" onSubmit={onSubmit}>
            <div className="auth-hp-grid-two">
              <label className="field-group">
                <span>First name</span>
                <input className="field" type="text" placeholder="First name *" value={form.firstName} onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))} required />
              </label>
              <label className="field-group">
                <span>Last name</span>
                <input className="field" type="text" placeholder="Last name *" value={form.lastName} onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))} required />
              </label>
            </div>
            <label className="field-group">
              <span>Email address</span>
              <input className="field" type="email" placeholder="Email address *" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} autoComplete="email" required />
            </label>
            <label className="field-group">
              <span>Password</span>
              <input className="field" type="password" placeholder="Password *" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} autoComplete="new-password" required />
            </label>
            <label className="field-group">
              <span>Confirm password</span>
              <input className="field" type="password" placeholder="Confirm password *" value={form.confirmPassword} onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))} autoComplete="new-password" required />
            </label>
            {error ? <p className="form-error">{error}</p> : null}
            <button type="submit" className="auth-hp-btn auth-hp-btn--primary" disabled={submitting}>
              {submitting ? "Creating account..." : "Create"}
            </button>
          </form>
        </div>
        <Link href="/privacy-policy" className="auth-hp-privacy">Privacy</Link>
      </section>
    </main>
  );
}
