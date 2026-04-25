import { createStaticRouteMetadata } from "@/lib/route-metadata";

export const metadata = createStaticRouteMetadata({
  title: "Return and Refund Policy",
  path: "/return-refund",
});

export default function ReturnRefundLayout({ children }) {
  return children;
}
