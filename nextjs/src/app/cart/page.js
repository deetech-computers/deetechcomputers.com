"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/format";
import { formatCategoryLabel, resolveProductImage } from "@/lib/products";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.qty || 0), 0),
    [items]
  );

  const couponDiscount = useMemo(() => {
    if (appliedCoupon !== "DEETECH10") return 0;
    return subtotal * 0.1;
  }, [appliedCoupon, subtotal]);

  const shipping = 0;
  const taxes = 0;
  const total = Math.max(0, subtotal + shipping + taxes - couponDiscount);

  function handleApplyCoupon() {
    const normalized = String(couponCode || "").trim().toUpperCase();
    if (!normalized) {
      setAppliedCoupon("");
      return;
    }
    setAppliedCoupon(normalized === "DEETECH10" ? "DEETECH10" : "");
  }

  return (
    <main className="shell page-section">
      <section className="cart-hero">
        <h1>Shopping Cart</h1>
        <p className="cart-hero__crumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Shopping Cart</span>
        </p>
      </section>

      {!items.length ? (
        <section className="panel cart-empty">
          <h2>Your cart is empty</h2>
          <p className="hero-copy">Add a product from the catalog to start building your order.</p>
          <Link href="/products" className="primary-link">Browse products</Link>
        </section>
      ) : (
        <section className="cart-shell">
          <div className="cart-layout cart-layout--page">
            <section className="cart-table panel">
              <header className="cart-table__head" aria-hidden="true">
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Subtotal</span>
              </header>

              <div className="cart-list">
                {items.map((item) => (
                  <article key={item.productId || item._id} className="cart-row">
                    <button
                      type="button"
                      className="cart-row__remove"
                      onClick={() => removeItem(item.productId || item._id)}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      x
                    </button>
                    <div className="cart-row__product">
                      <div className="cart-row__thumb">
                        {resolveProductImage(item.image) ? (
                          <img src={resolveProductImage(item.image)} alt={item.name} />
                        ) : (
                          <div className="product-card__placeholder">No image</div>
                        )}
                      </div>
                      <div className="cart-row__meta">
                        <h3>{item.name}</h3>
                        <p>{formatCategoryLabel(item.category || item.categoryName || "Product")}</p>
                      </div>
                    </div>
                    <p className="cart-row__price">{formatCurrency(item.price)}</p>
                    <div className="cart-row__qty">
                      <button type="button" onClick={() => updateQuantity(item.productId || item._id, Number(item.qty || 1) - 1)} aria-label={`Decrease ${item.name} quantity`}>
                        -
                      </button>
                      <input
                        className="cart-row__qty-input"
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(event) => updateQuantity(item.productId || item._id, Number(event.target.value || 1))}
                        aria-label={`${item.name} quantity`}
                      />
                      <button type="button" onClick={() => updateQuantity(item.productId || item._id, Number(item.qty || 1) + 1)} aria-label={`Increase ${item.name} quantity`}>
                        +
                      </button>
                    </div>
                    <p className="cart-row__subtotal">{formatCurrency(Number(item.price || 0) * Number(item.qty || 0))}</p>
                  </article>
                ))}
              </div>
            </section>

            <aside className="cart-summary panel">
              <h2>Order Summary</h2>
              <div className="cart-summary__lines">
                <div className="cart-summary__line">
                  <span>Items</span>
                  <strong>{itemCount}</strong>
                </div>
                <div className="cart-summary__line">
                  <span>Sub Total</span>
                  <strong>{formatCurrency(subtotal)}</strong>
                </div>
                <div className="cart-summary__line">
                  <span>Shipping</span>
                  <strong>{formatCurrency(shipping)}</strong>
                </div>
                <div className="cart-summary__line">
                  <span>Taxes</span>
                  <strong>{formatCurrency(taxes)}</strong>
                </div>
                <div className="cart-summary__line">
                  <span>Coupon Discount</span>
                  <strong>-{formatCurrency(couponDiscount)}</strong>
                </div>
              </div>
              <div className="cart-summary__total">
                <span>Total</span>
                <strong>{formatCurrency(total)}</strong>
              </div>
              <Link href="/checkout" className="cart-summary__checkout">Proceed to Checkout</Link>
            </aside>
          </div>

          <section className="cart-actions-bar">
            <div className="cart-actions-bar__coupon">
              <input
                className="field cart-actions-bar__input"
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
                placeholder="Coupon Code"
              />
              <button type="button" className="cart-actions-bar__apply" onClick={handleApplyCoupon}>
                Apply Coupon
              </button>
            </div>
            <button type="button" className="cart-actions-bar__clear" onClick={clearCart}>
              Clear Shopping Cart
            </button>
          </section>
        </section>
      )}
    </main>
  );
}
