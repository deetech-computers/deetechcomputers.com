"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { buildProductsHref, canonicalCategory, fetchProducts } from "@/lib/products";

function getBacklinkContext(pathname) {
  if (!pathname || pathname === "/") return "homepage";
  if (pathname.startsWith("/products")) return "products page";
  if (pathname.startsWith("/account")) return "account page";
  if (pathname.startsWith("/orders")) return "order tracking page";
  if (pathname.startsWith("/cart")) return "cart page";
  if (pathname.startsWith("/wishlist")) return "wishlist page";
  if (pathname.startsWith("/contact")) return "contact page";
  return "site navigation";
}

function canonicalHomeSectionKey(value) {
  const key = String(value || "").trim().toLowerCase();
  if (!key) return "";
  if (key === "popular") return "hot_deals";
  if (key === "new_arrivals") return "just_landed";
  if (key === "best_laptops") return "student_laptops";
  if (key === "top_smartphones") return "budget_smartphones";
  if (key === "shop_by_brands") return "trusted_brands";
  return key;
}

function SocialIcon({ name }) {
  if (name === "tiktok") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M14.5 3c.4 1.6 1.3 2.8 2.7 3.7 1 .6 2 .9 3.2 1v3.2c-1.7 0-3.4-.5-4.8-1.4v6.2c0 3.8-2.9 6.7-6.8 6.7-2.3 0-4.2-1-5.5-2.6-.8-1-1.2-2.2-1.2-3.6 0-3.8 2.9-6.8 6.7-6.8.3 0 .6 0 .9.1v3.3c-.3-.1-.6-.2-.9-.2-2 0-3.5 1.6-3.5 3.6 0 1.4.8 2.6 2 3.2.5.3 1 .4 1.6.4 2 0 3.5-1.6 3.5-3.6V3h2.1z"
        />
      </svg>
    );
  }
  if (name === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M20 12a8 8 0 0 1-11.7 7L4 20l1.1-4A8 8 0 1 1 20 12zm-8-6.4c-3.5 0-6.3 2.8-6.3 6.4 0 1.3.4 2.6 1.2 3.7l-.7 2.6 2.6-.7a6.3 6.3 0 1 0 3.2-12zm3.8 8.2c-.2-.1-1.4-.7-1.6-.8-.2-.1-.3-.1-.5.1l-.7.8c-.1.1-.3.2-.5.1-1.4-.7-2.4-2-2.6-2.4-.1-.2 0-.3.1-.5l.5-.6.2-.4c.1-.1.1-.3 0-.4 0-.1-.5-1.3-.7-1.7-.2-.5-.4-.4-.5-.4h-.4c-.1 0-.4.1-.5.3-.2.2-.7.7-.7 1.8s.8 2.1.9 2.3c.1.2 1.7 2.7 4 3.7.6.3 1.1.5 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.4-.6 1.6-1.2.2-.6.2-1 .1-1.1-.1-.1-.2-.1-.4-.2z"
        />
      </svg>
    );
  }
  if (name === "facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M13.6 21v-7.7h2.6l.4-3h-3V8.4c0-.9.3-1.5 1.6-1.5h1.7V4.2c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.2H8v3h2.5V21h3.1z"
        />
      </svg>
    );
  }
  if (name === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M7.8 3h8.4C18.9 3 21 5.1 21 7.8v8.4c0 2.7-2.1 4.8-4.8 4.8H7.8C5.1 21 3 18.9 3 16.2V7.8C3 5.1 5.1 3 7.8 3zm0 1.8c-1.7 0-3 1.3-3 3v8.4c0 1.7 1.3 3 3 3h8.4c1.7 0 3-1.3 3-3V7.8c0-1.7-1.3-3-3-3H7.8zm9.1 1.4a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4z"
        />
      </svg>
    );
  }
  if (name === "telegram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M21.2 4.5 3.8 11.2c-1.2.5-1.1 1.2-.2 1.5l4.4 1.4 1.7 5.5c.2.5.1.7.7.7.4 0 .6-.2.8-.4l2.1-2.1 4.4 3.3c.8.4 1.3.2 1.5-.7l3-14.1c.3-1.1-.4-1.5-1-1.2zm-3.3 3-7.7 7.2-.3 3.5-.7-2.4-2.8-.9 11.5-7.3z"
        />
      </svg>
    );
  }
  return null;
}

