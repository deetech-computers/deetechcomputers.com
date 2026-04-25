import { Suspense } from "react";
import HubtelPaymentSuccessClient from "./success-client";

export default function HubtelPaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="shell page-section">
          <section className="panel cart-empty">
            <h1>Finalizing Payment</h1>
            <p className="hero-copy">Confirming your payment...</p>
          </section>
        </main>
      }
    >
      <HubtelPaymentSuccessClient />
    </Suspense>
  );
}
