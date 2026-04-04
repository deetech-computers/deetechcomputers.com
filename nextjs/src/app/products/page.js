"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/products/product-card";
import { useCart } from "@/hooks/use-cart";
import { canonicalCategory, deriveCategories, fetchProducts } from "@/lib/products";

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

export default function ProductsPage() {
  const { addItem } = useCart();
  const initialFilters = getInitialCatalogFilters();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [search, setSearch] = useState(initialFilters.search);
  const [category, setCategory] = useState(initialFilters.category);

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
      const haystack = [product.name, product.brand, product.category].join(" ").toLowerCase();
      return matchesCategory && (!q || haystack.includes(q));
    });
  }, [category, products, search]);

  const categories = useMemo(() => deriveCategories(products), [products]);

  return (
    <main className="shell page-section">
      <div className="section-header section-header--catalog">
        <p className="section-kicker">Products</p>
        <h1>Shop the best devices for work, gaming, and everyday use.</h1>
      </div>

      <section className="panel filters-panel filters-panel--catalog">
        <input
          className="field"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search products, brands, or categories"
          aria-label="Search products"
        />
        <select className="field" value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category">
          <option value="all">All categories</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>{item.label}</option>
          ))}
        </select>
      </section>

      {status === "loading" && <div className="panel">Loading products...</div>}
      {status === "error" && <div className="panel">Could not load products: {error}</div>}

      {status === "ready" && (
        <>
          <p className="products-results">
            {filtered.length} {filtered.length === 1 ? "product" : "products"} available
          </p>
          <div className="product-grid product-grid--catalog">
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} onAddToCart={addItem} variant="catalog" />
          ))}
          </div>
        </>
      )}
    </main>
  );
}
