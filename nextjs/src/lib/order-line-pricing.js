function toMoney(value) {
  const amount = Number(value || 0);
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return Number(amount.toFixed(2));
}

export function getLinePricing(item = {}) {
  const currentUnitPrice = toMoney(item?.price);
  const explicitOriginalPrice = toMoney(item?.originalPrice || item?.unitOriginalPrice);
  const explicitDiscountPrice = toMoney(item?.discountPrice || item?.unitDiscountPrice);
  const fallbackProductOriginalPrice = toMoney(item?.product?.price);

  const originalUnitPrice = Math.max(
    currentUnitPrice,
    explicitOriginalPrice,
    explicitOriginalPrice ? 0 : fallbackProductOriginalPrice
  );
  const discountUnitPrice =
    explicitDiscountPrice > 0
      ? explicitDiscountPrice
      : currentUnitPrice;
  const hasDiscount =
    Boolean(item?.discountApplied) ||
    (originalUnitPrice > 0 && currentUnitPrice > 0 && originalUnitPrice > currentUnitPrice);
  const quantity = Math.max(1, Number(item?.qty || item?.quantity || 1));

  return {
    quantity,
    currentUnitPrice,
    originalUnitPrice: hasDiscount ? originalUnitPrice : currentUnitPrice,
    discountUnitPrice: hasDiscount ? discountUnitPrice : 0,
    hasDiscount,
    currentLineTotal: Number((currentUnitPrice * quantity).toFixed(2)),
    originalLineTotal: Number(((hasDiscount ? originalUnitPrice : currentUnitPrice) * quantity).toFixed(2)),
  };
}

export function getLinesDiscountTotal(items = []) {
  return Number(
    (items || [])
      .reduce((sum, item) => {
        const pricing = getLinePricing(item);
        if (!pricing.hasDiscount) return sum;
        return sum + Math.max(0, pricing.originalLineTotal - pricing.currentLineTotal);
      }, 0)
      .toFixed(2)
  );
}
