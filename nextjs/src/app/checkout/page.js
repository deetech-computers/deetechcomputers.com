"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/providers/toast-provider";
import { formatCurrency } from "@/lib/format";
import { formatCategoryLabel, resolveProductImage } from "@/lib/products";

const CHECKOUT_DRAFT_KEY = "deetech:checkout-phase-one";
const GHANA_REGIONS = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Western North",
  "Central",
  "Eastern",
  "Volta",
  "Oti",
  "Northern",
  "Savannah",
  "North East",
  "Upper East",
  "Upper West",
  "Bono",
  "Bono East",
  "Ahafo",
];

function splitName(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" "),
  };
}

function readDraft() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CHECKOUT_DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeDraft(value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(value));
}

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const { user } = useAuth();
  const { pushToast } = useToast();
  const [phaseSaved, setPhaseSaved] = useState(false);

  const initialName = splitName(user?.name);
  const [form, setForm] = useState({
    firstName: initialName.firstName,
    lastName: initialName.lastName,
    companyName: "",
    shippingAddress: user?.address || "",
    shippingCity: user?.city || "",
    deliveryRegion: "",
    mobileNumber: user?.phone || "",
    shippingEmail: user?.email || "",
    useShippingForBilling: true,
    billingAddress: "",
  });

  useEffect(() => {
    const draft = readDraft();
    if (!draft) return;
    setForm((current) => ({ ...current, ...draft }));
  }, []);

  useEffect(() => {
    if (!user) return;
    const nextName = splitName(user.name);
    setForm((current) => ({
      ...current,
      firstName: current.firstName || nextName.firstName,
      lastName: current.lastName || nextName.lastName,
      shippingAddress: current.shippingAddress || user.address || "",
      shippingCity: current.shippingCity || user.city || "",
      mobileNumber: current.mobileNumber || user.phone || "",
      shippingEmail: current.shippingEmail || user.email || "",
    }));
  }, [user]);

  useEffect(() => {
    writeDraft(form);
  }, [form]);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.qty || 0), 0),
    [items]
  );
  const shipping = 0;
  const taxes = 0;
  const total = subtotal + shipping + taxes;

  function updateField(key, value) {
    setPhaseSaved(false);
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!items.length) {
      pushToast("Your cart is empty", "warning");
      return;
    }

    const requiredFields = [
      form.firstName,
      form.lastName,
      form.shippingAddress,
      form.shippingCity,
      form.deliveryRegion,
      form.mobileNumber,
      form.shippingEmail,
    ];

    if (requiredFields.some((value) => !String(value || "").trim())) {
      pushToast("Please complete the required billing details", "warning");
      return;
    }

    setPhaseSaved(true);
    pushToast("Checkout phase one saved. Payment step comes next.", "success");
  }

  if (!items.length) {
    return (
      <main className="shell page-section">
        <section className="panel cart-empty">
          <h2>Your cart is empty</h2>
          <p className="hero-copy">Add products to your cart before moving to checkout.</p>
          <Link href="/products" className="primary-link">Browse products</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="shell page-section">
      <section className="checkout-hero">
        <h1>Checkout</h1>
        <p className="checkout-hero__crumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/cart">Shopping Cart</Link>
          <span>/</span>
          <span>Checkout</span>
        </p>
      </section>

      <section className="checkout-shell">
        <div className="checkout-layout">
          <section className="checkout-form panel">
            <div className="checkout-form__header">
              <h2>Billing Details</h2>
              <p>Phase one collects the customer and delivery details your backend order flow expects.</p>
            </div>

            <form className="checkout-fields" onSubmit={handleSubmit}>
              <label className="checkout-field">
                <span>First Name *</span>
                <input className="field" value={form.firstName} onChange={(event) => updateField("firstName", event.target.value)} placeholder="Ex. John" required />
              </label>

              <label className="checkout-field">
                <span>Last Name *</span>
                <input className="field" value={form.lastName} onChange={(event) => updateField("lastName", event.target.value)} placeholder="Ex. Doe" required />
              </label>

              <label className="checkout-field checkout-field--full">
                <span>Company Name (Optional)</span>
                <input className="field" value={form.companyName} onChange={(event) => updateField("companyName", event.target.value)} placeholder="Enter Company Name" />
              </label>

              <label className="checkout-field checkout-field--full">
                <span>Street Address *</span>
                <input className="field" value={form.shippingAddress} onChange={(event) => updateField("shippingAddress", event.target.value)} placeholder="Enter Street Address" required />
              </label>

              <label className="checkout-field">
                <span>City *</span>
                <input className="field" value={form.shippingCity} onChange={(event) => updateField("shippingCity", event.target.value)} placeholder="Select City" required />
              </label>

              <label className="checkout-field">
                <span>State / Region *</span>
                <select className="field" value={form.deliveryRegion} onChange={(event) => updateField("deliveryRegion", event.target.value)} required>
                  <option value="">Select Region</option>
                  {GHANA_REGIONS.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </label>

              <label className="checkout-field">
                <span>Phone *</span>
                <input className="field" value={form.mobileNumber} onChange={(event) => updateField("mobileNumber", event.target.value)} placeholder="Enter Phone Number" required />
              </label>

              <label className="checkout-field checkout-field--full">
                <span>Email *</span>
                <input className="field" type="email" value={form.shippingEmail} onChange={(event) => updateField("shippingEmail", event.target.value)} placeholder="Enter Email Address" required />
              </label>

              <div className="checkout-delivery checkout-field checkout-field--full">
                <span>Delivery Address *</span>
                <div className="checkout-delivery__options">
                  <button
                    type="button"
                    className={form.useShippingForBilling ? "checkout-delivery__choice is-active" : "checkout-delivery__choice"}
                    onClick={() => updateField("useShippingForBilling", true)}
                  >
                    <span className="checkout-delivery__radio" aria-hidden="true" />
                    Same as shipping address
                  </button>
                  <button
                    type="button"
                    className={!form.useShippingForBilling ? "checkout-delivery__choice is-active" : "checkout-delivery__choice"}
                    onClick={() => updateField("useShippingForBilling", false)}
                  >
                    <span className="checkout-delivery__radio" aria-hidden="true" />
                    Use a different billing address
                  </button>
                </div>
              </div>

              {!form.useShippingForBilling ? (
                <label className="checkout-field checkout-field--full">
                  <span>Billing Address *</span>
                  <input className="field" value={form.billingAddress} onChange={(event) => updateField("billingAddress", event.target.value)} placeholder="Enter Billing Address" />
                </label>
              ) : null}

              <div className="checkout-phase-action checkout-field checkout-field--full">
                {phaseSaved ? <p className="checkout-phase-action__message">Billing details saved for phase two payment.</p> : null}
                <button type="submit" className="checkout-summary__button">Proceed to Payment</button>
              </div>
            </form>
          </section>

          <aside className="checkout-summary panel">
            <h2>Order Summary</h2>
            <div className="checkout-summary__lines">
              <div className="checkout-summary__line">
                <span>Items</span>
                <strong>{itemCount}</strong>
              </div>
              <div className="checkout-summary__line">
                <span>Sub Total</span>
                <strong>{formatCurrency(subtotal)}</strong>
              </div>
              <div className="checkout-summary__line">
                <span>Shipping</span>
                <strong>{formatCurrency(shipping)}</strong>
              </div>
              <div className="checkout-summary__line">
                <span>Taxes</span>
                <strong>{formatCurrency(taxes)}</strong>
              </div>
            </div>
            <div className="checkout-summary__total">
              <span>Total</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
            <div className="checkout-summary__items">
              {items.map((item) => (
                <article key={item.productId || item._id} className="checkout-summary__item">
                  <div className="checkout-summary__thumb">
                    {resolveProductImage(item.image) ? (
                      <img src={resolveProductImage(item.image)} alt={item.name} />
                    ) : (
                      <div className="product-card__placeholder">No image</div>
                    )}
                  </div>
                  <div className="checkout-summary__item-copy">
                    <h3>{item.name}</h3>
                    <p>{formatCategoryLabel(item.category || item.categoryName || "Product")}</p>
                    <small>Qty {item.qty}</small>
                  </div>
                  <strong>{formatCurrency(Number(item.price || 0) * Number(item.qty || 0))}</strong>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
