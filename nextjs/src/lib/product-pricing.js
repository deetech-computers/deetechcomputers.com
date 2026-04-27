function normalizeDate(value) {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function getProductPricing(product, nowInput = new Date()) {
  const originalPrice = Number(product?.price || 0);
  const discountPrice = Number(product?.discountPrice || 0);
  const discountMode = String(product?.discountMode || "none").trim().toLowerCase();
  const discountStartsAt = normalizeDate(product?.discountStartsAt);
  const discountEndsAt = normalizeDate(product?.discountEndsAt);
  const now = normalizeDate(nowInput) || new Date();

  const hasValidDiscount =
    Number.isFinite(originalPrice) &&
    originalPrice > 0 &&
    Number.isFinite(discountPrice) &&
    discountPrice > 0 &&
    discountPrice < originalPrice;

  let isDiscountActive = false;
  if (hasValidDiscount) {
    if (discountMode === "instant") {
      isDiscountActive = true;
    } else if (discountMode === "timed") {
      const startsOk = !discountStartsAt || discountStartsAt.getTime() <= now.getTime();
      const endsOk = Boolean(discountEndsAt) && discountEndsAt.getTime() > now.getTime();
      isDiscountActive = startsOk && endsOk;
    }
  }

  const currentPrice = isDiscountActive ? discountPrice : originalPrice;
  const discountPercent = isDiscountActive
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  return {
    originalPrice,
    currentPrice,
    discountPrice: hasValidDiscount ? discountPrice : 0,
    discountMode,
    discountStartsAt,
    discountEndsAt,
    isDiscountActive,
    isTimedDiscount: isDiscountActive && discountMode === "timed",
    discountPercent,
  };
}
