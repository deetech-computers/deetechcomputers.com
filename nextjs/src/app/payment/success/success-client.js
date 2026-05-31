"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { API_BASE_ORDERS } from "@/lib/config";
import { requestJson } from "@/lib/http";
import { clearCompletedCheckoutState } from "@/lib/checkout";
import { getLinePricing } from "@/lib/order-line-pricing";
import { writeLastOrder } from "@/lib/order-confirmation";

function buildEstimatedDelivery(dateInput) {
  const base = new Date(dateInput || Date.now());
  return new Date(base.getTime() + 24 * 60 * 60 * 1000).toISOString();
}

function buildSavedOrderItem(item) {
  const pricing = getLinePricing(item);
  return {
    name: item?.product?.name || item?.name || "Product",
    category: item?.product?.category || item?.category || "Product",
    quantity: Number(item?.qty || item?.quantity || 0),
    qty: Number(item?.qty || item?.quantity || 0),
    price: pricing.currentUnitPrice,
    originalPrice: pricing.originalUnitPrice,
    discountPrice: pricing.discountUnitPrice,
    discountApplied: pricing.hasDiscount,
    image: item?.product?.images?.[0] || item?.product?.image || item?.image || "",
  };
}

function readFirstParam(params, keys) {
  for (const key of keys) {
    const value = String(params.get(key) || "").trim();
    if (value) return value;
  }
  return "";
}

export default function HubtelPaymentSuccessClient() {
  const router = useRouter();
  const params = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("Confirming your payment...");

  const clientReference = useMemo(
    () =>
      readFirstParam(params, [
        "clientReference",
        "ClientReference",
        "client_reference",
        "reference",
      ]),
    [params]
  );
  const statusToken = useMemo(
    () => readFirstParam(params, ["statusToken", "StatusToken", "status_token", "token"]),
    [params]
  );
  const returnToken = useMemo(
    () => readFirstParam(params, ["returnToken", "ReturnToken", "return_token"]),
    [params]
  );

  useEffect(() => {
    let ignore = false;

    async function finalize() {
      if (!clientReference || !statusToken) {
        setStatus("error");
        setMessage("Missing secure payment verification details. Please contact support.");
        return;
      }

      const startedAt = Date.now();
      const maxWaitMs = 120 * 1000;
      const delayMs = 2500;

      async function completePaidOrder(order) {
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
          reference: order?._id || clientReference,
          orderId: order?._id || clientReference,
          transactionId: clientReference,
          date: order?.createdAt || new Date().toISOString(),
          estimatedDeliveryDate: buildEstimatedDelivery(order?.paidAt || order?.createdAt),
          paymentMethod: order?.paymentMethod || "hubtel",
          total: Number(order?.totalPrice || 0),
          subtotal: Number(order?.itemsPrice || 0),
          shipping: Number(order?.shippingPrice || 0),
          discountCode: String(order?.discountCode || pending?.discountCode || "").trim().toUpperCase(),
          discountPercent: Number(order?.discountPercent || pending?.discountPercent || 0),
          discountAmount: Number(order?.discountAmount || pending?.discountAmount || 0),
          items: Array.isArray(order?.orderItems)
            ? order.orderItems.map((item) => buildSavedOrderItem(item))
            : Array.isArray(pending?.items)
              ? pending.items
              : [],
          email: order?.shippingEmail || order?.guestEmail || pending?.email || "",
          phone: order?.mobileNumber || pending?.phone || "",
          address: order?.shippingAddress || order?.guestAddress || pending?.address || "",
          city: order?.shippingCity || order?.guestCity || pending?.city || "",
        });

        if (typeof window !== "undefined") {
          clearCompletedCheckoutState();
          window.localStorage.removeItem("deetech-hubtel-pending");
          window.sessionStorage.setItem("deetech-order-complete-animate", "1");
          window.sessionStorage.setItem("deetech-order-complete-pending", "1");
        }

        clearCart();
        setStatus("success");
        setMessage("Payment confirmed. Taking you to your receipt...");
        router.replace("/order-completed");
      }

      while (!ignore && Date.now() - startedAt < maxWaitMs) {
        try {
          const result = await requestJson(
            `${API_BASE_ORDERS}/hubtel/status/${encodeURIComponent(clientReference)}?token=${encodeURIComponent(statusToken)}`
          );
          const order = result?.order;
          const paymentStatus = String(result?.paymentStatus || "").trim().toLowerCase();
          if (paymentStatus === "paid" && order) {
            await completePaidOrder(order);
            return;
          }
          if (paymentStatus === "failed") {
            setStatus("error");
            setMessage("Hubtel did not complete this payment. Please retry checkout or contact support if you were debited.");
            return;
          }
          if (returnToken) {
            const confirmed = await requestJson(
              `${API_BASE_ORDERS}/hubtel/return/${encodeURIComponent(clientReference)}?token=${encodeURIComponent(statusToken)}`,
              {
                method: "POST",
                body: JSON.stringify({ returnToken }),
              }
            );
            const confirmedStatus = String(confirmed?.paymentStatus || "").trim().toLowerCase();
            if (confirmedStatus === "paid" && confirmed?.order) {
              await completePaidOrder(confirmed.order);
              return;
            }
          }
        } catch {
          // keep polling for transient network/backend states
        }

        await new Promise((resolve) => window.setTimeout(resolve, delayMs));
      }

      if (!ignore) {
        setStatus("pending");
        setMessage("Payment confirmation is taking longer than expected. Please refresh this check or contact support if you were debited.");
      }
    }

    finalize();
    return () => {
      ignore = true;
    };
  }, [clearCart, clientReference, returnToken, router, statusToken]);

  return (
    <main className="shell page-section">
      <section className="panel cart-empty">
        <h1>
          {status === "error"
            ? "Payment Needs Attention"
            : status === "pending"
              ? "Still Confirming Payment"
              : "Finalizing Payment"}
        </h1>
        <p className="hero-copy">{message}</p>
        {status === "pending" || status === "error" ? (
          <div className="hero-actions">
            <button type="button" className="primary-link" onClick={() => window.location.reload()}>
              Check again
            </button>
            <button type="button" className="ghost-button" onClick={() => router.replace("/account")}>
              Open my account
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
}
