"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/products/product-card";
import { useCart } from "@/hooks/use-cart";
import {
  canonicalCategory,
  deriveCategories,
  fetchProducts,
  formatCategoryLabel,
  getProductStock,
} from "@/lib/products";

const PRICE_FILTERS = [
  { value: "all", label: "All prices" },
  { value: "under-1000", label: "Under GHS 1,000" },
  { value: "1000-3000", label: "GHS 1,000 - 3,000" },
  { value: "3000-7000", label: "GHS 3,000 - 7,000" },
  { value: "7000-plus", label: "Above GHS 7,000" },
];

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
  { value: "new_arrivals", label: "New arrivals" },
];

function labelize(value) {
  return String(value || "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function getInitialCatalogFilters() {
  if (typeof window === "undefined") {
    return { search: "", category: "all" };
  }

  const params = new URLSearchParams(window.location.search);
  return {
    search: params.get("q") || "",
    category: params.get("category") || "all",
  };
}

function getProductRating(product) {
  return Number(product?.rating ?? product?.averageRating ?? 0);
}

function getProductPrice(product) {
  return Number(product?.price || 0);
}

function getPriceRangeKey(price) {
  if (price < 1000) return "under-1000";
  if (price < 3000) return "1000-3000";
  if (price < 7000) return "3000-7000";
  return "7000-plus";
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

function ShopFilterSection({ title, children }) {
  return (
    <div className="shop-sidebar__section">
      <h3>{title}</h3>
      {children}
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

export default function ProductsPage() {
  const { addItem } = useCart();
  const initialFilters = getInitialCatalogFilters();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [search, setSearch] = useState(initialFilters.search);
  const [category, setCategory] = useState(initialFilters.category);
  const [brand, setBrand] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [reviewMin, setReviewMin] = useState("all");
  const [promotion, setPromotion] = useState("all");
  const [selectedSpecs, setSelectedSpecs] = useState({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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

  const categories = useMemo(() => deriveCategories(products), [products]);
  const scopedProducts = useMemo(() => {
    if (category === "all") return products;
    return products.filter((product) => canonicalCategory(product.category) === category);
  }, [category, products]);
  const brands = useMemo(() => {
    const seen = new Set();
    return scopedProducts
      .map((item) => String(item?.brand || "").trim())
      .filter(Boolean)
      .filter((item) => {
        const key = item.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => a.localeCompare(b));
  }, [scopedProducts]);
  const specGroups = useMemo(() => buildSpecGroups(scopedProducts), [scopedProducts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const reviewFloor = reviewMin === "all" ? 0 : Number(reviewMin);

    return products.filter((product) => {
      const productCategory = canonicalCategory(product.category);
      const productBrand = String(product?.brand || "").toLowerCase();
      const productPrice = getProductPrice(product);
      const productStock = getProductStock(product);
      const productRating = getProductRating(product);
      const productSections = Array.isArray(product?.homeSections)
        ? product.homeSections.map((item) => String(item || "").toLowerCase())
        : [];
      const specs = getProductSpecs(product);

      const matchesCategory = category === "all" || productCategory === category;
      const matchesBrand = brand === "all" || productBrand === brand;
      const matchesAvailability = availability === "all" || productStock > 0;
      const matchesPrice = priceRange === "all" || getPriceRangeKey(productPrice) === priceRange;
      const matchesReview = reviewFloor === 0 || productRating >= reviewFloor;
      const matchesPromotion =
        promotion === "all" ||
        (promotion === "featured" ? Boolean(product?.isFeatured) : productSections.includes(promotion));
      const matchesSpecs = Object.entries(selectedSpecs).every(([key, values]) => {
        if (!Array.isArray(values) || !values.length) return true;
        const specValue = String(specs?.[key] || "").trim();
        return values.includes(specValue);
      });
      const haystack = [
        product.name,
        product.brand,
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
        matchesPrice &&
        matchesReview &&
        matchesPromotion &&
        matchesSpecs &&
        (!q || haystack.includes(q))
      );
    });
  }, [availability, brand, category, priceRange, products, promotion, reviewMin, search, selectedSpecs]);

  const sorted = useMemo(() => {
    const items = [...filtered];

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
    if (priceRange !== "all") {
      const match = PRICE_FILTERS.find((item) => item.value === priceRange);
      chips.push({ key: "price", label: match?.label || "Price", clear: () => setPriceRange("all") });
    }
    if (sortBy !== "name") {
      const match = SORT_OPTIONS.find((item) => item.value === sortBy);
      chips.push({ key: "sort", label: match?.label || "Sort", clear: () => setSortBy("name") });
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
  }, [availability, brand, category, priceRange, promotion, reviewMin, selectedSpecs, sortBy]);

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
    setCategory("all");
    setBrand("all");
    setAvailability("all");
    setPriceRange("all");
    setSortBy("name");
    setReviewMin("all");
    setPromotion("all");
    setSelectedSpecs({});
  }

  function renderFilterContent() {
    return (
      <>
        <div className="shop-sidebar__section">
          <div className="shop-sidebar__heading">
            <h2>Filter Options</h2>
            <button type="button" className="shop-clear-button" onClick={resetAllFilters}>
              Reset
            </button>
          </div>
          <input
            className="field"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products"
            aria-label="Search products"
          />
        </div>

        <ShopFilterSection title="Sort By">
          <div className="shop-filter-stack">
            {SORT_OPTIONS.map((item) => (
              <FilterOption
                key={item.value}
                active={sortBy === item.value}
                label={item.label}
                onClick={() => setSortBy(item.value)}
              />
            ))}
          </div>
        </ShopFilterSection>

        <ShopFilterSection title="By Categories">
          <div className="shop-filter-stack">
            <FilterOption active={category === "all"} label="All" onClick={() => setCategory("all")} />
            {categories.map((item) => (
              <FilterOption
                key={item.slug}
                active={category === item.slug}
                label={item.label}
                count={item.count}
                onClick={() => setCategory(item.slug)}
              />
            ))}
          </div>
        </ShopFilterSection>

        <ShopFilterSection title="By Brand">
          <div className="shop-filter-stack">
            <FilterOption active={brand === "all"} label="All brands" onClick={() => setBrand("all")} />
            {brands.map((item) => (
              <FilterOption
                key={item}
                active={brand === item.toLowerCase()}
                label={item}
                onClick={() => setBrand(item.toLowerCase())}
              />
            ))}
          </div>
        </ShopFilterSection>

        {category !== "all"
          ? specGroups.map((group) => (
              <ShopFilterSection key={group.key} title={`By ${group.label}`}>
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

        <ShopFilterSection title="Price">
          <div className="shop-filter-stack">
            {PRICE_FILTERS.map((item) => (
              <FilterOption
                key={item.value}
                active={priceRange === item.value}
                label={item.label}
                onClick={() => setPriceRange(item.value)}
              />
            ))}
          </div>
        </ShopFilterSection>

        <ShopFilterSection title="Review">
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

        <ShopFilterSection title="By Promotions">
          <div className="shop-filter-stack">
            <FilterOption active={promotion === "all"} label="All offers" onClick={() => setPromotion("all")} />
            {PROMOTION_FILTERS.map((item) => (
              <FilterOption
                key={item.value}
                active={promotion === item.value}
                label={item.label}
                onClick={() => setPromotion(item.value)}
              />
            ))}
          </div>
        </ShopFilterSection>

        <ShopFilterSection title="Availability">
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
      <section className="shop-hero panel">
        <p className="section-kicker">Shop</p>
        <h1>Find the exact product you want with richer filters and faster sorting.</h1>
        <p className="hero-copy">
          Search, sort, and drill down by category, brand, stock, promotions, ratings, and detailed product specs.
        </p>
      </section>

      {status === "loading" && <div className="panel">Loading products...</div>}
      {status === "error" && <div className="panel">Could not load products: {error}</div>}

      {status === "ready" && (
        <>
        <div className="shop-layout">
          <aside className="shop-sidebar panel" aria-label="Filter options">
            {renderFilterContent()}
            </aside>

            <section className="shop-content">
              <div className="shop-toolbar panel">
                <div className="shop-toolbar__summary">
                  <p className="products-results">
                    Showing {sorted.length} of {products.length} products
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

                <div className="shop-toolbar__sort">
                  <label className="shop-sort-label" htmlFor="shop-sort">Sort by</label>
                  <select id="shop-sort" className="field shop-sort-select" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                    {SORT_OPTIONS.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="product-grid product-grid--catalog">
                {sorted.map((product) => (
                  <ProductCard key={product._id} product={product} onAddToCart={addItem} variant="catalog" />
                ))}
              </div>
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
