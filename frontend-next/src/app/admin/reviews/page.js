"use client";

import AdminShell from "@/components/admin/admin-shell";
import ResourcePage from "@/components/data/resource-page";
import { API_BASE } from "@/lib/config";

export default function AdminReviewsPage() {
  return (
    <AdminShell>
      <ResourcePage
        title="Reviews"
        subtitle="Moderation view for product reviews."
        endpoint={`${API_BASE}/reviews`}
        emptyText="No reviews found."
        requireAdmin
        mapItem={(item) => (
          <article key={item._id} className="data-item">
            <strong>{item.title || item.productName || "Review"}</strong>
            <p className="muted">Rating: {item.rating || 0} • Status: {item.status || "pending"}</p>
            <p>{item.comment || item.message || "No review text"}</p>
          </article>
        )}
      />
    </AdminShell>
  );
}
