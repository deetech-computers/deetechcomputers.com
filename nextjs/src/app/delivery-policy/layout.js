import { createStaticRouteMetadata } from "@/lib/route-metadata";

export const metadata = createStaticRouteMetadata({
  title: "Delivery Policy",
  path: "/delivery-policy",
});

export default function DeliveryPolicyLayout({ children }) {
  return children;
}
