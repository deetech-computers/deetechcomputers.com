import { createStaticRouteMetadata } from "@/lib/route-metadata";

export const metadata = createStaticRouteMetadata({
  title: "Login",
  path: "/login",
  description: "Sign in to your Deetech account to access orders and saved items.",
});

export default function LoginLayout({ children }) {
  return children;
}
