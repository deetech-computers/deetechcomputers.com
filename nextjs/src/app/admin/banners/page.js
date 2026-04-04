"use client";

import AdminShell from "@/components/admin/admin-shell";
import ResourcePage from "@/components/data/resource-page";
import { API_BASE } from "@/lib/config";

export default function AdminBannersPage() {
  return (
    <AdminShell>
      <ResourcePage
        title="Banners"
        subtitle="Marketing banners managed from a native route."
        endpoint={`${API_BASE}/banners`}
        emptyText="No banners found."
        requireAdmin
        mapItem={(item) => (
          <article key={item._id} className="data-item">
            <strong>{item.title || item.headline || "Banner"}</strong>
            <p className="muted">{item.link || "No link"}</p>
            <p>{item.description || item.subtext || "No description"}</p>
          </article>
        )}
      />
    </AdminShell>
  );
}
