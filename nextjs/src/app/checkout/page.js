"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/providers/toast-provider";
import { formatCurrency } from "@/lib/format";
import { formatCategoryLabel, resolveProductImage } from "@/lib/products";
import { writeLastOrder } from "@/lib/order-confirmation";
import { requestJson } from "@/lib/http";
import { requestWithToken } from "@/lib/resource";

const CHECKOUT_DRAFT_KEY = "deetech:checkout-draft";
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

const PAYMENT_METHODS = [
  {
    id: "mtn",
    label: "MTN Mobile Money",
    helper: "Merchant and direct MoMo payment",
    logo: "/payment/mtn.svg",
    lines: [
      "Merchant Number (ID): 694988",
      "Merchant Name: Deetek 360 Enterprise (DEETECH COMPUTERS)",
      "MoMo Number: 0591755964",
      "Account Name: Daniel Adjei Mensah (DEETECH COMPUTERS)",
    ],
  },
  {
    id: "vodafone",
    label: "Telecel Cash",
    helper: "Telecel / Vodafone merchant transfer",
    logo: "/payment/telecel.svg",
    lines: [
      "Merchant ID: 451444",
      "Account Name: DEETEK 360 Enterprise (DEETECH COMPUTERS)",
      "Use your Telecel Cash app or shortcode and upload the successful transaction screen.",
    ],
  },
  {
    id: "hubtel",
    label: "Hubtel",
    helper: "Quick shortcode payment",
    logo: "/payment/hubtel.svg",
    lines: [
      "Dial: *713*5964#",
      "Account Name: DEETEK 360 Enterprise (DEETECH COMPUTERS)",
      "After payment, upload the confirmation screen as proof.",
    ],
  },
  {
    id: "bank",
    label: "Bank Transfer",
    helper: "Direct transfer to our business account",
    logo: "/payment/calbank.svg",
    lines: [
      "Bank: CALBANK",
      "Account Number: 1400009398769",
      "Account Name: DEETEK 360 Enterprise (DEETECH COMPUTERS)",
    ],
  },
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

function clearDraft() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CHECKOUT_DRAFT_KEY);
}

