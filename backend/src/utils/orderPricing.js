function canonicalShippingCategory(value) {
  const input = String(value || "").trim().toLowerCase();
  if (!input) return "other";
  if (input.includes("laptop") || input.includes("desktop") || input.includes("workstation")) return "laptops";
  return input;
}

export function calculateShippingPrice(itemsPrice = 0, categoryInputs = []) {
  const safeItemsPrice = Math.max(0, Number(itemsPrice || 0));
  const categories = (Array.isArray(categoryInputs) ? categoryInputs : []).map(canonicalShippingCategory);
  const hasItems = categories.length > 0;
  const allLaptops = hasItems && categories.every((category) => category === "laptops");

  if (allLaptops) return 0;
  if (safeItemsPrice >= 2000) return 0;
  return 100;
}

export function buildOrderPricing({ itemsPrice = 0, discountPercent = 0, categoryInputs = [] } = {}) {
  const safeItemsPrice = Math.max(0, Number(itemsPrice || 0));
  const safeDiscountPercent = Math.max(0, Math.min(100, Number(discountPercent || 0)));
  const discountAmount = Number(((safeItemsPrice * safeDiscountPercent) / 100).toFixed(2));
  const discountedItemsPrice = Math.max(0, Number((safeItemsPrice - discountAmount).toFixed(2)));
  const shippingPrice = Number(calculateShippingPrice(safeItemsPrice, categoryInputs).toFixed(2));
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
