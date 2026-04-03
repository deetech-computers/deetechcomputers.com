"use client";

import AccountNav from "@/components/account/account-nav";
import ResourcePage from "@/components/data/resource-page";
import { API_BASE_ORDERS } from "@/lib/config";

export default function OrdersPage() {
  return (
    <main className="shell page-section">
      <section className="panel">
        <AccountNav />
      </section>
      <ResourcePage
        title="Orders"
        subtitle="Track your order history in the standalone app."
        endpoint={`${API_BASE_ORDERS}/myorders`}
        emptyText="No orders yet."
        mapItem={(item) => (
          <article key={item._id} className="data-item">
            <strong>{item.orderNumber || item._id}</strong>
            <p className="muted">{item.status || "Pending"} • {item.paymentStatus || "Unpaid"}</p>
            <p>Total: {Number(item.totalPrice || 0).toFixed(2)}</p>
          </article>
        )}
      />
    </main>
  );
}
