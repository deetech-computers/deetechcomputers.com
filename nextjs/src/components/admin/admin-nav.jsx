"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  ["/admin", "Dashboard"],
  ["/admin/orders", "Orders"],
  ["/admin/products", "Products"],
  ["/admin/users", "Users"],
  ["/admin/affiliates", "Affiliates"],
  ["/admin/reviews", "Reviews"],
  ["/admin/banners", "Banners"],
  ["/admin/messages", "Messages"],
  ["/admin/discounts", "Discounts"],
];

export default function AdminNav() {
  const pathname = usePathname();
  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);
  return (
    <aside className="admin-nav">
      <p className="section-kicker">Admin</p>
      {items.map(([href, label]) => (
        <Link key={href} href={href} className={isActive(href) ? "active" : ""}>
          {label}
        </Link>
      ))}
    </aside>
  );
}
