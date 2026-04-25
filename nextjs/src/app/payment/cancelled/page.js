import { Suspense } from "react";
import HubtelPaymentCancelledClient from "./cancelled-client";

export default function HubtelPaymentCancelledPage() {
  return (
    <Suspense
      fallback={
        <main className="shell page-section">
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
