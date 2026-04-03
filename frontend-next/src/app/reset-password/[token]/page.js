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
    <main className="shell page-section narrow-shell">
      <section className="panel">
        <p className="section-kicker">Reset password</p>
        <h1>Choose your new password</h1>
        <form className="auth-form" onSubmit={onSubmit}>
          <input className="field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" required />
          <input className="field" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" required />
          {message ? <p className="hero-copy">{message}</p> : null}
          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? "Updating..." : "Update password"}
          </button>
        </form>
        <div className="hero-actions">
          <Link href="/login" className="ghost-link">Back to login</Link>
        </div>
      </section>
    </main>
  );
}
