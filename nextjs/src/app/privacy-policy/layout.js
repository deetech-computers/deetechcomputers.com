import { createStaticRouteMetadata } from "@/lib/route-metadata";

export const metadata = createStaticRouteMetadata({
  title: "Privacy Policy",
  path: "/privacy-policy",
});

export default function PrivacyPolicyLayout({ children }) {
  return children;
}
