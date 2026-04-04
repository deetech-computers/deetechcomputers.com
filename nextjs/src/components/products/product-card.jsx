import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import { resolveProductImage } from "@/lib/products";

function getImageAlt(product) {
  return product?.name || product?.title || "Product image";
}

function getRating(product) {
  return Math.max(0, Math.min(5, Math.round(Number(product?.rating ?? product?.averageRating ?? 4))));
}

function getSummary(product) {
  const source =
    product?.shortDescription ||
    product?.description ||
    product?.name ||
    "Shop this product";

  return String(source).replace(/\s+/g, " ").trim();
}

export default function ProductCard({ product }) {
  const image = resolveProductImage(product.images?.[0] || product.image);
  const price = Number(product?.price || 0);
  const rating = getRating(product);

  return (
    <article className="product-card">
      <Link href={`/products/${product._id}`} className="product-card__link">
        <div className="product-card__media">
          <div className="product-card__image-shell">
            {image ? <img src={image} alt={getImageAlt(product)} loading="lazy" /> : <div className="product-card__placeholder">No image</div>}
          </div>
        </div>
        <div className="product-card__body">
          <p className="product-card__rating" aria-label={`${rating} out of 5 stars`}>
            {Array.from({ length: 5 }, (_, index) => (
              <span key={index} className={index < rating ? "is-filled" : ""}>{"\u2605"}</span>
            ))}
          </p>
          <h3>{getSummary(product)}</h3>
          <p className="product-card__price">{formatCurrency(price)}</p>
        </div>
      </Link>
    </article>
  );
}
