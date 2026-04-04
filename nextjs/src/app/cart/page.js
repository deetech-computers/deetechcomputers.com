"use client";

import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/format";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();

  return (
    <main className="shell page-section">
      <div className="section-header">
        <p className="section-kicker">Cart</p>
        <h1>Hybrid cart logic, native Next page</h1>
      </div>

      {!items.length ? (
        <section className="panel">
          <h2>Your cart is empty</h2>
          <p className="hero-copy">Add a product from the catalog to start a checkout flow.</p>
          <Link href="/products" className="primary-link">Browse products</Link>
        </section>
      ) : (
        <div className="cart-layout">
          <section className="panel">
            <div className="cart-list">
              {items.map((item) => (
                <article key={item.productId || item._id} className="cart-row">
                  <div>
                    <h3>{item.name}</h3>
                    <p>{formatCurrency(item.price)}</p>
                  </div>
                  <input
                    className="field"
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(event) =>
                      updateQuantity(item.productId || item._id, Number(event.target.value || 1))
                    }
                  />
                  <button type="button" className="ghost-button" onClick={() => removeItem(item.productId || item._id)}>
                    Remove
                  </button>
                </article>
              ))}
            </div>
          </section>
          <aside className="panel">
            <h2>Summary</h2>
            <p className="hero-copy">Subtotal</p>
            <strong>{formatCurrency(subtotal)}</strong>
            <div className="stack-actions">
              <button type="button" className="primary-button" disabled>Checkout coming next</button>
              <button type="button" className="ghost-button" onClick={clearCart}>Clear cart</button>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
