import { createStaticRouteMetadata } from "@/lib/route-metadata";

export const metadata = createStaticRouteMetadata({
  title: "Payment Policy",
  path: "/payment-policy",
});

export default function PaymentPolicyLayout({ children }) {
  return children;
}
