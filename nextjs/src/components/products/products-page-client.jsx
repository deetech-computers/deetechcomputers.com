"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ProductCard from "@/components/products/product-card";
import { useCart } from "@/hooks/use-cart";
import {
  buildProductsHref,
  canonicalCategory,
  deriveCategories,
  deriveCategoryBrandStats,
  fetchProducts,
  formatCategoryLabel,
  getProductPrice,
  getStorefrontCategoryLabel,
  getProductRating,
  getProductStock,
} from "@/lib/products";

const SORT_OPTIONS = [
  { value: "name", label: "Name: A to Z" },
  { value: "price-asc", label: "Price: Low to high" },
  { value: "price-desc", label: "Price: High to low" },
  { value: "rating", label: "Top rated" },
];

const REVIEW_FILTERS = [
  { value: "4", label: "4 stars & up" },
  { value: "3", label: "3 stars & up" },
  { value: "2", label: "2 stars & up" },
];

const PROMOTION_FILTERS = [
  { value: "featured", label: "Featured items" },
  { value: "hot_deals", label: "Hot deals" },
  { value: "just_landed", label: "Just landed" },
  { value: "student_laptops", label: "Laptops for students" },
  { value: "business_laptops", label: "Laptops for work & business" },
  { value: "gaming_laptops", label: "Powerful/Gaming laptops" },
  { value: "budget_smartphones", label: "Smartphones for every budget" },
  { value: "quality_accessories", label: "Quality accessories" },
  { value: "trusted_brands", label: "Shop trusted brands" },
];

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

function labelize(value) {
  return String(value || "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function getProductTimestamp(product) {
  return new Date(product?.createdAt || product?.updatedAt || 0).getTime() || 0;
}

function getProductId(product) {
  return String(product?._id || product?.id || "");
}

function getProductSpecs(product) {
  const specs = product?.specs;
  if (!specs) return {};
  if (typeof specs.entries === "function") {
    return Object.fromEntries(Array.from(specs.entries()));
  }
  if (typeof specs === "object") {
    return specs;
  }
  return {};
}

function buildSpecGroups(products) {
  const groups = new Map();

  for (const product of products || []) {
    const specs = getProductSpecs(product);
    for (const [rawKey, rawValue] of Object.entries(specs)) {
      const key = String(rawKey || "").trim();
      const value = String(rawValue || "").trim();
      if (!key || !value) continue;

      if (!groups.has(key)) {
        groups.set(key, { key, label: labelize(key), values: new Map(), count: 0 });
      }

      const group = groups.get(key);
      group.count += 1;
      group.values.set(value, (group.values.get(value) || 0) + 1);
    }
  }

  return [...groups.values()]
    .map((group) => ({
      key: group.key,
      label: group.label,
      count: group.count,
      options: [...group.values.entries()]
        .map(([value, count]) => ({ value, label: value, count }))
        .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)),
    }))
    .filter((group) => group.options.length >= 2 && group.options.length <= 12 && group.count >= 2)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, 8);
}

function ShopFilterSection({ id, title, expanded, onToggle, children }) {
  return (
    <div className="shop-sidebar__section">
      <button
        type="button"
        className="shop-sidebar__section-toggle"
        aria-expanded={expanded}
        aria-controls={`shop-filter-panel-${id}`}
        onClick={onToggle}
      >
        <h3>{title}</h3>
        <span className="shop-sidebar__section-icon" aria-hidden="true">
          {expanded ? "−" : "+"}
        </span>
      </button>
      {expanded ? (
        <div id={`shop-filter-panel-${id}`} className="shop-sidebar__section-content">
          {children}
        </div>
      ) : null}
    </div>
  );
}

function FilterOption({ active, label, count, onClick }) {
  return (
    <button type="button" className={active ? "shop-filter-option is-active" : "shop-filter-option"} onClick={onClick}>
      <span className="shop-filter-option__mark" aria-hidden="true" />
      <span className="shop-filter-option__label">{label}</span>
      {typeof count === "number" ? <span className="shop-filter-option__count">{count}</span> : null}
    </button>
  );
}

