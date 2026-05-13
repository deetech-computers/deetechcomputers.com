import AccountPageClient from "@/components/account/account-page-client";
import { createStaticRouteMetadata } from "@/lib/route-metadata";

export const metadata = createStaticRouteMetadata({
  title: "My Account",
  path: "/account",
  description: "Manage your Deetech account, orders, wishlist, and profile details.",
});

export default async function AccountPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const initialTab = Array.isArray(resolvedSearchParams?.tab)
    ? resolvedSearchParams.tab[0] || ""
    : resolvedSearchParams?.tab || "";

  return <AccountPageClient initialTab={initialTab} />;
}