function FooterFeatureIcon({ name }) {
  if (name === "delivery") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="2" y="8" width="10" height="6.5" rx="1" fill="none" stroke="currentColor" strokeWidth="1.9" />
        <path d="M12 9.5h4l2.8 2.8v2.2H12z" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
        <circle cx="7" cy="16.8" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.9" />
        <circle cx="17.2" cy="16.8" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.9" />
      </svg>
    );
  }
  if (name === "warranty") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 3.5 6 6.2v4.1c0 3.9 2.4 7.2 6 8.8 3.6-1.6 6-4.9 6-8.8V6.2z" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
        <path d="m9.3 11.7 1.7 1.8 3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "safe") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M6.8 6.1a8 8 0 0 1 10.8.9" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        <path d="m17.8 5.9 1.6 1.6-1.6 1.6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17.2 17.9a8 8 0 0 1-10.8-.9" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        <path d="m6.2 18.1-1.6-1.6 1.6-1.6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "service") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4.3 13.1v1.3A2.3 2.3 0 0 0 6.6 16.7H8v-4.5H6.5a2.2 2.2 0 0 0-2.2 2.2zm15.4 0v1.3a2.3 2.3 0 0 1-2.3 2.3H16v-4.5h1.5a2.2 2.2 0 0 1 2.2 2.2z" fill="none" stroke="currentColor" strokeWidth="1.9" />
        <path d="M5.2 12a6.8 6.8 0 0 1 13.6 0" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      </svg>
    );
  }
  return null;
}

