"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_BASE_AUTH } from "@/lib/config";
import { requestJson } from "@/lib/http";

export default function ResetPasswordPage({ params }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    setMessage("");
    try {
      await requestJson(`${API_BASE_AUTH}/reset-password/${params.token}`, {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      setMessage("Password updated successfully.");
      setTimeout(() => router.push("/login"), 1200);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="shell page-section auth-page">
      <section className="auth-shell">
        <div className="auth-panel auth-panel--form">
          <p className="section-kicker">New password</p>
          <h1>Choose a secure password.</h1>
          <p className="auth-lead">
            Your new password protects your order history, saved details, wishlist, reviews, and affiliate activity.
          </p>
          <form className="auth-form" onSubmit={onSubmit}>
            <label className="field-group">
              <span>New password</span>
              <input className="field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter a new secure password" autoComplete="new-password" required />
            </label>
            <label className="field-group">
              <span>Confirm new password</span>
              <input className="field" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat your new password" autoComplete="new-password" required />
            </label>
            {message ? <p className="auth-message">{message}</p> : null}
            <button className="primary-button auth-submit" type="submit" disabled={submitting}>
              {submitting ? "Updating..." : "Update password"}
            </button>
          </form>
          <div className="auth-links">
            <Link href="/login">Back to login</Link>
          </div>
        </div>
        <aside className="auth-panel auth-panel--story" aria-label="Password tips">
          <span className="auth-badge">Security tip</span>
          <h2>Pick something strong, private, and easy for only you to remember.</h2>
          <div className="auth-benefits">
            <p><strong>Use enough length</strong><span>Longer passwords are harder for others to guess.</span></p>
            <p><strong>Avoid reused passwords</strong><span>Do not use the same password from another account.</span></p>
            <p><strong>Keep it private</strong><span>DEETECH will never ask you to share your password.</span></p>
          </div>
        </aside>
      </section>
    </main>
  );
}
