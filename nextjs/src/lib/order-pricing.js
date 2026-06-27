import { API_BASE_ORDERS } from "./config";
import { requestJson } from "./http";
import { canonicalCategory } from "./products";

function shippingFeeForLineTotal(lineTotal) {
  const safeLineTotal = Math.max(0, Number(lineTotal || 0));
  if (safeLineTotal >= 2000) return 0;
  if (safeLineTotal >= 1000) return 100;
  if (safeLineTotal >= 300) return 50;
  if (safeLineTotal >= 60) return 30;
  return 0;
}

// Each cart line is priced for shipping independently based on its own
// (price * qty) subtotal, then summed - so one item crossing the
// free-shipping threshold (or being a laptop) never exempts a separate,
// lower-priced item in the same cart from its own shipping fee. Mirrors
// backend/src/utils/orderPricing.js, which is the authoritative source
// once the /preview request resolves - this is just the local fallback.
export function calculateShippingPrice(items = [], subtotal = 0) {
  const normalizedItems = Array.isArray(items) ? items : [];

  if (!normalizedItems.length) {
    return shippingFeeForLineTotal(subtotal);
  }

  return normalizedItems.reduce((sum, item) => {
    const category = canonicalCategory(item?.category || item?.categoryName || item?.name || "");
    if (category === "laptops" || category === "desktops") return sum;
    const lineTotal = Number(item?.price || 0) * Number(item?.qty || item?.quantity || 1);
    return sum + shippingFeeForLineTotal(lineTotal);
  }, 0);
}

export function buildCheckoutPricing({ items = [], subtotal = 0, discountAmount = 0 } = {}) {
  const safeSubtotal = Math.max(0, Number(subtotal || 0));
  const safeDiscountAmount = Math.max(0, Number(discountAmount || 0));
  const shipping = calculateShippingPrice(items, safeSubtotal);
  const taxes = 0;
  const total = Math.max(0, safeSubtotal + shipping + taxes - safeDiscountAmount);

  return {
    subtotal: safeSubtotal,
    shipping,
    taxes,
    discountAmount: safeDiscountAmount,
    total,
  };
}

export function normalizeCheckoutPricing(payload, fallback = {}) {
  const localFallback = buildCheckoutPricing({
    items: fallback.items || [],
    subtotal: Number(fallback.subtotal || 0),
    discountAmount: Number(fallback.discountAmount || 0),
  });

  if (!payload || typeof payload !== "object") {
    return localFallback;
  }

  const subtotal = Math.max(
    0,
    Number(payload.itemsPrice ?? payload.subtotal ?? localFallback.subtotal)
  );
  const shipping = Math.max(0, Number(payload.shippingPrice ?? payload.shipping ?? localFallback.shipping));
  const discountAmount = Math.max(
    0,
    Number(payload.discountAmount ?? localFallback.discountAmount)
  );
  const total = Math.max(
    0,
    Number(payload.totalPrice ?? payload.total ?? subtotal + shipping - discountAmount)
  );

  return {
    subtotal,
    shipping,
    taxes: 0,
    discountAmount,
    total,
    discountPercent: Math.max(0, Number(payload.discountPercent || 0)),
    discountCode: String(payload.discountCode || "").trim(),
  };
}

export async function fetchCheckoutPricingPreview({
  orderItems = [],
  items = [],
  subtotal = 0,
  discountAmount = 0,
  discountCode = "",
} = {}) {
  const fallback = {
    items,
    subtotal,
    discountAmount,
  };

  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    return normalizeCheckoutPricing(null, fallback);
  }

  const payload = await requestJson(`${API_BASE_ORDERS}/preview`, {
    method: "POST",
    body: JSON.stringify({
      orderItems,
      discountCode: String(discountCode || "").trim().toUpperCase(),
    }),
    retries: 0,
  });

  return normalizeCheckoutPricing(payload, fallback);
}
