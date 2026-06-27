function canonicalShippingCategory(value) {
  const input = String(value || "").trim().toLowerCase();
  if (!input) return "other";
  if (input.includes("laptop") || input.includes("desktop") || input.includes("workstation")) return "laptops";
  return input;
}

function shippingFeeForLineTotal(lineTotal) {
  const safeLineTotal = Math.max(0, Number(lineTotal || 0));
  if (safeLineTotal >= 2000) return 0;
  if (safeLineTotal >= 1000) return 100;
  if (safeLineTotal >= 300) return 50;
  if (safeLineTotal >= 60) return 30;
  return 0;
}

// Each line item is priced for shipping independently based on its own
// (price * qty) subtotal, then summed - so a laptop being free (or one item
// crossing the free-shipping threshold on its own) never exempts a separate,
// lower-priced item in the same cart from its own shipping fee.
export function calculateShippingPrice(lineItems = []) {
  const normalized = Array.isArray(lineItems) ? lineItems : [];
  if (!normalized.length) return 0;

  return normalized.reduce((sum, line) => {
    const category = canonicalShippingCategory(line?.category);
    if (category === "laptops") return sum;
    return sum + shippingFeeForLineTotal(line?.lineTotal);
  }, 0);
}

export function buildOrderPricing({ itemsPrice = 0, discountPercent = 0, lineItems = [] } = {}) {
  const safeItemsPrice = Math.max(0, Number(itemsPrice || 0));
  const safeDiscountPercent = Math.max(0, Math.min(100, Number(discountPercent || 0)));
  const discountAmount = Number(((safeItemsPrice * safeDiscountPercent) / 100).toFixed(2));
  const discountedItemsPrice = Math.max(0, Number((safeItemsPrice - discountAmount).toFixed(2)));
  const shippingPrice = Number(calculateShippingPrice(lineItems).toFixed(2));
  const totalPrice = Number((discountedItemsPrice + shippingPrice).toFixed(2));

  return {
    itemsPrice: safeItemsPrice,
    discountPercent: safeDiscountPercent,
    discountAmount,
    discountedItemsPrice,
    shippingPrice,
    totalPrice,
  };
}

export function getCommissionableAmount(order = {}) {
  const persistedDiscountedItemsPrice = Number(order?.discountedItemsPrice || 0);
  if (persistedDiscountedItemsPrice > 0) {
    return Number(persistedDiscountedItemsPrice.toFixed(2));
  }

  const itemsPrice = Number(order?.itemsPrice || 0);
  if (itemsPrice > 0) {
    return Number(Math.max(0, itemsPrice - Number(order?.discountAmount || 0)).toFixed(2));
  }

  const totalPrice = Number(order?.totalPrice || 0);
  const shippingPrice = Number(order?.shippingPrice || 0);
  return Number(Math.max(0, totalPrice - shippingPrice).toFixed(2));
}
