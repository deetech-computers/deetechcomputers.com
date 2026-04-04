"use client";

import AdminShell from "@/components/admin/admin-shell";
import ResourcePage from "@/components/data/resource-page";
import { API_BASE } from "@/lib/config";

export default function AdminDiscountsPage() {
  return (
    <AdminShell>
      <ResourcePage
        title="Discounts"
        subtitle="Discount and coupon visibility in the admin app."
        endpoint={`${API_BASE}/admin/discounts`}
        emptyText="No discounts found."
        requireAdmin
        mapItem={(item) => (
          <article key={item._id} className="data-item">
            <strong>{item.code || item.name || "Discount"}</strong>
            <p className="muted">Status: {item.status || (item.isActive ? "active" : "inactive")}</p>
            <p>Value: {item.amount || item.value || item.discount || 0}</p>
          </article>
        )}
      />
    </AdminShell>
  );
}
