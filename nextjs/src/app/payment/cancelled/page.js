import { Suspense } from "react";
import HubtelPaymentCancelledClient from "./cancelled-client";
import "../payment-status-desktop.css";
import "../payment-status-mobile.css";

export default function HubtelPaymentCancelledPage() {
  return (
    <Suspense
      fallback={
        <main className="shell page-section payment-status-route">
          <section className="panel cart-empty">
            <h1>Payment Update</h1>
            <p className="hero-copy">Checking your latest payment status...</p>
          </section>
        </main>
      }
    >
      <HubtelPaymentCancelledClient />
    </Suspense>
  );
}
