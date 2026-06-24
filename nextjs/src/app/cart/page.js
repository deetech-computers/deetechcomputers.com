"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import StableImage from "@/components/ui/stable-image";
import { API_BASE } from "@/lib/config";
import { formatCurrency } from "@/lib/format";
import { buildOrderItems, readCheckoutDraft, writeCheckoutDraft } from "@/lib/checkout";
import "./cart-desktop.css";
import "./cart-mobile.css";
import { requestJson } from "@/lib/http";
import { getLinePricing, getLinesDiscountTotal } from "@/lib/order-line-pricing";
import { buildCheckoutPricing, fetchCheckoutPricingPreview } from "@/lib/order-pricing";
import { formatCategoryLabel, resolveProductImage } from "@/lib/products";
import { formatSelectedUpgrades } from "@/lib/product-upgrades";

function CartEmptyMark() {
  return (
    <div className="cart-empty-state__mark" aria-hidden="true">
      <svg className="cart-empty-state__bag" viewBox="0 0 120 120">
        <rect x="29" y="39" width="62" height="58" rx="12" fill="currentColor" opacity="0.12" />
        <path d="M34 46h52l-4 47H38L34 46Z" fill="#dce7fb" stroke="#00401b" strokeWidth="5" strokeLinejoin="round" />
        <path d="M44 48V36c0-12 7-20 16-20s16 8 16 20v12" fill="none" stroke="#00401b" strokeWidth="6" strokeLinecap="round" />
        <path d="M51 66h18" stroke="#00401b" strokeWidth="5" strokeLinecap="round" />
        <path d="M51 78h28" stroke="#00401b" strokeWidth="5" strokeLinecap="round" />
      </svg>
      <span>
        <svg viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </span>
    </div>
  );
}

