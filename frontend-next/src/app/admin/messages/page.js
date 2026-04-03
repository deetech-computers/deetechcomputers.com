"use client";

import AdminShell from "@/components/admin/admin-shell";
import ResourcePage from "@/components/data/resource-page";
import { API_BASE_SUPPORT } from "@/lib/config";

export default function AdminMessagesPage() {
  return (
    <AdminShell>
      <ResourcePage
        title="Messages"
        subtitle="Customer support inbox inside the new admin app."
        endpoint={API_BASE_SUPPORT}
        emptyText="No messages found."
        requireAdmin
        mapItem={(item) => (
          <article key={item._id} className="data-item">
            <strong>{item.subject || item.name || "Message"}</strong>
            <p className="muted">{item.email || "No email"} • {item.status || "new"}</p>
            <p>{item.message || item.response || "No content"}</p>
          </article>
        )}
      />
    </AdminShell>
  );
}
