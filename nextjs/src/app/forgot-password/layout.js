import { createStaticRouteMetadata } from "@/lib/route-metadata";

export const metadata = createStaticRouteMetadata({
  title: "Forgot Password",
  path: "/forgot-password",
});

export default function ForgotPasswordLayout({ children }) {
  return children;
}
