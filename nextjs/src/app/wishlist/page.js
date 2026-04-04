"use client";

import AccountNav from "@/components/account/account-nav";
import ResourcePage from "@/components/data/resource-page";
import { API_BASE } from "@/lib/config";

export default function WishlistPage() {
  return (
    <main className="shell page-section">
      <section className="panel">
        <AccountNav />
      </section>
      <ResourcePage
        title="Wishlist"
        subtitle="Your saved products now live in a native Next route."
        endpoint={`${API_BASE}/wishlist`}
        emptyText="Your wishlist is empty."
        mapItem={(item) => (
          <article key={item._id} className="data-item">
            <strong>{item.name || "Product"}</strong>
            <p className="muted">{item.brand || "Deetech"} • {item.category || "General"}</p>
            <p>Price: {Number(item.price || 0).toFixed(2)}</p>
          </article>
        )}
      />
    </main>
  );
}
