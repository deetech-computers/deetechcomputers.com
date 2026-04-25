"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ProductCard from "@/components/products/product-card";
import StableImage from "@/components/ui/stable-image";
import { useCart } from "@/hooks/use-cart";
import { API_BASE } from "@/lib/config";
import { requestJson } from "@/lib/http";
import {
  buildProductsHref,
  canonicalCategory,
  DEFAULT_STOREFRONT_CATEGORIES,
  deriveCategories,
  fetchProducts,
  getProductRating,
  getProductPrice,
  pickFeaturedProducts,
  resolveProductImage,
} from "@/lib/products";
import { asArray } from "@/lib/resource";

function normalizeBanner(item) {
  const category = canonicalCategory(item?.linkCategory || "");
  const subCategory = String(item?.linkSubCategory || "").trim().toLowerCase();
  const categoryLink =
    category && category !== "all"
      ? buildProductsHref({
          category,
          brand: subCategory && subCategory !== "all" ? subCategory : "",
        })
      : "";
  const customLink = String(item?.link || item?.ctaLink || "").trim();

  return {
    imageUrl: resolveProductImage(item?.imageUrl || item?.image_url || item?.image || ""),
    link: customLink || categoryLink || "",
  };
}
const HOME_LOGO_FILES = [
  "Acer_Inc.-Logo.wine.svg",
  "AOC_International-Logo.wine.svg",
  "Apple_Inc.-Logo.wine.svg",
  "Asus-Logo.wine.svg",
  "BenQ-Logo.wine.svg",
  "Brother_Industries-Logo.wine.svg",
  "Canon_Inc.-Logo.wine.svg",
  "Dell-Logo.wine.svg",
  "Google-Logo.wine.svg",
  "Hewlett-Packard-Logo.wine.svg",
  "Huawei-Logo.wine.svg",
  "Kingston_Technology-Logo.wine.svg",
  "Lenovo_Vibe_K4_Note-Logo.wine.svg",
  "LG_Corporation-Logo.wine.svg",
  "Microsoft-Logo.wine.svg",
  "Nokia-Logo.wine.svg",
  "Oppo-Logo.wine.svg",
  "Panasonic-Logo.wine.svg",
  "Philips-Logo.wine.svg",
  "Samsung-Logo.wine.svg",
  "SanDisk-Logo.wine.svg",
  "Seagate_Technology-Logo.wine.svg",
  "Seiko_Epson-Logo.wine.svg",
  "Toshiba-Logo.wine.svg",
  "Western_Digital-Logo.wine.svg",
  "Xero_(software)-Logo.wine.svg",
];
const HOME_LOGOS = HOME_LOGO_FILES.map((file) => ({
  src: `/home-logo/${file}`,
  alt: file
    .replace(/\.svg$/i, "")
    .replace(/[-_.()]+/g, " ")
    .replace(/\s+/g, " ")
    .trim(),
}));
const HOME_CATEGORY_IMAGES = {
  laptops: "/home-edited/laptops-removebg-preview.png",
  phones: "/home-edited/mobilephones-removebg-preview.png",
  monitors: "/home-edited/monitors-removebg-preview.png",
  accessories: "/home-edited/accessories-removebg-preview.png",
  printers: "/home-edited/printers-removebg-preview.png",
  storage: "/home-edited/storage_devices-removebg-preview.png",
  others: "/home-edited/others-removebg-preview.png",
  projectors: "/home-edited/projectors-removebg-preview.png",
};

function getCategoryArtKey(slug, label, index) {
  const value = `${slug} ${label}`.toLowerCase();

  if (value.includes("laptop")) return "laptops";
  if (value.includes("phone")) return "phones";
  if (value.includes("monitor")) return "monitors";
  if (value.includes("printer")) return "printers";
  if (value.includes("accessor")) return "accessories";
  if (value.includes("stor") || value.includes("drive") || value.includes("ssd")) return "storage";
  if (value.includes("tablet") || value.includes("ipad")) return "tablets";
  if (value.includes("watch")) return "watches";
  if (value.includes("camera")) return "camera";
  if (value.includes("game") || value.includes("controller") || value.includes("console")) return "gaming";
  if (value.includes("speaker") || value.includes("audio") || value.includes("sound") || value.includes("head")) return "audio";

  const fallbackKeys = ["audio", "gaming", "camera", "tablets", "storage", "accessories"];
  return fallbackKeys[index % fallbackKeys.length];
}
function getCategoryFilterHref(slug) {
  return buildProductsHref({
    category: canonicalCategory(slug),
    hash: "shop-results",
  });
}

