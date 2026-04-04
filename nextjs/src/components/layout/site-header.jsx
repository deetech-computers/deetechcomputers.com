"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";

const navItems = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/products", label: "Shop", icon: "shop" },
  { href: "/about", label: "About", icon: "about" },
  { href: "/contact", label: "Support", icon: "support" },
  { href: "/affiliates", label: "Affiliates", icon: "affiliates" },
];

function isActivePath(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function ActionIcon({ name }) {
  if (name === "search") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10 4a6 6 0 1 0 3.9 10.6l4.2 4.2 1.4-1.4-4.2-4.2A6 6 0 0 0 10 4Zm0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z" fill="currentColor" />
      </svg>
    );
  }
  if (name === "account") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.4 0-8 2-8 4.5V21h16v-2.5c0-2.5-3.6-4.5-8-4.5Z" fill="currentColor" />
      </svg>
    );
  }
  if (name === "search-field") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10.2 4.8a5.4 5.4 0 1 0 3.7 9.3l3.8 3.8 1.4-1.4-3.8-3.8a5.4 5.4 0 0 0-5.1-7.9Zm0 2a3.4 3.4 0 1 1 0 6.8 3.4 3.4 0 0 1 0-6.8Z" fill="currentColor" />
      </svg>
    );
  }
  if (name === "support") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3a8 8 0 0 0-8 8v2.5A2.5 2.5 0 0 0 6.5 16H8v-5H6a6 6 0 0 1 12 0h-2v5h1.5A2.5 2.5 0 0 0 20 13.5V11a8 8 0 0 0-8-8Zm-2 15h4a2 2 0 0 1-2 2h-1v-2Z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 18a2 2 0 1 0 2 2 2 2 0 0 0-2-2Zm10 0a2 2 0 1 0 2 2 2 2 0 0 0-2-2ZM6.2 6l.5 2H20l-1.5 7.2a2 2 0 0 1-2 1.6H9a2 2 0 0 1-2-1.6L5 4H2V2h4a1 1 0 0 1 1 .8L7.5 4H22v2Z" fill="currentColor" />
    </svg>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { count } = useCart();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const mobileMenuButtonRef = useRef(null);
  const mobileMenuCloseButtonRef = useRef(null);
  const previousMobileOpenRef = useRef(false);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    const scrollY = window.scrollY;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyWidth = document.body.style.width;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.width = previousBodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (mobileOpen) {
      mobileMenuCloseButtonRef.current?.focus();
      previousMobileOpenRef.current = true;
      return;
    }

    if (previousMobileOpenRef.current) {
      mobileMenuButtonRef.current?.focus();
      previousMobileOpenRef.current = false;
    }
  }, [mobileOpen]);

  const onSearchSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);
    setMobileOpen(false);
  };

  const mobileMenu = mobileOpen ? (
    <div id="mobile-navigation-menu" className="mobile-menu is-open" role="dialog" aria-modal="true" aria-label="Mobile navigation">
      <div className="mobile-menu__header">
        <Link href="/" className="brand-mark">
          <Image src="/logo.png" alt="Deetech" width={170} height={48} className="brand-mark__image" priority />
        </Link>
        <button
          ref={mobileMenuCloseButtonRef}
          type="button"
          className="mobile-menu__close"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <span />
          <span />
        </button>
      </div>

      <form className="mobile-menu__search" onSubmit={onSearchSubmit}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="search-input"
          placeholder="Search products"
          aria-label="Search products"
        />
      </form>

      <nav className="mobile-menu__nav" aria-label="Mobile navigation">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={isActivePath(pathname, item.href) ? "mobile-menu__link is-active" : "mobile-menu__link"}>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mobile-menu__actions">
        <Link href="/cart" className="cart-pill">
          Cart
          <span>{count}</span>
        </Link>
        {isAuthenticated ? (
          <>
            <Link href="/account" className="ghost-link">
              {user?.firstName || user?.name || "Account"}
            </Link>
            {user?.role === "admin" ? <Link href="/admin" className="ghost-link">Admin</Link> : null}
            <button type="button" className="ghost-button" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" className="ghost-link">Login</Link>
            <Link href="/register" className="primary-link">Create account</Link>
          </>
        )}
      </div>
    </div>
  ) : null;

  return (
    <>
      <header className="site-header">
        <div className="header-topbar">
          <div className="shell header-topbar__inner">
            <span>Free shipping on all orders over GHS 100</span>
            <span>Today's deal | Gift certificates</span>
          </div>
        </div>

        <div className="shell">
          <div className="header-inner">
            <div className="header-mobile-top">
              <div className="header-mobile-main">
                <button
                  ref={mobileMenuButtonRef}
                  type="button"
                  className="icon-button icon-button--mobile"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open menu"
                  aria-expanded={mobileOpen}
                  aria-controls="mobile-navigation-menu"
                >
                  <span />
                  <span />
                  <span />
                </button>
                <Link href="/" className="brand-mark brand-mark--mobile">
                  <Image src="/logo.png" alt="Deetech" width={190} height={56} className="brand-mark__image" priority />
                </Link>
              </div>
              <div className="header-mobile-quick-actions">
                <Link href="/cart" className="icon-button icon-button--mobile-action cart-button" aria-label="Cart">
                  <ActionIcon name="cart" />
                  <span>{count}</span>
                </Link>
                <Link href="/account" className="icon-button icon-button--mobile-action" aria-label="Account">
                  <ActionIcon name="account" />
                </Link>
              </div>
            </div>

            <Link href="/" className="brand-mark brand-mark--desktop-shell">
              <Image src="/logo.png" alt="Deetech" width={170} height={48} className="brand-mark__image" priority />
            </Link>

            <nav className="main-nav" aria-label="Primary navigation">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className={isActivePath(pathname, item.href) ? "nav-link is-active" : "nav-link"}>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="header-icon-actions">
              <form className="mobile-header-search" onSubmit={onSearchSubmit}>
                <span className="mobile-header-search__icon" aria-hidden="true">
                  <ActionIcon name="search-field" />
                </span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="search-input"
                  placeholder="Search products here"
                  aria-label="Search products"
                />
              </form>
              <button type="button" className="icon-button icon-button--desktop" onClick={() => router.push("/products")} aria-label="Search catalog">
                <ActionIcon name="search" />
              </button>
              <Link href="/account" className="icon-button icon-button--desktop" aria-label="Account">
                <ActionIcon name="account" />
              </Link>
              <Link href="/cart" className="icon-button icon-button--desktop cart-button" aria-label="Cart">
                <ActionIcon name="cart" />
                <span>{count}</span>
              </Link>
            </div>
          </div>
        </div>
      </header>
      {portalReady && mobileMenu ? createPortal(mobileMenu, document.body) : null}
    </>
  );
}
