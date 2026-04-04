"use client";

import AdminShell from "@/components/admin/admin-shell";
import ResourcePage from "@/components/data/resource-page";
import { API_BASE_USERS } from "@/lib/config";

export default function AdminUsersPage() {
  return (
    <AdminShell>
      <ResourcePage
        title="Users"
        subtitle="User management in the standalone admin frontend."
        endpoint={`${API_BASE_USERS}/admin/users`}
        emptyText="No users found."
        requireAdmin
        mapItem={(item) => (
          <article key={item._id} className="data-item">
            <strong>{item.name || item.email}</strong>
            <p className="muted">{item.email}</p>
            <p>Role: {item.role || "customer"}</p>
          </article>
        )}
      />
    </AdminShell>
  );
}
