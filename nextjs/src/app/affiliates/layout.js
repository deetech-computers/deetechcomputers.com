import { createStaticRouteMetadata } from "@/lib/route-metadata";

export const metadata = createStaticRouteMetadata({
  title: "Affiliate Program",
  path: "/affiliates",
});

export default function AffiliatesLayout({ children }) {
  return children;
}
