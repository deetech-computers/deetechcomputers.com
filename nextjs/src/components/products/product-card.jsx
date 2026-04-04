"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import { resolveProductImage } from "@/lib/products";
import { useToast } from "@/components/providers/toast-provider";

const WISHLIST_STORAGE_KEY = "deetech:wishlist";

function readWishlist() {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map((item) => String(item)) : [];
  } catch {
    return [];
  }
}

function writeWishlist(items) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
}

function getImageAlt(product) {
  return product?.name || product?.title || "Product image";
}

function getRating(product) {
  return Math.max(0, Math.min(5, Math.round(Number(product?.rating ?? product?.averageRating ?? 4))));
}

function getSummary(product) {
  const source =
    product?.shortDescription ||
    product?.description ||
    product?.name ||
    "Shop this product";

  return String(source).replace(/\s+/g, " ").trim();
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 21.35 10.55 20C5.4 15.24 2 12.09 2 8.25 2 5.1 4.42 2.75 7.5 2.75c1.74 0 3.41.81 4.5 2.09 1.09-1.28 2.76-2.09 4.5-2.09 3.08 0 5.5 2.35 5.5 5.5 0 3.84-3.4 6.99-8.55 11.76L12 21.35Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7a2.6 2.6 0 0 0 0-1.39l7-4.11A2.99 2.99 0 1 0 15 5a3 3 0 0 0 .04.49l-7 4.11a3 3 0 1 0 0 4.8l7.13 4.19c-.08.22-.13.46-.13.71a3 3 0 1 0 3-3Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2Zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2ZM7.17 14h9.96c.75 0 1.4-.41 1.74-1.03L22 7.5V5H6.21l-.94-2H2v2h2l3.6 7.59-1.35 2.44A1.98 1.98 0 0 0 8 18h12v-2H8l1.17-2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function ProductCard({ product, onAddToCart, variant = "default" }) {
  const { pushToast } = useToast();
  const productId = String(product?._id || product?.id || "");
  const [wishlisted, setWishlisted] = useState(() =>
    productId ? readWishlist().includes(productId) : false
  );
  const image = resolveProductImage(product.images?.[0] || product.image);
  const price = Number(product?.price || 0);
  const rating = getRating(product);
  const productHref = `/products/${productId}`;
  const isCatalog = variant === "catalog";
  const sharePayload = useMemo(
    () => ({
      title: product?.name || "Deetech product",
      text: getSummary(product),
    }),
    [product]
  );

  function toggleWishlist() {
    if (!productId) return;

    const nextWishlist = wishlisted
      ? readWishlist().filter((item) => item !== productId)
      : Array.from(new Set([...readWishlist(), productId]));

    writeWishlist(nextWishlist);
    setWishlisted(nextWishlist.includes(productId));
    pushToast(
      wishlisted ? "Removed from wishlist" : "Saved to wishlist",
      wishlisted ? "info" : "success"
    );
  }

  async function handleShare() {
    if (typeof window === "undefined") return;

    const url = `${window.location.origin}${productHref}`;

    try {
      if (navigator.share) {
        await navigator.share({ ...sharePayload, url });
        pushToast("Product shared", "success");
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        pushToast("Product link copied", "success");
        return;
      }

      pushToast("Sharing is not available on this device", "warning");
    } catch (error) {
      if (error?.name === "AbortError") return;
      pushToast("Could not share this product right now", "warning");
    }
  }

  function handleAddToCart() {
    if (typeof onAddToCart === "function") {
      onAddToCart(product);
    } else {
      pushToast("Open the product to add it from here", "info");
    }
  }

  return (
    <article className={`product-card${isCatalog ? " product-card--catalog" : ""}`}>
      <div className="product-card__media-wrap">
        <Link href={productHref} className={`product-card__link${isCatalog ? " product-card__link--media" : ""}`}>
          <div className="product-card__media">
            <div className="product-card__image-shell">
              {image ? <img src={image} alt={getImageAlt(product)} loading="lazy" /> : <div className="product-card__placeholder">No image</div>}
            </div>
          </div>
        </Link>

        {isCatalog ? (
          <div className="product-card__actions" aria-label="Product actions">
            <button
              type="button"
              className={`product-card__icon-button${wishlisted ? " is-active" : ""}`}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={wishlisted}
              onClick={toggleWishlist}
            >
              <HeartIcon />
            </button>
            <button
              type="button"
              className="product-card__icon-button"
              aria-label="Share product"
              onClick={handleShare}
            >
              <ShareIcon />
            </button>
          </div>
        ) : null}
      </div>

      <div className="product-card__body">
        <p className="product-card__rating" aria-label={`${rating} out of 5 stars`}>
          {Array.from({ length: 5 }, (_, index) => (
            <span key={index} className={index < rating ? "is-filled" : ""}>{"\u2605"}</span>
          ))}
        </p>
        <Link href={productHref} className="product-card__title-link">
          <h3>{getSummary(product)}</h3>
        </Link>
        <p className="product-card__price">{formatCurrency(price)}</p>
      </div>

      {isCatalog ? (
        <div className="product-card__footer">
          <button type="button" className="product-card__cart-button" onClick={handleAddToCart}>
            <CartIcon />
            <span>Add to cart</span>
          </button>
        </div>
      ) : null}
    </article>
  );
}
