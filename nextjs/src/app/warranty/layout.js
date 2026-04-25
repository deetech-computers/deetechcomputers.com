import { createStaticRouteMetadata } from "@/lib/route-metadata";

export const metadata = createStaticRouteMetadata({
  title: "Warranty",
  path: "/warranty",
});

export default function WarrantyLayout({ children }) {
  return children;
}
