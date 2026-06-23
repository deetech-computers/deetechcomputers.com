"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

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
  const svgProps = { viewBox: "0 0 24 24", width: 24, height: 24, className: "admin-icon", "aria-hidden": "true", focusable: "false" };
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round" };
  if (name === "dashboard") {
    return <svg {...svgProps}><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" {...common} /></svg>;
  }
  if (name === "orders") {
    return <svg {...svgProps}><path d="M4 6h3l2 10h9l2-7H8" {...common} /><path d="M10 20h.01M17 20h.01" {...common} /></svg>;
  }
  if (name === "products") {
    return <svg {...svgProps}><path d="M5 7h14v13H5zM8 4h8l3 3H5zM8 11h8" {...common} /></svg>;
  }
  if (name === "users") {
    return <svg {...svgProps}><path d="M16 19c0-2.2-1.8-4-4-4s-4 1.8-4 4" {...common} /><path d="M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM20 19c0-1.7-1-3.1-2.4-3.7M17 5.5a2.8 2.8 0 0 1 0 5" {...common} /></svg>;
  }
  if (name === "affiliates") {
    return <svg {...svgProps}><path d="M8.5 12.5 6 15a3 3 0 1 0 4.2 4.2l2.3-2.3M15.5 11.5 18 9a3 3 0 1 0-4.2-4.2l-2.3 2.3M9 15l6-6" {...common} /></svg>;
  }
  if (name === "reviews") {
    return <svg {...svgProps}><path d="M4 5h16v12H8l-4 4z" {...common} /><path d="m10 13 2-5 2 5M10.8 11h2.4" {...common} /></svg>;
  }
  if (name === "banners") {
    return <svg {...svgProps}><path d="M6 3h12v18l-6-3-6 3z" {...common} /><path d="M9 8h6M9 12h4" {...common} /></svg>;
  }
  if (name === "messages") {
    return <svg {...svgProps}><path d="M4 5h16v12H8l-4 4z" {...common} /><path d="M8 9h8M8 13h5" {...common} /></svg>;
  }
  if (name === "settings") {
    return <svg {...svgProps}><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" {...common} /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2 3-.2-.1a1.7 1.7 0 0 0-2 .1 1.7 1.7 0 0 0-.8 1.7V22h-3.6v-.3a1.7 1.7 0 0 0-.8-1.7 1.7 1.7 0 0 0-2-.1l-.2.1-2-3 .1-.1A1.7 1.7 0 0 0 6.6 15a1.7 1.7 0 0 0-1.5-1H5v-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2-3 .2.1a1.7 1.7 0 0 0 2-.1 1.7 1.7 0 0 0 .8-1.7V2h3.6v.3a1.7 1.7 0 0 0 .8 1.7 1.7 1.7 0 0 0 2 .1l.2-.1 2 3-.1.1A1.7 1.7 0 0 0 17.4 9a1.7 1.7 0 0 0 1.5 1h.1v4h-.1a1.7 1.7 0 0 0-1.5 1Z" {...common} /></svg>;
  }
  if (name === "logout") {
    return <svg {...svgProps}><path d="M10 17l5-5-5-5M15 12H3" {...common} /><path d="M13 4h5a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-5" {...common} /></svg>;
  }
  return <svg {...svgProps}><path d="M20 7 7 20l-3-3L17 4zM7 7h.01M17 17h.01" {...common} /></svg>;
}

export function MobileNavDrawer({ open, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const isActive = (href) => (href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));
  const handleLogout = () => {
    onClose();
    logout();
    router.push("/");
  };

  if (!open) return null;

  return (
    <div className="admin-mobile-menu" role="dialog" aria-modal="true" aria-label="Admin navigation">
      <button type="button" className="admin-mobile-menu__backdrop" aria-label="Close admin menu" onClick={onClose} />
      <nav className="admin-mobile-menu__panel" aria-label="Admin sections">
        <div className="admin-mobile-menu__head">
          <strong>DEETECH Admin</strong>
          <button type="button" onClick={onClose}>Close</button>
        </div>
        {items.map(([href, label, icon]) => (
          <Link key={href} href={href} className={isActive(href) ? "active" : ""} onClick={onClose}>
            <AdminNavIcon name={icon} />
            {label}
          </Link>
        ))}
        <div className="admin-mobile-menu__footer">
          <Link href="/admin" onClick={onClose}>
            <AdminNavIcon name="settings" />
            Settings
          </Link>
          <button type="button" onClick={handleLogout}>
            <AdminNavIcon name="logout" />
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const isActive = (href) => (href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));
  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <aside className="admin-nav">
      <div className="admin-nav__brand">
        <strong>DEETECH</strong>
        <span>Admin Operations</span>
      </div>
      <nav className="admin-nav__links" aria-label="Admin navigation">
        {items.map(([href, label, icon]) => (
          <Link key={href} href={href} className={isActive(href) ? "active" : ""}>
            <AdminNavIcon name={icon} />
            {label}
          </Link>
        ))}
      </nav>
      <div className="admin-nav__footer">
        <Link href="/admin" className="admin-nav__footer-link">
          <AdminNavIcon name="settings" />
          Settings
        </Link>
        <button type="button" className="admin-nav__footer-link admin-nav__footer-link--danger" onClick={handleLogout}>
          <AdminNavIcon name="logout" />
          Logout
        </button>
      </div>
    </aside>
  );
}
