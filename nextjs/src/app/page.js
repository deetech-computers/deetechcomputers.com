"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard from "@/components/products/product-card";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/components/providers/toast-provider";
import { API_BASE } from "@/lib/config";
import { requestJson } from "@/lib/http";
import { canonicalCategory, DEFAULT_STOREFRONT_CATEGORIES, deriveCategories, fetchProducts, getProductRating, pickFeaturedProducts } from "@/lib/products";
import { asArray } from "@/lib/resource";

function normalizeBanner(item) {
  return {
    eyebrow: item?.badge || item?.label || item?.category || item?.tag || "Featured Banner",
    title: item?.title || item?.headline || item?.name || "Latest Collection",
    emphasis: item?.emphasis || item?.offerText || item?.ctaHeadline || item?.subheadline || "",
    description: item?.description || item?.subtext || item?.summary || "",
    link: item?.link || item?.ctaLink || "/products",
    linkLabel: item?.buttonText || item?.ctaLabel || item?.linkLabel || "Shop now",
    secondaryLabel: item?.secondaryButtonText || item?.secondaryCtaLabel || "View collection",
  };
}

const serviceHighlights = [
  {
    title: "Free shipping worldwide",
    text: "Fast delivery on selected products and locations.",
    icon: "shipping",
  },
  {
    title: "24/7 customer service",
    text: "Friendly support when you need product guidance.",
    icon: "support",
  },
  {
    title: "Money back guarantee",
    text: "Trusted checkout and easy support-backed resolution.",
    icon: "guarantee",
  },
];

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

