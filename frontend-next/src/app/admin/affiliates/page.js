"use client";

import AdminShell from "@/components/admin/admin-shell";
import ResourcePage from "@/components/data/resource-page";
import { API_BASE } from "@/lib/config";

export default function AdminAffiliatesPage() {
  return (
    <AdminShell>
      <ResourcePage
        title="Affiliates"
        subtitle="Affiliate management route for the admin team."
        endpoint={`${API_BASE}/affiliates/admin`}
        emptyText="No affiliates found."
        requireAdmin
        mapItem={(item) => (
          <article key={item._id} className="data-item">
            <strong>{item.code || item.referralCode || item.name || "Affiliate"}</strong>
            <p className="muted">{item.email || "No email"} • {item.tier || "starter"}</p>
            <p>Status: {item.status || "active"}</p>
          </article>
        )}
      />
    </AdminShell>
  );
}
