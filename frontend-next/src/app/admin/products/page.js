"use client";

import AdminShell from "@/components/admin/admin-shell";
import ResourcePage from "@/components/data/resource-page";
import { API_BASE_PRODUCTS } from "@/lib/config";

export default function AdminProductsPage() {
  return (
    <AdminShell>
      <ResourcePage
        title="Products"
        subtitle="Manage product inventory from a native admin route."
        endpoint={API_BASE_PRODUCTS}
        emptyText="No products found."
        requireAdmin
        mapItem={(item) => (
          <article key={item._id} className="data-item">
            <strong>{item.name}</strong>
            <p className="muted">{item.brand || "Brand"} • {item.category || "Category"}</p>
            <p>Price: {Number(item.price || 0).toFixed(2)}</p>
          </article>
        )}
      />
    </AdminShell>
  );
}
