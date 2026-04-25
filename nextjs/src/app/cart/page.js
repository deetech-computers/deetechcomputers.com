"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import StableImage from "@/components/ui/stable-image";
import EmptyState from "@/components/ui/empty-state";
import { formatCurrency } from "@/lib/format";
import { readCheckoutDraft, writeCheckoutDraft } from "@/lib/checkout";
import { requestJson } from "@/lib/http";
import { formatCategoryLabel, resolveProductImage } from "@/lib/products";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponStatus, setCouponStatus] = useState("idle");
  const [couponMessage, setCouponMessage] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState({
    code: "",
    percent: 0,
  });
  const couponValidationSeq = useRef(0);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.qty || 0), 0),
    [items]
  );

  const couponDiscount = useMemo(() => {
    const percent = Number(appliedCoupon.percent || 0);
    if (!percent) return 0;
    return (subtotal * percent) / 100;
  }, [appliedCoupon.percent, subtotal]);

  const shipping = 0;
  const taxes = 0;
  const total = Math.max(0, subtotal + shipping + taxes - couponDiscount);

  useEffect(() => {
    const existingDraft = readCheckoutDraft() || {};
    writeCheckoutDraft({
      ...existingDraft,
      discountCode: String(appliedCoupon.code || "").trim(),
      discountPercent: Number(appliedCoupon.percent || 0),
      discountAmount: couponDiscount,
    });
  }, [appliedCoupon.code, appliedCoupon.percent, couponDiscount]);

  async function validateCoupon(rawCode) {
    const normalized = String(rawCode || "").trim().toUpperCase();
    const seq = ++couponValidationSeq.current;
    if (!normalized) {
      setAppliedCoupon({ code: "", percent: 0 });
      setCouponStatus("idle");
      setCouponMessage("");
      return;
    }

    if (normalized.length < 4) {
      setAppliedCoupon({ code: "", percent: 0 });
      setCouponStatus("idle");
      setCouponMessage("Enter at least 4 characters for coupon validation.");
      return;
    }

    setCouponStatus("checking");
    setCouponMessage("Validating coupon...");
    try {
      const result = await requestJson("/api/discounts/validate", {
        method: "POST",
        body: JSON.stringify({ code: normalized }),
      });
      if (seq !== couponValidationSeq.current) return;
      const percent = Number(result?.percent || 0);
      if (!(percent > 0)) {
        throw new Error("This coupon is not active right now.");
      }
      setAppliedCoupon({
        code: String(result?.code || normalized).toUpperCase(),
        percent,
      });
      setCouponStatus("valid");
      setCouponMessage(`Coupon applied: ${percent}% off`);
    } catch (error) {
      if (seq !== couponValidationSeq.current) return;
      setAppliedCoupon({ code: "", percent: 0 });
      setCouponStatus("invalid");
      setCouponMessage(error.message || "Invalid coupon code.");
    }
  }

  async function handleApplyCoupon() {
    await validateCoupon(couponCode);
  }

  useEffect(() => {
    const code = String(couponCode || "").trim();
    if (!code) {
      setAppliedCoupon({ code: "", percent: 0 });
      setCouponStatus("idle");
      setCouponMessage("");
      return;
    }

    const timer = window.setTimeout(() => {
      validateCoupon(code);
    }, 450);

    return () => window.clearTimeout(timer);
  }, [couponCode]);

  function handleClearShoppingCart() {
    clearCart();
    setCouponCode("");
    setAppliedCoupon({ code: "", percent: 0 });
    setCouponStatus("idle");
    setCouponMessage("");
    const existingDraft = readCheckoutDraft() || {};
    writeCheckoutDraft({
      ...existingDraft,
      discountCode: "",
      discountPercent: 0,
      discountAmount: 0,
    });
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
        <EmptyState
          icon="cart"
          title="Your cart is empty"
          description="Add a product from the catalog to start building your order."
          actionHref="/products"
          actionLabel="Browse products"
        />
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
                {items.map((item) => {
                  const productId = item.productId || item._id;
                  return (
                    <article key={productId} className="cart-row">
                      <Link href={productId ? `/products/${productId}` : "/products"} className="cart-row__product">
                        <div className="cart-row__thumb">
                          <StableImage
                            src={resolveProductImage(item.image)}
                            alt={item.name}
                            width={120}
                            height={120}
                          />
                        </div>
                        <div className="cart-row__meta">
                          <h3>{item.name}</h3>
                          <p>{formatCategoryLabel(item.category || item.categoryName || "Product")}</p>
                        </div>
                      </Link>
                      <p className="cart-row__price">{formatCurrency(item.price)}</p>
                      <div className="cart-row__controls">
                        <div className="cart-row__qty">
                          <button type="button" onClick={() => updateQuantity(productId, Number(item.qty || 1) - 1)} aria-label={`Decrease ${item.name} quantity`}>
                            -
                          </button>
                          <input
                            className="cart-row__qty-input"
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(event) => updateQuantity(productId, Number(event.target.value || 1))}
                            aria-label={`${item.name} quantity`}
                          />
                          <button type="button" onClick={() => updateQuantity(productId, Number(item.qty || 1) + 1)} aria-label={`Increase ${item.name} quantity`}>
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="cart-row__remove-mobile"
                          onClick={() => removeItem(productId)}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M9 3h6l1 2h4v2H4V5h4l1-2Zm1 6h2v8h-2V9Zm4 0h2v8h-2V9ZM7 9h2v8H7V9Zm-1 11h12l1-13H5l1 13Z" fill="currentColor" />
                          </svg>
                          <span>Remove</span>
                        </button>
                      </div>
                      <div className="cart-row__subtotal-block">
                        <p className="cart-row__subtotal">{formatCurrency(Number(item.price || 0) * Number(item.qty || 0))}</p>
                        <button
                          type="button"
                          className="cart-row__remove"
                          onClick={() => removeItem(productId)}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M9 3h6l1 2h4v2H4V5h4l1-2Zm-1 6h2v8H8V9Zm6 0h2v8h-2V9ZM5 7h14l-1 13H6L5 7Z" fill="currentColor" />
                          </svg>
                          <span>Remove</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
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
            {couponMessage ? (
              <p
                className={`checkout-affiliate__status is-${
                  couponStatus === "valid" ? "valid" : couponStatus === "invalid" ? "invalid" : "idle"
                }`}
              >
                {couponMessage}
              </p>
            ) : null}
            <button type="button" className="cart-actions-bar__clear" onClick={handleClearShoppingCart}>
              Clear Shopping Cart
            </button>
          </section>
        </section>
      )}
    </main>
  );
}
