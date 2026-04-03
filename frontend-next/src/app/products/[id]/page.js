"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/format";
import { fetchProductById, getProductStock, resolveProductImage } from "@/lib/products";

export default function ProductDetailPage({ params }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProductById(params.id)
      .then((item) => {
        setProduct(item);
        setStatus("ready");
      })
      .catch((err) => {
        setError(err.message);
        setStatus("error");
      });
  }, [params.id]);

  if (status === "loading") {
    return <main className="shell page-section"><div className="panel">Loading product...</div></main>;
  }

  if (status === "error" || !product) {
    return <main className="shell page-section"><div className="panel">Could not load product: {error}</div></main>;
  }

  const stock = getProductStock(product);

  return (
    <main className="shell page-section">
      <div className="product-detail">
        <div className="panel">
          {resolveProductImage(product.images?.[0] || product.image) ? (
            <img src={resolveProductImage(product.images?.[0] || product.image)} alt={product.name} />
          ) : (
            <div className="product-card__placeholder">No image</div>
          )}
        </div>
        <div className="panel">
          <p className="section-kicker">{product.brand || "Deetech"}</p>
          <h1>{product.name}</h1>
          <p className="hero-copy">
            {product.description || "Product details available from the current backend catalog."}
          </p>
          <div className="product-detail__stats">
            <span>{formatCurrency(product.price)}</span>
            <span>{stock > 0 ? `${stock} in stock` : "Out of stock"}</span>
          </div>
          <div>
            <label htmlFor="qty" className="section-kicker">Quantity</label>
            <input
              id="qty"
              className="field"
              type="number"
              min="1"
              max={Math.max(stock, 1)}
              value={qty}
              onChange={(event) => setQty(Number(event.target.value || 1))}
            />
          </div>
          <div className="hero-actions">
            <button type="button" className="primary-button" disabled={stock < 1} onClick={() => addItem(product, qty)}>
              Add to cart
            </button>
            <button
              type="button"
              className="ghost-button"
              disabled={stock < 1}
              onClick={() => {
                addItem(product, qty);
                router.push("/cart");
              }}
            >
              Buy now
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
