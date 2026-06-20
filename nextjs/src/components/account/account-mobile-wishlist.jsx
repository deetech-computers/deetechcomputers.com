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
    brokenHeart: (
      <>
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
        <path d="m13 5-3 5h4l-3 6" />
      </>
    ),
    cart: (
      <>
        <path d="M6 6h15l-2 9H8L6 6Z" />
        <path d="M6 6 5 3H2" />
        <circle cx="9" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </>
    ),
    chip: (
      <>
        <rect x="7" y="7" width="10" height="10" rx="1" />
        <path d="M9 1v3" />
        <path d="M15 1v3" />
        <path d="M9 20v3" />
        <path d="M15 20v3" />
        <path d="M20 9h3" />
        <path d="M20 15h3" />
        <path d="M1 9h3" />
        <path d="M1 15h3" />
        <path d="M10 10h4v4h-4Z" />
      </>
    ),
    board: (
      <>
        <rect x="4" y="5" width="16" height="14" rx="1" />
        <path d="M8 9h4v4H8Z" />
        <path d="M15 9h2" />
        <path d="M15 13h2" />
        <path d="M8 16h9" />
        <path d="M2 9h2" />
        <path d="M2 15h2" />
        <path d="M20 9h2" />
        <path d="M20 15h2" />
      </>
    ),
    checkBadge: (
      <>
        <path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6l-8-3Z" />
        <path d="m9 12 2 2 4-5" />
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
  const hasItems = visibleItems.length > 0;

  return (
    <section className="account-mobile-wishlist" aria-label="Wishlist">
      <header className="account-mobile-wishlist__head">
        <Link href="/account" aria-label="Back to account">
          <MobileWishlistIcon name="arrowLeft" />
        </Link>
        <div className="account-mobile-wishlist__title">
          <span>Account</span>
          <h1>Wishlist</h1>
        </div>
        <Link href="/account?tab=personal" aria-label="Account profile">
          <MobileWishlistIcon name={hasItems ? "user" : "heart"} />
        </Link>
      </header>

      <div className={hasItems ? "account-mobile-wishlist__body" : "account-mobile-wishlist__body is-empty"}>
        {hasItems ? <p>A mini wishlist preview linked to your main saved-products page.</p> : null}

        {hasItems ? (
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
            <div className="account-mobile-wishlist__empty-mark" aria-hidden="true">
              <MobileWishlistIcon name="brokenHeart" />
              <i><MobileWishlistIcon name="cart" /></i>
            </div>
            <h2>Your wishlist is empty</h2>
            <p>Save your favorite hardware to track availability.</p>
            <Link href="/products" className="account-mobile-wishlist__empty-action">Browse Products</Link>
            <div className="account-mobile-wishlist__empty-categories">
              <Link href="/products/accessories">
                <MobileWishlistIcon name="chip" />
                <span>Processors</span>
              </Link>
              <Link href="/products/accessories">
                <MobileWishlistIcon name="board" />
                <span>Mainboards</span>
              </Link>
            </div>
          </section>
        )}
      </div>

      {hasItems ? (
        <div className="account-mobile-wishlist__submit">
          <Link href="/wishlist">Open Wishlist</Link>
        </div>
      ) : null}
    </section>
  );
}
