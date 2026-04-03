"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AccountNav from "@/components/account/account-nav";
import { API_BASE_AUTH, API_BASE_USERS } from "@/lib/config";
import { requestJson } from "@/lib/http";
import { useAuth } from "@/hooks/use-auth";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { token, user, isAuthenticated } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!token || !user?.email) return;
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }
    try {
      await requestJson(`${API_BASE_AUTH}/login`, {
        method: "POST",
        body: JSON.stringify({ email: user.email, password: currentPassword }),
      });
      await requestJson(`${API_BASE_USERS}/profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ password: newPassword }),
      });
      setMessage("Password updated successfully.");
      setTimeout(() => router.push("/account"), 1000);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <main className="shell page-section narrow-shell">
      <section className="panel">
        <AccountNav />
        <p className="section-kicker">Change password</p>
        <h1>Update your password in the new app</h1>
        {!isAuthenticated ? (
          <p className="hero-copy">Login is required to change your password.</p>
        ) : (
          <form className="auth-form" onSubmit={onSubmit}>
            <input className="field" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current password" required />
            <input className="field" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" required />
            <input className="field" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" required />
            {message ? <p className="hero-copy">{message}</p> : null}
            <button className="primary-button" type="submit">Change password</button>
          </form>
        )}
      </section>
    </main>
  );
}
