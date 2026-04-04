"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductCard from "@/components/products/product-card";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/format";
import {
  canonicalCategory,
  fetchProductById,
  fetchProducts,
  formatCategoryLabel,
  getProductStock,
  resolveProductImage,
} from "@/lib/products";

function getProductImages(product) {
  const images = Array.isArray(product?.images) ? product.images : [];
  const normalized = images
    .map((image) => resolveProductImage(image))
    .filter(Boolean);

  const fallback = resolveProductImage(product?.image);
  if (fallback && !normalized.includes(fallback)) {
    normalized.unshift(fallback);
  }

  return normalized;
}

function getProductSpecs(product) {
  const specs = product?.specs;
  if (!specs) return [];
  if (typeof specs.entries === "function") {
    return Array.from(specs.entries());
  }
  if (typeof specs === "object") {
    return Object.entries(specs);
  }
  return [];
}

function getProductRating(product) {
  return Number(product?.rating ?? product?.averageRating ?? 4);
}

function getProductDescription(product) {
  return (
    product?.description ||
    product?.shortDescription ||
    product?.short_description ||
    "This product is part of our carefully selected collection built to deliver dependable quality, strong day-to-day performance, and a cleaner setup for work or home."
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const productId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  useEffect(() => {
    if (!productId) return;

    setStatus("loading");
    setError("");

    Promise.all([fetchProductById(productId), fetchProducts()])
      .then(([item, items]) => {
        setProduct(item);
        setAllProducts(items);
        setStatus("ready");
      })
      .catch((err) => {
        setError(err.message);
        setStatus("error");
      });
  }, [productId]);

  useEffect(() => {
    setActiveImage(0);
    setActiveTab("description");
    setQty(1);
  }, [product?._id]);

  if (status === "loading") {
    return <main className="shell page-section"><div className="panel">Loading product...</div></main>;
  }

  if (status === "error" || !product) {
    return <main className="shell page-section"><div className="panel">Could not load product: {error}</div></main>;
  }

  const stock = getProductStock(product);
  const images = getProductImages(product);
  const currentImage = images[activeImage] || images[0] || "";
  const categoryLabel = formatCategoryLabel(product?.category || canonicalCategory(product?.category));
  const productSpecs = getProductSpecs(product).filter(([, value]) => String(value || "").trim());
  const description = getProductDescription(product);
  const rating = getProductRating(product);
  const reviews = Array.isArray(product?.reviews) ? product.reviews : [];
  const relatedProducts = allProducts
    .filter((item) => String(item?._id) !== String(product?._id))
    .filter((item) => canonicalCategory(item?.category) === canonicalCategory(product?.category))
    .slice(0, 4);

  return (
    <main className="shell page-section">
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
          <div className="product-gallery__main">
            {currentImage ? (
              <img src={currentImage} alt={product.name} />
            ) : (
              <div className="product-card__placeholder">No image</div>
            )}
          </div>
          {images.length ? (
            <div className="product-gallery__selector" aria-label="Product images">
              <button
                type="button"
                className="product-gallery__arrow"
                onClick={() => setActiveImage((index) => (index === 0 ? images.length - 1 : index - 1))}
                aria-label="Previous product image"
              >
                &lsaquo;
              </button>
              <div className="product-gallery__thumbs">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    className={activeImage === index ? "product-gallery__thumb is-active" : "product-gallery__thumb"}
                    onClick={() => setActiveImage(index)}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="product-gallery__arrow"
                onClick={() => setActiveImage((index) => (index === images.length - 1 ? 0 : index + 1))}
                aria-label="Next product image"
              >
                &rsaquo;
              </button>
            </div>
          ) : null}
        </div>

        <div className="product-summary panel">
          <p className="product-summary__eyebrow">{product?.brand || categoryLabel}</p>
          <h1>{product.name}</h1>
          <div className="product-summary__rating" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
            <span>{"★".repeat(Math.max(0, Math.min(5, Math.round(rating))))}</span>
            <strong>{rating.toFixed(1)}</strong>
            <small>{reviews.length ? `(${reviews.length} reviews)` : "(Customer favorite)"}</small>
          </div>
          <p className="product-summary__price">{formatCurrency(product.price)}</p>
          <p className="product-summary__copy">{description}</p>

          <div className="product-summary__buy">
            <input
              id="qty"
              className="field product-summary__qty"
              type="number"
              min="1"
              max={Math.max(stock, 1)}
              value={qty}
              onChange={(event) => setQty(Number(event.target.value || 1))}
            />
            <button type="button" className="primary-button product-summary__cart" disabled={stock < 1} onClick={() => addItem(product, qty)}>
              Add to cart
            </button>
          </div>

          <div className="product-summary__meta">
            <p><strong>Category:</strong> {categoryLabel}</p>
            <p><strong>Stock:</strong> {stock > 0 ? `${stock} available` : "Out of stock"}</p>
          </div>

          <div className="product-summary__actions">
            <button type="button" className="ghost-button" onClick={() => router.push("/wishlist")}>Browse wishlist</button>
            <button type="button" className="ghost-button" onClick={() => router.push("/cart")}>Go to cart</button>
          </div>
        </div>
      </section>

      <section className="product-tabs panel">
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
            <div className="product-tabs__panel">
              {reviews.length ? (
                reviews.map((review, index) => (
                  <article key={review?._id || index} className="product-review">
                    <strong>{review?.name || "Customer"}</strong>
                    <p>{review?.comment || "Great product and solid value."}</p>
                  </article>
                ))
              ) : (
                <p>No reviews yet. Be the first to share your experience with this product.</p>
              )}
            </div>
          ) : null}
        </div>
      </section>

      {relatedProducts.length ? (
        <section className="related-products">
          <div className="related-products__header">
            <h2>Related products</h2>
          </div>
          <div className="related-products__grid">
            {relatedProducts.map((item) => (
              <ProductCard key={item._id} product={item} onAddToCart={addItem} variant="related" />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
