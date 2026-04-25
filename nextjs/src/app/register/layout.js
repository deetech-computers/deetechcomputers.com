import { createStaticRouteMetadata } from "@/lib/route-metadata";

export const metadata = createStaticRouteMetadata({
  title: "Create Account",
  path: "/register",
  description: "Create a Deetech account to save products and manage orders faster.",
});

export default function RegisterLayout({ children }) {
  return children;
}
