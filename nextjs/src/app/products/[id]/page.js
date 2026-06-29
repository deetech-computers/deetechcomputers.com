"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/products/product-card";
import StableImage from "@/components/ui/stable-image";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/providers/toast-provider";
import { formatCurrency } from "@/lib/format";
import { API_BASE } from "@/lib/config";
import { requestJson } from "@/lib/http";
import { requestWithToken } from "@/lib/resource";
import { addWishlistEntry, readWishlistIds, removeWishlistEntry } from "@/lib/wishlist";
import { normalizeAffiliateCode } from "@/lib/affiliate-attribution";
import "./product-detail-desktop.css";
import "./product-detail-mobile.css";
import {
  buildCloudinarySrcSet,
  canonicalCategory,
  fetchProductById,
  fetchProducts,
  formatCategoryLabel,
  getProductDiscountPercent,
  getProductOriginalPrice,
  getProductPrice,
  getProductRating,
  getProductReviewCount,
  getProductStock,
  isProductDiscountActive,
  optimizeCloudinaryImage,
  resolveProductImage,
} from "@/lib/products";
import { getProductPricing } from "@/lib/product-pricing";
import {
  applyUpgradeSelectionToSpecs,
  getProductDisplayPricing,
  hasProductUpgradeSpecs,
  normalizeProductUpgradeSpecs,
  normalizeUpgradeSelection,
} from "@/lib/product-upgrades";

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

function getProductSummary(product) {
  return (
    product?.shortDescription ||
    product?.short_description ||
    product?.description ||
    "This product is part of our carefully selected collection built to deliver dependable quality, strong day-to-day performance, and a cleaner setup for work or home."
  );
}

function normalizeDisplayTitle(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/[a-z]/.test(raw)) return raw;
  return raw
    .toLowerCase()
    .replace(/\b([a-z])/g, (match) => match.toUpperCase());
}

