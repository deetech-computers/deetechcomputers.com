import AccountPageClient from "@/components/account/account-page-client";
import { createStaticRouteMetadata } from "@/lib/route-metadata";

export const metadata = createStaticRouteMetadata({
  title: "My Account",
  path: "/account",
  description: "Manage your Deetech account, orders, wishlist, and profile details.",
});

export default function AccountPage() {
  return <AccountPageClient />;
}
