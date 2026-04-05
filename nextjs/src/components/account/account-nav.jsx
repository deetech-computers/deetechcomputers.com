"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  ["/account", "Profile"],
  ["/edit-account", "Edit Profile"],
  ["/orders", "Orders"],
  ["/wishlist", "Wishlist"],
  ["/messages", "Messages"],
  ["/affiliates", "Affiliates"],
  ["/change-password", "Password"],
];

export default function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="account-nav" aria-label="Account navigation">
      {items.map(([href, label]) => (
        <Link
          key={href}
          href={href}
          className={pathname === href || (href === "/orders" && pathname?.startsWith("/orders/")) ? "active" : ""}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
