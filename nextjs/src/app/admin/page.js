"use client";

import AdminShell from "@/components/admin/admin-shell";
import ResourcePage from "@/components/data/resource-page";
import { API_BASE } from "@/lib/config";

export default function AdminDashboardPage() {
  return (
    <AdminShell>
      <ResourcePage
        title="Dashboard"
        subtitle="Admin summary route owned by the new frontend."
        endpoint={`${API_BASE}/dashboard`}
        emptyText="Dashboard data is not available."
        requireAdmin
        mapItem={(item) => (
          <article key={item._id || item.label || JSON.stringify(item)} className="data-item">
            <pre className="muted">{JSON.stringify(item, null, 2)}</pre>
          </article>
        )}
      />
    </AdminShell>
  );
}
