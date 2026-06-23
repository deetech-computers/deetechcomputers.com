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

function getReviewerInitials(name) {
  const parts = String(name || "Customer")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  return (parts.map((part) => part[0]?.toUpperCase() || "").join("") || "CU").slice(0, 2);
}

const SOCIAL_LINKS = [
  { label: "TikTok", href: "https://www.tiktok.com/@deetech.computers?_r=1&_t=ZS-94rKFc7vpAr", icon: "tiktok" },
  { label: "WhatsApp", href: "https://wa.me/message/WEYXKNNA6KXXL1", icon: "whatsapp" },
  { label: "Facebook", href: "https://www.facebook.com/share/19NkhoTCdi/?mibextid=wwXIfr", icon: "facebook" },
  { label: "Instagram", href: "https://www.instagram.com/deetechcomputers1/", icon: "instagram" },
];

function BackArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 12H5M11 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
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
  const searchParams = useSearchParams();
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
  const [reviewFormOpen, setReviewFormOpen] = useState(true);
  const [affiliateShareCode, setAffiliateShareCode] = useState("");

  function handleAddToCart(item, qty = 1, options = {}) {
    if (!item) return;
    addItem(item, qty, options);
  }
  const [qty, setQty] = useState(1);
  const [selectedUpgrades, setSelectedUpgrades] = useState({});
  const [upgradePanelOpen, setUpgradePanelOpen] = useState(false);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [loadedMainImage, setLoadedMainImage] = useState({ image: "", src: "", srcSet: undefined });
  const [mainImageLoading, setMainImageLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const thumbnailRailRef = useRef(null);
  const previewThumbnailRailRef = useRef(null);
  const relatedRailRef = useRef(null);
  const tabsSectionRef = useRef(null);
  const galleryTouchStartXRef = useRef(null);
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
    () => optimizeCloudinaryImage(currentImage, { width: 560, height: 560, force: true }),
    [currentImage]
  );
  const optimizedCurrentImageSrcSet = useMemo(
    () => buildCloudinarySrcSet(currentImage, [360, 480, 560, 640], { crop: "fill", gravity: "auto", force: true }),
    [currentImage]
  );
  const optimizedGalleryImages = useMemo(
    () => images.map((image) => optimizeCloudinaryImage(image, { width: 560, height: 560, force: true })),
    [images]
  );
  const optimizedThumbnailImages = useMemo(
    () => images.map((image) => optimizeCloudinaryImage(image, { width: 140, height: 140 })),
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
    setUpgradePanelOpen(false);
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

  function scrollThumbnailRail(direction) {
    const rail = thumbnailRailRef.current;
    if (!rail) return;
    rail.scrollBy({
      left: direction * Math.max(rail.clientWidth * 0.72, 180),
      behavior: "smooth",
    });
  }

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
        <div className="product-detail-loading" aria-label="Loading product details">
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
  const productSpecs = applyUpgradeSelectionToSpecs(
    getProductSpecs(product).filter(([, value]) => String(value || "").trim()),
    selectedUpgrades
  );
  const description = getProductDescription(product);
  const summary = getProductSummary(product);
  const displayBrand = normalizeDisplayTitle(product?.brand || categoryLabel);
  const displayName = normalizeDisplayTitle(product?.name);
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

  function decrementQty() {
    setQty((current) => Math.max(1, current - 1));
  }

  function incrementQty() {
    setQty((current) => Math.min(Math.max(stock, 1), current + 1));
  }

  function handleGalleryTouchStart(event) {
    galleryTouchStartXRef.current = event.touches?.[0]?.clientX ?? null;
  }

  function handleGalleryTouchEnd(event) {
    const startX = galleryTouchStartXRef.current;
    galleryTouchStartXRef.current = null;
    if (startX === null || images.length < 2) return;

    const endX = event.changedTouches?.[0]?.clientX ?? startX;
    const deltaX = endX - startX;
    if (Math.abs(deltaX) < 40) return;

    if (deltaX > 0) {
      setActiveImage((index) => (index === 0 ? images.length - 1 : index - 1));
    } else {
      setActiveImage((index) => (index === images.length - 1 ? 0 : index + 1));
    }
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
    <>
      {/* DESKTOP HEADER */}
      <header className="hidden md:flex bg-white sticky top-0 z-50 shadow-sm">
        <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-10">
            <span className="font-headline-lg text-headline-lg font-bold text-primary">DEETECH Computers</span>
            <div className="flex gap-6 items-center">
              <a className="text-on-surface-variant font-medium hover:text-primary transition-colors font-label-md text-label-md" href="/products/laptops">Laptops</a>
              <a className="text-on-surface-variant font-medium hover:text-primary transition-colors font-label-md text-label-md" href="/products/desktops">Desktops</a>
              <a className="text-on-surface-variant font-medium hover:text-primary transition-colors font-label-md text-label-md" href="/products/accessories">Accessories</a>
              <a className="text-on-surface-variant font-medium hover:text-primary transition-colors font-label-md text-label-md" href="/products">Workstations</a>
              <a className="text-on-surface-variant font-medium hover:text-primary transition-colors font-label-md text-label-md" href="/contact">Support</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/cart")} className="p-2 hover:bg-surface-container rounded-full transition-all">
              <span className="material-symbols-outlined text-primary">shopping_cart</span>
            </button>
            <button onClick={() => router.push("/account")} className="p-2 hover:bg-surface-container rounded-full transition-all">
              <span className="material-symbols-outlined text-primary">account_circle</span>
            </button>
          </div>
        </nav>
      </header>

      {/* MOBILE TOP BAR */}
      <header className="md:hidden fixed top-0 w-full bg-white z-50 flex items-center justify-between px-4 h-16 shadow-sm">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary">arrow_back</span>
        </button>
        <nav className="flex-1 px-4">
          <span className="font-label-md text-label-md text-on-surface-variant">Home / </span>
          <span className="font-label-md text-label-md text-primary font-bold">{categoryLabel}</span>
        </nav>
        <button onClick={handleShare} className="w-10 h-10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary">share</span>
        </button>
      </header>

      <main className="md:pt-20 pt-0">
        {/* BREADCRUMBS - DESKTOP ONLY */}
        <nav className="hidden md:flex items-center gap-1 text-on-surface-variant font-label-md text-label-md mb-6 max-w-7xl mx-auto px-6 pt-6">
          <Link href="/">Home</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <Link href="/products">Shop</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <Link href={`/products/${canonicalCategory(product?.category)}`}>{categoryLabel}</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-primary font-bold">{product.name}</span>
        </nav>

        {/* DESKTOP LAYOUT: 2-column grid */}
        <div className="hidden md:grid max-w-7xl mx-auto px-6 gap-6 mb-12">
          <div className="col-span-7">
            {/* IMAGE GALLERY */}
            <div className="bg-white p-6 rounded-xl shadow-sm flex items-center justify-center min-h-96 overflow-hidden">
              {visibleMainImage.src ? (
                <StableImage
                  src={visibleMainImage.src}
                  srcSet={visibleMainImage.srcSet}
                  alt={product.name}
                  width={560}
                  height={560}
                  loading="eager"
                  fetchPriority="high"
                  className="w-full h-auto object-contain hover:scale-105 transition-transform duration-500 cursor-pointer"
                  onClick={() => setPreviewOpen(true)}
                />
              ) : (
                <div className="text-on-surface-variant">No image</div>
              )}
            </div>

            {/* THUMBNAIL RAIL */}
            {images.length > 1 && (
              <div className="flex gap-4 mt-4">
                {images.map((image, index) => (
                  <button
                    key={`thumb-${index}`}
                    onClick={() => setActiveImage(index)}
                    className={`relative w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImageIndex === index ? "border-primary-container" : "border-transparent"
                    }`}
                  >
                    <StableImage
                      src={optimizedThumbnailImages[index] || image}
                      alt={`${product.name} view ${index + 1}`}
                      width={140}
                      height={140}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="col-span-5">
            {/* SUMMARY PANEL - DESKTOP */}
            <div className="bg-accent-panel p-6 rounded-xl shadow-sm flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="font-label-md text-label-md text-primary-container uppercase tracking-widest">{displayBrand}</span>
                <h1 className="font-headline-lg text-headline-lg text-primary">{displayName}</h1>
                {reviewCount > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex text-on-secondary-container">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className="material-symbols-outlined fill text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {i < rating ? "star" : "star_half"}
                        </span>
                      ))}
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">({reviewCount} Reviews)</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-baseline gap-4">
                  <span className="font-headline-xl text-headline-xl text-primary">{formatCurrency(currentPrice)}</span>
                  {hasDiscount && (
                    <>
                      <span className="font-body-lg text-body-lg text-on-surface-variant line-through">{formatCurrency(originalPrice)}</span>
                      <span className="bg-error-container text-on-error-container px-2 py-1 rounded font-label-md text-label-md">{discountPercent}% OFF</span>
                    </>
                  )}
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Available in stock for immediate pickup or delivery across Ghana.</p>
              </div>

              {/* CONFIG OPTIONS */}
              {hasUpgradeableSpecs && (
                <div className="flex flex-col gap-4 border-t border-outline-variant pt-6">
                  {upgradeSpecs.ramOptions.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <label className="font-label-md text-label-md text-on-surface font-bold">Memory (RAM)</label>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => setSelectedUpgrades(prev => { const next = { ...prev }; delete next.ram; return next; })}
                          className={`px-4 py-2 rounded font-label-md border-2 transition-all ${!selectedUpgrades.ram ? 'bg-primary text-on-primary border-primary' : 'bg-white text-on-surface border-outline-variant hover:border-primary'}`}
                        >
                          Original
                        </button>
                        {upgradeSpecs.ramOptions.map(opt => (
                          <button
                            key={`ram-${opt.label}`}
                            onClick={() => setSelectedUpgrades(prev => ({ ...prev, ram: opt.label }))}
                            className={`px-4 py-2 rounded font-label-md border-2 transition-all ${selectedUpgrades.ram === opt.label ? 'bg-primary text-on-primary border-primary' : 'bg-white text-on-surface border-outline-variant hover:border-primary'}`}
                          >
                            {opt.label} {Number(opt.priceDelta || 0) > 0 && <span className="text-on-secondary-container">+{formatCurrency(opt.priceDelta)}</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {upgradeSpecs.storageOptions.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <label className="font-label-md text-label-md text-on-surface font-bold">Storage</label>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => setSelectedUpgrades(prev => { const next = { ...prev }; delete next.storage; return next; })}
                          className={`px-4 py-2 rounded font-label-md border-2 transition-all ${!selectedUpgrades.storage ? 'bg-primary text-on-primary border-primary' : 'bg-white text-on-surface border-outline-variant hover:border-primary'}`}
                        >
                          Original
                        </button>
                        {upgradeSpecs.storageOptions.map(opt => (
                          <button
                            key={`storage-${opt.label}`}
                            onClick={() => setSelectedUpgrades(prev => ({ ...prev, storage: opt.label }))}
                            className={`px-4 py-2 rounded font-label-md border-2 transition-all ${selectedUpgrades.storage === opt.label ? 'bg-primary text-on-primary border-primary' : 'bg-white text-on-surface border-outline-variant hover:border-primary'}`}
                          >
                            {opt.label} {Number(opt.priceDelta || 0) > 0 && <span className="text-on-secondary-container">+{formatCurrency(opt.priceDelta)}</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ACTIONS */}
              <div className="flex flex-col gap-4 pt-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-outline-variant rounded-lg bg-white">
                    <button onClick={decrementQty} className="p-4 hover:text-primary">
                      <span className="material-symbols-outlined">remove</span>
                    </button>
                    <input
                      type="number"
                      value={qty}
                      onChange={(e) => setQty(Math.max(1, Math.min(stock, Number(e.target.value) || 1)))}
                      className="w-12 text-center border-none bg-transparent font-bold focus:ring-0"
                      min="1"
                      max={Math.max(stock, 1)}
                    />
                    <button onClick={incrementQty} className="p-4 hover:text-primary">
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product, qty, { selectedUpgrades: normalizeUpgradeSelection(selectedUpgrades) })}
                    disabled={stock < 1}
                    className="flex-1 bg-primary-container text-on-primary-container py-4 rounded-lg font-headline-md hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined">shopping_cart</span>
                    Add to Cart
                  </button>
                </div>

                <div className="flex items-center justify-between border-t border-outline-variant pt-4">
                  <button onClick={handleCopy} className="flex items-center gap-2 text-on-surface-variant hover:text-primary font-label-md transition-all">
                    <span className="material-symbols-outlined">content_copy</span> Copy Link
                  </button>
                  <button onClick={handleWishlist} className={`flex items-center gap-2 font-label-md transition-all ${wishlisted ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
                    <span className="material-symbols-outlined">favorite</span> Wishlist
                  </button>
                  <button onClick={handleShare} className="flex items-center gap-2 text-on-surface-variant hover:text-primary font-label-md transition-all">
                    <span className="material-symbols-outlined">share</span> Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE LAYOUT */}
        <div className="md:hidden mt-16 pb-32">
          {/* IMAGE GALLERY - MOBILE */}
          <section className="relative bg-white">
            <div className="relative w-full aspect-square overflow-hidden">
              {visibleMainImage.src ? (
                <StableImage
                  src={visibleMainImage.src}
                  srcSet={visibleMainImage.srcSet}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                  onClick={() => setPreviewOpen(true)}
                />
              ) : (
                <div className="w-full h-full bg-surface-container flex items-center justify-center">No image</div>
              )}
            </div>

            {/* PAGINATION DOTS */}
            {images.length > 1 && (
              <div className="flex justify-center gap-1.5 py-4">
                {images.map((_, index) => (
                  <button
                    key={`dot-${index}`}
                    onClick={() => setActiveImage(index)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${activeImageIndex === index ? 'bg-primary' : 'bg-outline-variant'}`}
                  />
                ))}
              </div>
            )}

            {/* THUMBNAILS */}
            {images.length > 1 && (
              <div className="flex gap-3 px-4 pb-6 overflow-x-auto no-scrollbar">
                {images.map((image, index) => (
                  <button
                    key={`thumb-mobile-${index}`}
                    onClick={() => setActiveImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md border-2 overflow-hidden transition-all ${activeImageIndex === index ? 'border-primary' : 'border-outline-variant'}`}
                  >
                    <StableImage
                      src={optimizedThumbnailImages[index] || image}
                      alt={`View ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* SUMMARY CARD - MOBILE */}
          <section className="px-4 -mt-4">
            <div className="bg-white rounded-lg shadow-sm p-4 relative z-20">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-md text-label-md text-primary bg-secondary-container px-2 py-0.5 rounded">{displayBrand}</span>
                {reviewCount > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      ))}
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">({reviewCount})</span>
                  </div>
                )}
              </div>
              <h1 className="font-headline-md text-headline-md text-on-surface mb-4">{displayName}</h1>
              <div className="flex flex-col gap-1 mb-4">
                {hasDiscount && (
                  <div className="flex items-center gap-2">
                    <span className="bg-error text-white text-xs font-bold px-2 py-0.5 rounded">Save {discountPercent}%</span>
                    <span className="font-mono-data text-body-sm text-on-surface-variant line-through">{formatCurrency(originalPrice)}</span>
                  </div>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="font-mono-data text-headline-md font-bold text-primary">{formatCurrency(currentPrice)}</span>
                  {pricing.isTimedDiscount && pricing.discountEndsAt && (
                    <span className="font-body-sm text-body-sm text-error">Offer ends {formatDateTime(pricing.discountEndsAt)}</span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* CONFIG - MOBILE */}
          {hasUpgradeableSpecs && (
            <section className="px-4 mt-6">
              <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-4">Configure Hardware</h3>
              {upgradeSpecs.ramOptions.length > 0 && (
                <div className="mb-6">
                  <label className="font-body-sm font-semibold block mb-2">System RAM</label>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    <button
                      onClick={() => setSelectedUpgrades(prev => { const next = { ...prev }; delete next.ram; return next; })}
                      className={`flex-shrink-0 px-4 py-2 rounded border-2 text-body-sm font-semibold transition-all ${!selectedUpgrades.ram ? 'border-primary bg-primary-fixed-dim text-primary' : 'border-outline-variant bg-white text-on-surface-variant'}`}
                    >
                      Original
                    </button>
                    {upgradeSpecs.ramOptions.map(opt => (
                      <button
                        key={`ram-mobile-${opt.label}`}
                        onClick={() => setSelectedUpgrades(prev => ({ ...prev, ram: opt.label }))}
                        className={`flex-shrink-0 px-4 py-2 rounded border-2 text-body-sm transition-all ${selectedUpgrades.ram === opt.label ? 'border-primary bg-primary-fixed-dim text-primary' : 'border-outline-variant bg-white text-on-surface-variant'}`}
                      >
                        {opt.label} {Number(opt.priceDelta || 0) > 0 && <span className="text-primary font-bold">+{formatCurrency(opt.priceDelta)}</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {upgradeSpecs.storageOptions.length > 0 && (
                <div className="mb-6">
                  <label className="font-body-sm font-semibold block mb-2">Storage Capacity</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedUpgrades(prev => { const next = { ...prev }; delete next.storage; return next; })}
                      className={`flex-1 py-2 rounded border-2 text-body-sm font-semibold transition-all ${!selectedUpgrades.storage ? 'border-primary bg-primary-fixed-dim text-primary' : 'border-outline-variant bg-white text-on-surface-variant'}`}
                    >
                      Original
                    </button>
                    {upgradeSpecs.storageOptions.map(opt => (
                      <button
                        key={`storage-mobile-${opt.label}`}
                        onClick={() => setSelectedUpgrades(prev => ({ ...prev, storage: opt.label }))}
                        className={`flex-1 py-2 rounded border-2 text-body-sm transition-all ${selectedUpgrades.storage === opt.label ? 'border-primary bg-primary-fixed-dim text-primary' : 'border-outline-variant bg-white text-on-surface-variant'}`}
                      >
                        {opt.label} {Number(opt.priceDelta || 0) > 0 && <span className="block text-primary font-bold text-xs">+{formatCurrency(opt.priceDelta)}</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ACTION BUTTONS - MOBILE */}
          <section className="px-4 flex gap-3 mb-8 mt-6">
            <button onClick={handleCopy} className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-outline-variant shadow-sm active:bg-surface-container-high">
              <span className="material-symbols-outlined text-primary">content_copy</span>
            </button>
            <button onClick={handleWishlist} className={`w-12 h-12 flex items-center justify-center rounded-full border shadow-sm active:bg-surface-container-high transition-all ${wishlisted ? 'bg-primary' : 'bg-white border-outline-variant'}`}>
              <span className={`material-symbols-outlined ${wishlisted ? 'text-white' : 'text-primary'}`}>favorite</span>
            </button>
            <button onClick={handleShare} className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-outline-variant shadow-sm active:bg-surface-container-high">
              <span className="material-symbols-outlined text-primary">share</span>
            </button>
          </section>

          {/* TABS - MOBILE */}
          <section className="mb-8">
            <div className="flex border-b border-outline-variant px-4 bg-white sticky top-16 z-40">
              <button
                onClick={() => setActiveTab("description")}
                className={`flex-1 py-4 text-body-sm font-semibold border-b-2 transition-all ${activeTab === "description" ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent'}`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("specs")}
                className={`flex-1 py-4 text-body-sm font-medium border-b-2 transition-all ${activeTab === "specs" ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent'}`}
              >
                Specs
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`flex-1 py-4 text-body-sm font-medium border-b-2 transition-all ${activeTab === "reviews" ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent'}`}
              >
                Reviews
              </button>
            </div>

            <div className="p-4 bg-white space-y-4">
              {activeTab === "description" && (
                <p className="font-body-md text-on-surface-variant leading-relaxed">{description}</p>
              )}

              {activeTab === "specs" && (
                <div className="space-y-2">
                  {productSpecs.length ? productSpecs.map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-outline-variant">
                      <span className="text-body-sm text-on-surface-variant">{String(key).replace(/[_-]+/g, " ")}</span>
                      <span className="text-body-sm font-semibold">{String(value)}</span>
                    </div>
                  )) : (
                    <p className="text-on-surface-variant">Detailed specs coming soon.</p>
                  )}
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="mt-8 pt-6 border-t border-outline-variant">
                  {reviewCount > 0 ? (
                    <>
                      <div className="bg-accent-panel p-4 rounded-lg mb-6">
                        <div className="text-center mb-4">
                          <div className="text-4xl font-bold text-primary">{ratingValue.toFixed(1)}</div>
                          <div className="flex justify-center text-amber-400 mt-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            ))}
                          </div>
                          <p className="text-xs text-on-surface-variant mt-1">Based on {reviewCount} verified ratings</p>
                        </div>
                        {isAuthenticated && (
                          <button
                            onClick={() => setReviewFormOpen(!reviewFormOpen)}
                            className="w-full py-3 bg-white border border-primary text-primary font-bold rounded-lg active:bg-primary active:text-white transition-colors"
                          >
                            Write a review
                          </button>
                        )}
                      </div>

                      {sortedReviews.map((review, idx) => (
                        <div key={review?._id || idx} className="border-b border-outline-variant py-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary font-bold text-xs">
                                {getReviewerInitials(review?.user?.name || review?.name || "Customer")}
                              </div>
                              <div>
                                <div className="font-body-sm font-semibold">{review?.user?.name || review?.name || "Customer"}</div>
                                <div className="text-xs text-on-surface-variant">{getReviewTimeLabel(review?.createdAt)}</div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-0.5 mb-2">
                            {Array.from({ length: 5 }, (_, i) => (
                              <span key={i} className="material-symbols-outlined text-sm text-amber-400" style={{ fontVariationSettings: i < Number(review?.rating || 0) ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                            ))}
                          </div>
                          <h4 className="font-body-sm font-semibold mb-1">{review?.title || "Customer review"}</h4>
                          <p className="text-body-sm text-on-surface-variant">{review?.comment || review?.message || "No text"}</p>
                        </div>
                      ))}
                    </>
                  ) : (
                    <p className="text-on-surface-variant text-center py-6">No reviews yet. Be the first!</p>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* RELATED PRODUCTS - MOBILE */}
          {relatedProducts.length > 0 && (
            <section className="px-4 mb-12">
              <h3 className="font-headline-md mb-4">Customers Also Viewed</h3>
              <div className="flex gap-4 overflow-x-auto no-scrollbar">
                {relatedProducts.slice(0, 6).map((item) => (
                  <div key={item._id} className="flex-shrink-0 w-44 bg-white rounded-lg p-3 shadow-sm border border-outline-variant">
                    <div className="w-full aspect-square bg-surface-container-low rounded mb-3 overflow-hidden">
                      {getProductImages(item)[0] && (
                        <StableImage
                          src={getProductImages(item)[0]}
                          alt={item.name}
                          width={180}
                          height={180}
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                    <p className="font-label-md text-on-surface-variant mb-1 truncate">{item.name}</p>
                    <p className="font-mono-data text-primary font-bold">{formatCurrency(getProductPrice(item))}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SOCIAL LINKS - MOBILE */}
          <section className="px-4 space-y-6 mb-12">
            <div className="flex justify-center gap-6">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                  aria-label={link.label}
                >
                  <SocialAppIcon name={link.icon} />
                </a>
              ))}
            </div>
            <div className="space-y-3">
              <button onClick={() => router.push("/wishlist")} className="w-full py-3 bg-transparent border border-primary text-primary font-bold rounded-lg active:bg-primary-fixed-dim">
                Browse Wishlist
              </button>
              <button onClick={() => router.push("/cart")} className="w-full py-3 bg-transparent border border-primary text-primary font-bold rounded-lg active:bg-primary-fixed-dim">
                Go to Cart
              </button>
            </div>
          </section>
        </div>

        {/* STICKY BOTTOM BAR - MOBILE ONLY */}
        <footer className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-outline-variant px-4 py-4 flex items-center gap-4 z-40">
          <div className="flex items-center bg-background rounded-lg border border-outline-variant h-12 px-1">
            <button onClick={decrementQty} className="w-8 h-8 flex items-center justify-center text-on-surface-variant font-bold text-lg">−</button>
            <span className="w-8 text-center font-bold text-on-surface">{qty}</span>
            <button onClick={incrementQty} className="w-8 h-8 flex items-center justify-center text-on-surface-variant font-bold text-lg">+</button>
          </div>
          <button
            onClick={() => handleAddToCart(product, qty, { selectedUpgrades: normalizeUpgradeSelection(selectedUpgrades) })}
            disabled={stock < 1}
            className="flex-1 bg-primary text-white h-12 rounded-lg font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            Add to Cart
          </button>
        </footer>
      </main>

      {portalReady ? previewModal : null}
    </>
  );
}