function ServiceIcon({ name }) {
  if (name === "shipping") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 6h11v8H3Zm11 2h3.7l2.3 2.7V14H14ZM6.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM5 17h1.1a3 3 0 0 1 5.8 0h2.2a3 3 0 0 1 5.8 0H21v-5.6L18.3 8H16V5H3v12h2Z" fill="currentColor" />
      </svg>
    );
  }
  if (name === "support") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3a8 8 0 0 0-8 8v3a3 3 0 0 0 3 3h1v-6H6a6 6 0 0 1 12 0h-2v6h1a3 3 0 0 0 3-3v-3a8 8 0 0 0-8-8Zm-1 16h2a2 2 0 0 1-2 2h-1v-2Z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 2 7 3v5c0 5-3 9.1-7 10-4-1-7-5-7-10V5Zm0 4.2L8 8v2.4c0 2.9 1.6 5.6 4 6.8 2.4-1.2 4-3.9 4-6.8V8Zm-.9 7.3-2-2 1.4-1.4 1.1 1.1 2.7-2.7 1.4 1.4-4.1 4.1Z" fill="currentColor" />
    </svg>
  );
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
  const { pushToast } = useToast();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [banner, setBanner] = useState(null);
  const [productTab, setProductTab] = useState("popular");

  function handleAddToCart(product) {
    if (!product) return;
    addItem(product, 1);
    pushToast(`${product.name || "Product"} added to cart`, "success");
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
        const firstBanner = asArray(payload).find((item) => item) || null;
        setBanner(firstBanner ? normalizeBanner(firstBanner) : null);
      })
      .catch(() => {
        setBanner(null);
      });
  }, []);

  const laptopProducts = products.filter((product) => canonicalCategory(product?.category) === "laptops");
  const phoneProducts = products.filter((product) => canonicalCategory(product?.category) === "phones");
  const popularProducts = [...pickFeaturedProducts(products, 10)]
    .sort((a, b) => getFeaturedScore(b) - getFeaturedScore(a))
    .slice(0, 5);
  const bestLaptopProducts = sortByBestSeller(laptopProducts).slice(0, 5);
  const topPhoneProducts = sortByBestSeller(phoneProducts).slice(0, 5);
  const newArrivalProducts = sortByNewest(products).slice(0, 5);
  const productCollections = {
    popular: {
      label: "Popular",
      href: "/products",
      products: popularProducts.length ? popularProducts : sortByBestSeller(products).slice(0, 5),
    },
    laptops: {
      label: "Best Selling Laptops",
      href: "/products?category=laptops",
      products: bestLaptopProducts.length ? bestLaptopProducts : sortByBestSeller(products).slice(0, 5),
    },
    smartphones: {
      label: "Smartphones Top Sellers",
      href: "/products?category=phones",
      products: topPhoneProducts.length ? topPhoneProducts : sortByBestSeller(products).slice(0, 5),
    },
    arrivals: {
      label: "New Arrivals",
      href: "/products",
      products: newArrivalProducts,
    },
  };
  const visibleProducts = productCollections[productTab]?.products || productCollections.popular.products;
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
  const heroBanner = banner || {
    eyebrow: "Featured Banner",
    title: "Latest Collection",
    emphasis: "",
    description: "",
    link: "/products",
    linkLabel: "Shop now",
    secondaryLabel: "View collection",
  };

  return (
    <main>
      <section className="hero-section">
        <div className="hero-banner">
          <button type="button" className="hero-banner__arrow hero-banner__arrow--left" aria-label="Previous banner">
            <span />
          </button>

          <div className="hero-banner__inner shell">
            <div className="hero-banner__content">
              <p className="hero-banner__eyebrow">{heroBanner.eyebrow}</p>
              <h1>
                {heroBanner.title}
                {heroBanner.emphasis ? <span>{heroBanner.emphasis}</span> : null}
              </h1>
              {heroBanner.description ? <p className="hero-copy">{heroBanner.description}</p> : null}
              <div className="hero-actions">
                <Link href={heroBanner.link} className="primary-link">{heroBanner.linkLabel}</Link>
                <Link href={heroBanner.link} className="ghost-link hero-banner__ghost">{heroBanner.secondaryLabel}</Link>
              </div>
            </div>

            <div className="hero-banner__visual" aria-hidden="true">
              <div className="hero-speaker hero-speaker--rear">
                <span className="hero-speaker__top" />
                <span className="hero-speaker__control hero-speaker__control--one" />
                <span className="hero-speaker__control hero-speaker__control--two" />
                <span className="hero-speaker__control hero-speaker__control--three" />
              </div>
              <div className="hero-speaker hero-speaker--main">
                <span className="hero-speaker__halo" />
                <span className="hero-speaker__logo">d</span>
              </div>
            </div>
          </div>

          <button type="button" className="hero-banner__arrow hero-banner__arrow--right" aria-label="Next banner">
            <span />
          </button>
        </div>
      </section>

      <section className="shell service-banner">
        <div className="service-banner__grid">
          {serviceHighlights.map((item) => (
            <div key={item.title} className="service-banner__card">
              <span className="service-banner__icon">
                <ServiceIcon name={item.icon} />
              </span>
              <div className="service-banner__copy">
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </div>
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
              href={`/products?category=${encodeURIComponent(featuredCategory.slug)}`}
              className={`category-tile category-tile--featured category-tile--${getCategoryArtKey(featuredCategory.slug, featuredCategory.label, 0)}`}
            >
              <div className="category-tile__media" aria-hidden="true">
                <div className={`category-art category-art--${getCategoryArtKey(featuredCategory.slug, featuredCategory.label, 0)}`}>
                  <span className="category-art__shape category-art__shape--one" />
                  <span className="category-art__shape category-art__shape--two" />
                  <span className="category-art__shape category-art__shape--three" />
                  <span className="category-art__glow" />
                </div>
              </div>
              <div className="category-tile__overlay" />
              <div className="category-tile__content">
                <span className="category-tile__count">
                  {hasCategoryCounts && featuredCategory.count > 0
                    ? `${featuredCategory.count} item${featuredCategory.count === 1 ? "" : "s"}`
                    : "Top category"}
                </span>
                <h2>{featuredCategory.label}</h2>
                <span className="category-tile__cta">View offers</span>
              </div>
            </Link>
          ) : null}

          <div className="category-showcase__rail">
            {secondaryCategories.map((item, index) => {
              const artKey = getCategoryArtKey(item.slug, item.label, index + 1);

              return (
                <Link
                  key={item.slug}
                  href={`/products?category=${encodeURIComponent(item.slug)}`}
                  className={`category-tile category-tile--compact category-tile--${artKey}`}
                >
                  <div className="category-tile__media" aria-hidden="true">
                    <div className={`category-art category-art--${artKey}`}>
                      <span className="category-art__shape category-art__shape--one" />
                      <span className="category-art__shape category-art__shape--two" />
                      <span className="category-art__shape category-art__shape--three" />
                      <span className="category-art__glow" />
                    </div>
                  </div>
                  <div className="category-tile__overlay" />
                  <div className="category-tile__content">
                    <span className="category-tile__count">
                      {hasCategoryCounts && item.count > 0 ? `${item.count} item${item.count === 1 ? "" : "s"}` : "Shop category"}
                    </span>
                    <h2>{item.label}</h2>
                    <span className="category-tile__cta">Shop now</span>
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
            <h2>Top Products</h2>
          </div>
          <div className="homepage-products__controls">
            <div className="homepage-products__tabs" role="tablist" aria-label="Product collections">
              {Object.entries(productCollections).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  className={`homepage-products__tab ${productTab === key ? "is-active" : ""}`}
                  onClick={() => setProductTab(key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <Link href={productCollections[productTab]?.href || "/products"} className="homepage-products__view-all">
              View all
            </Link>
          </div>
        </div>

        {status === "loading" && <div className="panel">Loading products...</div>}
        {status === "error" && <div className="panel">Could not load products: {error}</div>}

        {status === "ready" && (
          <div className="product-grid">
            {visibleProducts.map((product) => (
              <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}


