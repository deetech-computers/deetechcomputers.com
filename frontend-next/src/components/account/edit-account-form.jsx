"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AccountNav from "@/components/account/account-nav";
import { useAuth } from "@/hooks/use-auth";

export default function EditAccountForm() {
  const router = useRouter();
  const { isAuthenticated, refreshProfile, saveProfile, status, user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    refreshProfile()
      .then((profile) => {
        const nextProfile = profile || user || {};
        setName(nextProfile.name || "");
        setEmail(nextProfile.email || "");
      })
      .catch((error) => {
        setMessage(error.message || "Error loading account info.");
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, refreshProfile, router, status, user]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      await saveProfile({ name: name.trim() });
      setMessage("Profile updated successfully!");
      window.setTimeout(() => router.push("/account"), 1200);
    } catch (error) {
      setMessage(error.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading" || loading) {
    return <section className="panel">Loading account...</section>;
  }

  return (
    <section className="panel account-edit-panel">
      <AccountNav />
      <p className="section-kicker">Edit profile</p>
      <h1>Edit Profile</h1>
      <p className="hero-copy">Update your name. Email changes are not allowed.</p>
      <form className="auth-form" onSubmit={onSubmit}>
        <label className="field-group">
          <span>Full Name</span>
          <input className="field" type="text" value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label className="field-group">
          <span>Email</span>
          <input className="field disabled-field" type="email" value={email} disabled />
        </label>
        <p className="hero-copy">Email cannot be changed.</p>
        {message ? <p className="hero-copy">{message}</p> : null}
        <div className="hero-actions">
          <button type="submit" className="primary-button" disabled={submitting}>
            {submitting ? "Saving..." : "Save Changes"}
          </button>
          <button type="button" className="ghost-button" onClick={() => router.push("/account")}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
