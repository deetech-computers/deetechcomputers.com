"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { requestJson } from "@/lib/http";

export default function HubtelPaymentCancelledClient() {
  const router = useRouter();
  const params = useSearchParams();
  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState(
    "Your payment was not completed. You can return to checkout and try again anytime."
  );

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

    async function checkOnce() {
      if (!clientReference || !statusToken) {
        setChecking(false);
        return;
      }
      try {
        const result = await requestJson(
          `/api/orders/hubtel/status/${encodeURIComponent(clientReference)}?token=${encodeURIComponent(statusToken)}`,
          { retries: 1 }
        );
        if (ignore) return;
        if (result?.paymentStatus === "paid") {
          router.replace(
            `/payment/success?clientReference=${encodeURIComponent(clientReference)}&statusToken=${encodeURIComponent(statusToken)}`
          );
          return;
        }
        if (result?.paymentStatus === "pending") {
          setMessage(
            "Your payment is still pending confirmation. You can wait a moment or retry from checkout."
          );
        }
      } catch {
        // Keep the standard cancelled fallback message.
      } finally {
        if (!ignore) setChecking(false);
      }
    }

    checkOnce();
    return () => {
      ignore = true;
    };
  }, [clientReference, router, statusToken]);

  return (
    <main className="shell page-section">
      <section className="panel cart-empty">
        <h1>Payment Cancelled</h1>
        <p className="hero-copy">
          {checking ? "Checking your latest payment status..." : message}
        </p>
        {!checking ? (
          <div className="hero-actions">
            <Link href="/checkout/payment" className="primary-link">Retry payment</Link>
            <Link href="/cart" className="ghost-button">Back to cart</Link>
          </div>
        ) : null}
      </section>
    </main>
  );
}
