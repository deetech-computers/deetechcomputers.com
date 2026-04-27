"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import StableImage from "@/components/ui/stable-image";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import {
  readWishlistEntries,
  removeWishlistEntry,
  WISHLIST_UPDATED_EVENT,
} from "@/lib/wishlist";
import { CART_ITEM_ADDED_EVENT } from "@/lib/cart";
import {
  buildProductsHref,
  canonicalCategory,
  DEFAULT_STOREFRONT_CATEGORIES,
  deriveCategoryBrandStats,
  fetchProducts,
  formatCategoryLabel,
  getProductPrice,
  resolveProductImage,
} from "@/lib/products";

const adminNavItem = { href: "/admin", label: "Admin", icon: "admin" };
const affiliateNavItem = { href: "/affiliates", label: "Affiliates", icon: "affiliates" };
const ADMIN_MENU_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/affiliates", label: "Affiliates" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/banners", label: "Banners" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/discounts", label: "Discounts" },
];
const HEADER_CATEGORY_ORDER = ["laptops", "phones", "monitors", "accessories", "storage", "others"];
const BRAND_FALLBACK = (
  <div className="brand-mark__fallback" aria-label="Deetech Computers">
    DEETECH
  </div>
);

function isActivePath(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function buildCategoryHref(slug, options = {}) {
  return buildProductsHref({
    category: canonicalCategory(slug),
    brand: options.brand || "",
    query: options.query || "",
    source: options.source || "",
    hash: "shop-results",
  });
}

function splitIntoColumns(items, size = 4) {
  const columns = [];
  for (let index = 0; index < items.length; index += size) {
    columns.push(items.slice(index, index + size));
  }
  return columns;
}

function buildDesktopDropdownBlocks(item) {
  const brandLinks = (item.sections || []).map((section) => ({
    label: `${section.value} (${section.count})`,
    href: buildCategoryHref(item.slug, { brand: section.value }),
  }));
  const links = [{ label: `All ${item.label}`, href: buildCategoryHref(item.slug) }, ...brandLinks];
  const chunks = splitIntoColumns(links, 6).slice(0, 3);
  if (!chunks.length) {
    return [
      {
        title: `Shop ${item.label}`,
        links: [{ label: `All ${item.label}`, href: buildCategoryHref(item.slug) }],
      },
    ];
  }
  return chunks.map((chunk, index) => ({
    title: index === 0 ? `Shop ${item.label}` : index === 1 ? "More options" : "Browse more",
    links: chunk,
  }));
}

function ActionIcon({ name }) {
  if (name === "wishlist") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 20.4 4.9 13.8a4.9 4.9 0 0 1 6.9-6.9l.2.2.2-.2a4.9 4.9 0 0 1 6.9 6.9L12 20.4Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (name === "search") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="10.5" cy="10.5" r="5.8" fill="none" stroke="currentColor" strokeWidth="1.9" />
        <path d="m15 15 4.4 4.4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "account") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8.3" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.9" />
        <path d="M5 20c.6-3 3.2-4.9 7-4.9s6.4 1.9 7 4.9" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
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
        <path d="M4.5 11.5a7.5 7.5 0 0 1 15 0v2.2a2.3 2.3 0 0 1-2.3 2.3H16v-4.9h2a6 6 0 0 0-12 0h2V16H6.8a2.3 2.3 0 0 1-2.3-2.3v-2.2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "delete") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 4h6m-9 3h12m-1 0-1 12H8L7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="19" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="19" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M2.5 4h2.9l1.7 9.2h10.2l1.7-6.4H7.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CategoryIcon({ slug }) {
  if (slug === "laptops") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 5h12a1 1 0 0 1 1 1v8H5V6a1 1 0 0 1 1-1Zm-3 11h18v2H3v-2Z" fill="currentColor" />
      </svg>
    );
  }
  if (slug === "phones") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm4 15.5a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2Z" fill="currentColor" />
      </svg>
    );
  }
  if (slug === "monitors") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5h16a1 1 0 0 1 1 1v9H3V6a1 1 0 0 1 1-1Zm6 12h4l1 2H9l1-2Z" fill="currentColor" />
      </svg>
    );
  }
  if (slug === "accessories") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 9a5 5 0 1 1 10 0v6a3 3 0 1 1-2 0V9a3 3 0 0 0-6 0v6a1 1 0 1 1-2 0V9Z" fill="currentColor" />
      </svg>
    );
  }
  if (slug === "storage") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 7h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Zm2 3h4v4H7v-4Zm7 0h3v1.8h-3V10Zm0 3h3v1.8h-3V13Z" fill="currentColor" />
      </svg>
    );
  }
  if (slug === "printers") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 4h10v4H7V4Zm-2 6h14a2 2 0 0 1 2 2v4h-3v4H6v-4H3v-4a2 2 0 0 1 2-2Zm3 7h8v-4H8v4Z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 4 8l8 5 8-5-8-5Zm-6.5 7.3L11 13.8v6.2l-5.5-3.4v-6.3Zm7.5 9.7v-6.2l5.5-3.5v6.3L13 20Z" fill="currentColor" />
    </svg>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const {
    items: cartItems,
    subtotal: cartSubtotal,
    count,
    status: cartStatus,
    updateQuantity,
    removeItem: removeCartItem,
  } = useCart();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpenSlug, setDesktopOpenSlug] = useState("");
  const [headerSearchOpen, setHeaderSearchOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [wishlistMenuOpen, setWishlistMenuOpen] = useState(false);
  const [searchProducts, setSearchProducts] = useState([]);
  const [wishlistPreviewItems, setWishlistPreviewItems] = useState([]);
  const [categoryNavItems, setCategoryNavItems] = useState(() => {
    const brandMap = deriveCategoryBrandStats([], { includeEmpty: false });
    return DEFAULT_STOREFRONT_CATEGORIES
      .filter((item) => HEADER_CATEGORY_ORDER.includes(item.slug))
      .sort((a, b) => HEADER_CATEGORY_ORDER.indexOf(a.slug) - HEADER_CATEGORY_ORDER.indexOf(b.slug))
      .map((item) => ({
      ...item,
      label: item.slug === "laptops" ? "Laptops and Desktops" : item.slug === "phones" ? "Phones" : item.label,
      sections: brandMap[item.slug] || [],
    }));
  });
  const [mobileExpandedSections, setMobileExpandedSections] = useState(() =>
    Object.fromEntries(
      DEFAULT_STOREFRONT_CATEGORIES
        .filter((item) => HEADER_CATEGORY_ORDER.includes(item.slug))
        .sort((a, b) => HEADER_CATEGORY_ORDER.indexOf(a.slug) - HEADER_CATEGORY_ORDER.indexOf(b.slug))
        .map((item) => [item.slug, false])
    )
  );
  const [mobileShopOpen, setMobileShopOpen] = useState(true);
  const [portalReady, setPortalReady] = useState(false);
  const mobileMenuButtonRef = useRef(null);
  const mobileMenuCloseButtonRef = useRef(null);
  const headerSearchInputRef = useRef(null);
  const desktopNavRef = useRef(null);
  const desktopDropdownRefs = useRef({});
  const accountMenuRef = useRef(null);
  const cartMenuRef = useRef(null);
  const wishlistMenuRef = useRef(null);
  const previousMobileOpenRef = useRef(false);
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === "undefined" ? 1280 : window.innerWidth
  );
  const isAdminRoute = pathname?.startsWith("/admin");
  const wishlistBadgeText = String(wishlistPreviewItems.length || 0);
  const desktopCategoryNavItems = categoryNavItems.filter((item) => item.slug !== "others");
  const desktopNavItems = isAdminRoute ? ADMIN_MENU_ITEMS : [...desktopCategoryNavItems, affiliateNavItem];

  useEffect(() => {
    setPortalReady(true);
  }, []);

  const cartBadgeText = cartStatus === "ready" ? String(count) : "0";

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDesktopOpenSlug("");
    setHeaderSearchOpen(false);
    setAccountMenuOpen(false);
    setCartDrawerOpen(false);
    setWishlistMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!headerSearchOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setHeaderSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [headerSearchOpen]);

  useEffect(() => {
    if (!headerSearchOpen) return;
    headerSearchInputRef.current?.focus();
  }, [headerSearchOpen]);

  useEffect(() => {
    let cancelled = false;

    fetchProducts()
      .then((products) => {
        if (cancelled) return;
        const brandMap = deriveCategoryBrandStats(products, { includeEmpty: false });
        setCategoryNavItems(
          DEFAULT_STOREFRONT_CATEGORIES
            .filter((item) => HEADER_CATEGORY_ORDER.includes(item.slug))
            .sort((a, b) => HEADER_CATEGORY_ORDER.indexOf(a.slug) - HEADER_CATEGORY_ORDER.indexOf(b.slug))
            .map((item) => ({
              ...item,
              label: item.slug === "laptops" ? "Laptops and Desktops" : item.slug === "phones" ? "Phones" : item.label,
              sections: brandMap[item.slug] || [],
            }))
        );
        setSearchProducts(Array.isArray(products) ? products : []);
      })
      .catch(() => {
        if (cancelled) return;
        const brandMap = deriveCategoryBrandStats([], { includeEmpty: false });
        setCategoryNavItems(
          DEFAULT_STOREFRONT_CATEGORIES
            .filter((item) => HEADER_CATEGORY_ORDER.includes(item.slug))
            .sort((a, b) => HEADER_CATEGORY_ORDER.indexOf(a.slug) - HEADER_CATEGORY_ORDER.indexOf(b.slug))
            .map((item) => ({
              ...item,
              label: item.slug === "laptops" ? "Laptops and Desktops" : item.slug === "phones" ? "Phones" : item.label,
              sections: brandMap[item.slug] || [],
            }))
        );
        setSearchProducts([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

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
      setMobileShopOpen(true);
      mobileMenuCloseButtonRef.current?.focus();
      previousMobileOpenRef.current = true;
      return;
    }

    if (previousMobileOpenRef.current) {
      mobileMenuButtonRef.current?.focus();
      previousMobileOpenRef.current = false;
    }
  }, [mobileOpen]);

  useEffect(() => {
    if (!desktopOpenSlug) return undefined;

    const onPointerDown = (event) => {
      if (desktopNavRef.current?.contains(event.target)) return;
      setDesktopOpenSlug("");
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setDesktopOpenSlug("");
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [desktopOpenSlug]);

  useEffect(() => {
    if (!accountMenuOpen) return undefined;

    const onPointerDown = (event) => {
      if (accountMenuRef.current?.contains(event.target)) return;
      setAccountMenuOpen(false);
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [accountMenuOpen]);

  useEffect(() => {
    if (!cartDrawerOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setCartDrawerOpen(false);
      }
    };

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [cartDrawerOpen]);

  useEffect(() => {
    if (!wishlistMenuOpen) return undefined;

    const onPointerDown = (event) => {
      if (wishlistMenuRef.current?.contains(event.target)) return;
      setWishlistMenuOpen(false);
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setWishlistMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [wishlistMenuOpen]);

  useEffect(() => {
    if (headerSearchOpen) {
      setAccountMenuOpen(false);
      setCartDrawerOpen(false);
      setWishlistMenuOpen(false);
    }
  }, [headerSearchOpen]);

  useEffect(() => {
    const onCartItemAdded = () => {
      setCartDrawerOpen(true);
      setWishlistMenuOpen(false);
      setAccountMenuOpen(false);
      setHeaderSearchOpen(false);
    };
    window.addEventListener(CART_ITEM_ADDED_EVENT, onCartItemAdded);
    return () => window.removeEventListener(CART_ITEM_ADDED_EVENT, onCartItemAdded);
  }, []);

  useEffect(() => {
    const syncWishlistPreview = () => {
      if (typeof window === "undefined") return;

      const entries = readWishlistEntries();
      if (!entries.length) {
        setWishlistPreviewItems([]);
        return;
      }

      const productsById = new Map(
        (Array.isArray(searchProducts) ? searchProducts : []).map((product) => [
          String(product?._id || product?.id || ""),
          product,
        ])
      );

      const hydrated = entries
        .map((entry) => {
          const product = productsById.get(String(entry.id));
          if (!product) return null;
          return {
            id: String(product?._id || product?.id || entry.id),
            name: String(product?.name || "Saved product"),
            image: product?.images?.[0] || product?.image || "",
            price: getProductPrice(product),
          };
        })
        .filter(Boolean)
        .slice(0, 4);

      setWishlistPreviewItems(hydrated);
    };

    syncWishlistPreview();
    window.addEventListener(WISHLIST_UPDATED_EVENT, syncWishlistPreview);
    window.addEventListener("storage", syncWishlistPreview);

    return () => {
      window.removeEventListener(WISHLIST_UPDATED_EVENT, syncWishlistPreview);
      window.removeEventListener("storage", syncWishlistPreview);
    };
  }, [searchProducts]);

  const onSearchSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);
    setMobileOpen(false);
    setHeaderSearchOpen(false);
  };

  function toggleMobileSection(slug) {
    setMobileExpandedSections((current) => ({
      ...current,
      [slug]: !current[slug],
    }));
  }

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  function closeDesktopDropdown() {
    setDesktopOpenSlug("");
    if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  function closeAccountMenu() {
    setAccountMenuOpen(false);
  }

  function closeCartDrawer() {
    setCartDrawerOpen(false);
  }

  function closeWishlistMenu() {
    setWishlistMenuOpen(false);
  }

  function removeFromCartPreview(event, productId) {
    event.preventDefault();
    event.stopPropagation();
    if (!productId) return;
    removeCartItem(productId);
  }

  function removeFromWishlistPreview(event, productId) {
    event.preventDefault();
    event.stopPropagation();
    if (!productId) return;
    removeWishlistEntry(productId);
  }

  function renderAccountMenuContent() {
    const onSelect = () => {
      closeAccountMenu();
    };

    if (isAuthenticated) {
      return (
        <>
          <div className="account-dropdown__head">
            <p>Signed in as</p>
            <strong>{user?.firstName || user?.name || "Customer"}</strong>
          </div>
          <div className="account-dropdown__links">
            <Link href="/account" className="account-dropdown__link" onClick={onSelect}>
              My account
            </Link>
            <Link href="/account?tab=orders" className="account-dropdown__link" onClick={onSelect}>
              My orders
            </Link>
            <Link href="/wishlist" className="account-dropdown__link" onClick={onSelect}>
              Wishlist
            </Link>
            <Link href="/affiliates" className="account-dropdown__link" onClick={onSelect}>
              Affiliates
            </Link>
            {user?.role === "admin" ? (
              <Link href="/admin" className="account-dropdown__link" onClick={onSelect}>
                Admin dashboard
              </Link>
            ) : null}
          </div>
          <button
            type="button"
            className="account-dropdown__logout"
            onClick={() => {
              closeAccountMenu();
              logout();
            }}
          >
            Logout
          </button>
        </>
      );
    }

    return (
      <>
        <div className="account-dropdown__head">
          <strong>Welcome to Deetech</strong>
          <p>Sign in to track orders, wishlist, and faster checkout.</p>
        </div>
        <div className="account-dropdown__guest-actions">
          <Link href="/login" className="account-dropdown__login" onClick={onSelect}>
            Login
          </Link>
          <Link href="/register" className="account-dropdown__register" onClick={onSelect}>
            Create account
          </Link>
        </div>
        <Link href="/forgot-password" className="account-dropdown__help" onClick={onSelect}>
          Forgot password?
        </Link>
      </>
    );
  }

  function getDesktopPanelStyle(slug, blockCount = 3) {
    const node = desktopDropdownRefs.current?.[slug];
    if (!node || !viewportWidth) return undefined;

    const rect = node.getBoundingClientRect();
    const normalizedCount = Math.max(1, Math.min(3, Number(blockCount) || 1));
    const targetWidth =
      normalizedCount === 1 ? 360 : normalizedCount === 2 ? 700 : 980;
    const panelWidth = Math.min(targetWidth, Math.max(320, viewportWidth * 0.88));
    const viewportPadding = 24;
    const centeredLeft = rect.width / 2 - panelWidth / 2;
    const minLeft = viewportPadding - rect.left;
    const maxLeft = viewportWidth - viewportPadding - rect.left - panelWidth;
    const safeLeft = Math.min(Math.max(centeredLeft, minLeft), maxLeft);

    return {
      left: `${safeLeft}px`,
      width: `${panelWidth}px`,
    };
  }

  const mobileMenu = mobileOpen ? (
    <div id="mobile-navigation-menu" className="mobile-menu is-open" role="dialog" aria-modal="true" aria-label="Mobile navigation">
      <div className="mobile-menu__header">
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
        {isAdminRoute ? (
          <p className="mobile-menu__title">Admin</p>
        ) : mobileShopOpen ? (
          <button
            type="button"
            className={mobileShopOpen ? "mobile-menu__shop-toggle is-open" : "mobile-menu__shop-toggle"}
            onClick={() => setMobileShopOpen((current) => !current)}
            aria-expanded={mobileShopOpen}
          >
            <span>Shop</span>
            <span className="mobile-menu__shop-symbol" aria-hidden="true">
              {mobileShopOpen ? "−" : "+"}
            </span>
          </button>
        ) : null}
      </div>

      <nav className="mobile-menu__nav mobile-menu__nav--catalog" aria-label="Mobile navigation">
        {isAdminRoute
          ? ADMIN_MENU_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={isActivePath(pathname, item.href) ? "mobile-menu__link is-active" : "mobile-menu__link"}
                onClick={closeMobileMenu}
              >
                <span>{item.label}</span>
              </Link>
            ))
          : (
              <>
                {!mobileShopOpen ? (
                  <div className="mobile-menu__top-links" aria-label="Quick links">
                    <Link href="/products" className="mobile-menu__top-link" onClick={closeMobileMenu}>
                      <span>Explore</span>
                      <svg viewBox="0 0 24 24" aria-hidden="true" className="mobile-menu__top-link-icon">
                        <path d="M8 16 16 8M10 8h6v6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                    <button
                      type="button"
                      className="mobile-menu__shop-toggle mobile-menu__shop-toggle--root"
                      onClick={() => setMobileShopOpen(true)}
                      aria-expanded="false"
                    >
                      <span>Shop</span>
                      <span className="mobile-menu__shop-symbol" aria-hidden="true">
                        +
                      </span>
                    </button>
                    <Link href="/contact" className="mobile-menu__top-link" onClick={closeMobileMenu}>
                      <span>Support</span>
                      <svg viewBox="0 0 24 24" aria-hidden="true" className="mobile-menu__top-link-icon">
                        <path d="M8 16 16 8M10 8h6v6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </div>
                ) : null}

                {mobileShopOpen ? (
                    <div className="mobile-menu__shop-body">
                      {categoryNavItems.map((item) => {
                        const isOpen = Boolean(mobileExpandedSections[item.slug]);
                        return (
                          <div key={item.slug} className={isOpen ? "mobile-menu__section is-open" : "mobile-menu__section"}>
                            <button
                              type="button"
                              className="mobile-menu__section-trigger"
                              onClick={() => toggleMobileSection(item.slug)}
                              aria-expanded={isOpen}
                              aria-label={`Toggle ${item.label} options`}
                            >
                              <span>{item.label}</span>
                              <span className="mobile-menu__section-chevron" aria-hidden="true" />
                            </button>
                            {isOpen ? (
                              <div className="mobile-menu__section-body">
                                <Link
                                  href={buildCategoryHref(item.slug)}
                                  className="mobile-menu__sublink mobile-menu__sublink--all"
                                  onClick={closeMobileMenu}
                                >
                                  All {item.label}
                                </Link>
                                {item.sections.map((section) => (
                                  <Link
                                    key={section.value}
                                    href={buildCategoryHref(item.slug, { brand: section.value })}
                                    className="mobile-menu__sublink"
                                    onClick={closeMobileMenu}
                                  >
                                    {section.value} ({section.count})
                                  </Link>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        );
                      })}

                      <Link
                        href={affiliateNavItem.href}
                        className={isActivePath(pathname, affiliateNavItem.href) ? "mobile-menu__link is-active" : "mobile-menu__link"}
                        onClick={closeMobileMenu}
                      >
                        <span>{affiliateNavItem.label}</span>
                      </Link>

                    </div>
                ) : null}

                {isAuthenticated ? (
                  <button
                    type="button"
                    className="mobile-menu__link mobile-menu__link--button"
                    onClick={() => {
                      closeMobileMenu();
                      logout();
                    }}
                  >
                    <span>Logout</span>
                  </button>
                ) : null}

                {user?.role === "admin" ? (
                  <Link href={adminNavItem.href} className={isActivePath(pathname, adminNavItem.href) ? "mobile-menu__link is-active" : "mobile-menu__link"} onClick={closeMobileMenu}>
                    <span>{adminNavItem.label}</span>
                  </Link>
                ) : null}
              </>
            )}
      </nav>
    </div>
  ) : null;

  const normalizedQuery = query.trim().toLowerCase();
  const searchMatches = normalizedQuery
    ? searchProducts.filter((product) => {
        const name = String(product?.name || "").toLowerCase();
        const brand = String(product?.brand || "").toLowerCase();
        const category = String(product?.category || "").toLowerCase();
        return name.includes(normalizedQuery) || brand.includes(normalizedQuery) || category.includes(normalizedQuery);
      })
    : [];
  const searchSuggestions = normalizedQuery
    ? Array.from(
        new Set(
          searchMatches
            .flatMap((product) => [String(product?.name || "").trim(), String(product?.brand || "").trim()])
            .filter(Boolean)
        )
      ).slice(0, 6)
    : [];
  const searchProductMatches = searchMatches.slice(0, 6);
  const searchResultsHref = normalizedQuery ? `/products?q=${encodeURIComponent(query.trim())}` : "/products";
  const formatSearchPrice = (value) => {
    const amount = Number(value || 0);
    if (!Number.isFinite(amount) || amount <= 0) return "";
    return `GH₵${amount.toLocaleString()}`;
  };

  function clearHeaderSearch() {
    setQuery("");
    headerSearchInputRef.current?.focus();
  }

  function closeHeaderSearch() {
    setHeaderSearchOpen(false);
  }

  const formatCartPrice = (value) => {
    const amount = Number(value || 0);
    if (!Number.isFinite(amount)) return "GH\u20B50.00";
    return `GH\u20B5${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  function updateFromDrawer(item, nextQty) {
    const id = String(item?.productId || item?._id || item?.id || "");
    if (!id) return;
    const safeQty = Math.max(1, Number(nextQty || 1));
    updateQuantity(id, safeQty);
  }

  function renderDesktopWishlistMenu() {
    if (!isAuthenticated) {
      return (
        <div className="wishlist-dropdown__empty">
          <p>Create account or login to use wishlist.</p>
          <Link href="/login" className="wishlist-dropdown__cta" onClick={closeWishlistMenu}>
            Go to login
          </Link>
        </div>
      );
    }

    if (!wishlistPreviewItems.length) {
      return (
        <div className="wishlist-dropdown__empty">
          <p>Your wishlist is empty.</p>
          <Link href="/products" className="wishlist-dropdown__cta" onClick={closeWishlistMenu}>
            Browse products
          </Link>
        </div>
      );
    }

    return (
      <div className="wishlist-dropdown__content">
        <div className="wishlist-dropdown__items">
          {wishlistPreviewItems.map((item) => (
            <div
              key={item.id}
              className="wishlist-dropdown__item"
            >
              <Link href={`/products/${item.id}`} className="wishlist-dropdown__thumb" onClick={closeWishlistMenu}>
                <StableImage
                  src={resolveProductImage(item.image)}
                  alt={item.name || "Wishlist product"}
                  width={110}
                  height={90}
                />
              </Link>
              <div className="wishlist-dropdown__meta">
                <Link
                  href={`/products/${item.id}`}
                  className="wishlist-dropdown__name"
                  onClick={closeWishlistMenu}
                >
                  <strong>{item.name}</strong>
                </Link>
                <b>{formatCartPrice(item.price)}</b>
                <button
                  type="button"
                  className="wishlist-dropdown__remove"
                  onClick={(event) => removeFromWishlistPreview(event, item.id)}
                  aria-label={`Remove ${item.name || "item"} from wishlist`}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <Link href="/wishlist" className="wishlist-dropdown__cta" onClick={closeWishlistMenu}>
          View wishlist
        </Link>
      </div>
    );
  }

  function renderSearchResults(onSelect) {
    if (!normalizedQuery) return null;

    return (
      <div className="desktop-search-tray__results">
        <aside className="desktop-search-tray__sidebar">
          <p className="desktop-search-tray__sidebar-title">Suggestions</p>
          <div className="desktop-search-tray__suggestions">
            {searchSuggestions.map((suggestion) => (
              <Link
                key={suggestion}
                href={`/products?q=${encodeURIComponent(suggestion)}`}
                className="desktop-search-tray__suggestion"
                onClick={onSelect}
              >
                {suggestion}
              </Link>
            ))}
          </div>
          <Link href={searchResultsHref} className="desktop-search-tray__all-results" onClick={onSelect}>
            See all results
          </Link>
        </aside>

        <section className="desktop-search-tray__main">
          <div className="desktop-search-tray__section-head">
            <p className="desktop-search-tray__section-title">
              Shop <span>({searchMatches.length})</span>
            </p>
            <Link href={searchResultsHref} className="desktop-search-tray__see-all" onClick={onSelect}>
              See all
            </Link>
          </div>

          {searchProductMatches.length ? (
            <div className="desktop-search-tray__products">
              {searchProductMatches.map((product) => (
                <Link
                  key={String(product?._id || product?.id)}
                  href={`/products/${String(product?._id || product?.id)}`}
                  className="desktop-search-tray__product"
                  onClick={onSelect}
                >
                  <div className="desktop-search-tray__product-thumb">
                    <StableImage
                      src={resolveProductImage(product?.images?.[0] || product?.image)}
                      alt={product?.name || "Product"}
                      width={110}
                      height={84}
                    />
                  </div>
                  <div className="desktop-search-tray__product-copy">
                    <strong>{product?.name || "Product"}</strong>
                    <p>
                      {String(product?.short_description || product?.description || "").trim() ||
                        String(product?.brand || formatCategoryLabel(product?.category || "Product")).toUpperCase()}
                    </p>
                    {formatSearchPrice(getProductPrice(product)) ? <b>{formatSearchPrice(getProductPrice(product))}</b> : null}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="desktop-search-tray__empty">No matching products found.</p>
          )}

          <div className="desktop-search-tray__section-head desktop-search-tray__section-head--secondary">
            <p className="desktop-search-tray__section-title">
              Discover <span>({searchSuggestions.length})</span>
            </p>
            <Link href={searchResultsHref} className="desktop-search-tray__see-all" onClick={onSelect}>
              See all
            </Link>
          </div>
        </section>
      </div>
    );
  }

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
            {headerSearchOpen ? (
              <div className="header-search-mode">
                <Link href="/" className="brand-mark header-search-mode__brand" aria-label="Go to homepage">
                  <StableImage
                    src="/logo.png"
                    alt="Deetech Computers logo"
                    width={170}
                    height={48}
                    className="brand-mark__image"
                    loading="eager"
                    fetchPriority="high"
                    fallback={BRAND_FALLBACK}
                    fallbackClassName="brand-mark__fallback"
                  />
                </Link>
                <form className="header-search-mode__form" onSubmit={onSearchSubmit}>
                  <input
                    ref={headerSearchInputRef}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="search-input"
                    placeholder="What can we help you find today?"
                    aria-label="Search products"
                  />
                  {query ? (
                    <button
                      type="button"
                      className="header-search-mode__clear"
                      aria-label="Clear search text"
                      onClick={clearHeaderSearch}
                    >
                      <span />
                      <span />
                    </button>
                  ) : null}
                  <button type="submit" className="header-search-mode__submit" aria-label="Search products">
                    <ActionIcon name="search" />
                  </button>
                </form>
                <button type="button" className="header-search-mode__cancel" onClick={closeHeaderSearch} aria-label="Cancel search">
                  <span />
                  <span />
                </button>
                {normalizedQuery ? <div className="header-search-mode__results">{renderSearchResults(closeHeaderSearch)}</div> : null}
                <Link href="/contact" className="header-search-mode__assist" aria-label="Help me choose a product">
                  Help me choose
                </Link>
              </div>
            ) : (
              <>
                <div className="header-mobile-top">
                  <div className="header-mobile-main">
                    <button
                      ref={mobileMenuButtonRef}
                      type="button"
                      className="icon-button icon-button--mobile"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        setMobileOpen(true);
                      }}
                      aria-label="Open menu"
                      aria-expanded={mobileOpen}
                      aria-controls="mobile-navigation-menu"
                    >
                      <span />
                      <span />
                      <span />
                    </button>
                    <Link href="/" className="brand-mark brand-mark--mobile">
                      <StableImage
                        src="/logo.png"
                        alt="Deetech Computers logo"
                        width={190}
                        height={56}
                        className="brand-mark__image"
                        loading="eager"
                        fetchPriority="high"
                        fallback={BRAND_FALLBACK}
                        fallbackClassName="brand-mark__fallback"
                      />
                    </Link>
                  </div>
                  <div className="header-mobile-quick-actions">
                    <button
                      type="button"
                      className="icon-button icon-button--mobile-action"
                      aria-label="Search"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        setHeaderSearchOpen(true);
                      }}
                    >
                      <ActionIcon name="search" />
                    </button>
                    <Link href="/wishlist" className="icon-button icon-button--mobile-action" aria-label="Wishlist">
                      <ActionIcon name="wishlist" />
                      <span className="icon-button__badge">
                        {wishlistBadgeText}
                      </span>
                    </Link>
                    <button
                      type="button"
                      className={cartDrawerOpen ? "icon-button icon-button--mobile-action cart-button is-active" : "icon-button icon-button--mobile-action cart-button"}
                      aria-label="Cart"
                      onClick={() => {
                        setHeaderSearchOpen(false);
                        setWishlistMenuOpen(false);
                        setAccountMenuOpen(false);
                        setCartDrawerOpen((current) => !current);
                      }}
                    >
                      <ActionIcon name="cart" />
                      <span className={cartStatus === "ready" ? "icon-button__badge" : "icon-button__badge is-pending"}>{cartBadgeText}</span>
                    </button>
                    <Link
                      href="/account"
                      className="icon-button icon-button--mobile-action"
                      aria-label="Account"
                    >
                      <ActionIcon name="account" />
                    </Link>
                  </div>
                </div>

                <Link href="/" className="brand-mark brand-mark--desktop-shell">
                  <StableImage
                    src="/logo.png"
                    alt="Deetech Computers logo"
                    width={170}
                    height={48}
                    className="brand-mark__image"
                    loading="eager"
                    fetchPriority="high"
                    fallback={BRAND_FALLBACK}
                    fallbackClassName="brand-mark__fallback"
                  />
                </Link>

            <nav ref={desktopNavRef} className="main-nav" aria-label="Primary navigation">
              {desktopNavItems.map((item) =>
                item.slug ? (
                  (() => {
                    const dropdownBlocks = buildDesktopDropdownBlocks(item);
                    return (
                  <div
                    key={item.slug}
                    className={desktopOpenSlug === item.slug ? "nav-dropdown is-open" : "nav-dropdown"}
                    ref={(node) => {
                      if (node) desktopDropdownRefs.current[item.slug] = node;
                    }}
                    onMouseEnter={() => setDesktopOpenSlug(item.slug)}
                    onMouseLeave={() => setDesktopOpenSlug("")}
                  >
                    <Link
                      href={buildCategoryHref(item.slug)}
                      className={desktopOpenSlug === item.slug ? "nav-link nav-link--toggle is-open" : "nav-link nav-link--toggle"}
                      onClick={closeDesktopDropdown}
                    >
                      <span>
                        {item.label}
                        <span className="sr-only"> product category</span>
                      </span>
                    </Link>
                    {desktopOpenSlug === item.slug ? (
                      <div className="nav-dropdown__panel" style={getDesktopPanelStyle(item.slug, dropdownBlocks.length)}>
                        <div className="nav-dropdown__section">
                          <div
                            className={`nav-dropdown__content nav-dropdown__content--cols-${Math.max(1, Math.min(3, dropdownBlocks.length))}`}
                          >
                            {dropdownBlocks.map((block, blockIndex) => (
                              <div
                                key={`${item.slug}-block-${blockIndex}`}
                                className={
                                  dropdownBlocks.length === 3 && blockIndex === 2
                                    ? "nav-dropdown__column nav-dropdown__column--muted"
                                    : "nav-dropdown__column"
                                }
                              >
                                <p className="nav-dropdown__heading">{block.title}</p>
                                <div className="nav-dropdown__links">
                                  {block.links.map((linkItem) => (
                                      <Link
                                        key={`${item.slug}-${blockIndex}-${linkItem.label}`}
                                        href={linkItem.href}
                                        className="nav-dropdown__link"
                                        onClick={closeDesktopDropdown}
                                      >
                                        {linkItem.label}
                                      </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                    );
                  })()
                ) : (
                  <Link key={item.href} href={item.href} className={isActivePath(pathname, item.href) ? "nav-link is-active" : "nav-link"}>
                    <span>
                      {item.label}
                      <span className="sr-only"> page link</span>
                    </span>
                  </Link>
                )
              )}
            </nav>

                <div className="header-icon-actions">
              <button
                type="button"
                className={headerSearchOpen ? "icon-button icon-button--desktop is-active" : "icon-button icon-button--desktop"}
                aria-label="Search"
                aria-expanded={headerSearchOpen}
                onClick={() => {
                  setAccountMenuOpen(false);
                  setHeaderSearchOpen(true);
                }}
              >
                <ActionIcon name="search" />
              </button>
              <div
                className={wishlistMenuOpen ? "wishlist-dropdown is-open" : "wishlist-dropdown"}
                ref={wishlistMenuRef}
                onMouseEnter={() => setWishlistMenuOpen(true)}
                onMouseLeave={() => setWishlistMenuOpen(false)}
              >
                <Link
                  href="/wishlist"
                  className={wishlistMenuOpen ? "icon-button icon-button--desktop is-active" : "icon-button icon-button--desktop"}
                  aria-label="Wishlist"
                  aria-haspopup="menu"
                  aria-expanded={wishlistMenuOpen}
                >
                  <ActionIcon name="wishlist" />
                  <span className="icon-button__badge">
                    {wishlistBadgeText}
                  </span>
                </Link>
                {wishlistMenuOpen ? (
                  <div className="wishlist-dropdown__panel" role="menu" aria-label="Wishlist preview">
                    {renderDesktopWishlistMenu()}
                  </div>
                ) : null}
              </div>
              <button
                type="button"
                ref={cartMenuRef}
                className={cartDrawerOpen ? "icon-button icon-button--desktop cart-button is-active" : "icon-button icon-button--desktop cart-button"}
                aria-label="Cart"
                aria-haspopup="dialog"
                aria-expanded={cartDrawerOpen}
                onClick={() => {
                  setHeaderSearchOpen(false);
                  setWishlistMenuOpen(false);
                  setAccountMenuOpen(false);
                  setCartDrawerOpen((current) => !current);
                }}
                >
                  <ActionIcon name="cart" />
                <span className={cartStatus === "ready" ? "icon-button__badge" : "icon-button__badge is-pending"}>{cartBadgeText}</span>
              </button>
              <div
                className={accountMenuOpen ? "account-dropdown is-open" : "account-dropdown"}
                ref={accountMenuRef}
                onMouseEnter={() => setAccountMenuOpen(true)}
                onMouseLeave={() => setAccountMenuOpen(false)}
              >
                <Link
                  href="/account"
                  className={accountMenuOpen ? "icon-button icon-button--desktop is-active" : "icon-button icon-button--desktop"}
                  aria-label="Account"
                  aria-haspopup="menu"
                  aria-expanded={accountMenuOpen}
                >
                  <ActionIcon name="account" />
                </Link>
                {accountMenuOpen ? (
                  <div className="account-dropdown__panel" role="menu" aria-label="Account menu">
                    {renderAccountMenuContent()}
                  </div>
                ) : null}
              </div>
            </div>
              </>
            )}
          </div>
        </div>
      </header>
      {portalReady && cartDrawerOpen
        ? createPortal(
            <div className="cart-feedback" role="dialog" aria-modal="true" aria-label="Your cart">
              <button
                type="button"
                className="cart-feedback__backdrop"
                aria-label="Close cart panel"
                onClick={closeCartDrawer}
              />
              <aside className="cart-feedback__panel">
                <header className="cart-feedback__head">
                  <h2>Your Cart</h2>
                  <button type="button" className="cart-feedback__close" onClick={closeCartDrawer} aria-label="Close cart">
                    <span />
                    <span />
                  </button>
                </header>
                <div className="cart-feedback__body">
                  {cartItems.length ? (
                    <div className="cart-feedback__items">
                      {cartItems.map((item, index) => {
                        const id = String(item?.productId || item?._id || item?.id || "");
                        const qty = Number(item?.qty || item?.quantity || 1);
                        const lineTotal = Number(item?.price || 0) * qty;
                        const maxStock = Number(item?.countInStock || 99);
                        return (
                          <article key={id || `${item?.name || "item"}-${index}`} className="cart-feedback__item">
                            <Link href={id ? `/products/${id}` : "/cart"} className="cart-feedback__thumb" onClick={closeCartDrawer}>
                              <StableImage
                                src={resolveProductImage(item?.image || item?.images?.[0])}
                                alt={item?.name || "Cart product"}
                                width={84}
                                height={84}
                              />
                            </Link>
                            <div className="cart-feedback__meta">
                              <div className="cart-feedback__top">
                                <Link href={id ? `/products/${id}` : "/cart"} className="cart-feedback__name" onClick={closeCartDrawer}>
                                  {item?.name || "Product"}
                                </Link>
                                <p className="cart-feedback__price">{formatCartPrice(lineTotal)}</p>
                              </div>
                              <div className="cart-feedback__bottom">
                                <div className="cart-feedback__qty">
                                  <button
                                    type="button"
                                    onClick={() => updateFromDrawer(item, Math.max(1, qty - 1))}
                                    aria-label={`Decrease quantity for ${item?.name || "item"}`}
                                  >
                                    -
                                  </button>
                                  <span>{qty}</span>
                                  <button
                                    type="button"
                                    onClick={() => updateFromDrawer(item, Math.min(maxStock || 99, qty + 1))}
                                    aria-label={`Increase quantity for ${item?.name || "item"}`}
                                  >
                                    +
                                  </button>
                                </div>
                                <button
                                  type="button"
                                  className="cart-feedback__delete"
                                  onClick={(event) => removeFromCartPreview(event, id)}
                                  aria-label={`Remove ${item?.name || "item"} from cart`}
                                >
                                  <ActionIcon name="delete" />
                                  <span>Remove</span>
                                </button>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="cart-feedback__empty">
                      <p>There are no items in your cart.</p>
                    </div>
                  )}
                </div>
                <footer className="cart-feedback__foot">
                  <div className="cart-feedback__subtotal">
                    <span>Subtotal:</span>
                    <strong>{formatCartPrice(cartSubtotal)}</strong>
                  </div>
                  <div className="cart-feedback__actions">
                    <Link href="/cart" className="cart-feedback__view" onClick={closeCartDrawer}>
                      View cart
                    </Link>
                    <Link href="/checkout" className="cart-feedback__checkout" onClick={closeCartDrawer}>
                      Checkout
                    </Link>
                  </div>
                </footer>
              </aside>
            </div>,
            document.body
          )
        : null}
      {portalReady && mobileMenu ? createPortal(mobileMenu, document.body) : null}
    </>
  );
}
