"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import StableImage from "@/components/ui/stable-image";
import { useToast } from "@/components/providers/toast-provider";
import { SITE_URL } from "@/lib/config";
import { formatCurrency } from "@/lib/format";
import { fetchProducts, formatCategoryLabel, getProductStock, resolveProductImage } from "@/lib/products";
import { getProductPricing } from "@/lib/product-pricing";
import "./wishlist-desktop.css";
import "./wishlist-mobile.css";
import {
  clearWishlistEntries,
  readWishlistEntries,
  removeWishlistEntry,
  writeWishlistEntries,
} from "@/lib/wishlist";

function RemoveIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 7h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10 4h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 7v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function WishlistEmptyMark() {
  return (
    <div className="wishlist-empty-state__mark" aria-hidden="true">
      <svg className="wishlist-empty-state__heart" viewBox="0 0 120 120">
        <path d="M60 98 24 63c-14-14-6-39 14-39 9 0 17 5 22 13 5-8 13-13 22-13 20 0 28 25 14 39L60 98Z" fill="#dce7fb" stroke="#00401b" strokeWidth="6" strokeLinejoin="round" />
        <path d="m44 58 11 11 23-29" fill="none" stroke="#00401b" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>
        <svg viewBox="0 0 24 24">
          <path d="M6 6h2l2 10h8l2-7H9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 20h.01M18 20h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path d="M15 4v6M12 7h6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </span>
    </div>
  );
}

function WishlistEmptyIcon({ type }) {
  if (type === "phone") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="8" y="3" width="8" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M11 17h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "cart") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h16l-2 9H7L4 7Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M8 20h.01M17 20h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 6h12v8H6V6Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M10 18h4l1-4H9l1 4Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function WishlistSkeleton() {
  return (
    <section className="wishlist-shell wishlist-skeleton" aria-label="Loading wishlist">
      <div className="wishlist-table panel">
        <div className="wishlist-skeleton__head">
          {Array.from({ length: 6 }, (_, index) => (
            <span key={index} />
          ))}
        </div>
        <div className="wishlist-skeleton__list">
          {Array.from({ length: 3 }, (_, index) => (
            <article key={index} className="wishlist-skeleton__row">
              <span className="wishlist-skeleton__button" />
              <div className="wishlist-skeleton__product">
                <span className="wishlist-skeleton__thumb" />
                <div className="wishlist-skeleton__meta">
                  <span />
                  <span />
                </div>
              </div>
              <span />
              <span />
              <span />
              <span className="wishlist-skeleton__button" />
            </article>
          ))}
        </div>
      </div>
      <div className="wishlist-skeleton__actions">
        <span />
        <span />
        <span />
      </div>
    </section>
  );
}

