import { createStaticRouteMetadata } from "@/lib/route-metadata";

export const metadata = createStaticRouteMetadata({
  title: "FAQ",
  path: "/faq",
});

export default function FaqLayout({ children }) {
  return children;
}
