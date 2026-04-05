"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/providers/toast-provider";
import { formatCurrency } from "@/lib/format";
import { formatCategoryLabel, resolveProductImage } from "@/lib/products";
import { requestJson } from "@/lib/http";

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
  const [affiliateState, setAffiliateState] = useState({
    status: "idle",
    message: "",
    ownerName: "",
    commissionRate: 0,
  });
  const fieldRefs = useRef({});

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
    affiliateCode: "",
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

  useEffect(() => {
    const code = String(form.affiliateCode || "").trim();

    if (!code) {
      setAffiliateState({
        status: "idle",
        message: "",
        ownerName: "",
        commissionRate: 0,
      });
      return;
    }

    if (code.length < 4) {
      setAffiliateState({
        status: "idle",
        message: "Affiliate code must be at least 4 characters.",
        ownerName: "",
        commissionRate: 0,
      });
      return;
    }

    let ignore = false;
    const timer = window.setTimeout(async () => {
      setAffiliateState((current) => ({
        ...current,
        status: "validating",
        message: "Checking affiliate code...",
      }));

      try {
        const result = await requestJson("/api/affiliates/validate-code", {
          method: "POST",
          body: JSON.stringify({ code }),
        });

        if (ignore) return;

        setAffiliateState({
          status: "valid",
          message: `Affiliate code linked to ${result.ownerName}`,
          ownerName: result.ownerName || "",
          commissionRate: Number(result.commissionRate || 0),
        });

        if (result.code && result.code !== code) {
          setForm((current) =>
            current.affiliateCode === code ? { ...current, affiliateCode: result.code } : current
          );
        }
      } catch (error) {
        if (ignore) return;
        setAffiliateState({
          status: "invalid",
          message: error.message || "Affiliate code not found",
          ownerName: "",
          commissionRate: 0,
        });
      }
    }, 450);

    return () => {
      ignore = true;
      window.clearTimeout(timer);
    };
  }, [form.affiliateCode]);

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

  function registerFieldRef(key) {
    return (element) => {
      fieldRefs.current[key] = element;
    };
  }

  function focusField(key) {
    const element = fieldRefs.current[key];
    if (!element) return;
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => {
      element.focus?.();
    }, 120);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!items.length) {
      pushToast("Your cart is empty", "warning");
      return;
    }

    const requiredFields = [
      ["firstName", form.firstName],
      ["lastName", form.lastName],
      ["shippingAddress", form.shippingAddress],
      ["shippingCity", form.shippingCity],
      ["deliveryRegion", form.deliveryRegion],
      ["mobileNumber", form.mobileNumber],
      ["shippingEmail", form.shippingEmail],
    ];

    if (!form.useShippingForBilling) {
      requiredFields.push(["billingAddress", form.billingAddress]);
    }

    const firstMissing = requiredFields.find(([, value]) => !String(value || "").trim());
    if (firstMissing) {
      pushToast("Please complete the required billing details", "warning");
      focusField(firstMissing[0]);
      return;
    }

    if (String(form.affiliateCode || "").trim()) {
      if (affiliateState.status === "validating") {
        pushToast("Please wait while the affiliate code is being checked", "info");
        focusField("affiliateCode");
        return;
      }
      if (affiliateState.status !== "valid") {
        pushToast("Please enter a valid affiliate code or clear it", "warning");
        focusField("affiliateCode");
        return;
      }
    }

    if (!form.useShippingForBilling && !String(form.billingAddress || "").trim()) {
      pushToast("Please provide the billing address", "warning");
      focusField("billingAddress");
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
                <input ref={registerFieldRef("firstName")} className="field" value={form.firstName} onChange={(event) => updateField("firstName", event.target.value)} placeholder="Ex. John" required />
              </label>

              <label className="checkout-field">
                <span>Last Name *</span>
                <input ref={registerFieldRef("lastName")} className="field" value={form.lastName} onChange={(event) => updateField("lastName", event.target.value)} placeholder="Ex. Doe" required />
              </label>

              <label className="checkout-field checkout-field--full">
                <span>Company Name (Optional)</span>
                <input className="field" value={form.companyName} onChange={(event) => updateField("companyName", event.target.value)} placeholder="Enter Company Name" />
              </label>

              <label className="checkout-field checkout-field--full">
                <span>Street Address *</span>
                <input ref={registerFieldRef("shippingAddress")} className="field" value={form.shippingAddress} onChange={(event) => updateField("shippingAddress", event.target.value)} placeholder="Enter Street Address" required />
              </label>

              <label className="checkout-field">
                <span>City *</span>
                <input ref={registerFieldRef("shippingCity")} className="field" value={form.shippingCity} onChange={(event) => updateField("shippingCity", event.target.value)} placeholder="Select City" required />
              </label>

              <label className="checkout-field">
                <span>State / Region *</span>
                <select ref={registerFieldRef("deliveryRegion")} className="field" value={form.deliveryRegion} onChange={(event) => updateField("deliveryRegion", event.target.value)} required>
                  <option value="">Select Region</option>
                  {GHANA_REGIONS.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </label>

              <label className="checkout-field">
                <span>Phone *</span>
                <input ref={registerFieldRef("mobileNumber")} className="field" value={form.mobileNumber} onChange={(event) => updateField("mobileNumber", event.target.value)} placeholder="Enter Phone Number" required />
              </label>

              <label className="checkout-field checkout-field--full">
                <span>Email *</span>
                <input ref={registerFieldRef("shippingEmail")} className="field" type="email" value={form.shippingEmail} onChange={(event) => updateField("shippingEmail", event.target.value)} placeholder="Enter Email Address" required />
              </label>

              <label className="checkout-field checkout-field--full">
                <span>Affiliate Code</span>
                <input
                  ref={registerFieldRef("affiliateCode")}
                  className={`field ${affiliateState.status === "invalid" ? "field--invalid" : ""} ${affiliateState.status === "valid" ? "field--valid" : ""}`}
                  value={form.affiliateCode}
                  onChange={(event) => updateField("affiliateCode", event.target.value.toUpperCase())}
                  placeholder="Enter Affiliate Code"
                />
                {affiliateState.message ? (
                  <small className={`checkout-affiliate__status is-${affiliateState.status}`}>
                    {affiliateState.message}
                    {affiliateState.status === "valid" && affiliateState.commissionRate ? ` (${affiliateState.commissionRate}% commission link active)` : ""}
                  </small>
                ) : null}
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
                  <input ref={registerFieldRef("billingAddress")} className="field" value={form.billingAddress} onChange={(event) => updateField("billingAddress", event.target.value)} placeholder="Enter Billing Address" />
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