export default function WishlistPage() {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { pushToast } = useToast();
  const [status, setStatus] = useState("loading");
  const [products, setProducts] = useState([]);
  const [wishlistEntries, setWishlistEntries] = useState([]);

  useEffect(() => {
    setWishlistEntries(readWishlistEntries());

    fetchProducts()
      .then((items) => {
        setProducts(Array.isArray(items) ? items : []);
        setStatus("ready");
      })
      .catch(() => {
        setProducts([]);
        setStatus("ready");
      });
  }, []);

  const wishlistItems = useMemo(() => {
    const productMap = new Map(
      products.map((product) => [String(product?._id || product?.id || ""), product])
    );

    return wishlistEntries
      .map((entry) => {
        const product = productMap.get(entry.id);
        if (!product) return null;

        const pricing = getProductPricing(product);

        return {
          entry,
          product,
          id: entry.id,
          price: pricing.currentPrice,
          originalPrice: pricing.originalPrice,
          hasDiscount: pricing.isDiscountActive,
          inStock: getProductStock(product) > 0,
          image: resolveProductImage(product?.images?.[0] || product?.image),
          categoryLabel: formatCategoryLabel(product?.category || "Product"),
        };
      })
      .filter(Boolean);
  }, [products, wishlistEntries]);

  const wishlistLink = useMemo(() => {
    const ids = wishlistEntries.map((item) => item.id).filter(Boolean);
    if (!ids.length) return `${SITE_URL}/wishlist`;
    return `${SITE_URL}/wishlist?items=${encodeURIComponent(ids.join(","))}`;
  }, [wishlistEntries]);

  function handleRemove(productId) {
    const nextEntries = removeWishlistEntry(productId);
    setWishlistEntries(nextEntries);
    pushToast("Removed from wishlist", "info");
  }

  function handleAddToCart(product) {
    addItem(product, 1);
  }

  function handleAddAllToCart() {
    if (!wishlistItems.length) {
      pushToast("Your wishlist is empty", "info");
      return;
    }

    const inStockItems = wishlistItems.filter((item) => item.inStock);
    if (!inStockItems.length) {
      pushToast("No in-stock wishlist items to add", "warning");
      return;
    }

    inStockItems.forEach((item) => addItem(item.product, 1));
    pushToast("Wishlist items added to cart", "success");
  }

  function handleClearWishlist() {
    clearWishlistEntries();
    setWishlistEntries([]);
    pushToast("Wishlist cleared", "info");
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(wishlistLink);
      pushToast("Wishlist link copied", "success");
    } catch {
      pushToast("Could not copy wishlist link", "warning");
    }
  }

  useEffect(() => {
    if (!wishlistEntries.length) return;
    writeWishlistEntries(wishlistEntries);
  }, [wishlistEntries]);

  return (
    <main className="shell page-section wishlist-page">
      <section className="cart-hero wishlist-hero">
        <h1>Wishlist</h1>
        <p className="cart-hero__crumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Wishlist</span>
        </p>
      </section>

      {status === "loading" ? (
        <WishlistSkeleton />
      ) : !isAuthenticated ? (
        <section className="wishlist-guest-state" aria-labelledby="wishlist-guest-title">
          <div className="wishlist-guest-state__card">
            <div className="wishlist-guest-state__mark" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <rect x="5" y="11" width="14" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <div className="wishlist-guest-state__copy">
              <p className="wishlist-guest-state__eyebrow">Saved products</p>
              <h2 id="wishlist-guest-title">Wishlist is for account holders</h2>
              <p>Create an account or login to save products to your wishlist and access them from any device.</p>
            </div>
            <div className="wishlist-guest-state__actions">
              <Link href="/login" className="wishlist-guest-state__primary">Login</Link>
              <Link href="/register" className="wishlist-guest-state__secondary">Create account</Link>
              <Link href="/account" className="wishlist-guest-state__secondary">Go to account</Link>
            </div>
          </div>
        </section>
      ) : !wishlistItems.length ? (
        <section className="wishlist-empty-state" aria-labelledby="wishlist-empty-title">
          <div className="wishlist-empty-state__card">
            <WishlistEmptyMark />
            <div className="wishlist-empty-state__copy">
              <p className="wishlist-empty-state__eyebrow">Saved products</p>
              <h2 id="wishlist-empty-title">Your wishlist is empty</h2>
              <p>
                Save your favorite DEETECH hardware so you can compare stock, prices, and cart them later.
              </p>
            </div>
            <Link href="/products" className="wishlist-empty-state__primary">
              Browse Products
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <div className="wishlist-empty-state__quick-links" aria-label="Wishlist empty quick links">
            <Link href="/products/laptops">
              <WishlistEmptyIcon type="laptop" />
              <span>
                <strong>Laptops</strong>
                <small>Save work, school, and gaming picks</small>
              </span>
            </Link>
            <Link href="/products/phones">
              <WishlistEmptyIcon type="phone" />
              <span>
                <strong>Phones</strong>
                <small>Track clean smartphone options</small>
              </span>
            </Link>
            <Link href="/cart">
              <WishlistEmptyIcon type="cart" />
              <span>
                <strong>Shopping Cart</strong>
                <small>Return to items ready for checkout</small>
              </span>
            </Link>
          </div>
        </section>
      ) : (
        <section className="wishlist-shell">
          <div className="wishlist-table panel">
            <header className="wishlist-table__head" aria-hidden="true">
              <span>Product</span>
              <span>Price</span>
              <span>Stock</span>
              <span>Actions</span>
            </header>

            <div className="wishlist-list">
              {wishlistItems.map((item, index) => (
                <article key={item.id} className={index % 2 === 1 ? "wishlist-row is-striped" : "wishlist-row"}>
                  <Link href={`/products/${item.id}`} className="wishlist-row__product">
                    <div className="wishlist-row__thumb">
                      <StableImage
                        src={item.image}
                        alt={item.product.name}
                        width={120}
                        height={120}
                      />
                    </div>

                    <div className="wishlist-row__meta">
                      <h3>{item.product.name}</h3>
                      <p>{item.categoryLabel}</p>
                    </div>
                  </Link>

                  <div className="wishlist-row__category-mobile">
                    <span>{item.categoryLabel}</span>
                    <button
                      type="button"
                      className="wishlist-row__remove-mobile"
                      onClick={() => handleRemove(item.id)}
                      aria-label={`Remove ${item.product.name} from wishlist`}
                    >
                      <RemoveIcon />
                    </button>
                  </div>

                  <div className="wishlist-row__price-block">
                    <p className="wishlist-row__price">{formatCurrency(item.price)}</p>
                    {item.hasDiscount ? (
                      <p className="wishlist-row__price-old">{formatCurrency(item.originalPrice)}</p>
                    ) : null}
                  </div>

                  <p className={item.inStock ? "wishlist-row__stock is-in-stock" : "wishlist-row__stock is-out-of-stock"}>
                    {item.inStock ? "In Stock" : "Out of Stock"}
                  </p>

                  <div className="wishlist-row__action">
                    <button
                      type="button"
                      className="wishlist-row__cart"
                      disabled={!item.inStock}
                      onClick={() => handleAddToCart(item.product)}
                    >
                      {item.inStock ? "Add to Cart" : "Out of Stock"}
                    </button>
                    <button
                      type="button"
                      className="wishlist-row__remove"
                      onClick={() => handleRemove(item.id)}
                      aria-label={`Remove ${item.product.name} from wishlist`}
                    >
                      <RemoveIcon />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <section className="wishlist-actions">
            <div className="wishlist-actions__link">
              <label htmlFor="wishlist-link">Wishlist link:</label>
              <input
                id="wishlist-link"
                className="field wishlist-actions__input"
                value={wishlistLink}
                readOnly
              />
              <button type="button" className="wishlist-actions__copy" onClick={handleCopyLink}>
                Copy Link
              </button>
            </div>

            <button type="button" className="wishlist-actions__clear" onClick={handleClearWishlist}>
              Clear Wishlist
            </button>

            <button type="button" className="wishlist-actions__add-all" onClick={handleAddAllToCart}>
              Add All to Cart
            </button>
          </section>
        </section>
      )}
    </main>
  );
}
