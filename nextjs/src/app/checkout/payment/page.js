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
import {
  PAYMENT_METHODS,
  buildClientOrderRef,
  buildOrderItems,
  clearCheckoutDraft,
  isPhaseOneComplete,
  readCheckoutDraft,
  writeCheckoutDraft,
} from "@/lib/checkout";
import { requestJson } from "@/lib/http";
import { requestWithToken } from "@/lib/resource";

export default function CheckoutPaymentPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { token, isAuthenticated } = useAuth();
  const { pushToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [rewarding, setRewarding] = useState(false);
  const [proofUploading, setProofUploading] = useState(false);
  const [affiliateState, setAffiliateState] = useState({
    status: "idle",
    message: "",
    ownerName: "",
    commissionRate: 0,
  });
  const fieldRefs = useRef({});
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    shippingAddress: "",
    shippingCity: "",
    deliveryRegion: "",
    mobileNumber: "",
    shippingEmail: "",
    affiliateCode: "",
    useShippingForBilling: true,
    billingAddress: "",
    paymentMethod: "mtn",
    paymentProofUrl: "",
    paymentProofName: "",
    paymentProofStorage: "",
    clientOrderRef: "",
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const draft = readCheckoutDraft();
    if (!draft || !isPhaseOneComplete(draft)) {
      pushToast("Please complete phase one before payment", "warning");
      router.replace("/checkout");
      return;
    }
    setForm((current) => ({ ...current, ...draft }));
    setReady(true);
  }, [pushToast, router]);

  useEffect(() => {
    if (!ready) return;
    writeCheckoutDraft(form);
  }, [form, ready]);

  useEffect(() => {
    if (!ready) return;
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
  }, [form.affiliateCode, ready]);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.qty || 0), 0),
    [items]
  );
  const shipping = 0;
  const taxes = 0;
  const total = subtotal + shipping + taxes;
  const activePaymentMethod =
    PAYMENT_METHODS.find((method) => method.id === form.paymentMethod) || PAYMENT_METHODS[0];

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

    if (String(form.affiliateCode || "").trim() && affiliateState.status === "invalid") {
      pushToast("Please fix the affiliate code before confirming", "warning");
      router.push("/checkout");
      return;
    }

    const orderItems = buildOrderItems(items);
    if (!orderItems.length) {
      pushToast("Your cart items are not ready for checkout", "warning");
      return;
    }

    const clientOrderRef = form.clientOrderRef || buildClientOrderRef();
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
        orderId: result?.orderId || order?._id || clientOrderRef,
        transactionId: clientOrderRef,
        date: order?.createdAt || new Date().toISOString(),
        estimatedDeliveryDate: new Date(
          new Date(order?.createdAt || Date.now()).getTime() + 3 * 24 * 60 * 60 * 1000
        ).toISOString(),
        paymentMethod: form.paymentMethod,
        total: Number(order?.totalPrice || total),
        subtotal,
        shipping,
        items: items.map((item) => ({
          name: item.name,
          category: item.category || item.categoryName || "Product",
          quantity: item.qty,
          qty: item.qty,
          price: Number(item.price || 0),
          image: item.image || "",
        })),
        email: form.shippingEmail,
        phone: form.mobileNumber,
        address: form.shippingAddress,
        city: form.shippingCity,
      });

      clearCheckoutDraft();
      clearCart();
      pushToast("Order placed successfully", "success");
      setRewarding(true);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("deetech-order-complete-animate", "1");
      }
      await new Promise((resolve) => window.setTimeout(resolve, 1400));
      router.push("/order-completed");
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

  if (!ready) {
    return (
      <main className="shell page-section">
        <section className="panel cart-empty">
          <h2>Preparing payment step...</h2>
          <p className="hero-copy">Checking your checkout details.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="shell page-section">
      {rewarding ? (
        <div className="checkout-success-transition" aria-live="polite">
          <div className="checkout-success-transition__halo" aria-hidden="true" />
          <div className="checkout-success-transition__card">
            <div className="checkout-success-transition__check" aria-hidden="true">{"\u2713"}</div>
            <strong>Payment confirmed</strong>
            <p>Your order is being wrapped up beautifully.</p>
          </div>
        </div>
      ) : null}

      <section className="checkout-hero">
        <h1>Checkout</h1>
        <p className="checkout-hero__crumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/cart">Shopping Cart</Link>
          <span>/</span>
          <Link href="/checkout">Checkout</Link>
          <span>/</span>
          <span>Payment</span>
        </p>
      </section>

      <section className="checkout-shell">
        <div className="checkout-layout">
          <section className="checkout-form panel">
            <div className="checkout-form__header">
              <h2>Select Payment Method</h2>
              <p>Phase two uses your saved billing details. Refresh will keep both steps active until the order is submitted.</p>
            </div>

            <section className="checkout-customer-card">
              <div className="checkout-customer-grid">
                <div><span>Name</span><strong>{[form.firstName, form.lastName].filter(Boolean).join(" ")}</strong></div>
                <div><span>Email</span><strong>{form.shippingEmail}</strong></div>
                <div><span>Phone</span><strong>{form.mobileNumber}</strong></div>
                <div><span>Region</span><strong>{form.deliveryRegion}</strong></div>
                <div className="checkout-customer-grid__full"><span>Address</span><strong>{form.shippingAddress}, {form.shippingCity}</strong></div>
              </div>
              <Link href="/checkout" className="checkout-payment__secondary checkout-payment__secondary--inline">Edit billing details</Link>
            </section>

            <div className="checkout-payment__methods">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  ref={method.id === form.paymentMethod ? registerFieldRef("paymentMethod") : undefined}
                  type="button"
                  className={method.id === form.paymentMethod ? "checkout-payment__option is-active" : "checkout-payment__option"}
                  onClick={() => setForm((current) => ({ ...current, paymentMethod: method.id }))}
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
              <div className="checkout-summary__line">
                <span>Payment Method</span>
                <strong>{activePaymentMethod.label}</strong>
              </div>
              <div className="checkout-summary__line">
                <span>Proof Upload</span>
                <strong>{form.paymentProofUrl ? "Uploaded" : "Required"}</strong>
              </div>
            </div>
            <div className="checkout-summary__total">
              <span>Total</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
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
