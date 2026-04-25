import { createStaticRouteMetadata } from "@/lib/route-metadata";

export const metadata = createStaticRouteMetadata({
  title: "Contact Us",
  path: "/contact",
  description: "Reach Deetech support for orders, delivery, products, and assistance.",
});

export default function ContactLayout({ children }) {
  return children;
}
