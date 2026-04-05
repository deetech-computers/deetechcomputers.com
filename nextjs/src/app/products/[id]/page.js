"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductCard from "@/components/products/product-card";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/providers/toast-provider";
import { formatCurrency } from "@/lib/format";
import { API_BASE } from "@/lib/config";
import { requestJson } from "@/lib/http";
import { requestWithToken } from "@/lib/resource";
import {
  canonicalCategory,
  fetchProductById,
  fetchProducts,
  formatCategoryLabel,
  getProductRating,
  getProductReviewCount,
  getProductStock,
  resolveProductImage,
} from "@/lib/products";

function getProductImages(product) {
  const images = Array.isArray(product?.images) ? product.images : [];
  const normalized = images.map((image) => resolveProductImage(image)).filter(Boolean);
  const fallback = resolveProductImage(product?.image);

  if (fallback && !normalized.includes(fallback)) {
    normalized.unshift(fallback);
  }

  return normalized;
}

function getProductSpecs(product) {
  const specs = product?.specs;
  if (!specs) return [];
  if (typeof specs.entries === "function") return Array.from(specs.entries());
  if (typeof specs === "object") return Object.entries(specs);
  return [];
}

function getProductDescription(product) {
  return (
    product?.description ||
    product?.shortDescription ||
    product?.short_description ||
    "This product is part of our carefully selected collection built to deliver dependable quality, strong day-to-day performance, and a cleaner setup for work or home."
  );
}

function getReviewAverage(reviews) {
  const ratings = (reviews || [])
    .map((review) => Number(review?.rating))
    .filter((value) => Number.isFinite(value) && value > 0);

  if (!ratings.length) return 0;
  return ratings.reduce((sum, value) => sum + value, 0) / ratings.length;
}

function getReviewBreakdown(reviews) {
  return [5, 4, 3, 2, 1].map((stars) => {
    const count = (reviews || []).filter((review) => Number(review?.rating) === stars).length;
    const total = reviews?.length || 0;
    return {
      stars,
      count,
      percentage: total ? (count / total) * 100 : 0,
    };
  });
}

function getReviewTimeLabel(value) {
  const timestamp = new Date(value || Date.now()).getTime();
  const diff = Date.now() - timestamp;
  const day = 24 * 60 * 60 * 1000;
  const month = 30 * day;

  if (diff < day) return "Today";
  if (diff < 2 * day) return "1 day ago";
  if (diff < month) return `${Math.max(1, Math.floor(diff / day))} days ago`;
  if (diff < 2 * month) return "1 month ago";
  return `${Math.max(2, Math.floor(diff / month))} months ago`;
}

function getReviewerInitials(name) {
  const parts = String(name || "Customer")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  return (parts.map((part) => part[0]?.toUpperCase() || "").join("") || "CU").slice(0, 2);
}

const WISHLIST_STORAGE_KEY = "deetech:wishlist";
const SOCIAL_LINKS = [
  { label: "TikTok", href: "https://www.tiktok.com/@deetech.computers?_r=1&_t=ZS-94rKFc7vpAr", icon: "tiktok" },
  { label: "WhatsApp", href: "https://wa.me/message/WEYXKNNA6KXXL1", icon: "whatsapp" },
  { label: "Facebook", href: "https://www.facebook.com/share/19NkhoTCdi/?mibextid=wwXIfr", icon: "facebook" },
  { label: "Instagram", href: "https://www.instagram.com/deetechcomputers1/", icon: "instagram" },
];

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

function ProductActionIcon({ name }) {
  if (name === "copy") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 9h10v12H9zM5 3h10v3H8v9H5z" fill="currentColor" />
      </svg>
    );
  }
  if (name === "wishlist") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21 4.7 13.9A4.9 4.9 0 0 1 12 7a4.9 4.9 0 0 1 7.3 6.9Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "share") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15 8a3 3 0 1 0-2.8-4H12a3 3 0 0 0 .2 1L8 7.2a3 3 0 1 0 0 9.6l4.2 2.2A3 3 0 1 0 13 17a3 3 0 0 0-.2 1l-4.2-2.2a3 3 0 0 0 0-7.6L12.8 6A3 3 0 0 0 15 8Z" fill="currentColor" />
      </svg>
    );
  }
  const icons = {
    facebook: "f",
    tiktok: "♪",
    instagram: "◎",
    whatsapp: "◔",
  };
  return <span aria-hidden="true">{icons[name] || "•"}</span>;
}

