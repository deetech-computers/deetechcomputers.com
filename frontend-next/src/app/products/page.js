"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/products/product-card";
import { useCart } from "@/hooks/use-cart";
import { canonicalCategory, deriveCategories, fetchProducts } from "@/lib/products";

export default function ProductsPage() {
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearch(params.get("q") || "");
    setCategory(params.get("category") || "all");
  }, []);

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
      <div className="section-header">
        <p className="section-kicker">Products</p>
        <h1>Catalog built directly on the Next.js app</h1>
      </div>

      <section className="panel filters-panel">
        <input
          className="field"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, brand, or category"
        />
        <select className="field" value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="all">All categories</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>{item.label}</option>
          ))}
        </select>
      </section>

      {status === "loading" && <div className="panel">Loading products...</div>}
      {status === "error" && <div className="panel">Could not load products: {error}</div>}

      {status === "ready" && (
        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} onAddToCart={addItem} />
          ))}
        </div>
      )}
    </main>
  );
}
