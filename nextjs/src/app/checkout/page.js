"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/providers/toast-provider";
import {
  GHANA_REGIONS,
  isPhaseOneComplete,
  readCheckoutDraft,
  splitName,
  writeCheckoutDraft,
} from "@/lib/checkout";

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCart();
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
    paymentMethod: "mtn",
    paymentProofUrl: "",
    paymentProofName: "",
    paymentProofStorage: "",
    clientOrderRef: "",
  });

  useEffect(() => {
    const draft = readCheckoutDraft();
    if (!draft) return;
    setForm((current) => ({ ...current, ...draft }));
    if (isPhaseOneComplete({ ...form, ...draft })) {
      setPhaseSaved(true);
    }
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
    writeCheckoutDraft(form);
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
        const response = await fetch("/api/affiliates/validate-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload?.message || "Affiliate code not found");
        if (ignore) return;
        setAffiliateState({
          status: "valid",
          message: `Affiliate code linked to ${payload.ownerName}`,
          ownerName: payload.ownerName || "",
          commissionRate: Number(payload.commissionRate || 0),
        });
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
      element.click?.();
    }, 120);
  }

  function validatePhaseOne() {
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
      return false;
    }

    if (String(form.affiliateCode || "").trim()) {
      if (affiliateState.status === "validating") {
        pushToast("Please wait while the affiliate code is being checked", "info");
        focusField("affiliateCode");
        return false;
      }
      if (affiliateState.status !== "valid") {
        pushToast("Please enter a valid affiliate code or clear it", "warning");
        focusField("affiliateCode");
        return false;
      }
    }

    if (!form.useShippingForBilling && !String(form.billingAddress || "").trim()) {
      pushToast("Please provide the billing address", "warning");
      focusField("billingAddress");
      return false;
    }

    return true;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!items.length) {
      pushToast("Your cart is empty", "warning");
      return;
    }

    if (!validatePhaseOne()) return;

    setPhaseSaved(true);
    pushToast("Billing details saved. Moving to payment step.", "success");
    router.push("/checkout/payment");
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
              <p>Phase one collects the customer and delivery details. Payment continues on the next step.</p>
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
            <h2>Step Guide</h2>
            <div className="checkout-summary__lines">
              <div className="checkout-summary__line">
                <span>Step 1</span>
                <strong>Billing details</strong>
              </div>
              <div className="checkout-summary__line">
                <span>Step 2</span>
                <strong>Manual payment</strong>
              </div>
              <div className="checkout-summary__line">
                <span>Saved Draft</span>
                <strong>Active</strong>
              </div>
            </div>
            <div className="checkout-summary__note">
              Your entered details stay saved, so refresh will not clear phase one or phase two.
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