function getCategoryTileImage(slug) {
  const key = canonicalCategory(slug);
  return HOME_CATEGORY_IMAGES[key] || "";
}

function isLaptopDesktopCategory(item) {
  const slug = canonicalCategory(item?.slug || "");
  const label = String(item?.label || "").toLowerCase();
  return slug === "laptops" || label.includes("desktop");
}

function getHomeSectionFilterHref(sectionKey, category = "all") {
  return buildProductsHref({
    category,
    promotion: sectionKey,
    hash: "shop-results",
  });
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

function getProductTimestamp(product) {
  return new Date(product?.createdAt || product?.updatedAt || 0).getTime() || 0;
}

function getBestSellerScore(product) {
  return Number(
    product?.sold ??
      product?.salesCount ??
      product?.orderCount ??
      product?.numSales ??
      getProductRating(product) ??
      0
  );
}

function getFeaturedScore(product) {
  return Number(
    (product?.isFeatured ? 1000 : 0) +
      (product?.featured ? 1000 : 0) +
      getProductRating(product) * 10
  );
}

function sortByBestSeller(products) {
  return [...products].sort((a, b) => getBestSellerScore(b) - getBestSellerScore(a));
}

function sortByNewest(products) {
  return [...products].sort((a, b) => getProductTimestamp(b) - getProductTimestamp(a));
}

export default function HomePage() {
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [banners, setBanners] = useState([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [mobileHomeProductsView, setMobileHomeProductsView] = useState("scroll");
  const [isMobileHomeProducts, setIsMobileHomeProducts] = useState(false);
  const homeSectionRailRefs = useRef({});
  const [homeSectionRailNav, setHomeSectionRailNav] = useState({});

  function handleAddToCart(product) {
    if (!product) return;
    addItem(product, 1);
  }

  useEffect(() => {
    fetchProducts()
      .then((items) => {
        setProducts(items);
        setStatus("ready");
      })
      .catch((err) => {
        setError(err.message);
        setStatus("error");
      });
  }, []);

  useEffect(() => {
    requestJson(`${API_BASE}/banners`)
      .then((payload) => {
        const normalized = asArray(payload)
          .map((item) => normalizeBanner(item))
          .filter((item) => item && item.imageUrl);
        setBanners(normalized);
        setBannerIndex(0);
      })
      .catch(() => {
        setBanners([]);
      });
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % banners.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [banners.length]);

  const laptopProducts = products.filter((product) => canonicalCategory(product?.category) === "laptops");
  const phoneProducts = products.filter((product) => canonicalCategory(product?.category) === "phones");
  const featuredProducts = [...pickFeaturedProducts(products, 12)]
    .sort((a, b) => getFeaturedScore(b) - getFeaturedScore(a))
    .slice(0, 8);
  const newArrivalProducts = sortByNewest(products).slice(0, 5);
  const sectionProducts = (sectionKey, allowedCategories = []) => {
    const allowed = new Set((allowedCategories || []).map((item) => canonicalCategory(item)));
    return products.filter((product) => {
      const productCategory = canonicalCategory(product?.category);
      if (allowed.size && !allowed.has(productCategory)) return false;
      const sections = Array.isArray(product?.homeSections) ? product.homeSections : [];
      return sections.map(canonicalHomeSectionKey).includes(sectionKey);
    });
  };
  const pickSectionProducts = ({
    sectionKey,
    allowedCategories = [],
    fallback = [],
  }) => {
    const tagged = sortByNewest(sectionProducts(sectionKey, allowedCategories));
    if (tagged.length) return tagged.slice(0, 5);
    return sortByNewest(fallback).slice(0, 5);
  };
  const productCollections = {
    hot_deals: {
      label: "Hot Deals",
      href: getHomeSectionFilterHref("hot_deals"),
      products: pickSectionProducts({
        sectionKey: "hot_deals",
        fallback: [],
      }),
    },
    just_landed: {
      label: "Just Landed",
      href: getHomeSectionFilterHref("just_landed"),
      products: pickSectionProducts({
        sectionKey: "just_landed",
        fallback: newArrivalProducts,
      }),
    },
    student_laptops: {
      label: "Laptops for Students",
      href: getHomeSectionFilterHref("student_laptops", "laptops"),
      products: pickSectionProducts({
        sectionKey: "student_laptops",
        allowedCategories: ["laptops"],
        fallback: [],
      }),
    },
    business_laptops: {
      label: "Laptops for Work & Business",
      href: getHomeSectionFilterHref("business_laptops", "laptops"),
      products: pickSectionProducts({
        sectionKey: "business_laptops",
        allowedCategories: ["laptops"],
        fallback: [],
      }),
    },
    gaming_laptops: {
      label: "Powerful/Gaming Laptops",
      href: getHomeSectionFilterHref("gaming_laptops", "laptops"),
      products: pickSectionProducts({
        sectionKey: "gaming_laptops",
        allowedCategories: ["laptops"],
        fallback: [],
      }),
    },
    budget_smartphones: {
      label: "Smartphones for Every Budget",
      href: getHomeSectionFilterHref("budget_smartphones", "phones"),
      products: pickSectionProducts({
        sectionKey: "budget_smartphones",
        allowedCategories: ["phones"],
        fallback: [],
      }),
    },
    quality_accessories: {
      label: "Quality Accessories",
      href: getHomeSectionFilterHref("quality_accessories", "accessories"),
      products: pickSectionProducts({
        sectionKey: "quality_accessories",
        allowedCategories: ["accessories"],
        fallback: [],
      }),
    },
    trusted_brands: {
      label: "Shop Trusted Brands",
      href: getHomeSectionFilterHref("trusted_brands"),
      products: pickSectionProducts({
        sectionKey: "trusted_brands",
        fallback: [],
      }),
    },
  };
  const homepageSectionMeta = {
    just_landed: {
      title: "Just Landed",
      description: "Fresh arrivals just added to the store so customers can discover the newest devices first.",
    },
    hot_deals: {
      title: "Hot Deals",
      description: "Limited-time value picks selected to highlight strong offers and fast-moving deals.",
    },
    student_laptops: {
      title: "Laptops for Students",
      description: "Reliable study-ready laptops focused on performance, battery life, and affordable value.",
    },
    business_laptops: {
      title: "Laptops for Work & Business",
      description: "Productive work machines for office tasks, business apps, and professional day-to-day use.",
    },
    gaming_laptops: {
      title: "Powerful/Gaming Laptops",
      description: "High-performance laptop options for demanding workloads, gaming, and creative multitasking.",
    },
    budget_smartphones: {
      title: "Smartphones for Every Budget",
      description: "Phone picks across price levels so customers can find the right device for their budget.",
    },
    quality_accessories: {
      title: "Quality Accessories",
      description: "Trusted accessories to complete setups, improve productivity, and extend device usability.",
    },
    trusted_brands: {
      title: "Shop Trusted Brands",
      description: "Brand-focused products selected by admin for trusted shopping.",
    },
  };
  const homepageSectionOrder = [
    "just_landed",
    "hot_deals",
    "student_laptops",
    "business_laptops",
    "gaming_laptops",
    "budget_smartphones",
    "quality_accessories",
    "trusted_brands",
  ];
  const visibleHomepageSections = homepageSectionOrder
    .map((key) => ({
      key,
      href: productCollections[key]?.href || "/products",
      title: homepageSectionMeta[key]?.title || productCollections[key]?.label || "Products",
      description: homepageSectionMeta[key]?.description || "Curated products for this section.",
      products: productCollections[key]?.products || [],
    }))
    .filter((section) => section.products.length > 0);
  const homeSectionsSignature = visibleHomepageSections.map((section) => `${section.key}:${section.products.length}`).join("|");
  const categories = deriveCategories(products);
  const hasCategoryCounts = categories.some((item) => item.count > 0);
  const featuredCategoryOrder = ["laptops", "phones", "accessories", "monitors", "printers", "storage", "others"];
  const orderedCategories = [...categories].sort((a, b) => {
    const featuredIndexA = featuredCategoryOrder.indexOf(a.slug);
    const featuredIndexB = featuredCategoryOrder.indexOf(b.slug);

    if (featuredIndexA !== -1 && featuredIndexB !== -1) return featuredIndexA - featuredIndexB;
    if (featuredIndexA !== -1) return -1;
    if (featuredIndexB !== -1) return 1;

    const defaultIndexA = DEFAULT_STOREFRONT_CATEGORIES.findIndex((item) => item.slug === a.slug);
    const defaultIndexB = DEFAULT_STOREFRONT_CATEGORIES.findIndex((item) => item.slug === b.slug);
    if (defaultIndexA !== -1 && defaultIndexB !== -1) return defaultIndexA - defaultIndexB;
    return a.label.localeCompare(b.label);
  });
  const featuredCategory =
    orderedCategories.find((item) => item.slug === "laptops") ||
    orderedCategories[0] ||
    null;
  const secondaryCategories = orderedCategories.filter((item) => item.slug !== featuredCategory?.slug);
  const fallbackHeroBanner = {
    imageUrl: "",
    link: "",
  };
  const heroBanners = banners.length ? banners : [fallbackHeroBanner];
  const goToPrevBanner = () => {
    setBannerIndex((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);
  };
  const goToNextBanner = () => {
    setBannerIndex((prev) => (prev + 1) % heroBanners.length);
  };
  const renderHeroSlide = (item, idx) => {
    const imageNode = item.imageUrl ? (
      <div className="hero-banner__slide-media">
        <StableImage
          src={item.imageUrl}
          alt=""
          width={1920}
          height={720}
          loading={idx === 0 ? "eager" : "lazy"}
          fetchPriority={idx === 0 ? "high" : "low"}
          decoding="async"
          className="hero-banner__slide-image hero-banner__slide-image--bg"
          aria-hidden="true"
        />
        <StableImage
          src={item.imageUrl}
          alt="Featured banner image"
          width={1920}
          height={720}
          loading={idx === 0 ? "eager" : "lazy"}
          fetchPriority={idx === 0 ? "high" : "low"}
          decoding="async"
          className="hero-banner__slide-image hero-banner__slide-image--fg"
        />
      </div>
    ) : (
      <div className="hero-banner__slide-fallback" />
    );

    if (item.link) {
      return (
        <Link href={item.link} className="hero-banner__slide-link" aria-label="Open banner link">
          {imageNode}
        </Link>
      );
    }
    return imageNode;
  };

  function setHomeSectionRailRef(sectionKey, node) {
    if (!sectionKey) return;
    if (node) {
      homeSectionRailRefs.current[sectionKey] = node;
      return;
    }
    delete homeSectionRailRefs.current[sectionKey];
  }

  function updateHomeSectionRailNav(sectionKey) {
    const rail = homeSectionRailRefs.current[sectionKey];
    if (!rail) {
      setHomeSectionRailNav((current) => ({
        ...current,
        [sectionKey]: { left: false, right: false },
      }));
      return;
    }
    const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
    const currentScroll = rail.scrollLeft;
    setHomeSectionRailNav((current) => ({
      ...current,
      [sectionKey]: {
        left: currentScroll > 8,
        right: currentScroll < maxScroll - 8,
      },
    }));
  }

  function updateAllHomeSectionRailNav() {
    visibleHomepageSections.forEach((section) => {
      updateHomeSectionRailNav(section.key);
    });
  }

  function scrollHomeSectionRail(sectionKey, direction) {
    const rail = homeSectionRailRefs.current[sectionKey];
    if (!rail) return;
    rail.scrollBy({
      left: direction * Math.max(rail.clientWidth * 0.82, 220),
      behavior: "smooth",
    });
  }

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const media = window.matchMedia("(max-width: 640px)");
    const sync = () => setIsMobileHomeProducts(media.matches);
    sync();
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", sync);
      return () => media.removeEventListener("change", sync);
    }
    media.addListener(sync);
    return () => media.removeListener(sync);
  }, []);

  useEffect(() => {
    const onResize = () => updateAllHomeSectionRailNav();
    let observer;
    if (!isMobileHomeProducts || mobileHomeProductsView !== "scroll") return undefined;
    updateAllHomeSectionRailNav();
    window.addEventListener("resize", onResize);

    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => updateAllHomeSectionRailNav());
      Object.values(homeSectionRailRefs.current).forEach((rail) => {
        observer.observe(rail);
      });
    }

    return () => {
      window.removeEventListener("resize", onResize);
      if (observer) observer.disconnect();
    };
  }, [homeSectionsSignature, isMobileHomeProducts, mobileHomeProductsView, status]);

  function renderCategoryMedia(item, artKey) {
    const categoryImage = getCategoryTileImage(item?.slug);
    if (categoryImage) {
      return (
        <StableImage
          src={categoryImage}
          alt={`${item?.label || "Category"} preview`}
          width={720}
          height={420}
          loading="lazy"
          decoding="async"
          className={`category-tile__image${isLaptopDesktopCategory(item) ? " category-tile__image--laptops-desktops" : ""}`}
          fallback={<div className={`category-art category-art--${artKey}`} aria-hidden="true" />}
          fallbackClassName="category-tile__fallback"
        />
      );
    }
    return (
      <div className={`category-art category-art--${artKey}`}>
        <span className="category-art__shape category-art__shape--one" />
        <span className="category-art__shape category-art__shape--two" />
        <span className="category-art__shape category-art__shape--three" />
        <span className="category-art__glow" />
      </div>
    );
  }

  return (
    <main>
      <section className="hero-section">
        <div className="hero-banner">
          <div className="hero-banner__slides" style={{ transform: `translateX(-${bannerIndex * 100}%)` }}>
            {heroBanners.map((item, idx) => (
              <div key={`hero-banner-${idx}`} className="hero-banner__slide">
                {renderHeroSlide(item, idx)}
              </div>
            ))}
          </div>

          <button type="button" className="hero-banner__arrow hero-banner__arrow--left" aria-label="Previous banner" onClick={goToPrevBanner}>
            <span />
          </button>

          <button type="button" className="hero-banner__arrow hero-banner__arrow--right" aria-label="Next banner" onClick={goToNextBanner}>
            <span />
          </button>
          {heroBanners.length > 1 ? (
            <div className="hero-banner__dots" role="tablist" aria-label="Select banner slide">
              {heroBanners.map((_, idx) => (
                <button
                  key={`hero-dot-${idx}`}
                  type="button"
                  role="tab"
                  className={`hero-banner__dot ${idx === bannerIndex ? "is-active" : ""}`}
                  aria-selected={idx === bannerIndex}
                  aria-label={`Go to banner ${idx + 1}`}
                  onClick={() => setBannerIndex(idx)}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="home-logo-marquee" aria-label="Trusted brands">
        <div className="home-logo-marquee__track">
          {[0, 1].map((cloneIndex) => (
            <div
              key={cloneIndex}
              className="home-logo-marquee__lane"
              aria-hidden={cloneIndex === 1 ? "true" : undefined}
            >
              {HOME_LOGOS.map((logo) => (
                <div key={`${cloneIndex}-${logo.src}`} className="home-logo-marquee__item">
                  <StableImage
                    src={logo.src}
                    alt={logo.alt}
                    width={120}
                    height={52}
                    loading="lazy"
                    decoding="async"
                    className="home-logo-marquee__img"
                    fallback={<div className="home-logo-marquee__fallback" aria-hidden="true" />}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="shell category-showcase">
        <div className="category-showcase__intro">
          <p className="section-kicker">Categories</p>
          <h2>Quick Product Search</h2>
          <p className="hero-copy">
            Jump straight into the department you want so it is faster to find the right products.
          </p>
        </div>

        <div className="category-showcase__grid">
          {featuredCategory ? (
            <Link
              href={getCategoryFilterHref(featuredCategory.slug)}
              className={`category-tile category-tile--featured category-tile--${getCategoryArtKey(featuredCategory.slug, featuredCategory.label, 0)}`}
            >
              <div className="category-tile__media" aria-hidden="true">
                {renderCategoryMedia(
                  featuredCategory,
                  getCategoryArtKey(featuredCategory.slug, featuredCategory.label, 0)
                )}
              </div>
              <div className="category-tile__overlay" />
              <div className="category-tile__content">
                <span className="category-tile__count">
                  {hasCategoryCounts && featuredCategory.count > 0
                    ? `${featuredCategory.count} item${featuredCategory.count === 1 ? "" : "s"}`
                    : "Top category"}
                </span>
                <h2>{featuredCategory.label}</h2>
                <span className="category-tile__cta">Open filter</span>
              </div>
            </Link>
          ) : null}

          <div className="category-showcase__rail">
            {secondaryCategories.map((item, index) => {
              const artKey = getCategoryArtKey(item.slug, item.label, index + 1);

              return (
                <Link
                  key={item.slug}
                  href={getCategoryFilterHref(item.slug)}
                  className={`category-tile category-tile--compact category-tile--${artKey}`}
                >
                  <div className="category-tile__media" aria-hidden="true">
                    {renderCategoryMedia(item, artKey)}
                  </div>
                  <div className="category-tile__overlay" />
                  <div className="category-tile__content">
                    <span className="category-tile__count">
                      {hasCategoryCounts && item.count > 0 ? `${item.count} item${item.count === 1 ? "" : "s"}` : "Shop category"}
                    </span>
                    <h2>{item.label}</h2>
                    <span className="category-tile__cta">Open filter</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="shell homepage-products page-section">
        <div className="homepage-products__header">
          <div className="homepage-products__title">
            <p className="section-kicker">Homepage products</p>
            <div className="homepage-products__title-row">
              <h2>Curated Home Collections</h2>
              {isMobileHomeProducts ? (
                <div className="homepage-products__mobile-view-toggle" role="group" aria-label="Homepage product view mode">
                  <button
                    type="button"
                    className={`homepage-products__view-mode ${mobileHomeProductsView === "scroll" ? "is-active" : ""}`}
                    onClick={() => setMobileHomeProductsView("scroll")}
                    aria-pressed={mobileHomeProductsView === "scroll"}
                    aria-label="Use scroll view"
                    title="Scroll view"
                  >
                    <img
                      src="/list%201.png"
                      alt=""
                      className="homepage-products__view-mode-image"
                      aria-hidden="true"
                    />
                  </button>
                  <button
                    type="button"
                    className={`homepage-products__view-mode ${mobileHomeProductsView === "grid" ? "is-active" : ""}`}
                    onClick={() => setMobileHomeProductsView("grid")}
                    aria-pressed={mobileHomeProductsView === "grid"}
                    aria-label="Use grid view"
                    title="Grid view"
                  >
                    <img
                      src="/menu.png"
                      alt=""
                      className="homepage-products__view-mode-image"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {status === "loading" && <div className="panel">Loading products...</div>}
        {status === "error" && <div className="panel">Could not load products: {error}</div>}

        {status === "ready" &&
          (visibleHomepageSections.length ? (
            <div className="homepage-products__stack">
              {visibleHomepageSections.map((section) => (
                <section key={section.key} className="homepage-products__section">
                  {(() => {
                    const useMobileScroll = isMobileHomeProducts && mobileHomeProductsView === "scroll";
                    const useMobileGrid = isMobileHomeProducts && mobileHomeProductsView === "grid";
                    const listedProducts = useMobileGrid ? section.products.slice(0, 4) : section.products;
                    return (
                      <>
                  <div className="homepage-products__section-head">
                    <div>
                      <h3>{section.title}</h3>
                      <p className="hero-copy">{section.description}</p>
                    </div>
                    {!useMobileScroll ? (
                      <Link href={section.href} className="homepage-products__view-all">
                      View all
                    </Link>
                    ) : null}
                  </div>

                  {useMobileScroll ? (
                    <div className="homepage-products__rail-wrap">
                      <div className="homepage-products__rail-controls" aria-label={`${section.title} carousel controls`}>
                        <button
                          type="button"
                          className="homepage-products__rail-arrow homepage-products__rail-arrow--left"
                          onClick={() => scrollHomeSectionRail(section.key, -1)}
                          aria-label={`Scroll ${section.title} left`}
                          disabled={!homeSectionRailNav[section.key]?.left}
                        >
                          &lsaquo;
                        </button>
                        <button
                          type="button"
                          className="homepage-products__rail-arrow homepage-products__rail-arrow--right"
                          onClick={() => scrollHomeSectionRail(section.key, 1)}
                          aria-label={`Scroll ${section.title} right`}
                          disabled={!homeSectionRailNav[section.key]?.right}
                        >
                          &rsaquo;
                        </button>
                      </div>

                      <div
                        ref={(node) => setHomeSectionRailRef(section.key, node)}
                        className="product-grid homepage-products__mobile-rail"
                        onScroll={() => updateHomeSectionRailNav(section.key)}
                      >
                        {section.products.map((product) => (
                          <ProductCard key={`${section.key}-${product._id}`} product={product} onAddToCart={handleAddToCart} />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="product-grid">
                      {listedProducts.map((product) => (
                        <ProductCard key={`${section.key}-${product._id}`} product={product} onAddToCart={handleAddToCart} />
                      ))}
                    </div>
                  )}
                  {useMobileScroll ? (
                    <Link href={section.href} className="homepage-products__view-all homepage-products__view-all--below">
                      View all
                    </Link>
                  ) : null}
                      </>
                    );
                  })()}
                </section>
              ))}
            </div>
          ) : (
            <div className="panel">
              No curated homepage sections are filled yet. Add products to home sections in admin to display them here.
            </div>
          ))}
      </section>

    </main>
  );
}
