"use client";

import AccountNav from "@/components/account/account-nav";
import ResourcePage from "@/components/data/resource-page";
import { API_BASE } from "@/lib/config";

export default function AffiliatesPage() {
  return (
    <main className="shell page-section">
      <section className="panel">
        <AccountNav />
      </section>
      <ResourcePage
        title="Affiliates"
        subtitle="Affiliate status and metrics without the old page system."
        endpoint={`${API_BASE}/affiliates/me`}
        emptyText="No affiliate profile yet."
        mapItem={(item) => (
          <article key={item._id || item.code || "affiliate"} className="data-item">
            <strong>{item.code || item.referralCode || "Affiliate"}</strong>
            <p className="muted">Tier: {item.tier || "starter"}</p>
            <p>Commission earned: {Number(item.earnedCommission || item.totalCommission || 0).toFixed(2)}</p>
          </article>
        )}
      />
    </main>
  );
}
