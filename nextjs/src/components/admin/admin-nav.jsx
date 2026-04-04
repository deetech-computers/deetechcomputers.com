"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  ["/admin", "Dashboard"],
  ["/admin/products", "Products"],
  ["/admin/orders", "Orders"],
  ["/admin/messages", "Messages"],
  ["/admin/users", "Users"],
  ["/admin/reviews", "Reviews"],
  ["/admin/affiliates", "Affiliates"],
  ["/admin/discounts", "Discounts"],
  ["/admin/banners", "Banners"],
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <aside className="admin-nav">
      <p className="section-kicker">Admin</p>
      {items.map(([href, label]) => (
        <Link key={href} href={href} className={pathname === href ? "active" : ""}>
          {label}
        </Link>
      ))}
    </aside>
  );
}