export default function ProductsPageClient({ initialFilters }) {
  const router = useRouter();
  const pathname = usePathname();
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [search, setSearch] = useState(initialFilters.search);
  const [category, setCategory] = useState(initialFilters.category);
  const [brand, setBrand] = useState(initialFilters.brand);
  const [availability, setAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [reviewMin, setReviewMin] = useState("all");
  const [promotion, setPromotion] = useState(canonicalHomeSectionKey(initialFilters.promotion || "all"));
  const [selectedSpecs, setSelectedSpecs] = useState({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [itemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    categories: true,
    brand: false,
    review: false,
    promotions: false,
    availability: false,
  });
  const [selectedPrice, setSelectedPrice] = useState({ min: 0, max: 0 });

  useEffect(() => {
    setSearch(initialFilters.search);
    setCategory(initialFilters.category);
    setBrand(initialFilters.brand);
    setPromotion(canonicalHomeSectionKey(initialFilters.promotion || "all"));
  }, [initialFilters.brand, initialFilters.category, initialFilters.search, initialFilters.promotion]);

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
    if (!mobileFiltersOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileFiltersOpen]);

  const categories = useMemo(() => {
    const available = deriveCategories(products, { includeEmpty: false });
    if (category === "all" || available.some((item) => item.slug === category)) {
      return available;
    }

    return [
      ...available,
      {
        slug: category,
        label: getStorefrontCategoryLabel(category),
        count: 0,
        image: "",
        product: null,
      },
    ];
  }, [category, products]);
  const scopedProducts = useMemo(() => {
    if (category === "all") return products;
    return products.filter((product) => canonicalCategory(product.category) === category);
  }, [category, products]);
  const brands = useMemo(() => {
    if (category === "all") {
      const counts = new Map();
      for (const item of products) {
        const value = String(item?.subCategory || item?.brand || "").trim();
        if (!value) continue;
        const key = value.toLowerCase();
        const current = counts.get(key);
        if (current) {
          current.count += 1;
        } else {
          counts.set(key, { value, count: 1 });
        }
      }
      const options = [...counts.values()];
      if (brand !== "all" && !options.some((item) => item.value.toLowerCase() === brand)) {
        options.push({ value: labelize(brand), count: 0 });
      }
      return options.sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
    }

    const brandMap = deriveCategoryBrandStats(scopedProducts, { includeEmpty: false });
    const options = [...(brandMap[category] || [])];
    if (brand !== "all" && !options.some((item) => item.value.toLowerCase() === brand)) {
      options.push({ value: labelize(brand), count: 0 });
    }
    return options;
  }, [category, products, scopedProducts]);
  const specGroups = useMemo(() => buildSpecGroups(scopedProducts), [scopedProducts]);
  const recentProductIdSet = useMemo(() => {
    const recentIds = [...products]
      .sort((a, b) => getProductTimestamp(b) - getProductTimestamp(a))
      .slice(0, 30)
      .map((item) => getProductId(item))
      .filter(Boolean);

    return new Set(recentIds);
  }, [products]);

  useEffect(() => {
    if (status !== "ready") return;
    if (brand === "all") return;
    const isStillAvailable = brands.some((item) => item.value.toLowerCase() === brand);
    if (!isStillAvailable) {
      setBrand("all");
    }
  }, [brand, brands, status]);

  const baseFiltered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const reviewFloor = reviewMin === "all" ? 0 : Number(reviewMin);

    return products.filter((product) => {
      const productCategory = canonicalCategory(product.category);
      const productBrand = String(product?.subCategory || product?.brand || "").toLowerCase();
      const productStock = getProductStock(product);
      const productRating = getProductRating(product);
      const productSections = Array.isArray(product?.homeSections)
        ? product.homeSections.map(canonicalHomeSectionKey)
        : [];
      const productId = getProductId(product);
      const specs = getProductSpecs(product);

      const matchesCategory = category === "all" || productCategory === category;
      const matchesBrand = brand === "all" || productBrand === brand;
      const matchesAvailability = availability === "all" || productStock > 0;
      const matchesReview = reviewFloor === 0 || productRating >= reviewFloor;
      const matchesSpecs = Object.entries(selectedSpecs).every(([key, values]) => {
        if (!Array.isArray(values) || !values.length) return true;
        const specValue = String(specs?.[key] || "").trim();
        return values.includes(specValue);
      });
      const haystack = [
        product.name,
        product.brand,
        product.subCategory,
        product.category,
        product.description,
        product.short_description,
        ...Object.values(specs || {}),
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesCategory &&
        matchesBrand &&
        matchesAvailability &&
        matchesReview &&
        matchesSpecs &&
        (!q || haystack.includes(q))
      );
    });
  }, [availability, brand, category, products, reviewMin, search, selectedSpecs]);

  const promotionOptions = useMemo(() => {
    const counts = PROMOTION_FILTERS.map((item) => {
      const value = item.value;
      const count = baseFiltered.filter((product) => {
        const productSections = Array.isArray(product?.homeSections)
          ? product.homeSections.map(canonicalHomeSectionKey)
          : [];
        const productId = getProductId(product);

        if (value === "featured") return Boolean(product?.isFeatured);
        if (value === "just_landed") return recentProductIdSet.has(productId);
        return productSections.includes(value);
      }).length;

      return { ...item, count };
    }).filter((item) => item.count > 0);

    if (promotion !== "all" && !counts.some((item) => item.value === promotion)) {
      const selected = PROMOTION_FILTERS.find((item) => item.value === promotion);
      if (selected) {
        counts.push({ ...selected, count: 0 });
      }
    }

    return counts;
  }, [baseFiltered, promotion, recentProductIdSet]);

  const filteredByNonPrice = useMemo(() => {
    if (promotion === "all") return baseFiltered;

    return baseFiltered.filter((product) => {
      const productSections = Array.isArray(product?.homeSections)
        ? product.homeSections.map(canonicalHomeSectionKey)
        : [];
      const productId = getProductId(product);

      if (promotion === "featured") return Boolean(product?.isFeatured);
      if (promotion === "just_landed") return recentProductIdSet.has(productId);
      return productSections.includes(promotion);
    });
  }, [baseFiltered, promotion, recentProductIdSet]);

  const priceBounds = useMemo(() => {
    const values = filteredByNonPrice.map(getProductPrice).filter((value) => Number.isFinite(value) && value > 0);
    if (!values.length) return { min: 0, max: 0 };
    return {
      min: Math.floor(Math.min(...values)),
      max: Math.ceil(Math.max(...values)),
    };
  }, [filteredByNonPrice]);

  useEffect(() => {
    if (!priceBounds.max) {
      setSelectedPrice({ min: 0, max: 0 });
      return;
    }
    // Default to full range whenever available bounds change,
    // so all products are visible until user adjusts slider.
    setSelectedPrice({ min: priceBounds.min, max: priceBounds.max });
  }, [priceBounds.max, priceBounds.min]);

  const filtered = useMemo(() => {
    if (!priceBounds.max) return filteredByNonPrice;
    return filteredByNonPrice.filter((product) => {
      const productPrice = getProductPrice(product);
      return productPrice >= selectedPrice.min && productPrice <= selectedPrice.max;
    });
  }, [filteredByNonPrice, priceBounds.max, selectedPrice.max, selectedPrice.min]);

  const sorted = useMemo(() => {
    const items = [...filtered];

    if (promotion === "just_landed") {
      return items.sort((a, b) => getProductTimestamp(b) - getProductTimestamp(a));
    }

    switch (sortBy) {
      case "price-asc":
        return items.sort((a, b) => getProductPrice(a) - getProductPrice(b));
      case "price-desc":
        return items.sort((a, b) => getProductPrice(b) - getProductPrice(a));
      case "rating":
        return items.sort((a, b) => getProductRating(b) - getProductRating(a));
      case "name":
        return items.sort((a, b) => String(a?.name || "").localeCompare(String(b?.name || "")));
      default:
        return items.sort((a, b) => String(a?.name || "").localeCompare(String(b?.name || "")));
    }
  }, [filtered, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, brand, availability, sortBy, reviewMin, promotion, selectedSpecs, itemsPerPage, selectedPrice.max, selectedPrice.min]);

  useEffect(() => {
    if (initialFilters.source === "home-quick-search" || initialFilters.source === "home-collection") {
      setBrand("all");
      setAvailability("all");
      setSortBy("name");
      setReviewMin("all");
      setSelectedSpecs({});
    }
  }, [initialFilters.source]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage));

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const pagedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sorted.slice(start, start + itemsPerPage);
  }, [currentPage, itemsPerPage, sorted]);

  const visiblePagination = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, "ellipsis", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "ellipsis", currentPage, currentPage + 1, "ellipsis-tail", totalPages];
  }, [currentPage, totalPages]);

  const activeFilters = useMemo(() => {
    const chips = [];
    if (category !== "all") {
      chips.push({ key: "category", label: formatCategoryLabel(category), clear: () => setCategory("all") });
    }
    if (brand !== "all") {
      chips.push({ key: "brand", label: brand, clear: () => setBrand("all") });
    }
    if (availability !== "all") {
      chips.push({ key: "availability", label: "In stock", clear: () => setAvailability("all") });
    }
    if (priceBounds.max && (selectedPrice.min !== priceBounds.min || selectedPrice.max !== priceBounds.max)) {
      chips.push({
        key: "price",
        label: `GHS ${selectedPrice.min.toLocaleString()} - GHS ${selectedPrice.max.toLocaleString()}`,
        clear: () => setSelectedPrice({ min: priceBounds.min, max: priceBounds.max }),
      });
    }
    if (reviewMin !== "all") {
      chips.push({ key: "review", label: `${reviewMin}+ stars`, clear: () => setReviewMin("all") });
    }
    if (promotion !== "all") {
      const match = PROMOTION_FILTERS.find((item) => item.value === promotion);
      chips.push({ key: "promotion", label: match?.label || "Promotion", clear: () => setPromotion("all") });
    }
    Object.entries(selectedSpecs).forEach(([key, values]) => {
      values.forEach((value) => {
        chips.push({
          key: `${key}:${value}`,
          label: `${labelize(key)}: ${value}`,
          clear: () =>
            setSelectedSpecs((current) => ({
              ...current,
              [key]: (current[key] || []).filter((item) => item !== value),
            })),
        });
      });
    });
    return chips;
  }, [availability, brand, category, priceBounds.max, priceBounds.min, promotion, reviewMin, selectedPrice.max, selectedPrice.min, selectedSpecs]);
  const activeCategoryLabel = category === "all" ? "Shop" : getStorefrontCategoryLabel(category);

  function toggleFilterSection(id) {
    setExpandedSections((current) => ({
      ...current,
      [id]: !(current[id] ?? true),
    }));
  }

  function isSectionExpanded(id) {
    return expandedSections[id] ?? false;
  }

  function formatSliderPrice(value) {
    return `GHS ${Number(value || 0).toLocaleString()}`;
  }

  function toggleSpecFilter(key, value) {
    setSelectedSpecs((current) => {
      const values = Array.isArray(current[key]) ? current[key] : [];
      const nextValues = values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value];
      return {
        ...current,
        [key]: nextValues,
      };
    });
  }

  function resetAllFilters() {
    setSearch("");
    if (pathname !== "/products") {
      router.push("/products#shop-results");
      return;
    }
    setCategory("all");
    setBrand("all");
    setAvailability("all");
    setSortBy("name");
    setReviewMin("all");
    setPromotion("all");
    setSelectedSpecs({});
    setSelectedPrice({
      min: priceBounds.min,
      max: priceBounds.max,
    });
  }

  function renderFilterContent() {
    function handleCategoryChange(nextCategory) {
      if (nextCategory === "all") {
        router.push("/products#shop-results");
        return;
      }
      router.push(buildProductsHref({ category: nextCategory, hash: "shop-results" }));
    }

    return (
      <>
        <div className="shop-sidebar__section">
          <div className="shop-sidebar__heading">
            <h2>Filter Options</h2>
            <button type="button" className="shop-clear-button" onClick={resetAllFilters}>
              Reset
            </button>
          </div>
        </div>

        <ShopFilterSection
          id="price"
          title="Price"
          expanded={isSectionExpanded("price")}
          onToggle={() => toggleFilterSection("price")}
        >
          <div className="shop-price-filter">
            <div className="shop-price-filter__values">
              <span>{formatSliderPrice(selectedPrice.min)}</span>
              <span>{formatSliderPrice(selectedPrice.max)}</span>
            </div>
            <div className="shop-price-filter__slider">
              <div
                className="shop-price-filter__track-active"
                style={{
                  left: priceBounds.max
                    ? `${((selectedPrice.min - priceBounds.min) / Math.max(1, priceBounds.max - priceBounds.min)) * 100}%`
                    : "0%",
                  right: priceBounds.max
                    ? `${100 - ((selectedPrice.max - priceBounds.min) / Math.max(1, priceBounds.max - priceBounds.min)) * 100}%`
                    : "0%",
                }}
              />
              <input
                type="range"
                min={priceBounds.min}
                max={priceBounds.max}
                value={selectedPrice.min}
                onChange={(event) => {
                  const nextMin = Number(event.target.value);
                  setSelectedPrice((current) => ({
                    min: Math.min(nextMin, current.max),
                    max: current.max,
                  }));
                }}
                disabled={!priceBounds.max}
                aria-label="Minimum price"
              />
              <input
                type="range"
                min={priceBounds.min}
                max={priceBounds.max}
                value={selectedPrice.max}
                onChange={(event) => {
                  const nextMax = Number(event.target.value);
                  setSelectedPrice((current) => ({
                    min: current.min,
                    max: Math.max(nextMax, current.min),
                  }));
                }}
                disabled={!priceBounds.max}
                aria-label="Maximum price"
              />
            </div>
          </div>
        </ShopFilterSection>

        <ShopFilterSection
          id="categories"
          title="By Categories"
          expanded={isSectionExpanded("categories")}
          onToggle={() => toggleFilterSection("categories")}
        >
          <div className="shop-filter-stack">
            <FilterOption active={category === "all"} label="All" onClick={() => handleCategoryChange("all")} />
            {categories.map((item) => (
              <FilterOption
                key={item.slug}
                active={category === item.slug}
                label={item.label}
                count={item.count}
                onClick={() => handleCategoryChange(item.slug)}
              />
            ))}
          </div>
        </ShopFilterSection>

        <ShopFilterSection
          id="brand"
          title="By Brand"
          expanded={isSectionExpanded("brand")}
          onToggle={() => toggleFilterSection("brand")}
        >
          <div className="shop-filter-stack">
            <FilterOption active={brand === "all"} label="All brands" onClick={() => setBrand("all")} />
            {brands.map((item) => (
              <FilterOption
                key={item.value}
                active={brand === item.value.toLowerCase()}
                label={item.value}
                count={item.count}
                onClick={() => setBrand(item.value.toLowerCase())}
              />
            ))}
          </div>
        </ShopFilterSection>

        {category !== "all"
          ? specGroups.map((group) => (
              <ShopFilterSection
                key={group.key}
                id={`spec-${group.key}`}
                title={`By ${group.label}`}
                expanded={isSectionExpanded(`spec-${group.key}`)}
                onToggle={() => toggleFilterSection(`spec-${group.key}`)}
              >
                <div className="shop-filter-stack">
                  {group.options.map((option) => (
                    <FilterOption
                      key={`${group.key}-${option.value}`}
                      active={(selectedSpecs[group.key] || []).includes(option.value)}
                      label={option.label}
                      count={option.count}
                      onClick={() => toggleSpecFilter(group.key, option.value)}
                    />
                  ))}
                </div>
              </ShopFilterSection>
            ))
          : null}

        <ShopFilterSection
          id="review"
          title="Review"
          expanded={isSectionExpanded("review")}
          onToggle={() => toggleFilterSection("review")}
        >
          <div className="shop-filter-stack">
            <FilterOption active={reviewMin === "all"} label="All ratings" onClick={() => setReviewMin("all")} />
            {REVIEW_FILTERS.map((item) => (
              <FilterOption
                key={item.value}
                active={reviewMin === item.value}
                label={item.label}
                onClick={() => setReviewMin(item.value)}
              />
            ))}
          </div>
        </ShopFilterSection>

        <ShopFilterSection
          id="promotions"
          title="By Promotions"
          expanded={isSectionExpanded("promotions")}
          onToggle={() => toggleFilterSection("promotions")}
        >
          <div className="shop-filter-stack">
            <FilterOption active={promotion === "all"} label="All offers" onClick={() => setPromotion("all")} />
            {promotionOptions.map((item) => (
              <FilterOption
                key={item.value}
                active={promotion === item.value}
                label={item.label}
                count={item.count}
                onClick={() => setPromotion(item.value)}
              />
            ))}
          </div>
        </ShopFilterSection>

        <ShopFilterSection
          id="availability"
          title="Availability"
          expanded={isSectionExpanded("availability")}
          onToggle={() => toggleFilterSection("availability")}
        >
          <div className="shop-filter-stack">
            <FilterOption active={availability === "all"} label="All" onClick={() => setAvailability("all")} />
            <FilterOption active={availability === "instock"} label="In stock" onClick={() => setAvailability("instock")} />
          </div>
        </ShopFilterSection>
      </>
    );
  }

  return (
    <main className="shell page-section shop-page">
      <section className="shop-hero" aria-label="Shop page heading">
        <p className="shop-hero__crumbs">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>{activeCategoryLabel}</span>
        </p>
        <h1>{activeCategoryLabel}</h1>
      </section>

      {status === "loading" && <div className="panel">Loading products...</div>}
      {status === "error" && <div className="panel">Could not load products: {error}</div>}

      {status === "ready" && (
        <>
        <div className="shop-layout" id="shop-results">
          <aside className="shop-sidebar panel" aria-label="Filter options">
            {renderFilterContent()}
            </aside>

            <section className="shop-content">
              <div className="shop-toolbar panel">
                <div className="shop-toolbar__summary" role="status" aria-live="polite">
                  <p className="products-results">
                    {pagedProducts.length} OF {sorted.length} RESULTS
                  </p>
                  {activeFilters.length ? (
                    <div className="shop-active-filters">
                      {activeFilters.map((item) => (
                        <button key={item.key} type="button" className="shop-active-filter" onClick={item.clear}>
                          {item.label}
                          <span>&times;</span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className="shop-toolbar__controls">
                  <div className="shop-toolbar__view">
                    <span>PAGE</span>
                    <strong>{currentPage}</strong>
                    <small>of {totalPages}</small>
                  </div>
                  <label className="shop-toolbar__sort" htmlFor="shop-sort-select">
                    <span>SORT BY</span>
                    <select id="shop-sort-select" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                      {SORT_OPTIONS.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className="product-grid product-grid--catalog">
                {pagedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} onAddToCart={addItem} variant="catalog" />
                ))}
              </div>

              {totalPages > 1 ? (
                <nav className="shop-pagination" aria-label="Products pagination">
                  <button
                    type="button"
                    className="shop-pagination__arrow"
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                    &lsaquo;
                  </button>

                  <div className="shop-pagination__pages">
                    {visiblePagination.map((entry, index) =>
                      typeof entry === "number" ? (
                        <button
                          key={entry}
                          type="button"
                          className={currentPage === entry ? "shop-pagination__page is-active" : "shop-pagination__page"}
                          onClick={() => setCurrentPage(entry)}
                          aria-current={currentPage === entry ? "page" : undefined}
                        >
                          {entry}
                        </button>
                      ) : (
                        <span key={`${entry}-${index}`} className="shop-pagination__ellipsis" aria-hidden="true">
                          ...
                        </span>
                      )
                    )}
                  </div>

                  <button
                    type="button"
                    className="shop-pagination__arrow"
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                  >
                    &rsaquo;
                  </button>
                </nav>
              ) : null}
            </section>
          </div>

          <div className="shop-mobile-bar" aria-label="Mobile shop actions">
            <button type="button" className="shop-mobile-bar__button" onClick={() => setMobileFiltersOpen(true)}>
              Filter
            </button>
          </div>

          {mobileFiltersOpen ? (
            <div className="shop-drawer" role="dialog" aria-modal="true" aria-label="Filter products">
              <div className="shop-drawer__header">
                <h2>Filters</h2>
                <button type="button" className="shop-drawer__close" onClick={() => setMobileFiltersOpen(false)}>
                  Close
                </button>
              </div>
              <div className="shop-drawer__body">{renderFilterContent()}</div>
            </div>
          ) : null}
        </>
      )}
    </main>
  );
}
