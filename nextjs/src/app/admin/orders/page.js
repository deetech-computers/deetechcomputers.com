"use client";

import AdminShell from "@/components/admin/admin-shell";
import ResourcePage from "@/components/data/resource-page";
import { API_BASE_ORDERS } from "@/lib/config";

export default function AdminOrdersPage() {
  return (
    <AdminShell>
      <ResourcePage
        title="Orders"
        subtitle="Monitor all customer orders."
        endpoint={API_BASE_ORDERS}
        emptyText="No orders found."
        requireAdmin
        mapItem={(item) => (
          <article key={item._id} className="data-item">
            <strong>{item.orderNumber || item._id}</strong>
            <p className="muted">{item.status || "Pending"} • {item.paymentStatus || "Unpaid"}</p>
            <p>Total: {Number(item.totalPrice || 0).toFixed(2)}</p>
          </article>
        )}
      />
    </AdminShell>
  );
}
