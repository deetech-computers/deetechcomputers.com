import { createStaticRouteMetadata } from "@/lib/route-metadata";

export const metadata = createStaticRouteMetadata({
  title: "Terms of Use",
  path: "/terms-of-use",
});

export default function TermsOfUseLayout({ children }) {
  return children;
}