function CartEmptyIcon({ type }) {
  if (type === "wishlist") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20.5 5.2 14C2 10.9 3.8 5.5 8.2 5.5c1.7 0 3 .8 3.8 2 .8-1.2 2.1-2 3.8-2 4.4 0 6.2 5.4 3 8.5L12 20.5Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "support") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12a7 7 0 0 1 14 0v4a3 3 0 0 1-3 3h-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M5 13h3v5H5v-5Zm11 0h3v5h-3v-5Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M12 19h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16l-2 9H7L4 7Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M7 7 8.4 4h7.2L17 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 20h.01M17 20h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const [couponCode, setCouponCode] = useState("");
  const [couponStatus, setCouponStatus] = useState("idle");
  const [couponMessage, setCouponMessage] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState({
    code: "",
    percent: 0,
  });
  const couponValidationSeq = useRef(0);
  const pricingPreviewSeq = useRef(0);
  const [pricingPreview, setPricingPreview] = useState(null);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.qty || 0), 0),
    [items]
  );
  const productDiscountTotal = useMemo(() => getLinesDiscountTotal(items), [items]);

  const couponDiscount = useMemo(() => {
    const percent = Number(appliedCoupon.percent || 0);
    if (!percent) return 0;
    return (subtotal * percent) / 100;
  }, [appliedCoupon.percent, subtotal]);

  const localPricing = useMemo(
    () => buildCheckoutPricing({ items, subtotal, discountAmount: couponDiscount }),
    [items, subtotal, couponDiscount]
  );
  const pricingPreviewKey = useMemo(
    () =>
      JSON.stringify({
        orderItems: buildOrderItems(items),
        discountCode: String(appliedCoupon.code || "").trim().toUpperCase(),
        subtotal: Number(subtotal || 0),
        discountAmount: Number(couponDiscount || 0),
      }),
    [appliedCoupon.code, couponDiscount, items, subtotal]
  );
  const pricing =
    pricingPreview?.key === pricingPreviewKey ? pricingPreview.value : localPricing;
  const shipping = pricing.shipping;
  const taxes = pricing.taxes;
  const total = pricing.total;

  useEffect(() => {
    const orderItems = buildOrderItems(items);
    const seq = ++pricingPreviewSeq.current;

    if (!orderItems.length) {
      return;
    }

    let ignore = false;

    async function syncPricingPreview() {
      try {
        const preview = await fetchCheckoutPricingPreview({
          orderItems,
          items,
          subtotal,
          discountAmount: couponDiscount,
          discountCode: appliedCoupon.code,
        });
        if (ignore || seq !== pricingPreviewSeq.current) return;
        setPricingPreview({ key: pricingPreviewKey, value: preview });
      } catch {
        if (ignore || seq !== pricingPreviewSeq.current) return;
        setPricingPreview({ key: pricingPreviewKey, value: localPricing });
      }
    }

    syncPricingPreview();
    return () => {
      ignore = true;
    };
  }, [appliedCoupon.code, couponDiscount, items, localPricing, pricingPreviewKey, subtotal]);

  useEffect(() => {
    const existingDraft = readCheckoutDraft(user) || {};
    writeCheckoutDraft({
      ...existingDraft,
      discountCode: String(appliedCoupon.code || "").trim(),
      discountPercent: Number(appliedCoupon.percent || 0),
      discountAmount: couponDiscount,
    }, user);
  }, [appliedCoupon.code, appliedCoupon.percent, couponDiscount, user]);

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
      const result = await requestJson(`${API_BASE}/discounts/validate`, {
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
    const existingDraft = readCheckoutDraft(user) || {};
    writeCheckoutDraft({
      ...existingDraft,
      discountCode: "",
      discountPercent: 0,
      discountAmount: 0,
    }, user);
  }

  return (
    <main className="shell page-section cart-page-route">
      <section className="cart-hero">
        <h1>Shopping Cart</h1>
        <p className="cart-hero__crumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Shopping Cart</span>
        </p>
      </section>

      {!items.length ? (
        <section className="cart-empty-state" aria-labelledby="cart-empty-title">
          <div className="cart-empty-state__card">
            <CartEmptyMark />
            <div className="cart-empty-state__copy">
              <p className="cart-empty-state__eyebrow">Ready when you are</p>
              <h2 id="cart-empty-title">Your cart is empty</h2>
              <p>
                Add laptops, phones, accessories, or monitors to start building your DEETECH order.
              </p>
            </div>
            <div className="cart-empty-state__actions">
              <Link href="/products" className="cart-empty-state__primary">
                Browse Products
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link href="/wishlist" className="cart-empty-state__secondary">
                View Wishlist
              </Link>
            </div>
          </div>

          <div className="cart-empty-state__quick-links" aria-label="Cart empty quick links">
            <Link href="/products?promotion=just_landed#shop-results">
              <CartEmptyIcon type="cart" />
              <span>
                <strong>New Arrivals</strong>
                <small>Fresh stock from the shop</small>
              </span>
            </Link>
            <Link href="/wishlist">
              <CartEmptyIcon type="wishlist" />
              <span>
                <strong>Saved Products</strong>
                <small>Return to products you liked</small>
              </span>
            </Link>
            <Link href="/contact">
              <CartEmptyIcon type="support" />
              <span>
                <strong>Need Help?</strong>
                <small>Ask before you checkout</small>
              </span>
            </Link>
          </div>
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
                {items.map((item) => {
                  const productId = item.productId || item._id;
                  const lineKey = item.lineKey || productId;
                  const upgradeLabel = formatSelectedUpgrades(item.selectedUpgrades);
                  const pricing = getLinePricing(item);
                  return (
                    <article key={lineKey} className="cart-row">
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
                          {upgradeLabel ? <small>{upgradeLabel}</small> : null}
                        </div>
                      </Link>
                      <div className="cart-row__price-block">
                        {pricing.hasDiscount ? (
                          <p className="cart-row__price-old">{formatCurrency(pricing.originalUnitPrice)}</p>
                        ) : null}
                        <p className="cart-row__price">{formatCurrency(pricing.currentUnitPrice)}</p>
                      </div>
                      <div className="cart-row__controls">
                        <div className="cart-row__qty">
                          <button type="button" onClick={() => updateQuantity(productId, Number(item.qty || 1) - 1, lineKey)} aria-label={`Decrease ${item.name} quantity`}>
                            -
                          </button>
                          <input
                            className="cart-row__qty-input"
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(event) => updateQuantity(productId, Number(event.target.value || 1), lineKey)}
                            aria-label={`${item.name} quantity`}
                          />
                          <button type="button" onClick={() => updateQuantity(productId, Number(item.qty || 1) + 1, lineKey)} aria-label={`Increase ${item.name} quantity`}>
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="cart-row__remove-mobile"
                          onClick={() => removeItem(productId, lineKey)}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M9 3h6l1 2h4v2H4V5h4l1-2Zm1 6h2v8h-2V9Zm4 0h2v8h-2V9ZM7 9h2v8H7V9Zm-1 11h12l1-13H5l1 13Z" fill="currentColor" />
                          </svg>
                          <span>Remove</span>
                        </button>
                      </div>
                      <div className="cart-row__subtotal-block">
                        <div className="cart-row__subtotal-stack">
                          {pricing.hasDiscount ? (
                            <p className="cart-row__subtotal-old">{formatCurrency(pricing.originalLineTotal)}</p>
                          ) : null}
                          <p className="cart-row__subtotal">{formatCurrency(pricing.currentLineTotal)}</p>
                        </div>
                        <button
                          type="button"
                          className="cart-row__remove"
                          onClick={() => removeItem(productId, lineKey)}
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
                {productDiscountTotal > 0 ? (
                  <div className="cart-summary__line">
                    <span>Product Savings</span>
                    <strong>-{formatCurrency(productDiscountTotal)}</strong>
                  </div>
                ) : null}
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
