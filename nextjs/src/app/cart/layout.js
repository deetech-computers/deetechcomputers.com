import { createStaticRouteMetadata } from "@/lib/route-metadata";

export const metadata = createStaticRouteMetadata({
  title: "Shopping Cart",
  path: "/cart",
  description: "Review your selected products and continue to secure checkout.",
});

export default function CartLayout({ children }) {
  return children;
}
