"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import { resolveProductImage } from "@/lib/products";
import { useToast } from "@/components/providers/toast-provider";
import { useCart } from "@/hooks/use-cart";

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
    product?.short_description ||
    product?.description ||
    product?.name ||
    "Shop this product";

  return String(source).replace(/\s+/g, " ").trim();
}

function getCategoryLabel(product) {
  return String(product?.category || "").replace(/[_-]+/g, " ").trim() || "Products";
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

function ActionIcon({ src, alt }) {
  return <img src={src} alt={alt} className="product-card__icon-asset" loading="lazy" />;
}

export default function ProductCard({ product, onAddToCart, variant = "default" }) {
  const { pushToast } = useToast();
  const { items } = useCart();
  const productId = String(product?._id || product?.id || "");
  const [wishlisted, setWishlisted] = useState(() =>
    productId ? readWishlist().includes(productId) : false
  );
  const [justAdded, setJustAdded] = useState(false);
  const highlightTimerRef = useRef(null);
  const image = resolveProductImage(product.images?.[0] || product.image);
  const price = Number(product?.price || 0);
  const rating = getRating(product);
  const productHref = `/products/${productId}`;
  const isCatalog = variant === "catalog";
  const isRelated = variant === "related";
  const stock = Number(product?.countInStock ?? product?.stock_quantity ?? product?.stock ?? 0);
  const summary = getSummary(product);
  const categoryLabel = getCategoryLabel(product);
  const sharePayload = useMemo(
    () => ({
      title: product?.name || "Deetech product",
      text: summary,
    }),
    [product, summary]
  );
  const cartQuantity = useMemo(
    () =>
      items.reduce((sum, item) => {
        const itemId = String(item?.productId || item?._id || "");
        return itemId === productId ? sum + Number(item?.qty || 0) : sum;
      }, 0),
    [items, productId]
  );
  const isInCart = cartQuantity > 0;

  useEffect(() => {
    return () => {
      if (highlightTimerRef.current) {
        window.clearTimeout(highlightTimerRef.current);
      }
    };
  }, []);

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
      setJustAdded(true);
      if (highlightTimerRef.current) {
        window.clearTimeout(highlightTimerRef.current);
      }
      highlightTimerRef.current = window.setTimeout(() => {
        setJustAdded(false);
      }, 1800);
    } else {
      pushToast("Open the product to add it from here", "info");
    }
  }

  return (
    <article className={`product-card${isCatalog ? " product-card--catalog" : ""}${isRelated ? " product-card--related" : ""}`}>
      <div className="product-card__media-wrap">
        <Link href={productHref} className={`product-card__link${isCatalog || isRelated ? " product-card__link--media" : ""}`}>
          <div className="product-card__media">
            <div className="product-card__image-shell">
              {image ? <img src={image} alt={getImageAlt(product)} loading="lazy" /> : <div className="product-card__placeholder">No image</div>}
            </div>
          </div>
        </Link>
      </div>

      <div className="product-card__body">
        {isRelated ? (
          <div className="product-card__meta-row">
            <p className="product-card__category">{categoryLabel}</p>
            <p className="product-card__rating" aria-label={`${rating} out of 5 stars`}>
              {Array.from({ length: 5 }, (_, index) => (
                <span key={index} className={index < rating ? "is-filled" : ""}>{"\u2605"}</span>
              ))}
              <strong>{rating.toFixed(1)}</strong>
            </p>
          </div>
        ) : null}
        <Link href={productHref} className="product-card__title-link">
          <h3>{product?.name || "Product"}</h3>
        </Link>
        <p className="product-card__description">{isRelated ? summary : summary}</p>
        <p className="product-card__price">{formatCurrency(price)}</p>
        {!isRelated ? (
          <p className="product-card__rating" aria-label={`${rating} out of 5 stars`}>
            {Array.from({ length: 5 }, (_, index) => (
              <span key={index} className={index < rating ? "is-filled" : ""}>{"\u2605"}</span>
            ))}
            <strong>{rating.toFixed(1)}</strong>
          </p>
        ) : null}
      </div>

      {isCatalog ? (
        <div className="product-card__footer">
          <div className="product-card__footer-actions" aria-label="Product actions">
            <button
              type="button"
              className="product-card__icon-button product-card__icon-button--footer"
              aria-label="Share product"
              onClick={handleShare}
            >
              <ActionIcon src="/icons/share.svg" alt="" />
            </button>
            <button
              type="button"
              className={`product-card__cart-button${isInCart ? " is-in-cart" : ""}${justAdded ? " is-just-added" : ""}`}
              onClick={handleAddToCart}
              disabled={stock < 1}
              aria-label={stock > 0 ? (isInCart ? `Add another to cart. ${cartQuantity} already in cart` : "Add to cart") : "Unavailable"}
            >
              <CartIcon />
              <span>
                {stock < 1 ? "Unavailable" : isInCart ? `Added (${cartQuantity})` : "Add to cart"}
              </span>
            </button>
            <button
              type="button"
              className={`product-card__icon-button product-card__icon-button--footer${wishlisted ? " is-active" : ""}`}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={wishlisted}
              onClick={toggleWishlist}
            >
              <ActionIcon src="/icons/wishlist.svg" alt="" />
            </button>
          </div>
        </div>
      ) : null}
    </article>
  );
}
