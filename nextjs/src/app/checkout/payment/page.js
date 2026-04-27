"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import StableImage from "@/components/ui/stable-image";
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
  const PROCESSING_FLOOR_MS = 1800;
  const SUCCESS_FLOOR_MS = 3000;
  const HUBTEL_POLL_INTERVAL_MS = 2500;
  const HUBTEL_MAX_WAIT_MS = 10 * 60 * 1000;
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { token, isAuthenticated } = useAuth();
  const { pushToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [transitionStage, setTransitionStage] = useState("idle");
  const [proofUploading, setProofUploading] = useState(false);
  const [hubtelModalOpen, setHubtelModalOpen] = useState(false);
  const [hubtelCheckoutUrl, setHubtelCheckoutUrl] = useState("");
  const [hubtelClientReference, setHubtelClientReference] = useState("");
  const [hubtelStatusToken, setHubtelStatusToken] = useState("");
  const [hubtelWaiting, setHubtelWaiting] = useState(false);
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
    paymentFlow: "manual",
    paymentProofUrl: "",
    paymentProofName: "",
    paymentProofStorage: "",
    discountCode: "",
    discountPercent: 0,
    discountAmount: 0,
    clientOrderRef: "",
  });
  const [ready, setReady] = useState(false);
  const hubtelFinalizedRef = useRef(false);
  const submitLockRef = useRef(false);

  function buildEstimatedDelivery(dateInput) {
    const base = new Date(dateInput || Date.now());
    return new Date(base.getTime() + 24 * 60 * 60 * 1000).toISOString();
  }

  useEffect(() => {
    router.prefetch?.("/order-completed");
  }, [router]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem("deetech-hubtel-pending");
    if (!raw) return;
    try {
      const pending = JSON.parse(raw);
      const pendingRef = String(pending?.clientOrderRef || "").trim();
      const pendingStatusToken = String(pending?.statusToken || "").trim();
      const awaitingAutoHubtel = Boolean(pending?.awaitingAutoHubtel);
      if (!pendingRef || !pendingStatusToken || !awaitingAutoHubtel) {
        window.localStorage.removeItem("deetech-hubtel-pending");
        return;
      }
      setHubtelClientReference(pendingRef);
      setHubtelStatusToken(pendingStatusToken);
      setHubtelWaiting(true);
      setTransitionStage("processing");
      setForm((current) => ({
        ...current,
        paymentMethod: "hubtel",
        paymentFlow: "auto",
      }));
    } catch {
      window.localStorage.removeItem("deetech-hubtel-pending");
    }
  }, []);

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
    if (String(form.clientOrderRef || "").trim()) return;
    setForm((current) => {
      if (String(current.clientOrderRef || "").trim()) return current;
      return {
        ...current,
        clientOrderRef: buildClientOrderRef(),
      };
    });
  }, [form.clientOrderRef, ready]);

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
  const couponDiscount =
    Number(form.discountAmount || 0) > 0
      ? Number(form.discountAmount || 0)
      : (subtotal * Number(form.discountPercent || 0)) / 100;
  const total = Math.max(0, subtotal + shipping + taxes - couponDiscount);
  const manualPaymentMethods = PAYMENT_METHODS;
  const hubtelPaymentMethod =
    PAYMENT_METHODS.find((method) => method.id === "hubtel") || PAYMENT_METHODS[0];
  const activeManualPaymentMethod =
    manualPaymentMethods.find((method) => method.id === form.paymentMethod) ||
    manualPaymentMethods[0] ||
    PAYMENT_METHODS[0];
  const isHubtelMethod = form.paymentMethod === "hubtel";
  const isAutoFlow = isHubtelMethod && form.paymentFlow === "auto";
  const isManualFlow = !isAutoFlow;
  const submitDisabled =
    submitting ||
    (isManualFlow && proofUploading);

  function closeHubtelModal() {
    setHubtelModalOpen(false);
    setHubtelCheckoutUrl("");
  }

  async function finalizePaidHubtelOrder(order, fallbackReference = "") {
    const ref = String(order?._id || fallbackReference || "").trim();
    if (!ref) return;

    const pendingRaw =
      typeof window !== "undefined"
        ? window.localStorage.getItem("deetech-hubtel-pending")
        : null;
    let pending = null;
    try {
      pending = pendingRaw ? JSON.parse(pendingRaw) : null;
    } catch {
      pending = null;
    }

    writeLastOrder({
      reference: ref,
      orderId: ref,
      transactionId: String(order?.clientOrderRef || fallbackReference || "").trim(),
      date: order?.createdAt || new Date().toISOString(),
      estimatedDeliveryDate: buildEstimatedDelivery(order?.paidAt || order?.createdAt),
      paymentMethod: order?.paymentMethod || "hubtel",
      total: Number(order?.totalPrice || 0),
      subtotal:
        Number(order?.discountAmount || 0) > 0
          ? Number(order?.totalPrice || 0) + Number(order?.discountAmount || 0)
          : Number(order?.totalPrice || 0),
      shipping: 0,
      discountCode: String(order?.discountCode || pending?.discountCode || "").trim().toUpperCase(),
      discountPercent: Number(order?.discountPercent || pending?.discountPercent || 0),
      discountAmount: Number(order?.discountAmount || pending?.discountAmount || 0),
      items: Array.isArray(order?.orderItems)
        ? order.orderItems.map((item) => ({
            name: item?.product?.name || "Product",
            category: item?.product?.category || "Product",
            quantity: Number(item?.qty || 0),
            qty: Number(item?.qty || 0),
            price: Number(item?.price || 0),
            image: item?.product?.images?.[0] || item?.product?.image || "",
          }))
        : Array.isArray(pending?.items)
          ? pending.items
          : [],
      email: order?.shippingEmail || order?.guestEmail || pending?.email || "",
      phone: order?.mobileNumber || pending?.phone || "",
      address: order?.shippingAddress || order?.guestAddress || pending?.address || "",
      city: order?.shippingCity || order?.guestCity || pending?.city || "",
    });

    clearCheckoutDraft();
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("deetech-hubtel-pending");
      window.sessionStorage.setItem("deetech-order-complete-animate", "1");
      window.sessionStorage.setItem("deetech-order-complete-pending", "1");
    }
    setHubtelModalOpen(false);
    setHubtelCheckoutUrl("");
    setHubtelWaiting(false);
    setHubtelClientReference("");
    setHubtelStatusToken("");
    clearCart();
    router.replace("/order-completed");
  }

  function continueToHubtelCheckout() {
    if (!hubtelCheckoutUrl) {
      pushToast("Hubtel checkout link is missing. Please try again.", "error");
      return;
    }
    if (typeof window === "undefined") return;
    const popup = window.open(hubtelCheckoutUrl, "_blank", "noopener,noreferrer");
    if (!popup) {
      pushToast("Popup blocked. Allow popups, then tap continue again.", "warning");
      return;
    }
    closeHubtelModal();
    setHubtelWaiting(true);
    setTransitionStage("processing");
    pushToast("Hubtel checkout opened in a new tab.", "success");
  }

  useEffect(() => {
    if (!hubtelClientReference || !hubtelStatusToken || hubtelFinalizedRef.current) return;
    let ignore = false;

    async function pollHubtelStatus() {
      const startedAt = Date.now();
      while (!ignore && !hubtelFinalizedRef.current && Date.now() - startedAt < HUBTEL_MAX_WAIT_MS) {
        try {
          const result = await requestJson(
            `/api/orders/hubtel/status/${encodeURIComponent(hubtelClientReference)}?token=${encodeURIComponent(hubtelStatusToken)}`,
            { retries: 1 }
          );
          const paymentStatus = String(result?.paymentStatus || "").toLowerCase();
          if (paymentStatus === "paid" && result?.order) {
            hubtelFinalizedRef.current = true;
            await finalizePaidHubtelOrder(result.order, hubtelClientReference);
            return;
          }
          if (paymentStatus === "failed") {
            setHubtelWaiting(false);
            setTransitionStage("idle");
            pushToast("Hubtel payment failed. Please retry payment.", "warning");
            return;
          }
        } catch (error) {
          if (Number(error?.status || 0) === 404) {
            if (typeof window !== "undefined") {
              window.localStorage.removeItem("deetech-hubtel-pending");
            }
            setHubtelWaiting(false);
            setTransitionStage("idle");
            setHubtelClientReference("");
            setHubtelStatusToken("");
            return;
          }
          // Keep polling through transient network/backend issues.
        }

        await new Promise((resolve) => window.setTimeout(resolve, HUBTEL_POLL_INTERVAL_MS));
      }

      if (!ignore && !hubtelFinalizedRef.current) {
        setHubtelWaiting(false);
        setTransitionStage("idle");
        pushToast("Payment check timed out. You can retry or refresh shortly.", "warning");
      }
    }

    pollHubtelStatus();
    return () => {
      ignore = true;
    };
  }, [hubtelClientReference, hubtelStatusToken, pushToast]);

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
    if (submitLockRef.current || submitting) {
      return;
    }

    if (!items.length) {
      pushToast("Your cart is empty", "warning");
      return;
    }

    if (!form.paymentMethod) {
      pushToast("Please choose a payment method", "warning");
      focusField("paymentMethod");
      return;
    }

    if (isManualFlow && proofUploading) {
      pushToast("Please wait for the payment proof upload to finish", "info");
      return;
    }

    if (isManualFlow && !form.paymentProofUrl) {
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

    const clientOrderRef = String(form.clientOrderRef || "").trim() || buildClientOrderRef();
    if (!String(form.clientOrderRef || "").trim()) {
      setForm((current) => ({ ...current, clientOrderRef }));
    }
    const shippingName = [form.firstName, form.lastName].filter(Boolean).join(" ").trim();
    const selectedPaymentMethodId = form.paymentMethod;
    const commonPayload = {
      orderItems,
      paymentMethod: selectedPaymentMethodId,
      paymentFlow: isAutoFlow ? "auto" : "manual",
      deliveryRegion: form.deliveryRegion,
      mobileNumber: form.mobileNumber.trim(),
      frontendOrigin:
        typeof window !== "undefined" ? window.location.origin : undefined,
      clientOrderRef,
      paymentScreenshotUrl: isAutoFlow ? "" : form.paymentProofUrl,
      discountCode: String(form.discountCode || "").trim().toUpperCase() || undefined,
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

    submitLockRef.current = true;
    setSubmitting(true);
    hubtelFinalizedRef.current = false;
    setTransitionStage("processing");
    const processingStart = Date.now();
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
      const checkoutUrl = String(result?.checkoutUrl || order?.paymentGatewayCheckoutUrl || "").trim();
      const statusToken = String(result?.statusToken || "").trim();

      if (isAutoFlow) {
        if (!checkoutUrl) {
          throw new Error("Unable to start Hubtel checkout. Please try again.");
        }
        if (!statusToken) {
          throw new Error("Unable to verify Hubtel payment status. Please try again.");
        }
        const orderRef = String(order?.clientOrderRef || clientOrderRef || "").trim();
        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            "deetech-hubtel-pending",
            JSON.stringify({
              clientOrderRef: orderRef,
              statusToken,
              orderId: result?.orderId || order?._id || "",
              paymentMethod: selectedPaymentMethodId,
              subtotal,
              shipping,
              taxes,
              awaitingAutoHubtel: true,
              discountCode: String(order?.discountCode || form.discountCode || "").trim().toUpperCase(),
              discountPercent: Number(order?.discountPercent || form.discountPercent || 0),
              discountAmount: Number(order?.discountAmount || couponDiscount || 0),
              email: form.shippingEmail,
              phone: form.mobileNumber,
              address: form.shippingAddress,
              city: form.shippingCity,
              items: items.map((item) => ({
                name: item.name,
                category: item.category || item.categoryName || "Product",
                quantity: item.qty,
                qty: item.qty,
                price: Number(item.price || 0),
                image: item.image || "",
              })),
            })
          );
        }
        setHubtelClientReference(orderRef);
        setHubtelStatusToken(statusToken);
        setHubtelWaiting(false);
        setTransitionStage("idle");
        setHubtelCheckoutUrl(checkoutUrl);
        setHubtelModalOpen(true);
        pushToast("Hubtel checkout is ready. Continue from the popup menu.", "success");
        return;
      }

      writeLastOrder({
        reference: result?.orderId || order?._id || clientOrderRef,
        orderId: result?.orderId || order?._id || clientOrderRef,
        transactionId: clientOrderRef,
        date: order?.createdAt || new Date().toISOString(),
        estimatedDeliveryDate: buildEstimatedDelivery(order?.paidAt || order?.createdAt),
        paymentMethod: selectedPaymentMethodId,
        total: Number(order?.totalPrice || total),
        subtotal:
          Number(order?.discountAmount || 0) > 0
            ? Number(order?.totalPrice || 0) + Number(order?.discountAmount || 0)
            : subtotal,
        shipping,
        discountCode: String(order?.discountCode || form.discountCode || "").trim().toUpperCase(),
        discountPercent: Number(order?.discountPercent || form.discountPercent || 0),
        discountAmount: Number(order?.discountAmount || couponDiscount || 0),
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
      pushToast("Order placed successfully", "success");
      const processingElapsed = Date.now() - processingStart;
      if (processingElapsed < PROCESSING_FLOOR_MS) {
        await new Promise((resolve) =>
          window.setTimeout(resolve, PROCESSING_FLOOR_MS - processingElapsed)
        );
      }
      setTransitionStage("success");
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("deetech-order-complete-animate", "1");
        window.sessionStorage.setItem("deetech-order-complete-pending", "1");
        await new Promise((resolve) =>
          window.requestAnimationFrame(() =>
            window.requestAnimationFrame(resolve)
          )
        );
      }
      await new Promise((resolve) => window.setTimeout(resolve, SUCCESS_FLOOR_MS));
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
      clearCart();
      router.push("/order-completed");
    } catch (error) {
      setTransitionStage("idle");
      console.error("Checkout order error:", error);
      pushToast(error.message || "Unable to place order", "error");
    } finally {
      submitLockRef.current = false;
      setSubmitting(false);
    }
  }

  if (!items.length && transitionStage === "idle") {
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
      {transitionStage !== "idle" ? (
        <div
          className={
            transitionStage === "success"
              ? "checkout-success-transition checkout-success-transition--success"
              : "checkout-success-transition"
          }
          aria-live="polite"
        >
          <div className="checkout-success-transition__halo" aria-hidden="true" />
          <div className="checkout-success-transition__card">
            <div
              className={
                transitionStage === "success"
                  ? "checkout-success-transition__badge checkout-success-transition__badge--success"
                  : "checkout-success-transition__badge"
              }
              aria-hidden="true"
            >
              {transitionStage === "success" ? (
                <span className="checkout-success-transition__celebration">
                  <span className="checkout-success-transition__burst" />
                  <span className="checkout-success-transition__cone" />
                </span>
              ) : (
                <span className="checkout-success-transition__spinner" />
              )}
            </div>
            <strong className="checkout-success-transition__title">
              {transitionStage === "success" ? "Thank you for your purchase" : "Processing your order"}
            </strong>
            <p className="checkout-success-transition__message">
              {transitionStage === "success"
                ? "Everything is set. Your order is underway and we are preparing your completed receipt."
                : hubtelWaiting
                  ? "Waiting for Hubtel payment confirmation. Once paid, we will automatically complete your order and redirect you."
                  : "Please hold on while we validate your payment, save your order, and prepare your completion page."}
            </p>
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
              {manualPaymentMethods.map((method) => (
                <button
                  key={method.id}
                  ref={method.id === form.paymentMethod ? registerFieldRef("paymentMethod") : undefined}
                  type="button"
                  className={method.id === form.paymentMethod ? "checkout-payment__option is-active" : "checkout-payment__option"}
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      paymentMethod: method.id,
                      paymentFlow: method.id === "hubtel" ? current.paymentFlow : "manual",
                    }))
                  }
                >
                  <span className="checkout-payment__radio" aria-hidden="true" />
                  <StableImage
                    src={method.logo}
                    alt={method.label}
                    className="checkout-payment__logo"
                    width={72}
                    height={72}
                  />
                  <span className="checkout-payment__copy">
                    <strong>{method.label}</strong>
                    <small>{method.helper}</small>
                  </span>
                </button>
              ))}

              {isHubtelMethod ? (
                <section className="checkout-payment__flow-options">
                  <h3>Hubtel Option</h3>
                  <div className="checkout-payment__flow-grid">
                    <button
                      ref={registerFieldRef("paymentFlow")}
                      type="button"
                      className={isManualFlow ? "checkout-payment__flow is-active" : "checkout-payment__flow"}
                      onClick={() => setForm((current) => ({ ...current, paymentFlow: "manual" }))}
                    >
                      <strong>Hubtel Manual</strong>
                      <small>Use Hubtel details and upload payment proof.</small>
                    </button>
                    <button
                      type="button"
                      className={isAutoFlow ? "checkout-payment__flow is-active" : "checkout-payment__flow"}
                      onClick={() => setForm((current) => ({ ...current, paymentFlow: "auto" }))}
                    >
                      <strong>Hubtel Automatic</strong>
                      <small>Pay on secure Hubtel checkout. No proof upload required.</small>
                    </button>
                  </div>
                </section>
              ) : null}
            </div>

            <div className="checkout-payment__details">
              {isAutoFlow ? (
                <section className="checkout-payment__auto-card">
                  <div className="checkout-payment__auto-head">
                    <StableImage
                      src={hubtelPaymentMethod.logo}
                      alt={hubtelPaymentMethod.label}
                      className="checkout-payment__logo checkout-payment__logo--large"
                      width={84}
                      height={84}
                    />
                    <div>
                      <h3>Hubtel Automatic Checkout</h3>
                      <p>
                        You are about to pay securely with Hubtel. After confirmation, we will redirect you to Hubtel to complete payment instantly.
                      </p>
                    </div>
                  </div>
                  <div className="checkout-payment__auto-steps">
                    <div>1. Confirm total and tap <strong>Continue to Hubtel</strong>.</div>
                    <div>2. Complete payment on the secure Hubtel screen.</div>
                    <div>3. Return automatically and we finalize your order.</div>
                  </div>
                  <p className="checkout-payment__auto-note checkout-payment__auto-note--strong">
                    No screenshot is needed in automatic mode.
                  </p>
                </section>
              ) : null}

              {isManualFlow ? (
                <>
                  <div className="checkout-payment__instruction-card">
                    <div className="checkout-payment__instruction-head">
                      <StableImage
                        src={activeManualPaymentMethod.logo}
                        alt={activeManualPaymentMethod.label}
                        className="checkout-payment__logo checkout-payment__logo--large"
                        width={84}
                        height={84}
                      />
                      <div>
                        <h3>{activeManualPaymentMethod.label}</h3>
                        <p>Use the exact DEETECH payment details below, then upload your transaction screenshot.</p>
                      </div>
                    </div>
                    <div className="checkout-payment__instruction-grid">
                      {activeManualPaymentMethod.lines.map((line) => (
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
                          <StableImage
                            src={resolveProductImage(form.paymentProofUrl)}
                            alt={form.paymentProofName || "Payment proof"}
                            width={120}
                            height={120}
                          />
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
                </>
              ) : null}
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
                <strong>{isAutoFlow ? "Hubtel (Automatic Checkout)" : activeManualPaymentMethod.label}</strong>
              </div>
              <div className="checkout-summary__line">
                <span>Proof Upload</span>
                <strong>
                  {isAutoFlow
                      ? "Not required"
                      : form.paymentProofUrl
                        ? "Uploaded"
                        : "Required"}
                </strong>
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
                  disabled={submitDisabled}
                >
                  {submitting
                    ? "Confirming Order..."
                    : isAutoFlow
                        ? "Prepare Hubtel Checkout"
                        : "Confirm Payment"}
                </button>
              <p className="checkout-summary__note">
                {isAutoFlow
                  ? "You will complete payment on Hubtel secure checkout and return automatically."
                  : "Manual payment plus proof upload completes the order."}
              </p>
            </div>
            <div className="checkout-summary__items">
              {items.map((item) => (
                <article key={item.productId || item._id} className="checkout-summary__item">
                  <div className="checkout-summary__thumb">
                    {resolveProductImage(item.image) ? (
                      <StableImage
                        src={resolveProductImage(item.image)}
                        alt={item.name}
                        width={96}
                        height={96}
                      />
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

      {hubtelModalOpen ? (
        <div className="checkout-hubtel-modal" role="dialog" aria-modal="true" aria-labelledby="hubtelModalTitle">
          <div className="checkout-hubtel-modal__backdrop" onClick={closeHubtelModal} />
          <section className="checkout-hubtel-modal__card">
            <button
              type="button"
              className="checkout-hubtel-modal__close"
              aria-label="Close Hubtel checkout menu"
              onClick={closeHubtelModal}
            >
              ×
            </button>
            <h2 id="hubtelModalTitle">Hubtel Checkout Ready</h2>
            <p>
              Continue to Hubtel secure checkout in a new tab. When payment is completed, you can return here safely.
            </p>
            <div className="checkout-hubtel-modal__actions">
              <button type="button" className="checkout-summary__button" onClick={continueToHubtelCheckout}>
                Continue to Hubtel
              </button>
              <button type="button" className="checkout-payment__secondary" onClick={closeHubtelModal}>
                Cancel
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