function SocialAppIcon({ name }) {
  if (name === "facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13.4 21v-7.3h2.4l.4-2.9h-2.8V9c0-.8.2-1.4 1.4-1.4H16V5.1c-.2 0-.9-.1-1.8-.1-2.5 0-4.2 1.5-4.2 4.4v1.4H7.5v2.9H10V21h3.4Z" fill="currentColor" />
      </svg>
    );
  }
  if (name === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="4.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.1" cy="6.9" r="1.1" fill="currentColor" />
      </svg>
    );
  }
  if (name === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4.5a7.4 7.4 0 0 0-6.4 11.2L4.6 20l4.5-1a7.4 7.4 0 1 0 2.9-14.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M9.6 8.7c-.2-.5-.4-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-.9 2.3.1 1.3 1 2.6 1.2 2.8.2.2 1.9 3.1 4.7 4.2 2.8 1.1 2.8.7 3.3.6.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.1.1-1.3-.1-.2-.3-.3-.7-.5l-1.6-.8c-.4-.2-.7-.3-.9.2l-.6.7c-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.6-.9-.8-1.5-1.9-1.7-2.2-.2-.4 0-.5.1-.7l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6l-.7-1.8Z" fill="currentColor" />
      </svg>
    );
  }
  if (name === "tiktok") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14.6 4c.4 1.8 1.5 3.3 3.4 4V10a7.6 7.6 0 0 1-3.3-.8v5.3a4.9 4.9 0 1 1-4.2-4.8V12a2.6 2.6 0 1 0 1.8 2.5V4h2.3Z" fill="currentColor" />
      </svg>
    );
  }
  return null;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const { token, isAuthenticated } = useAuth();
  const { pushToast } = useToast();
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [reviewSort, setReviewSort] = useState("newest");
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", comment: "" });
  const [reviewStatus, setReviewStatus] = useState("idle");
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const productId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!productId) return;

    setStatus("loading");
    setError("");

    Promise.all([fetchProductById(productId), fetchProducts()])
      .then(([item, items]) => {
        setProduct(item);
        setAllProducts(items);
        setStatus("ready");
      })
      .catch((err) => {
        setError(err.message);
        setStatus("error");
      });
  }, [productId]);

  useEffect(() => {
    if (!productId) return;

    requestJson(`${API_BASE}/reviews/product/${productId}`)
      .then((items) => {
        setReviews(Array.isArray(items) ? items : []);
      })
      .catch(() => {
        setReviews([]);
      });
  }, [productId]);

  useEffect(() => {
    if (!productId || !isAuthenticated || !token) {
      setMyReview(null);
      return;
    }

    requestWithToken(`${API_BASE}/reviews/my/${productId}`, token)
      .then((item) => {
        setMyReview(item || null);
      })
      .catch(() => {
        setMyReview(null);
      });
  }, [isAuthenticated, productId, token]);

  const images = useMemo(() => getProductImages(product), [product]);
  const currentImage = images[activeImage] || images[0] || "";

  useEffect(() => {
    setActiveImage(0);
    setActiveTab("description");
    setQty(1);
    setPreviewOpen(false);
    setWishlisted(product?._id ? readWishlist().includes(String(product._id)) : false);
  }, [product?._id]);

  useEffect(() => {
    if (!myReview) {
      setReviewForm({ rating: 5, title: "", comment: "" });
      return;
    }

    setReviewForm({
      rating: Math.max(1, Math.min(5, Number(myReview?.rating) || 5)),
      title: String(myReview?.title || ""),
      comment: String(myReview?.comment || ""),
    });
  }, [myReview]);

  useEffect(() => {
    if (!previewOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setPreviewOpen(false);
      }
      if (event.key === "ArrowLeft") {
        setActiveImage((index) => (index === 0 ? images.length - 1 : index - 1));
      }
      if (event.key === "ArrowRight") {
        setActiveImage((index) => (index === images.length - 1 ? 0 : index + 1));
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [images.length, previewOpen]);

  if (status === "loading") {
    return <main className="shell page-section"><div className="panel">Loading product...</div></main>;
  }

  if (status === "error" || !product) {
    return <main className="shell page-section"><div className="panel">Could not load product: {error}</div></main>;
  }

  const stock = getProductStock(product);
  const categoryLabel = formatCategoryLabel(product?.category || canonicalCategory(product?.category));
  const productSpecs = getProductSpecs(product).filter(([, value]) => String(value || "").trim());
  const description = getProductDescription(product);
  const ratingValue = Math.max(0, Math.min(5, reviews.length ? getReviewAverage(reviews) : getProductRating(product)));
  const rating = Math.round(ratingValue);
  const reviewCount = reviews.length || getProductReviewCount(product);
  const reviewBreakdown = getReviewBreakdown(reviews);
  const sortedReviews = [...reviews].sort((a, b) => {
    if (reviewSort === "oldest") {
      return new Date(a?.createdAt || 0).getTime() - new Date(b?.createdAt || 0).getTime();
    }
    if (reviewSort === "highest") {
      return Number(b?.rating || 0) - Number(a?.rating || 0);
    }
    if (reviewSort === "lowest") {
      return Number(a?.rating || 0) - Number(b?.rating || 0);
    }
    return new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime();
  });
  const relatedProducts = allProducts
    .filter((item) => String(item?._id) !== String(product?._id))
    .filter((item) => canonicalCategory(item?.category) === canonicalCategory(product?.category))
    .slice(0, 4);

  const previewModal = previewOpen && currentImage
    ? createPortal(
        <div className="product-preview" role="dialog" aria-modal="true" aria-label="Product image preview">
          <button type="button" className="product-preview__close" onClick={() => setPreviewOpen(false)} aria-label="Close preview">
            x
          </button>
          <button
            type="button"
            className="product-preview__arrow product-preview__arrow--left"
            onClick={() => setActiveImage((index) => (index === 0 ? images.length - 1 : index - 1))}
            aria-label="Previous preview image"
          >
            &lsaquo;
          </button>
          <div className="product-preview__stage" onClick={() => setPreviewOpen(false)}>
            <img src={currentImage} alt={product.name} onClick={(event) => event.stopPropagation()} />
          </div>
          <button
            type="button"
            className="product-preview__arrow product-preview__arrow--right"
            onClick={() => setActiveImage((index) => (index === images.length - 1 ? 0 : index + 1))}
            aria-label="Next preview image"
          >
            &rsaquo;
          </button>

          <div className="product-preview__thumbs" aria-label="Preview images">
            {images.map((image, index) => (
              <button
                key={`preview-${image}-${index}`}
                type="button"
                className={activeImage === index ? "product-preview__thumb is-active" : "product-preview__thumb"}
                onClick={() => setActiveImage(index)}
                aria-label={`Preview image ${index + 1}`}
              >
                <img src={image} alt={`${product.name} preview ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>,
        document.body
      )
    : null;

  function decrementQty() {
    setQty((current) => Math.max(1, current - 1));
  }

  function incrementQty() {
    setQty((current) => Math.min(Math.max(stock, 1), current + 1));
  }

  async function handleCopy() {
    const url = `${window.location.origin}/products/${productId}`;
    try {
      await navigator.clipboard.writeText(url);
      pushToast("Product link copied", "success");
    } catch {
      pushToast("Could not copy product link", "warning");
    }
  }

  async function handleShare() {
    const url = `${window.location.origin}/products/${productId}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: product?.name || "Deetech product", text: description, url });
        pushToast("Product shared", "success");
        return;
      }
      await navigator.clipboard.writeText(url);
      pushToast("Product link copied", "success");
    } catch (error) {
      if (error?.name !== "AbortError") {
        pushToast("Could not share product", "warning");
      }
    }
  }

  function handleWishlist() {
    const currentId = String(product?._id || productId || "");
    if (!currentId) return;
    if (!isAuthenticated) {
      pushToast("Login required to use wishlist", "info");
      return;
    }
    const nextWishlist = wishlisted
      ? readWishlist().filter((item) => item !== currentId)
      : Array.from(new Set([...readWishlist(), currentId]));
    writeWishlist(nextWishlist);
    setWishlisted(nextWishlist.includes(currentId));
    pushToast(wishlisted ? "Removed from wishlist" : "Saved to wishlist", wishlisted ? "info" : "success");
  }

  async function handleReviewSubmit(event) {
    event.preventDefault();

    if (!isAuthenticated || !token) {
      pushToast("Login required to write a review", "info");
      return;
    }

    const payload = {
      rating: Math.max(1, Math.min(5, Number(reviewForm.rating) || 5)),
      title: String(reviewForm.title || "").trim(),
      comment: String(reviewForm.comment || "").trim(),
    };

    if (payload.title.length < 2 || payload.comment.length < 3) {
      pushToast("Please complete the review title and comment", "warning");
      return;
    }

    setReviewStatus("saving");

    try {
      const saved = myReview?._id
        ? await requestWithToken(`${API_BASE}/reviews/${myReview._id}`, token, {
            method: "PUT",
            body: JSON.stringify(payload),
          })
        : await requestWithToken(`${API_BASE}/reviews/${productId}`, token, {
            method: "POST",
            body: JSON.stringify(payload),
          });

      const nextReview = saved || null;
      setMyReview(nextReview);
      setReviews((current) => {
        const others = current.filter((item) => String(item?._id) !== String(nextReview?._id));
        return nextReview ? [nextReview, ...others] : others;
      });
      setActiveTab("reviews");
      setReviewStatus("idle");
      pushToast(myReview ? "Review updated" : "Review submitted", "success");
    } catch (submitError) {
      setReviewStatus("idle");
      pushToast(submitError.message || "Could not save review", "warning");
    }
  }

  return (
    <main className="shell page-section">
      <section className="product-breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/products">Shop</Link>
        <span>/</span>
        <span>{categoryLabel}</span>
        <span>/</span>
        <span>{product.name}</span>
      </section>

      <section className="product-detail-view">
        <div className="product-gallery panel">
          <button
            type="button"
            className="product-gallery__main product-gallery__main--interactive"
            onClick={() => setPreviewOpen(true)}
            aria-label="Tap to preview product image"
          >
            {currentImage ? (
              <img src={currentImage} alt={product.name} />
            ) : (
              <div className="product-card__placeholder">No image</div>
            )}
          </button>

          {images.length ? (
            <div className="product-gallery__selector" aria-label="Product images">
              <button
                type="button"
                className="product-gallery__arrow"
                onClick={() => setActiveImage((index) => (index === 0 ? images.length - 1 : index - 1))}
                aria-label="Previous product image"
              >
                &lsaquo;
              </button>
              <div className="product-gallery__thumbs">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    className={activeImage === index ? "product-gallery__thumb is-active" : "product-gallery__thumb"}
                    onClick={() => setActiveImage(index)}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="product-gallery__arrow"
                onClick={() => setActiveImage((index) => (index === images.length - 1 ? 0 : index + 1))}
                aria-label="Next product image"
              >
                &rsaquo;
              </button>
            </div>
          ) : null}
        </div>

        <div className="product-summary panel">
          <p className="product-summary__eyebrow">{product?.brand || categoryLabel}</p>
          <h1>{product.name}</h1>
          <div className="product-summary__rating" aria-label={`${reviewCount > 0 ? ratingValue.toFixed(1) : "0.0"} out of 5 stars`}>
            <span>
              {Array.from({ length: 5 }, (_, index) => (
                <span key={index}>{index < rating ? "★" : "☆"}</span>
              ))}
            </span>
            <strong>{reviewCount > 0 ? ratingValue.toFixed(1) : "0.0"}</strong>
            <small>{reviewCount > 0 ? `(${reviewCount} reviews)` : "(0 reviews)"}</small>
          </div>
          <p className="product-summary__price">{formatCurrency(product.price)}</p>
          <p className="product-summary__copy">{description}</p>

          <div className="product-summary__buy">
            <div className="product-summary__qty-control" aria-label="Product quantity">
              <button type="button" className="product-summary__qty-button" onClick={decrementQty} aria-label="Reduce quantity">
                -
              </button>
              <input
                id="qty"
                className="field product-summary__qty"
                type="number"
                min="1"
                max={Math.max(stock, 1)}
                value={qty}
                onChange={(event) => setQty(Math.min(Math.max(Number(event.target.value || 1), 1), Math.max(stock, 1)))}
              />
              <button type="button" className="product-summary__qty-button" onClick={incrementQty} aria-label="Increase quantity">
                +
              </button>
            </div>
            <button type="button" className="primary-button product-summary__cart" disabled={stock < 1} onClick={() => addItem(product, qty)}>
              {stock < 1 ? "Out of stock" : "Add to cart"}
            </button>
          </div>

          <div className="product-summary__inline-actions" aria-label="Product actions">
            <button type="button" className="product-summary__icon-action" onClick={handleCopy}>
              <ProductActionIcon name="copy" />
              <span>Copy</span>
            </button>
            <button type="button" className={`product-summary__icon-action${wishlisted ? " is-active" : ""}`} onClick={handleWishlist}>
              <ProductActionIcon name="wishlist" />
              <span>Wishlist</span>
            </button>
            <button type="button" className="product-summary__icon-action" onClick={handleShare}>
              <ProductActionIcon name="share" />
              <span>Share</span>
            </button>
          </div>

          <div className="product-summary__meta">
            <p><strong>Category:</strong> {categoryLabel}</p>
            <p><strong>Stock:</strong> {stock > 0 ? `${stock} available` : "Out of stock"}</p>
          </div>

          <div className="product-summary__social">
            <p>Follow and reach us</p>
            <div className="product-summary__social-links">
              {SOCIAL_LINKS.map((item) => (
                <a key={item.label} href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}>
                  <SocialAppIcon name={item.icon} />
                </a>
              ))}
            </div>
          </div>

          <div className="product-summary__actions">
            <button type="button" className="ghost-button" onClick={() => router.push("/wishlist")}>Browse wishlist</button>
            <button type="button" className="ghost-button" onClick={() => router.push("/cart")}>Go to cart</button>
          </div>
        </div>
      </section>

      <section className="product-tabs panel">
        <div className="product-tabs__nav" role="tablist" aria-label="Product details">
          <button
            type="button"
            role="tab"
            className={activeTab === "description" ? "product-tabs__tab is-active" : "product-tabs__tab"}
            aria-selected={activeTab === "description"}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          <button
            type="button"
            role="tab"
            className={activeTab === "specs" ? "product-tabs__tab is-active" : "product-tabs__tab"}
            aria-selected={activeTab === "specs"}
            onClick={() => setActiveTab("specs")}
          >
            Specs
          </button>
          <button
            type="button"
            role="tab"
            className={activeTab === "reviews" ? "product-tabs__tab is-active" : "product-tabs__tab"}
            aria-selected={activeTab === "reviews"}
            onClick={() => setActiveTab("reviews")}
          >
            Review
          </button>
        </div>

        <div className="product-tabs__body">
          {activeTab === "description" ? (
            <div className="product-tabs__panel">
              <p>{description}</p>
            </div>
          ) : null}

          {activeTab === "specs" ? (
            <div className="product-tabs__panel product-tabs__panel--specs">
              {productSpecs.length ? (
                productSpecs.map(([key, value]) => (
                  <div key={key} className="product-spec-row">
                    <span>{String(key).replace(/[_-]+/g, " ")}</span>
                    <strong>{String(value)}</strong>
                  </div>
                ))
              ) : (
                <p>Detailed specs will appear here as more product data is added.</p>
              )}
            </div>
          ) : null}

          {activeTab === "reviews" ? (
            <div className="product-tabs__panel">
              <div className="product-review-overview">
                <div className="product-review-overview__score">
                  <strong>{reviewCount > 0 ? ratingValue.toFixed(1) : "0.0"}</strong>
                  <span>Out of 5</span>
                  <p className="product-card__rating" aria-label={`${reviewCount > 0 ? ratingValue.toFixed(1) : "0.0"} out of 5 stars`}>
                    {Array.from({ length: 5 }, (_, index) => (
                      <span key={index} className={index < rating ? "is-filled" : ""}>{"★"}</span>
                    ))}
                  </p>
                  <small>{reviewCount} {reviewCount === 1 ? "review" : "reviews"}</small>
                </div>

                <div className="product-review-overview__bars">
                  {reviewBreakdown.map((item) => (
                    <div key={item.stars} className="product-review-bar">
                      <span>{item.stars} Star</span>
                      <div className="product-review-bar__track">
                        <div className="product-review-bar__fill" style={{ width: `${item.percentage}%` }} />
                      </div>
                      <strong>{item.count}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="product-review-actions">
                <div className="product-review-actions__copy">
                  <h3>Review List</h3>
                  <p>{reviewCount ? `Showing 1-${sortedReviews.length} of ${reviewCount} results` : "No reviews yet. Be the first to share your experience with this product."}</p>
                </div>
                <label className="product-review-actions__sort">
                  <span>Sort by</span>
                  <select className="field" value={reviewSort} onChange={(event) => setReviewSort(event.target.value)}>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="highest">Highest rating</option>
                    <option value="lowest">Lowest rating</option>
                  </select>
                </label>
              </div>

              <div className="product-review-shell">
                <div className="product-review-list">
                  {sortedReviews.length ? (
                    sortedReviews.map((review, index) => {
                      const reviewerName = review?.user?.name || review?.name || "Customer";
                      return (
                        <article key={review?._id || index} className="product-review">
                          <div className="product-review__header">
                            <div className="product-review__identity">
                              <div className="product-review__avatar" aria-hidden="true">
                                {getReviewerInitials(reviewerName)}
                              </div>
                              <div>
                                <strong>{reviewerName}</strong>
                                <span className="product-review__verified">(Verified)</span>
                              </div>
                            </div>
                            <time>{getReviewTimeLabel(review?.createdAt)}</time>
                          </div>
                          <h4>{review?.title || "Customer review"}</h4>
                          <p>{review?.comment || review?.message || "No review text provided."}</p>
                          <p className="product-card__rating" aria-label={`${Number(review?.rating || 0)} out of 5 stars`}>
                            {Array.from({ length: 5 }, (_, index) => (
                              <span key={index} className={index < Number(review?.rating || 0) ? "is-filled" : ""}>{"★"}</span>
                            ))}
                            <strong>{Number(review?.rating || 0).toFixed(1)}</strong>
                          </p>
                          {review?.image_url ? (
                            <div className="product-review__media">
                              <img src={resolveProductImage(review.image_url)} alt={review?.title || "Review upload"} />
                            </div>
                          ) : null}
                        </article>
                      );
                    })
                  ) : (
                    <p>No reviews yet. Be the first to share your experience with this product.</p>
                  )}
                </div>
              </div>

              <aside className="product-review-form product-review-form--full">
                <h3>{myReview ? "Update your review" : "Write a review"}</h3>
                <p>{isAuthenticated ? "Share your real experience to help other customers buy with confidence." : "Login to write a review. Guests can still browse all customer reviews."}</p>
                <form className="auth-form" onSubmit={handleReviewSubmit}>
                  <label>
                    <span>Rating</span>
                    <select
                      className="field"
                      value={reviewForm.rating}
                      onChange={(event) => setReviewForm((current) => ({ ...current, rating: Number(event.target.value) }))}
                      disabled={!isAuthenticated}
                    >
                      {[5, 4, 3, 2, 1].map((value) => (
                        <option key={value} value={value}>{value} Star{value === 1 ? "" : "s"}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Review title</span>
                    <input
                      className="field"
                      value={reviewForm.title}
                      onChange={(event) => setReviewForm((current) => ({ ...current, title: event.target.value }))}
                      placeholder="Summarize your experience"
                      disabled={!isAuthenticated}
                    />
                  </label>
                  <label>
                    <span>Your review</span>
                    <textarea
                      className="field"
                      rows="5"
                      value={reviewForm.comment}
                      onChange={(event) => setReviewForm((current) => ({ ...current, comment: event.target.value }))}
                      placeholder="Tell other customers what stood out to you"
                      disabled={!isAuthenticated}
                    />
                  </label>
                  {isAuthenticated ? (
                    <button type="submit" className="primary-button product-review-form__submit" disabled={reviewStatus === "saving"}>
                      {reviewStatus === "saving" ? "Saving review..." : myReview ? "Update review" : "Submit review"}
                    </button>
                  ) : (
                    <button type="button" className="ghost-button product-review-form__submit" onClick={() => router.push("/login")}>
                      Login to review
                    </button>
                  )}
                </form>
              </aside>
            </div>
          ) : null}
        </div>
      </section>

      {relatedProducts.length ? (
        <section className="related-products">
          <div className="related-products__header">
            <h2>Related products</h2>
          </div>
          <div className="related-products__grid">
            {relatedProducts.map((item) => (
              <ProductCard key={item._id} product={item} onAddToCart={addItem} variant="related" />
            ))}
          </div>
        </section>
      ) : null}

      {portalReady ? previewModal : null}
    </main>
  );
}