export default function SiteFooter() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const [promotionVisibility, setPromotionVisibility] = useState({});
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    let cancelled = false;

    fetchProducts()
      .then((items) => {
        if (cancelled) return;

        const counts = { all: {}, byCategory: {} };
        for (const product of items || []) {
          const productCategory = canonicalCategory(product?.category);
          if (!counts.byCategory[productCategory]) {
            counts.byCategory[productCategory] = {};
          }
          const sections = Array.isArray(product?.homeSections) ? product.homeSections : [];
          for (const raw of sections) {
            const key = canonicalHomeSectionKey(raw);
            if (!key) continue;
            counts.all[key] = (counts.all[key] || 0) + 1;
            counts.byCategory[productCategory][key] = (counts.byCategory[productCategory][key] || 0) + 1;
          }
        }

        if ((items || []).length > 0) {
          counts.all.just_landed = counts.all.just_landed || 1;
        }

        setPromotionVisibility(counts);
      })
      .catch(() => {
        if (cancelled) return;
        setPromotionVisibility({});
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const backlinkContext = getBacklinkContext(pathname);
  const footerSections = [
    {
      title: "Shop & Deals",
      links: [
        { href: buildProductsHref({ promotion: "hot_deals", hash: "shop-results" }), label: "Hot Deals", promotionKey: "hot_deals" },
        { href: buildProductsHref({ promotion: "just_landed", hash: "shop-results" }), label: "Just Landed", promotionKey: "just_landed" },
        { href: buildProductsHref({ category: "laptops", promotion: "student_laptops", hash: "shop-results" }), label: "Laptops for Students", promotionKey: "student_laptops", promotionCategory: "laptops" },
        { href: buildProductsHref({ category: "laptops", promotion: "business_laptops", hash: "shop-results" }), label: "Laptops for Work & Business", promotionKey: "business_laptops", promotionCategory: "laptops" },
        { href: buildProductsHref({ category: "phones", promotion: "budget_smartphones", hash: "shop-results" }), label: "Smartphones for Every Budget", promotionKey: "budget_smartphones", promotionCategory: "phones" },
        { href: buildProductsHref({ category: "accessories", promotion: "quality_accessories", hash: "shop-results" }), label: "Quality Accessories", promotionKey: "quality_accessories", promotionCategory: "accessories" },
        { href: buildProductsHref({ promotion: "trusted_brands", hash: "shop-results" }), label: "Shop Trusted Brands", promotionKey: "trusted_brands" },
        { href: buildProductsHref({ category: "laptops", promotion: "gaming_laptops", hash: "shop-results" }), label: "Powerful / Gaming Laptops", promotionKey: "gaming_laptops", promotionCategory: "laptops" },
      ],
    },
    {
      title: "Order Support",
      links: [
        { href: "/how-it-works", label: "How It Works" },
        { href: "/faq", label: "Frequently Asked Questions" },
        { href: "/account?tab=orders", label: "Track an Order" },
        { href: "/delivery-policy", label: "Shipping & Delivery" },
        { href: "/return-refund", label: "How to Start a Return" },
        { href: "/payment-policy", label: "Payment Options" },
        { href: "/contact", label: "Contact Support" },
      ],
    },
    {
      title: "My Account",
      links: isAuthenticated
        ? [
            { href: "/account", label: "My Account" },
            { href: "/account?tab=orders", label: "My Orders" },
            { href: "/wishlist", label: "My Wishlist" },
            { href: "/account?tab=address", label: "Manage Address" },
          ]
        : [
            { href: "/login", label: "Sign In / Register" },
            { href: "/account", label: "My Account" },
            { href: "/account?tab=orders", label: "My Orders" },
            { href: "/wishlist", label: "My Wishlist" },
            { href: "/account?tab=address", label: "Manage Address" },
            { href: "/forgot-password", label: "Reset Password" },
          ],
    },
    {
      title: "Programs & News",
      links: [
        { href: "/affiliates", label: "Affiliate Program" },
        { href: "/about", label: "About DEETECH" },
      ],
    },
    {
      title: "Useful Links",
      links: [
        { href: "/terms-of-use", label: "Terms & Conditions" },
        { href: "/privacy-policy", label: "Privacy Statement" },
        { href: "/warranty", label: "Warranty" },
        { href: "/contact", label: "Technical Support" },
        { href: "/about", label: "About DEETECH" },
      ],
    },
  ];
  const socialLinks = [
    { href: "https://www.tiktok.com/@deetech.computers?_r=1&_t=ZS-94rKFc7vpAr", label: "TikTok", icon: "tiktok" },
    { href: "https://whatsapp.com/channel/0029VavCp7HInlqHhP0aGf3z", label: "WhatsApp", icon: "whatsapp" },
    { href: "https://www.facebook.com/share/19NkhoTCdi/?mibextid=wwXIfr", label: "Facebook", icon: "facebook" },
    { href: "https://www.instagram.com/deetechcomputers1/", label: "Instagram", icon: "instagram" },
    { href: "https://t.me/Deetechcomputers01", label: "Telegram", icon: "telegram" },
  ];
  const footerFeatures = [
    {
      icon: "delivery",
      title: "Nationwide Delivery",
      subtitle: "We Deliver Across Ghana",
    },
    {
      icon: "warranty",
      title: "Warranty",
      subtitle: "Brand & Product Specific",
    },
    {
      icon: "safe",
      title: "Safe Shopping",
      subtitle: "Secure Shopping Experience",
    },
    {
      icon: "service",
      title: "After Sale Service",
      subtitle: "Call: +233591755964",
    },
  ];

  const visibleFooterSections = useMemo(
    () =>
      footerSections
        .map((section) => ({
          ...section,
          links: section.links.filter((item) => {
            if (!item.promotionKey) return true;
            const categoryScope = String(item.promotionCategory || "").trim().toLowerCase();
            if (categoryScope) {
              return Number(promotionVisibility.byCategory?.[categoryScope]?.[item.promotionKey] || 0) > 0;
            }
            return Number(promotionVisibility.all?.[item.promotionKey] || 0) > 0;
          }),
        }))
        .filter((section) => section.links.length > 0),
    [footerSections, promotionVisibility]
  );

  if (isAdminRoute) return null;

  return (
    <footer className="site-footer">
      <section className="footer-feature-band" aria-label="Service highlights">
        <div className="shell footer-feature-grid">
          {footerFeatures.map((item) => (
            <article key={item.title} className="footer-feature-item">
              <span className="footer-feature-item__icon">
                <FooterFeatureIcon name={item.icon} />
              </span>
              <div className="footer-feature-item__copy">
                <strong>{item.title}</strong>
                <span>{item.subtitle}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="shell footer-grid footer-grid--desktop">
        <h2 className="sr-only">Site footer navigation</h2>
        {visibleFooterSections.map((section) => (
          <section key={section.title} className="footer-section">
            <h3>{section.title}</h3>
            <ul className="footer-links">
              {section.links.map((item) => (
                <li key={item.href + item.label}>
                  <Link href={item.href}>
                    {item.label}
                    <span className="sr-only"> link from {backlinkContext}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div className="shell footer-grid footer-grid--mobile">
        <h2 className="sr-only">Site footer navigation for mobile</h2>
        {visibleFooterSections.map((section) => (
          <details key={section.title} className="footer-section" open={false}>
            <summary>{section.title}</summary>
            <ul className="footer-links">
              {section.links.map((item) => (
                <li key={item.href + item.label}>
                  <Link href={item.href}>
                    {item.label}
                    <span className="sr-only"> link from {backlinkContext}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
      <div className="shell footer-meta">
        <div className="footer-socials" aria-label="Social media links">
          {socialLinks.map((item) => (
            <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label}>
              <SocialIcon name={item.icon} />
            </a>
          ))}
        </div>
        <div className="footer-legal-links">
          <Link href="/privacy-policy">Privacy Statement</Link>
          <Link href="/terms-of-use">Terms and Conditions</Link>
          <Link href="/payment-policy">Payments & Billing Terms</Link>
          <Link href="/return-refund">Return and Refund Policy</Link>
        </div>
        <p className="footer-address">
          DEETECH COMPUTERS, Kumasi Adum Asempa Building and Kumasi Bantama, Ghana.
        </p>
        <p className="footer-copyright">© Copyright 2026 DEETECH COMPUTERS. All rights reserved.</p>
        <p className="footer-disclaimer">
          Product prices, availability, and delivery timelines may vary by stock levels and location. Promotions may be
          limited by time, quantity, and eligibility.
        </p>
      </div>
    </footer>
  );
}
