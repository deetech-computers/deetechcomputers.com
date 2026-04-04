"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/products/product-card";
import { useCart } from "@/hooks/use-cart";
import { canonicalCategory, deriveCategories, fetchProducts, formatCategoryLabel, getProductStock } from "@/lib/products";

const PRICE_FILTERS = [
  { value: "all", label: "All prices" },
  { value: "under-1000", label: "Under GHS 1,000" },
  { value: "1000-3000", label: "GHS 1,000 - 3,000" },
  { value: "3000-7000", label: "GHS 3,000 - 7,000" },
  { value: "7000-plus", label: "Above GHS 7,000" },
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to high" },
  { value: "price-desc", label: "Price: High to low" },
  { value: "rating", label: "Top rated" },
  { value: "name", label: "Name: A to Z" },
];

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
  const [sortBy, setSortBy] = useState("featured");

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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((product) => {
      const productCategory = canonicalCategory(product.category);
      const matchesCategory = category === "all" || productCategory === category;
      const matchesBrand = brand === "all" || String(product?.brand || "").toLowerCase() === brand;
      const matchesAvailability = availability === "all" || getProductStock(product) > 0;
      const matchesPrice = priceRange === "all" || getPriceRangeKey(getProductPrice(product)) === priceRange;
      const haystack = [product.name, product.brand, product.category, product.description, product.short_description]
        .join(" ")
        .toLowerCase();

      return matchesCategory && matchesBrand && matchesAvailability && matchesPrice && (!q || haystack.includes(q));
    });
  }, [availability, brand, category, priceRange, products, search]);

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
        return items.sort((a, b) => {
          const stockDelta = getProductStock(b) - getProductStock(a);
          if (stockDelta !== 0) return stockDelta;
          return getProductRating(b) - getProductRating(a);
        });
    }
  }, [filtered, sortBy]);

  const categories = useMemo(() => deriveCategories(products), [products]);
  const brands = useMemo(() => {
    const seen = new Set();
    return products
      .map((item) => String(item?.brand || "").trim())
      .filter(Boolean)
      .filter((item) => {
        const key = item.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => a.localeCompare(b));
  }, [products]);

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
    return chips;
  }, [availability, brand, category, priceRange]);

  return (
    <main className="shell page-section">
      <section className="shop-hero panel">
        <p className="section-kicker">Shop</p>
        <h1>Find the right device faster with smart filters and quick actions.</h1>
        <p className="hero-copy">
          Browse laptops, monitors, printers, accessories, phones, and storage with a cleaner mobile shopping flow.
        </p>
      </section>

      {status === "loading" && <div className="panel">Loading products...</div>}
      {status === "error" && <div className="panel">Could not load products: {error}</div>}

      {status === "ready" && (
        <div className="shop-layout">
          <aside className="shop-sidebar panel" aria-label="Filter options">
            <div className="shop-sidebar__section">
              <div className="shop-sidebar__heading">
                <h2>Filter Options</h2>
                <button
                  type="button"
                  className="shop-clear-button"
                  onClick={() => {
                    setSearch("");
                    setCategory("all");
                    setBrand("all");
                    setAvailability("all");
                    setPriceRange("all");
                    setSortBy("featured");
                  }}
                >
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

            <div className="shop-sidebar__section">
              <h3>Categories</h3>
              <div className="shop-filter-list">
                <button type="button" className={category === "all" ? "shop-filter-chip is-active" : "shop-filter-chip"} onClick={() => setCategory("all")}>
                  All
                </button>
                {categories.map((item) => (
                  <button
                    key={item.slug}
                    type="button"
                    className={category === item.slug ? "shop-filter-chip is-active" : "shop-filter-chip"}
                    onClick={() => setCategory(item.slug)}
                  >
                    {item.label}
                    <span>{item.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="shop-sidebar__section">
              <h3>Brand</h3>
              <div className="shop-filter-list">
                <button type="button" className={brand === "all" ? "shop-filter-chip is-active" : "shop-filter-chip"} onClick={() => setBrand("all")}>
                  All brands
                </button>
                {brands.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={brand === item.toLowerCase() ? "shop-filter-chip is-active" : "shop-filter-chip"}
                    onClick={() => setBrand(item.toLowerCase())}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="shop-sidebar__section">
              <h3>Price</h3>
              <div className="shop-filter-list">
                {PRICE_FILTERS.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={priceRange === item.value ? "shop-filter-chip is-active" : "shop-filter-chip"}
                    onClick={() => setPriceRange(item.value)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="shop-sidebar__section">
              <h3>Availability</h3>
              <div className="shop-filter-list">
                <button type="button" className={availability === "all" ? "shop-filter-chip is-active" : "shop-filter-chip"} onClick={() => setAvailability("all")}>
                  All
                </button>
                <button type="button" className={availability === "instock" ? "shop-filter-chip is-active" : "shop-filter-chip"} onClick={() => setAvailability("instock")}>
                  In stock
                </button>
              </div>
            </div>
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
      )}
    </main>
  );
}
