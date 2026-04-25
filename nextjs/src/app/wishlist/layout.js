import { createStaticRouteMetadata } from "@/lib/route-metadata";

export const metadata = createStaticRouteMetadata({
  title: "Wishlist",
  path: "/wishlist",
  description: "View your saved products and add them to cart anytime.",
});

export default function WishlistLayout({ children }) {
  return children;
}
