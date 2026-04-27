"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import StableImage from "@/components/ui/stable-image";
import EmptyState from "@/components/ui/empty-state";
import { useToast } from "@/components/providers/toast-provider";
import { SITE_URL } from "@/lib/config";
import { formatCurrency } from "@/lib/format";
import { fetchProducts, formatCategoryLabel, getProductPrice, getProductStock, resolveProductImage } from "@/lib/products";
import {
  clearWishlistEntries,
  readWishlistEntries,
  removeWishlistEntry,
  writeWishlistEntries,
} from "@/lib/wishlist";

function formatDateLabel(value) {
  if (!value) return "Recently added";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently added";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function RemoveIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 3h6l1 2h4v2H4V5h4l1-2Zm-1 6h2v8H8V9Zm6 0h2v8h-2V9ZM5 7h14l-1 13H6L5 7Z" fill="currentColor" />
    </svg>
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

        return {
          entry,
          product,
          id: entry.id,
          price: getProductPrice(product),
          inStock: getProductStock(product) > 0,
          dateLabel: formatDateLabel(entry.addedAt),
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
    <main className="shell page-section">
      <section className="cart-hero wishlist-hero">
        <h1>Wishlist</h1>
        <p className="cart-hero__crumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Wishlist</span>
        </p>
      </section>

      {status === "loading" ? (
        <section className="panel wishlist-empty">
          <h2>Loading wishlist...</h2>
        </section>
      ) : !isAuthenticated ? (
        <section className="panel wishlist-empty">
          <h2>Wishlist is for account holders</h2>
          <p className="hero-copy">Create an account or login to save products to your wishlist and access them from any device.</p>
          <div className="stack-actions">
            <Link href="/login" className="primary-link">Login</Link>
            <Link href="/register" className="ghost-link">Create account</Link>
            <Link href="/account" className="ghost-link">Go to account</Link>
          </div>
        </section>
      ) : !wishlistItems.length ? (
        <EmptyState
          icon="wishlist"
          title="Your wishlist is empty"
          description="Save products you love so you can compare and add them to cart later."
          actionHref="/products"
          actionLabel="Browse products"
        />
      ) : (
        <section className="wishlist-shell">
          <div className="wishlist-table panel">
            <header className="wishlist-table__head" aria-hidden="true">
              <span>Product</span>
              <span>Price</span>
              <span>Date Added</span>
              <span>Stock Status</span>
              <span></span>
            </header>

            <div className="wishlist-list">
              {wishlistItems.map((item) => (
                <article key={item.id} className="wishlist-row">
                  <button
                    type="button"
                    className="wishlist-row__remove"
                    onClick={() => handleRemove(item.id)}
                    aria-label={`Remove ${item.product.name} from wishlist`}
                  >
                    <RemoveIcon />
                    <span>Remove</span>
                  </button>

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

                  <p className="wishlist-row__price">{formatCurrency(item.price)}</p>
                  <p className="wishlist-row__date">{item.dateLabel}</p>
                  <p className={item.inStock ? "wishlist-row__stock is-in-stock" : "wishlist-row__stock is-out-of-stock"}>
                    {item.inStock ? "Instock" : "Out of stock"}
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
                  </div>

                  <div className="wishlist-row__mobile-actions">
                    <button
                      type="button"
                      className="wishlist-row__remove-mobile"
                      onClick={() => handleRemove(item.id)}
                    >
                      <RemoveIcon />
                      <span>Remove</span>
                    </button>
                    <button
                      type="button"
                      className="wishlist-row__cart"
                      disabled={!item.inStock}
                      onClick={() => handleAddToCart(item.product)}
                    >
                      {item.inStock ? "Add to Cart" : "Out of Stock"}
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
