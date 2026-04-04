"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AccountNav from "@/components/account/account-nav";
import { useAuth } from "@/hooks/use-auth";

export default function AccountPage() {
  const { isAuthenticated, refreshProfile, status, user } = useAuth();
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoadingProfile(true);
    refreshProfile().finally(() => setLoadingProfile(false));
  }, [isAuthenticated, refreshProfile]);

  if (status === "loading") {
    return <main className="shell page-section"><div className="panel">Loading account...</div></main>;
  }

  if (!isAuthenticated) {
    return (
      <main className="shell page-section">
        <section className="panel">
          <h1>Account access required</h1>
          <p className="hero-copy">Login to view your profile inside the new standalone frontend.</p>
          <Link href="/login" className="primary-link">Go to login</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="shell page-section">
      <div className="section-header">
        <p className="section-kicker">Account</p>
        <h1>Profile powered by the existing backend</h1>
      </div>
      <section className="panel">
        <AccountNav />
        <div className="account-grid">
          <div>
            <h2>{user?.name || "Customer"}</h2>
            <p>{user?.email || "No email available"}</p>
            <p>Role: {user?.role || "customer"}</p>
          </div>
          <div className="stack-actions">
            <Link href="/edit-account" className="primary-link">
              Edit profile
            </Link>
            <button
              type="button"
              className="ghost-button"
              onClick={() => {
                setLoadingProfile(true);
                refreshProfile().finally(() => setLoadingProfile(false));
              }}
            >
              {loadingProfile ? "Refreshing..." : "Refresh profile"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