function getReviewAverage(reviews) {
  const ratings = (reviews || [])
    .map((review) => Number(review?.rating))
    .filter((value) => Number.isFinite(value) && value > 0);

  if (!ratings.length) return 0;
  return ratings.reduce((sum, value) => sum + value, 0) / ratings.length;
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

function formatDateTime(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

const SOCIAL_LINKS = [
  { label: "TikTok", href: "https://www.tiktok.com/@deetech.computers?_r=1&_t=ZS-94rKFc7vpAr", icon: "tiktok" },
  { label: "WhatsApp", href: "https://wa.me/message/WEYXKNNA6KXXL1", icon: "whatsapp" },
  { label: "Facebook", href: "https://www.facebook.com/share/19NkhoTCdi/?mibextid=wwXIfr", icon: "facebook" },
  { label: "Instagram", href: "https://www.instagram.com/deetechcomputers1/", icon: "instagram" },
];

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
  const searchParams = useSearchParams();
  const { addItem } = useCart();
  const { token, isAuthenticated } = useAuth();
  const { pushToast } = useToast();
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoaded, setReviewsLoaded] = useState(false);
  const [myReview, setMyReview] = useState(null);
  const [reviewSort, setReviewSort] = useState("newest");
  const [visibleReviewCount, setVisibleReviewCount] = useState(5);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", comment: "", imageUrl: "" });
  const [reviewStatus, setReviewStatus] = useState("idle");
  const [uploadingReviewImage, setUploadingReviewImage] = useState(false);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [affiliateShareCode, setAffiliateShareCode] = useState("");

  function handleAddToCart(item, qty = 1, options = {}) {
    if (!item) return;
    addItem(item, qty, options);
  }
  const [qty, setQty] = useState(1);
  const [selectedUpgrades, setSelectedUpgrades] = useState({});
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [loadedMainImage, setLoadedMainImage] = useState({ image: "", src: "", srcSet: undefined });
  const [mainImageLoading, setMainImageLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [reviewImagePreview, setReviewImagePreview] = useState("");
  const [reviewPhotosModalOpen, setReviewPhotosModalOpen] = useState(false);
  const [photoModalSort, setPhotoModalSort] = useState("newest");
  const [photoModalRatingFilter, setPhotoModalRatingFilter] = useState("all");
  const [portalReady, setPortalReady] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const thumbnailRailRef = useRef(null);
  const previewThumbnailRailRef = useRef(null);
  const relatedRailRef = useRef(null);
  const tabsSectionRef = useRef(null);
  const [relatedRailNav, setRelatedRailNav] = useState({ left: false, right: false });
  const productId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!productId) return;

    let cancelled = false;
    let idleHandle = null;
    let timerHandle = null;

    setStatus("loading");
    setError("");
    setProduct(null);
    setAllProducts([]);

    fetchProductById(productId)
      .then((item) => {
        if (cancelled) return;
        setProduct(item);
        setStatus("ready");

        const loadRelatedProducts = () => {
          fetchProducts()
            .then((items) => {
              if (!cancelled) setAllProducts(items);
            })
            .catch(() => {
              if (!cancelled) setAllProducts([]);
            });
        };

        if (typeof window !== "undefined" && "requestIdleCallback" in window) {
          idleHandle = window.requestIdleCallback(loadRelatedProducts, { timeout: 1800 });
        } else if (typeof window !== "undefined") {
          timerHandle = window.setTimeout(loadRelatedProducts, 450);
        } else {
          loadRelatedProducts();
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setStatus("error");
      });

    return () => {
      cancelled = true;
      if (idleHandle && typeof window !== "undefined" && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleHandle);
      }
      if (timerHandle && typeof window !== "undefined") {
        window.clearTimeout(timerHandle);
      }
    };
  }, [productId]);

  useEffect(() => {
    if (!productId) return;

    setReviewsLoaded(false);
    setVisibleReviewCount(5);
    requestJson(`${API_BASE}/reviews/product/${productId}`)
      .then((items) => {
        setReviews(Array.isArray(items) ? items : []);
      })
      .catch(() => {
        setReviews([]);
      })
      .finally(() => {
        setReviewsLoaded(true);
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

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setAffiliateShareCode("");
      return;
    }

    let cancelled = false;
    requestWithToken(`${API_BASE}/affiliates/me`, token)
      .then((payload) => {
        if (cancelled) return;
        const code = normalizeAffiliateCode(payload?.affiliate?.code || "");
        setAffiliateShareCode(code);
      })
      .catch(() => {
        if (cancelled) return;
        setAffiliateShareCode("");
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (!affiliateShareCode || typeof window === "undefined") return;
    const current = new URL(window.location.href);
    if (normalizeAffiliateCode(current.searchParams.get("affiliate"))) return;
    current.searchParams.set("affiliate", affiliateShareCode);
    window.history.replaceState({}, "", current.toString());
  }, [affiliateShareCode]);

  const images = useMemo(() => getProductImages(product), [product]);
  const activeImageIndex = images.length ? Math.min(activeImage, images.length - 1) : 0;
  const currentImage = images[activeImageIndex] || "";
  const optimizedCurrentImage = useMemo(
    () => optimizeCloudinaryImage(currentImage, { width: 560, height: 747, crop: "fit", force: true }),
    [currentImage]
  );
  const optimizedCurrentImageSrcSet = useMemo(
    () => buildCloudinarySrcSet(currentImage, [360, 480, 560, 640], { crop: "fit", gravity: "auto", force: true, heightRatio: 4 / 3 }),
    [currentImage]
  );
  const optimizedGalleryImages = useMemo(
    () => images.map((image) => optimizeCloudinaryImage(image, { width: 560, height: 747, crop: "fit", force: true })),
    [images]
  );
  const optimizedThumbnailImages = useMemo(
    () => images.map((image) => optimizeCloudinaryImage(image, { width: 140, height: 104 })),
    [images]
  );
  const hasLoadedSelectedMainImage = loadedMainImage.src === optimizedCurrentImage;
  const visibleMainImage =
    loadedMainImage.src && !hasLoadedSelectedMainImage
      ? loadedMainImage
      : { image: currentImage, src: optimizedCurrentImage, srcSet: optimizedCurrentImageSrcSet };

  useEffect(() => {
    setActiveImage(0);
    setLoadedMainImage({ image: "", src: "", srcSet: undefined });
    setMainImageLoading(false);
    setActiveTab("description");
    setQty(1);
    setSelectedUpgrades({});
    setPreviewOpen(false);
    setWishlisted(product?._id ? readWishlistIds().includes(String(product._id)) : false);
  }, [product?._id]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    optimizedGalleryImages.forEach((src) => {
      if (!src) return;
      const image = new window.Image();
      image.src = src;
    });
  }, [optimizedGalleryImages]);

  useEffect(() => {
    if (!optimizedCurrentImage) {
      setLoadedMainImage({ image: "", src: "", srcSet: undefined });
      setMainImageLoading(false);
      return undefined;
    }

    if (loadedMainImage.src === optimizedCurrentImage) {
      setMainImageLoading(false);
      return undefined;
    }

    let cancelled = false;
    setMainImageLoading(Boolean(loadedMainImage.src));

    if (typeof window === "undefined") {
      setLoadedMainImage({ image: currentImage, src: optimizedCurrentImage, srcSet: optimizedCurrentImageSrcSet });
      setMainImageLoading(false);
      return undefined;
    }

    const image = new window.Image();
    image.onload = () => {
      if (cancelled) return;
      setLoadedMainImage({ image: currentImage, src: optimizedCurrentImage, srcSet: optimizedCurrentImageSrcSet });
      setMainImageLoading(false);
    };
    image.onerror = () => {
      if (cancelled) return;
      setLoadedMainImage({ image: currentImage, src: optimizedCurrentImage, srcSet: optimizedCurrentImageSrcSet });
      setMainImageLoading(false);
    };
    if (optimizedCurrentImageSrcSet) {
      image.srcset = optimizedCurrentImageSrcSet;
      image.sizes = "(max-width: 640px) calc(100vw - 32px), (max-width: 980px) min(720px, calc(100vw - 32px)), 613px";
    }
    image.src = optimizedCurrentImage;

    return () => {
      cancelled = true;
    };
  }, [currentImage, loadedMainImage.src, optimizedCurrentImage, optimizedCurrentImageSrcSet]);

  useEffect(() => {
    if (!product?._id) return;
    const tab = String(searchParams?.get("tab") || "").toLowerCase();
    const hash = typeof window !== "undefined" ? String(window.location.hash || "").toLowerCase() : "";
    const wantsReviews = tab === "reviews" || hash === "#reviews";
    if (!wantsReviews) return;

    setActiveTab("reviews");
    requestAnimationFrame(() => {
      tabsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      if (typeof window === "undefined") return;

      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.delete("tab");
      if (String(nextUrl.hash || "").toLowerCase() === "#reviews") {
        nextUrl.hash = "";
      }
      window.history.replaceState({}, "", nextUrl.toString());
    });
  }, [product?._id, searchParams]);

  useEffect(() => {
    if (!myReview) {
      setReviewForm({ rating: 5, title: "", comment: "", imageUrl: "" });
      return;
    }

    setReviewForm({
      rating: Math.max(1, Math.min(5, Number(myReview?.rating) || 5)),
      title: String(myReview?.title || ""),
      comment: String(myReview?.comment || ""),
      imageUrl: String(myReview?.image_url || ""),
    });
  }, [myReview]);

  useEffect(() => {
    if (!previewOpen) return undefined;

    const scrollY = window.scrollY;
    const previousOverflow = document.body.style.overflow;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyWidth = document.body.style.width;
    const previousHtmlOverflow = document.documentElement.style.overflow;
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

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousOverflow;
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.width = previousBodyWidth;
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [images.length, previewOpen]);

  useEffect(() => {
    if (!reviewImagePreview) return undefined;

    const scrollY = window.scrollY;
    const previousOverflow = document.body.style.overflow;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyWidth = document.body.style.width;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setReviewImagePreview("");
      }
    };

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousOverflow;
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.width = previousBodyWidth;
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [reviewImagePreview]);

  useEffect(() => {
    if (!reviewPhotosModalOpen) return undefined;

    const scrollY = window.scrollY;
    const previousOverflow = document.body.style.overflow;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyWidth = document.body.style.width;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setReviewPhotosModalOpen(false);
      }
    };

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousOverflow;
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.width = previousBodyWidth;
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [reviewPhotosModalOpen]);

  function scrollPreviewThumbnailRail(direction) {
    const rail = previewThumbnailRailRef.current;
    if (!rail) return;
    rail.scrollBy({
      left: direction * Math.max(rail.clientWidth * 0.55, 150),
      behavior: "smooth",
    });
  }

  function updateRelatedRailNav() {
    const rail = relatedRailRef.current;
    if (!rail) {
      setRelatedRailNav({ left: false, right: false });
      return;
    }
    const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
    const current = rail.scrollLeft;
    setRelatedRailNav({
      left: current > 8,
      right: current < maxScroll - 8,
    });
  }

  function scrollRelatedRail(direction) {
    const rail = relatedRailRef.current;
    if (!rail) return;
    const cards = Array.from(rail.querySelectorAll(".related-products__item"));
    if (!cards.length) return;

    const currentScroll = rail.scrollLeft;
    const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
    const tolerance = 18;
    const isMobileRail = typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches;
    let nextLeft = currentScroll;

    if (isMobileRail) {
      const positions = cards.map((card) => Math.max(0, Math.min(card.offsetLeft, maxScroll)));
      if (direction > 0) {
        nextLeft = positions.find((position) => position > currentScroll + tolerance) ?? maxScroll;
      } else {
        nextLeft =
          [...positions].reverse().find((position) => position < currentScroll - tolerance) ?? 0;
      }
    } else {
      const pageWidth = Math.max(rail.clientWidth, 1);
      nextLeft =
        direction > 0
          ? Math.min(maxScroll, currentScroll + pageWidth)
          : Math.max(0, currentScroll - pageWidth);
    }

    rail.scrollTo({
      left: nextLeft,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    const rail = relatedRailRef.current;
    if (!rail) return undefined;

    const onScroll = () => updateRelatedRailNav();
    const onResize = () => updateRelatedRailNav();
    let observer;

    updateRelatedRailNav();
    rail.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => updateRelatedRailNav());
      observer.observe(rail);
    }

    return () => {
      rail.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (observer) observer.disconnect();
    };
  }, [allProducts, product?._id, product?.category]);

  if (status === "loading") {
    return (
      <main className="shell page-section product-detail-page">
        <div className="product-detail-loading product-detail-loading--desktop" aria-label="Loading product details">
          <div className="product-detail-loading__top">
            <div className="product-detail-loading__gallery panel" />
            <div className="product-detail-loading__summary panel">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="product-detail-loading__tabs panel" />
        </div>
        <div className="product-detail-loading product-detail-loading--mobile" aria-label="Loading product details" aria-hidden="true">
          <div className="product-detail-loading__crumb" />
          <div className="product-detail-loading__gallery-m" />
          <div className="product-detail-loading__thumbs-m">
            <span />
            <span />
            <span />
          </div>
          <div className="product-detail-loading__summary-m panel">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="product-detail-loading__tabs-m panel" />
        </div>
      </main>
    );
  }

  if (status === "error" || !product) {
    return <main className="shell page-section product-detail-page"><div className="panel">Could not load product: {error}</div></main>;
  }

  const stock = getProductStock(product);
  const pricing = getProductPricing(product);
  const upgradeSpecs = normalizeProductUpgradeSpecs(product?.upgradeSpecs);
  const hasUpgradeableSpecs = hasProductUpgradeSpecs(product);
  const displayPricing = getProductDisplayPricing(product, selectedUpgrades);
  const hasDiscount = displayPricing.hasDiscount;
  const currentPrice = displayPricing.currentPrice;
  const originalPrice = displayPricing.originalPrice;
  const discountPercent = displayPricing.discountPercent;
  const categoryLabel = formatCategoryLabel(product?.category || canonicalCategory(product?.category));
  const productCanonicalCategory = canonicalCategory(product?.category);
  const isLaptopCategory = productCanonicalCategory === "laptops" || productCanonicalCategory === "desktops";
  const attentionBadgeLabel = isLaptopCategory ? "Free Delivery" : "Quality Guaranteed";
  const productSpecs = applyUpgradeSelectionToSpecs(
    getProductSpecs(product).filter(([, value]) => String(value || "").trim()),
    selectedUpgrades
  );
  const description = getProductDescription(product);
  const summary = getProductSummary(product);
  const displayBrand = normalizeDisplayTitle(product?.brand || categoryLabel);
  const displayName = normalizeDisplayTitle(product?.name);
  const ratingValue = Math.max(
    0,
    Math.min(5, reviews.length ? getReviewAverage(reviews) : reviewsLoaded ? 0 : getProductRating(product))
  );
  const rating = Math.round(ratingValue);
  const reviewCount = reviews.length || (reviewsLoaded ? 0 : getProductReviewCount(product));
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
  const reviewsForModal = reviews
    .filter((review) => photoModalRatingFilter === "all" || Number(review?.rating || 0) === Number(photoModalRatingFilter))
    .sort((a, b) => {
      if (photoModalSort === "oldest") {
        return new Date(a?.createdAt || 0).getTime() - new Date(b?.createdAt || 0).getTime();
      }
      if (photoModalSort === "highest") {
        return Number(b?.rating || 0) - Number(a?.rating || 0);
      }
      if (photoModalSort === "lowest") {
        return Number(a?.rating || 0) - Number(b?.rating || 0);
      }
      return new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime();
    });
  const relatedProducts = allProducts
    .filter((item) => String(item?._id) !== String(product?._id))
    .filter((item) => canonicalCategory(item?.category) === canonicalCategory(product?.category))
    .slice(0, 12)
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const aOutOfStock = getProductStock(a.item) < 1;
      const bOutOfStock = getProductStock(b.item) < 1;
      if (aOutOfStock !== bOutOfStock) return aOutOfStock ? 1 : -1;
      return a.index - b.index;
    })
    .map(({ item }) => item);

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
            <StableImage
              src={currentImage}
              alt={product.name}
              onClick={(event) => event.stopPropagation()}
              width={1200}
              height={1200}
            />
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
            <button
              type="button"
              className="product-preview__thumb-arrow"
              onClick={() => scrollPreviewThumbnailRail(-1)}
              aria-label="Scroll preview images left"
            >
              &lsaquo;
            </button>
            <div ref={previewThumbnailRailRef} className="product-preview__thumb-rail">
              {images.map((image, index) => (
                <button
                  key={`preview-${image}-${index}`}
                  type="button"
                  className={activeImageIndex === index ? "product-preview__thumb is-active" : "product-preview__thumb"}
                  onClick={() => setActiveImage(index)}
                  aria-label={`Preview image ${index + 1}`}
                >
                  <StableImage
                    src={image}
                    alt={`${product.name} preview ${index + 1}`}
                    width={140}
                    height={140}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              className="product-preview__thumb-arrow"
              onClick={() => scrollPreviewThumbnailRail(1)}
              aria-label="Scroll preview images right"
            >
              &rsaquo;
            </button>
          </div>
        </div>,
        document.body
      )
    : null;

  const reviewImagePreviewModal = reviewImagePreview
    ? createPortal(
        <div className="product-preview product-preview--review" role="dialog" aria-modal="true" aria-label="Review photo preview">
          <button type="button" className="product-preview__close" onClick={() => setReviewImagePreview("")} aria-label="Close preview">
            x
          </button>
          <div className="product-preview__stage" onClick={() => setReviewImagePreview("")}>
            <StableImage
              src={reviewImagePreview}
              alt="Review photo"
              onClick={(event) => event.stopPropagation()}
              width={1200}
              height={1200}
            />
          </div>
        </div>,
        document.body
      )
    : null;

  const reviewPhotosModal = reviewPhotosModalOpen
    ? createPortal(
        <div className="product-review-photos-modal" role="dialog" aria-modal="true" aria-label="Review photos">
          <div className="product-review-photos-modal__overlay" onClick={() => setReviewPhotosModalOpen(false)} />
          <div className="product-review-photos-modal__panel">
            <div className="product-review-photos-modal__head">
              <h3>More from reviews</h3>
              <button type="button" onClick={() => setReviewPhotosModalOpen(false)} aria-label="Close">
                x
              </button>
            </div>
            <div className="product-review-photos-modal__filters">
              <label>
                <span>Sort by</span>
                <select className="field" value={photoModalSort} onChange={(event) => setPhotoModalSort(event.target.value)}>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="highest">Highest rating</option>
                  <option value="lowest">Lowest rating</option>
                </select>
              </label>
              <label>
                <span>Rating</span>
                <select className="field" value={photoModalRatingFilter} onChange={(event) => setPhotoModalRatingFilter(event.target.value)}>
                  <option value="all">All ratings</option>
                  <option value="5">5 stars</option>
                  <option value="4">4 stars</option>
                  <option value="3">3 stars</option>
                  <option value="2">2 stars</option>
                  <option value="1">1 star</option>
                </select>
              </label>
            </div>
            <div className="product-review-photos-modal__list">
              {!reviewsForModal.length ? (
                <p className="product-review-photos-modal__empty">No reviews match this filter.</p>
              ) : null}
              {reviewsForModal.map((review, index) => {
                const reviewerName = review?.user?.name || review?.name || "Customer";
                const hasPhoto = Boolean(review?.image_url);
                return (
                  <div key={review?._id || index} className="product-review-photos-modal__item">
                    {hasPhoto ? (
                      <button
                        type="button"
                        className="product-review-photos-modal__item-thumb"
                        onClick={() => {
                          setReviewPhotosModalOpen(false);
                          setReviewImagePreview(resolveProductImage(review.image_url));
                        }}
                        aria-label="View photo full size"
                      >
                        <StableImage
                          src={resolveProductImage(review.image_url)}
                          alt={review?.title || "Review upload"}
                          width={90}
                          height={90}
                        />
                      </button>
                    ) : null}
                    <span>
                      <strong>{reviewerName}</strong>
                      <small>{review?.comment || "No review text provided."}</small>
                    </span>
                  </div>
                );
              })}
            </div>
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

  function buildShareUrl() {
    const baseUrl = `${window.location.origin}/products/${productId}`;
    const code = normalizeAffiliateCode(affiliateShareCode);
    if (!code) return baseUrl;
    return `${baseUrl}?affiliate=${encodeURIComponent(code)}`;
  }

  async function handleCopy() {
    const url = buildShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      pushToast("Product link copied", "success");
    } catch {
      pushToast("Could not copy product link", "warning");
    }
  }

  async function handleShare() {
    const url = buildShareUrl();
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
    const nextWishlist = wishlisted ? removeWishlistEntry(currentId) : addWishlistEntry(currentId);
    setWishlisted(nextWishlist.some((item) => item.id === currentId));
    pushToast(wishlisted ? "Removed from wishlist" : "Saved to wishlist", wishlisted ? "info" : "success");
  }

  async function handleReviewImageSelect(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !token) return;

    setUploadingReviewImage(true);
    try {
      const form = new FormData();
      form.append("image", file);
      const result = await requestWithToken(`${API_BASE}/reviews/upload`, token, {
        method: "POST",
        body: form,
      });
      setReviewForm((current) => ({ ...current, imageUrl: result?.imageUrl || "" }));
    } catch (uploadError) {
      pushToast(uploadError.message || "Could not upload image", "warning");
    } finally {
      setUploadingReviewImage(false);
    }
  }

  function handleReviewImageRemove() {
    setReviewForm((current) => ({ ...current, imageUrl: "" }));
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
      image_url: String(reviewForm.imageUrl || "").trim(),
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
        return nextReview && nextReview.status === "approved" ? [nextReview, ...others] : others;
      });
      setActiveTab("reviews");
      setReviewStatus("idle");
      setReviewFormOpen(false);
      pushToast(
        nextReview && nextReview.status !== "approved"
          ? "Review submitted - it will appear once approved by an admin"
          : myReview
            ? "Review updated"
            : "Review submitted",
        "success"
      );
    } catch (submitError) {
      setReviewStatus("idle");
      pushToast(submitError.message || "Could not save review", "warning");
    }
  }

  return (
    <main className="shell page-section product-detail-page">
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
          <div className="product-gallery__stage">
            <button
              type="button"
              className="product-gallery__main product-gallery__main--interactive"
              onClick={() => setPreviewOpen(true)}
              aria-label="Tap to preview product image"
            >
              {visibleMainImage.src ? (
                <>
                  <StableImage
                    src={visibleMainImage.src}
                    srcSet={visibleMainImage.srcSet}
                    sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 980px) min(720px, calc(100vw - 32px)), 613px"
                    alt={product.name}
                    width={560}
                    height={560}
                    loading="eager"
                    fetchPriority="high"
                    className="product-gallery__main-image"
                  />
                  {mainImageLoading ? <span className="product-gallery__main-loading" aria-hidden="true" /> : null}
                  <span className="product-gallery__preview-badge">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M16 16l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    <span className="product-gallery__preview-badge-text product-gallery__preview-badge-text--desktop">Click to preview</span>
                    <span className="product-gallery__preview-badge-text product-gallery__preview-badge-text--mobile">Tap to preview</span>
                  </span>
                </>
              ) : (
                <div className="product-card__placeholder">No image</div>
              )}
            </button>
          </div>

          {images.length ? (
            <div
              className="product-gallery__selector"
              aria-label="Product images"
            >
              <div
                ref={thumbnailRailRef}
                className="product-gallery__thumbs"
              >
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    className={activeImageIndex === index ? "product-gallery__thumb is-active" : "product-gallery__thumb"}
                    onClick={() => setActiveImage(index)}
                    aria-label={`View image ${index + 1}`}
                  >
                    <StableImage
                      src={optimizedThumbnailImages[index] || image}
                      alt={`${product.name} ${index + 1}`}
                      width={140}
                      height={140}
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="product-summary panel">
          <p className="product-summary__eyebrow">{displayBrand}</p>
          <h1>{displayName}</h1>
          {reviewCount > 0 ? (
            <div className="product-summary__rating" aria-label={`${ratingValue.toFixed(1)} out of 5 stars`}>
              <span>
                {Array.from({ length: 5 }, (_, index) => (
                  <span key={index}>{index < rating ? "★" : "☆"}</span>
                ))}
              </span>
              <strong>{ratingValue.toFixed(1)}</strong>
              <small>{`(${reviewCount} reviews)`}</small>
            </div>
          ) : null}
          <div className="product-summary__price-group">
            {hasDiscount ? <p className="product-summary__price-old">{formatCurrency(originalPrice)}</p> : null}
            <div className="product-summary__price-row">
              <p className="product-summary__price">{formatCurrency(currentPrice)}</p>
              {hasDiscount && discountPercent > 0 ? (
                <span className="product-summary__discount-badge">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M20.59 13.41 12 22l-9.41-9.41a2 2 0 0 1 0-2.83L11.17 2H20a2 2 0 0 1 2 2v8.83a2 2 0 0 1-.41 1.58Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                    <circle cx="16" cy="8" r="1.6" fill="currentColor" />
                  </svg>
                  Save {discountPercent}%
                </span>
              ) : (
                <span className="product-summary__attention-badge">
                  {isLaptopCategory ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M2 7h11v8H2zM13 10h4l3 3v2h-7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                      <circle cx="6.5" cy="17.5" r="1.6" fill="currentColor" />
                      <circle cx="16.5" cy="17.5" r="1.6" fill="currentColor" />
                    </svg>
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {attentionBadgeLabel}
                </span>
              )}
            </div>
            {pricing.isTimedDiscount && pricing.discountEndsAt ? (
              <p className="product-summary__discount-note">
                Offer ends {formatDateTime(pricing.discountEndsAt)}
              </p>
            ) : null}
          </div>
          {hasUpgradeableSpecs ? (
            <div className="product-summary__upgrades">
              <div className="product-summary__upgrade-body">
                  {upgradeSpecs.ramOptions.length ? (
                    <div className="product-summary__upgrade-group">
                      <span>Memory (RAM)</span>
                      <div className="product-summary__upgrade-options">
                        <button
                          type="button"
                          className={!selectedUpgrades.ram ? "product-summary__upgrade-chip is-active" : "product-summary__upgrade-chip"}
                          onClick={() =>
                            setSelectedUpgrades((current) => {
                              const next = { ...current };
                              delete next.ram;
                              return next;
                            })
                          }
                        >
                          <span>Original</span>
                        </button>
                        {upgradeSpecs.ramOptions.map((option) => (
                          <button
                            key={`ram-${option.label}`}
                            type="button"
                            className={selectedUpgrades.ram === option.label ? "product-summary__upgrade-chip is-active" : "product-summary__upgrade-chip"}
                            onClick={() =>
                              setSelectedUpgrades((current) => ({
                                ...current,
                                ram: option.label,
                              }))
                            }
                          >
                            <span>{option.label}</span>
                            {Number(option.priceDelta || 0) > 0 ? <small>+ {formatCurrency(option.priceDelta)}</small> : null}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {upgradeSpecs.storageOptions.length ? (
                    <div className="product-summary__upgrade-group">
                      <span>Storage</span>
                      <div className="product-summary__upgrade-options">
                        <button
                          type="button"
                          className={!selectedUpgrades.storage ? "product-summary__upgrade-chip is-active" : "product-summary__upgrade-chip"}
                          onClick={() =>
                            setSelectedUpgrades((current) => {
                              const next = { ...current };
                              delete next.storage;
                              return next;
                            })
                          }
                        >
                          <span>Original</span>
                        </button>
                        {upgradeSpecs.storageOptions.map((option) => (
                          <button
                            key={`storage-${option.label}`}
                            type="button"
                            className={selectedUpgrades.storage === option.label ? "product-summary__upgrade-chip is-active" : "product-summary__upgrade-chip"}
                            onClick={() =>
                              setSelectedUpgrades((current) => ({
                                ...current,
                                storage: option.label,
                              }))
                            }
                          >
                            <span>{option.label}</span>
                            {Number(option.priceDelta || 0) > 0 ? <small>+ {formatCurrency(option.priceDelta)}</small> : null}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
              </div>
            </div>
          ) : null}
          <p className="product-summary__copy">{summary}</p>

          <div className="product-summary__buy">
            <div className="product-summary__qty-control" aria-label="Product quantity">
              <label htmlFor="qty" className="sr-only">Quantity</label>
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
            <button
              type="button"
              className="primary-button product-summary__cart"
              disabled={stock < 1}
              onClick={() =>
                handleAddToCart(product, qty, {
                  selectedUpgrades: normalizeUpgradeSelection(selectedUpgrades),
                })
              }
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="9" cy="20" r="1.4" fill="currentColor" />
                <circle cx="17" cy="20" r="1.4" fill="currentColor" />
                <path d="M3 4h2l2.4 11.2a1.6 1.6 0 0 0 1.6 1.3h7.4a1.6 1.6 0 0 0 1.6-1.3L20 7H6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {stock < 1 ? "Out of stock" : "Add to cart"}
            </button>
          </div>

          <div className="product-summary__inline-actions" aria-label="Product actions">
            <button type="button" className={`product-summary__icon-action${wishlisted ? " is-active" : ""}`} onClick={handleWishlist}>
              <ProductActionIcon name="wishlist" />
              <span>Wishlist</span>
            </button>
            <button type="button" className="product-summary__icon-action" onClick={handleShare}>
              <ProductActionIcon name="share" />
              <span>Share</span>
            </button>
            <button type="button" className="product-summary__icon-action" onClick={handleCopy}>
              <ProductActionIcon name="copy" />
              <span>Copy Link</span>
            </button>
          </div>

          <div className="product-summary__meta">
            <p><strong>Category:</strong> {categoryLabel}</p>
            <p>
              <strong>Stock:</strong>
              <span className={stock > 0 ? "product-summary__stock-badge is-in-stock" : "product-summary__stock-badge is-out-of-stock"}>
                {stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </p>
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

      <section id="reviews" ref={tabsSectionRef} className="product-tabs panel">
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
            <div className="product-tabs__panel product-tabs__panel--reviews">
              <div className="product-review-layout">
                <div className="product-review-score-card">
                  {reviewCount > 0 ? (
                    <>
                      <strong className="product-review-score-card__value">{ratingValue.toFixed(1)}</strong>
                      <p className="product-card__rating" aria-label={`${ratingValue.toFixed(1)} out of 5 stars`}>
                        {Array.from({ length: 5 }, (_, index) => (
                          <span key={index} className={index < rating ? "is-filled" : ""}>{"★"}</span>
                        ))}
                      </p>
                      <small>Based on {reviewCount} verified {reviewCount === 1 ? "purchase" : "purchases"}</small>
                    </>
                  ) : (
                    <p className="product-review-score-card__empty">No reviews yet. Be the first to share your experience with this product.</p>
                  )}
                  {isAuthenticated ? (
                    <button
                      type="button"
                      className="product-review-score-card__cta"
                      onClick={() => setReviewFormOpen((current) => !current)}
                      aria-expanded={reviewFormOpen}
                      aria-controls="product-review-form-body"
                    >
                      {myReview ? "Update your review" : "Write a Review"}
                    </button>
                  ) : null}
                  {reviewCount > 0 ? (
                    <div className="product-review-score-card__trust">
                      <strong>Verified Reviews</strong>
                      <span>Reviews are tied to a signed-in DEETECH account.</span>
                    </div>
                  ) : null}
                </div>

                <div className="product-review-list-wrap">
                  <div className="product-review-list-wrap__head">
                    <h3>Community Feedback</h3>
                    {reviewCount > 0 ? (
                      <label className="product-review-actions__sort">
                        <span>Sort by</span>
                        <select className="field" value={reviewSort} onChange={(event) => setReviewSort(event.target.value)}>
                          <option value="newest">Newest</option>
                          <option value="oldest">Oldest</option>
                          <option value="highest">Highest rating</option>
                          <option value="lowest">Lowest rating</option>
                        </select>
                      </label>
                    ) : null}
                  </div>
                  {reviews.length > 0 ? (
                    <button
                      type="button"
                      className="product-review-photos-trigger"
                      onClick={() => setReviewPhotosModalOpen(true)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M5 12.5 9.5 17 19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      More from reviews ({reviews.length})
                      <span aria-hidden="true">{"›"}</span>
                    </button>
                  ) : null}
                  <div className="product-review-list">
                    {sortedReviews.length ? (
                      sortedReviews.slice(0, visibleReviewCount).map((review, index) => {
                        const reviewerName = review?.user?.name || review?.name || "Customer";
                        return (
                          <article key={review?._id || index} className="product-review">
                            {review?.image_url ? (
                              <button
                                type="button"
                                className="product-review__media"
                                onClick={() => setReviewImagePreview(resolveProductImage(review.image_url))}
                                aria-label="View review photo full size"
                              >
                                <StableImage
                                  src={resolveProductImage(review.image_url)}
                                  alt={review?.title || "Review upload"}
                                  width={280}
                                  height={280}
                                />
                              </button>
                            ) : null}
                            <div className="product-review__body">
                              <p className="product-card__rating" aria-label={`${Number(review?.rating || 0)} out of 5 stars`}>
                                {Array.from({ length: 5 }, (_, index) => (
                                  <span key={index} className={index < Number(review?.rating || 0) ? "is-filled" : ""}>{"★"}</span>
                                ))}
                              </p>
                              <div className="product-review__header">
                                <strong>{reviewerName}</strong>
                                <time>{getReviewTimeLabel(review?.createdAt)}</time>
                              </div>
                              <p>{review?.comment || review?.message || "No review text provided."}</p>
                            </div>
                          </article>
                        );
                      })
                    ) : (
                      <p className="product-review-list__empty">No reviews yet. Be the first to share your experience with this product.</p>
                    )}
                  </div>
                  {sortedReviews.length > visibleReviewCount ? (
                    <button
                      type="button"
                      className="product-review-list__load-more"
                      onClick={() => setVisibleReviewCount((current) => current + 5)}
                    >
                      Load More Reviews
                    </button>
                  ) : null}
                  {sortedReviews.length > 4 ? (
                    <button
                      type="button"
                      className="product-review-list__view-more-mobile"
                      onClick={() => setReviewPhotosModalOpen(true)}
                    >
                      View More Reviews
                    </button>
                  ) : null}
                </div>
              </div>

              {reviewFormOpen && isAuthenticated ? (
                <aside id="product-review-form-body" className="product-review-form product-review-form--full">
                  <h3>{myReview ? "Update Your Review" : "Write a Review"}</h3>
                  <form className="auth-form" onSubmit={handleReviewSubmit}>
                    <label>
                      <span>Rating</span>
                      <div className="product-review-form__rating" role="radiogroup" aria-label="Rate this product">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            type="button"
                            role="radio"
                            aria-checked={reviewForm.rating === value}
                            aria-label={`${value} star${value === 1 ? "" : "s"}`}
                            className={`product-review-form__star${reviewForm.rating >= value ? " is-active" : ""}`}
                            onClick={() => setReviewForm((current) => ({ ...current, rating: value }))}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </label>
                    <label>
                      <span>Review title</span>
                      <input
                        className="field"
                        value={reviewForm.title}
                        onChange={(event) => setReviewForm((current) => ({ ...current, title: event.target.value }))}
                        placeholder="Summarize your experience"
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
                      />
                    </label>
                    <label>
                      <span>Photo (optional)</span>
                      <div className="product-review-form__photo-dropzone">
                        {reviewForm.imageUrl ? (
                          <div className="product-review-form__photo-preview">
                            <StableImage src={resolveProductImage(reviewForm.imageUrl)} alt="Your review photo" width={84} height={84} />
                            <button type="button" className="product-review-form__photo-remove" onClick={handleReviewImageRemove}>
                              Remove photo
                            </button>
                          </div>
                        ) : (
                          <>
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="product-review-form__photo-icon">
                              <path d="M4 8h3l2-3h6l2 3h3v11H4V8Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                              <circle cx="12" cy="13" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                            </svg>
                            <label className="product-review-form__photo-upload">
                              <input
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                disabled={uploadingReviewImage}
                                onChange={handleReviewImageSelect}
                              />
                              {uploadingReviewImage ? "Uploading..." : "Add a photo (1 image)"}
                            </label>
                            <small>Supported formats: JPG, PNG. Max 5MB.</small>
                          </>
                        )}
                      </div>
                    </label>
                    <button type="submit" className="primary-button product-review-form__submit" disabled={reviewStatus === "saving" || uploadingReviewImage}>
                      {reviewStatus === "saving" ? "Saving review..." : myReview ? "Update review" : "Submit review"}
                    </button>
                  </form>
                </aside>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      {relatedProducts.length ? (
        <section className="related-products">
          <div className="related-products__header">
            <h2>Related products</h2>
            <div className="related-products__controls" aria-label="Related products navigation">
              <button
                type="button"
                className="related-products__arrow related-products__arrow--left"
                onClick={() => scrollRelatedRail(-1)}
                aria-label="Scroll related products left"
                disabled={!relatedRailNav.left}
              >
                &lsaquo;
              </button>
              <button
                type="button"
                className="related-products__arrow related-products__arrow--right"
                onClick={() => scrollRelatedRail(1)}
                aria-label="Scroll related products right"
                disabled={!relatedRailNav.right}
              >
                &rsaquo;
              </button>
            </div>
          </div>
          <div className="related-products__rail-wrap">
            <div ref={relatedRailRef} className="related-products__grid related-products__rail">
              {relatedProducts.map((item) => (
                <div key={item._id} className="related-products__item">
                  <ProductCard product={item} onAddToCart={handleAddToCart} variant="related" />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <div className="product-sticky-bar" aria-hidden="true">
        <div className="product-sticky-bar__qty" aria-label="Product quantity">
          <button type="button" onClick={decrementQty} aria-label="Reduce quantity">-</button>
          <span>{qty}</span>
          <button type="button" onClick={incrementQty} aria-label="Increase quantity">+</button>
        </div>
        <button
          type="button"
          className="product-sticky-bar__cart"
          disabled={stock < 1}
          onClick={() =>
            handleAddToCart(product, qty, {
              selectedUpgrades: normalizeUpgradeSelection(selectedUpgrades),
            })
          }
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="9" cy="20" r="1.4" fill="currentColor" />
            <circle cx="17" cy="20" r="1.4" fill="currentColor" />
            <path d="M3 4h2l2.4 11.2a1.6 1.6 0 0 0 1.6 1.3h7.4a1.6 1.6 0 0 0 1.6-1.3L20 7H6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {stock < 1 ? "Out of stock" : "Add to cart"}
        </button>
      </div>

      {portalReady ? previewModal : null}
      {portalReady ? reviewImagePreviewModal : null}
      {portalReady ? reviewPhotosModal : null}
    </main>
  );
}
