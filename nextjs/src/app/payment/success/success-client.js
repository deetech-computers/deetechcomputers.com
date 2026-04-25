"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { requestJson } from "@/lib/http";
import { writeLastOrder } from "@/lib/order-confirmation";

function buildEstimatedDelivery(dateInput) {
  const base = new Date(dateInput || Date.now());
  return new Date(base.getTime() + 24 * 60 * 60 * 1000).toISOString();
}

export default function HubtelPaymentSuccessClient() {
  const router = useRouter();
  const params = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("Confirming your payment...");

  const clientReference = useMemo(
    () => String(params.get("clientReference") || "").trim(),
    [params]
  );
  const statusToken = useMemo(
    () => String(params.get("statusToken") || "").trim(),
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
      const maxWaitMs = 60 * 1000;
      const delayMs = 2500;

      while (!ignore && Date.now() - startedAt < maxWaitMs) {
        try {
          const result = await requestJson(
            `/api/orders/hubtel/status/${encodeURIComponent(clientReference)}?token=${encodeURIComponent(statusToken)}`
          );
          const order = result?.order;
          if (result?.paymentStatus === "paid" && order) {
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

            if (typeof window !== "undefined") {
              window.localStorage.removeItem("deetech-hubtel-pending");
              window.sessionStorage.setItem("deetech-order-complete-animate", "1");
              window.sessionStorage.setItem("deetech-order-complete-pending", "1");
            }

            clearCart();
            router.replace("/order-completed");
            return;
          }
        } catch {
          // keep polling for transient network/backend states
        }

        await new Promise((resolve) => window.setTimeout(resolve, delayMs));
      }

      if (!ignore) {
        setStatus("pending");
        setMessage("Payment confirmation is taking longer than expected. Please check your orders shortly.");
      }
    }

    finalize();
    return () => {
      ignore = true;
    };
  }, [clearCart, clientReference, router, statusToken]);

  return (
    <main className="shell page-section">
      <section className="panel cart-empty">
        <h1>{status === "error" ? "Payment Reference Missing" : "Finalizing Payment"}</h1>
        <p className="hero-copy">{message}</p>
      </section>
    </main>
  );
}