function buildClientOrderRef() {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return `dc-${window.crypto.randomUUID()}`;
  }
  return `dc-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function isPhaseOneComplete(form) {
  return [
    form.firstName,
    form.lastName,
    form.shippingAddress,
    form.shippingCity,
    form.deliveryRegion,
    form.mobileNumber,
    form.shippingEmail,
  ].every((value) => String(value || "").trim());
}

function buildOrderItems(items) {
  return items
    .map((item) => ({
      product: String(item.productId || item._id || ""),
      qty: Number(item.qty || 0),
    }))
    .filter((item) => item.product && item.qty > 0);
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user, token, isAuthenticated } = useAuth();
  const { pushToast } = useToast();
  const [phaseSaved, setPhaseSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [proofUploading, setProofUploading] = useState(false);
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
    const draft = readDraft();
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
  const phaseOneReady = useMemo(() => isPhaseOneComplete(form), [form]);
  const canShowPaymentPhase = phaseSaved || phaseOneReady;
  const activePaymentMethod =
    PAYMENT_METHODS.find((method) => method.id === form.paymentMethod) || PAYMENT_METHODS[0];

  function updateField(key, value) {
    setPhaseSaved(false);
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updatePaymentField(key, value) {
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
    pushToast("Billing details saved. Continue with payment method and proof upload.", "success");
    window.setTimeout(() => {
      document.getElementById("checkout-payment-step")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 120);
  }

  async function handleProofUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      pushToast("Please upload an image file for your payment proof", "warning");
      event.target.value = "";
      return;
    }

    const body = new FormData();
    body.append("image", file);

    setProofUploading(true);
    try {
      const result = await requestJson("/api/upload/payment-proof", {
        method: "POST",
        body,
      });

      setForm((current) => ({
        ...current,
        paymentProofUrl: result.imageUrl || "",
        paymentProofName: file.name,
        paymentProofStorage: result.storage || "",
      }));
      pushToast("Payment proof uploaded successfully", "success");
    } catch (error) {
      pushToast(error.message || "Failed to upload payment proof", "error");
    } finally {
      setProofUploading(false);
      event.target.value = "";
    }
  }

  function clearProof() {
    setForm((current) => ({
      ...current,
      paymentProofUrl: "",
      paymentProofName: "",
      paymentProofStorage: "",
    }));
  }

  async function handleConfirmPayment() {
    if (!items.length) {
      pushToast("Your cart is empty", "warning");
      return;
    }

    if (!validatePhaseOne()) return;

    if (!form.paymentMethod) {
      pushToast("Please choose a payment method", "warning");
      focusField("paymentMethod");
      return;
    }

    if (proofUploading) {
      pushToast("Please wait for the payment proof upload to finish", "info");
      return;
    }

    if (!form.paymentProofUrl) {
      pushToast("Please upload your payment proof before confirming", "warning");
      focusField("paymentProof");
      return;
    }

    const orderItems = buildOrderItems(items);
    if (!orderItems.length) {
      pushToast("Your cart items are not ready for checkout", "warning");
      return;
    }

    const clientOrderRef = form.clientOrderRef || buildClientOrderRef();
    if (!form.clientOrderRef) {
      setForm((current) => ({ ...current, clientOrderRef }));
    }

    const shippingName = [form.firstName, form.lastName].filter(Boolean).join(" ").trim();

    const commonPayload = {
      orderItems,
      paymentMethod: form.paymentMethod,
      deliveryRegion: form.deliveryRegion,
      mobileNumber: form.mobileNumber.trim(),
      clientOrderRef,
      paymentScreenshotUrl: form.paymentProofUrl,
      affiliateCode: String(form.affiliateCode || "").trim() || undefined,
    };

    const payload =
      isAuthenticated && token
        ? {
            ...commonPayload,
            shippingName,
            shippingEmail: form.shippingEmail.trim(),
            shippingAddress: form.shippingAddress.trim(),
            shippingCity: form.shippingCity.trim(),
          }
        : {
            ...commonPayload,
            guestName: shippingName,
            guestEmail: form.shippingEmail.trim(),
            guestAddress: form.shippingAddress.trim(),
            guestCity: form.shippingCity.trim(),
          };

    setSubmitting(true);
    try {
      const result =
        isAuthenticated && token
          ? await requestWithToken("/api/orders", token, {
              method: "POST",
              body: JSON.stringify(payload),
            })
          : await requestJson("/api/orders/guest", {
              method: "POST",
              body: JSON.stringify(payload),
            });

      const order = result?.order || {};
      writeLastOrder({
        reference: result?.orderId || order?._id || clientOrderRef,
        date: order?.createdAt || new Date().toISOString(),
        paymentMethod: form.paymentMethod,
        total: Number(order?.totalPrice || total),
        subtotal,
        shipping,
        items: items.map((item) => ({
          name: item.name,
          quantity: item.qty,
          qty: item.qty,
          price: Number(item.price || 0),
        })),
        email: form.shippingEmail,
        phone: form.mobileNumber,
        address: form.shippingAddress,
        city: form.shippingCity,
      });

      clearDraft();
      clearCart();
      pushToast("Order placed successfully", "success");
      router.push("/thankyou");
    } catch (error) {
      pushToast(error.message || "Unable to place order", "error");
    } finally {
      setSubmitting(false);
    }
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

            {canShowPaymentPhase ? (
              <section id="checkout-payment-step" className="checkout-payment">
                <div className="checkout-form__header">
                  <h2>Select Payment Method</h2>
                  <p>Select a manual payment channel, complete the transfer, then upload your proof of payment.</p>
                </div>

                <div className="checkout-payment__methods">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      ref={method.id === form.paymentMethod ? registerFieldRef("paymentMethod") : undefined}
                      type="button"
                      className={method.id === form.paymentMethod ? "checkout-payment__option is-active" : "checkout-payment__option"}
                      onClick={() => updatePaymentField("paymentMethod", method.id)}
                    >
                      <span className="checkout-payment__radio" aria-hidden="true" />
                      <img src={method.logo} alt={method.label} className="checkout-payment__logo" />
                      <span className="checkout-payment__copy">
                        <strong>{method.label}</strong>
                        <small>{method.helper}</small>
                      </span>
                    </button>
                  ))}
                </div>

                <div className="checkout-payment__details">
                  <div className="checkout-payment__instruction-card">
                    <div className="checkout-payment__instruction-head">
                      <img src={activePaymentMethod.logo} alt={activePaymentMethod.label} className="checkout-payment__logo checkout-payment__logo--large" />
                      <div>
                        <h3>{activePaymentMethod.label}</h3>
                        <p>Use the exact DEETECH payment details below, then upload your transaction screenshot.</p>
                      </div>
                    </div>
                    <div className="checkout-payment__instruction-grid">
                      {activePaymentMethod.lines.map((line) => (
                        <div key={line} className="checkout-payment__instruction-block">{line}</div>
                      ))}
                    </div>
                  </div>

                  <div className="checkout-payment__upload-card">
                    <div className="checkout-payment__upload-head">
                      <h3>Upload Proof of Payment</h3>
                      <p>Your order is created only after the payment proof is uploaded and confirmed.</p>
                    </div>

                    {form.paymentProofUrl ? (
                      <div className="checkout-payment__proof-preview">
                        <div className="checkout-payment__proof-thumb">
                          <img src={resolveProductImage(form.paymentProofUrl)} alt={form.paymentProofName || "Payment proof"} />
                        </div>
                        <div className="checkout-payment__proof-meta">
                          <strong>{form.paymentProofName || "Payment proof uploaded"}</strong>
                          <small>{form.paymentProofStorage ? `Stored in ${form.paymentProofStorage}` : "Upload complete"}</small>
                        </div>
                        <button type="button" className="checkout-payment__secondary" onClick={clearProof}>
                          Remove
                        </button>
                      </div>
                    ) : null}

                    <label className="checkout-payment__upload" ref={registerFieldRef("paymentProof")}>
                      <input type="file" accept="image/*" onChange={handleProofUpload} />
                      <span className="checkout-payment__upload-button">
                        {proofUploading ? "Uploading proof..." : form.paymentProofUrl ? "Replace payment proof" : "Upload payment proof"}
                      </span>
                      <small className="checkout-payment__helper">Accepted: screenshot or clear image of the successful payment receipt.</small>
                    </label>
                  </div>
                </div>
              </section>
            ) : null}
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
              {canShowPaymentPhase ? (
                <>
                  <div className="checkout-summary__line">
                    <span>Payment Method</span>
                    <strong>{activePaymentMethod.label}</strong>
                  </div>
                  <div className="checkout-summary__line">
                    <span>Proof Upload</span>
                    <strong>{form.paymentProofUrl ? "Uploaded" : "Required"}</strong>
                  </div>
                </>
              ) : null}
            </div>
            <div className="checkout-summary__total">
              <span>Total</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
            {canShowPaymentPhase ? (
              <div className="checkout-summary__actions">
                <button
                  type="button"
                  className="checkout-summary__button"
                  onClick={handleConfirmPayment}
                  disabled={submitting || proofUploading}
                >
                  {submitting ? "Confirming Order..." : "Confirm Payment"}
                </button>
                <p className="checkout-summary__note">Manual payment plus proof upload completes the order.</p>
              </div>
            ) : null}
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
