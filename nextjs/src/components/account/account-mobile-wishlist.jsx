"use client";

import Link from "next/link";
import StableImage from "@/components/ui/stable-image";
import { formatCurrency } from "@/lib/format";

function MobileWishlistIcon({ name }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
  };
  const paths = {
    arrowLeft: (
      <>
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M20 21a8 8 0 0 0-16 0" />
      </>
    ),
    heart: (
      <>
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
      </>
    ),
  };

  return (
    <svg className="account-mobile-wishlist__icon" viewBox="0 0 24 24" aria-hidden="true" {...common}>
      {paths[name] || paths.heart}
    </svg>
  );
}

export default function MobileWishlist({ items }) {
  const visibleItems = items.slice(0, 3);

  return (
    <section className="account-mobile-wishlist" aria-label="Wishlist">
      <header className="account-mobile-wishlist__head">
        <Link href="/account" aria-label="Back to account">
          <MobileWishlistIcon name="arrowLeft" />
        </Link>
        <h1>Wishlist</h1>
        <Link href="/account?tab=personal" aria-label="Account profile">
          <MobileWishlistIcon name="user" />
        </Link>
      </header>

      <div className="account-mobile-wishlist__body">
        <p>A mini wishlist preview linked to your main saved-products page.</p>

        {visibleItems.length ? (
          <div className="account-mobile-wishlist__list">
            {visibleItems.map((item) => (
              <article key={item.id} className="account-mobile-wishlist__card">
                <Link href={`/products/${item.id}`} className="account-mobile-wishlist__product">
                  <span className="account-mobile-wishlist__thumb">
                    <StableImage
                      src={item.image}
                      alt={item.name}
                      width={88}
                      height={88}
                    />
                  </span>
                  <span className="account-mobile-wishlist__copy">
                    <strong>{item.name}</strong>
                    <em>{item.category || "Product"}</em>
                  </span>
                </Link>
                <div className="account-mobile-wishlist__meta">
                  <strong>{formatCurrency(item.price)}</strong>
                  <span className={item.inStock ? "is-in-stock" : "is-out"}>
                    {item.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <section className="account-mobile-wishlist__empty">
            <MobileWishlistIcon name="heart" />
            <h2>Your wishlist is empty</h2>
            <p>Save products you want to compare or revisit later.</p>
          </section>
        )}
      </div>

      <div className="account-mobile-wishlist__submit">
        <Link href="/wishlist">Open Wishlist</Link>
      </div>
    </section>
  );
}
