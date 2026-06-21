"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  ["/admin", "Dashboard", "dashboard"],
  ["/admin/orders", "Orders", "orders"],
  ["/admin/products", "Products", "products"],
  ["/admin/users", "Users", "users"],
  ["/admin/affiliates", "Affiliates", "affiliates"],
  ["/admin/reviews", "Reviews", "reviews"],
  ["/admin/banners", "Banners", "banners"],
  ["/admin/messages", "Messages", "messages"],
  ["/admin/discounts", "Discounts", "discounts"],
];

function AdminNavIcon({ name }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round" };
  if (name === "dashboard") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" {...common} /></svg>;
  }
  if (name === "orders") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h3l2 10h9l2-7H8" {...common} /><path d="M10 20h.01M17 20h.01" {...common} /></svg>;
  }
  if (name === "products") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14v13H5zM8 4h8l3 3H5zM8 11h8" {...common} /></svg>;
  }
  if (name === "users") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 19c0-2.2-1.8-4-4-4s-4 1.8-4 4" {...common} /><path d="M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM20 19c0-1.7-1-3.1-2.4-3.7M17 5.5a2.8 2.8 0 0 1 0 5" {...common} /></svg>;
  }
  if (name === "affiliates") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 12.5 6 15a3 3 0 1 0 4.2 4.2l2.3-2.3M15.5 11.5 18 9a3 3 0 1 0-4.2-4.2l-2.3 2.3M9 15l6-6" {...common} /></svg>;
  }
  if (name === "reviews") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v12H8l-4 4z" {...common} /><path d="m10 13 2-5 2 5M10.8 11h2.4" {...common} /></svg>;
  }
  if (name === "banners") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-3-6 3z" {...common} /><path d="M9 8h6M9 12h4" {...common} /></svg>;
  }
  if (name === "messages") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v12H8l-4 4z" {...common} /><path d="M8 9h8M8 13h5" {...common} /></svg>;
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7 7 20l-3-3L17 4zM7 7h.01M17 17h.01" {...common} /></svg>;
}

export default function AdminNav() {
  const pathname = usePathname();
  const isActive = (href) => (href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));
  return (
    <aside className="admin-nav">
      <div className="admin-nav__brand">
        <strong>DEETECH</strong>
        <span>Admin Operations</span>
      </div>
      {items.map(([href, label, icon]) => (
        <Link key={href} href={href} className={isActive(href) ? "active" : ""}>
          <AdminNavIcon name={icon} />
          {label}
        </Link>
      ))}
    </aside>
  );
}
