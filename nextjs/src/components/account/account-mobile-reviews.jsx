"use client";

import Link from "next/link";
import StableImage from "@/components/ui/stable-image";
import { resolveProductImage } from "@/lib/products";

function getAverageRating(reviews) {
  if (!reviews.length) return "0.0";
  const total = reviews.reduce((sum, review) => sum + Number(review?.rating || 0), 0);
  return (total / reviews.length).toFixed(1);
}

function truncateText(value, fallback) {
  const text = String(value || fallback || "").trim();
  if (text.length <= 128) return text;
  return `${text.slice(0, 125).trim()}...`;
}

function MobileReviewsIcon({ name }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
  };
  const paths = {
    arrowLeft: (
      <>
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </>
    ),
    settings: (
      <>
        <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 1 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1A2 2 0 1 1 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6h.1a1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 1 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.6 1h.1a2 2 0 1 1 0 4H21a1.7 1.7 0 0 0-1.6 1Z" />
      </>
    ),
    person: (
      <>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="9" r="3" />
        <path d="M6.8 18.3a6.2 6.2 0 0 1 10.4 0" />
      </>
    ),
    chevronRight: (
      <>
        <path d="m9 18 6-6-6-6" />
      </>
    ),
    star: (
      <>
        <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
      </>
    ),
    review: (
      <>
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
        <path d="M8 9h8" />
        <path d="M8 13h5" />
      </>
    ),
    external: (
      <>
        <path d="M15 3h6v6" />
        <path d="M10 14 21 3" />
        <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
      </>
    ),
  };

  return (
    <svg className="account-mobile-reviews__icon" viewBox="0 0 24 24" aria-hidden="true" {...common}>
      {paths[name] || paths.review}
    </svg>
  );
}

function MobileReviewStars({ rating }) {
  const value = Math.max(0, Math.min(5, Math.round(Number(rating || 0))));
  return (
    <span className="account-mobile-reviews__stars" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <svg key={index} viewBox="0 0 24 24" aria-hidden="true" className={index < value ? "is-filled" : ""}>
          <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
        </svg>
      ))}
    </span>
  );
}

export default function MobileReviews({ reviews }) {
  const visibleReviews = reviews.slice(0, 3);

  return (
    <section className="account-mobile-reviews" aria-label="Reviews">
      <header className="account-mobile-reviews__head">
        <Link href="/account" aria-label="Back to account">
          <MobileReviewsIcon name="arrowLeft" />
        </Link>
        <div className="account-mobile-reviews__title">
          <span>Account <MobileReviewsIcon name="chevronRight" /> Reviews</span>
          <h1>Reviews</h1>
        </div>
        <Link href="/account?tab=personal" aria-label="Account settings">
          <MobileReviewsIcon name={reviews.length ? "settings" : "person"} />
        </Link>
      </header>

      {reviews.length ? (
        <div className="account-mobile-reviews__body">
          <section className="account-mobile-reviews__summary" aria-label="Review summary">
            <article>
              <strong>{getAverageRating(reviews)}</strong>
              <MobileReviewStars rating={Number(getAverageRating(reviews))} />
              <span>Avg. Rating</span>
            </article>
            <article>
              <strong>{reviews.length}</strong>
              <MobileReviewsIcon name="review" />
              <span>Total Reviews</span>
            </article>
          </section>

          <div className="account-mobile-reviews__list">
            {visibleReviews.map((review) => {
              const product = review?.product || {};
              const image = resolveProductImage(product?.images?.[0] || product?.image);
              const productHref = product?._id ? `/products/${product._id}?tab=reviews#reviews` : "/products";
              return (
                <article key={review?._id || productHref} className="account-mobile-reviews__card">
                  <Link href={productHref} className="account-mobile-reviews__thumb">
                    <StableImage
                      src={image}
                      alt={product?.name || "Product"}
                      width={88}
                      height={88}
                    />
                  </Link>
                  <div className="account-mobile-reviews__copy">
                    <span>Completed Review</span>
                    <Link href={productHref}>{product?.name || "Product"}</Link>
                    <MobileReviewStars rating={review?.rating} />
                  </div>
                  <strong className="account-mobile-reviews__title">
                    &quot;{review?.title || "Customer review"}&quot;
                  </strong>
                  <p>{truncateText(review?.comment || review?.review, "Your submitted product feedback is saved with this purchase.")}</p>
                  <Link href={productHref} className="account-mobile-reviews__open">
                    <span>Open Product</span>
                    <MobileReviewsIcon name="external" />
                  </Link>
                </article>
              );
            })}
          </div>

          <div className="account-mobile-reviews__footer">
            <p>Showing {visibleReviews.length} of {reviews.length} reviews</p>
            {reviews.length > visibleReviews.length ? (
              <Link href="/products?tab=reviews">Load More</Link>
            ) : null}
          </div>
        </div>
      ) : (
        <section className="account-mobile-reviews__empty">
          <div className="account-mobile-reviews__empty-mark" aria-hidden="true">
            <MobileReviewsIcon name="star" />
            <i><MobileReviewsIcon name="review" /></i>
          </div>
          <h2>No reviews yet</h2>
          <p>Share your feedback on your recent purchases. Your insights help the DEETECH community find the right hardware.</p>
          <Link href="/account?tab=orders">Review Past Orders</Link>
          <strong>Every review matters</strong>
        </section>
      )}
    </section>
  );
}
