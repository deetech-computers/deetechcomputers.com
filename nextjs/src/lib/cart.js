import { API_BASE_CART } from "./config";
import { requestJson } from "./http";
import { resolveProductImage } from "./products";
import { getProductPricing } from "./product-pricing";
import {
  buildCartLineKey,
  normalizeUpgradeSelection,
  resolveProductUpgradeSelection,
} from "./product-upgrades";

const CART_KEY = "cart";
const CART_REMOVED_KEY = "cart_removed_ids";
const MAX_QTY = 99;
export const CART_ITEM_ADDED_EVENT = "deetech:cart-item-added";

export function normalizeQty(value) {
  const qty = Number(value);
  if (!Number.isFinite(qty) || qty < 1) return 1;
  return Math.min(Math.round(qty), MAX_QTY);
}

export function normalizeCartItems(items = []) {
  const map = new Map();

  items.forEach((item) => {
    const id = String(item.productId || item._id || item.id || "");
    if (!id) return;
    const normalizedUpgrades = normalizeUpgradeSelection(item.selectedUpgrades);
    const lineKey =
      String(item.lineKey || "").trim() ||
      buildCartLineKey(id, normalizedUpgrades) ||
      id;

    const unitPrice = Number(item.price || 0);
    const originalPrice = Number(item.originalPrice || 0);
    const discountPrice = Number(item.discountPrice || 0);
    const hasDiscount =
      Boolean(item.hasDiscount || item.discountApplied) ||
      (originalPrice > 0 && originalPrice > unitPrice);
    const normalized = {
      ...item,
      _id: item._id || item.productId || id,
      productId: item.productId || item._id || id,
      lineKey,
      selectedUpgrades: normalizedUpgrades,
      qty: normalizeQty(item.qty || item.quantity || 1),
      price: unitPrice,
      originalPrice: hasDiscount ? Math.max(unitPrice, originalPrice) : unitPrice,
      discountPrice: hasDiscount ? (discountPrice > 0 ? discountPrice : unitPrice) : 0,
      hasDiscount,
    };

    map.set(lineKey, normalized);
  });

  return Array.from(map.values());
}

export function readStoredCart() {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CART_KEY) || "[]");
    const removedIds = readRemovedCartIds();
    return normalizeCartItems(Array.isArray(parsed) ? parsed : []).filter(
      (item) => {
        const lineKey = String(item.lineKey || "").trim();
        const productId = String(item.productId || item._id || "").trim();
        return !removedIds.has(lineKey || productId) && !removedIds.has(productId);
      }
    );
  } catch {
    return [];
  }
}

export function writeStoredCart(items) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(normalizeCartItems(items)));
}

export function clearStoredCart() {
  writeStoredCart([]);
}

function readRemovedCartIds() {
  if (typeof window === "undefined") return new Set();
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CART_REMOVED_KEY) || "[]");
    return new Set(Array.isArray(parsed) ? parsed.map(String).filter(Boolean) : []);
  } catch {
    return new Set();
  }
}

function writeRemovedCartIds(ids) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_REMOVED_KEY, JSON.stringify(Array.from(ids).map(String).filter(Boolean)));
}

export function markRemovedCartItem(productId) {
  const id = String(productId || "");
  if (!id) return;
  const ids = readRemovedCartIds();
  ids.add(id);
  writeRemovedCartIds(ids);
}

export function markRemovedCartItems(productIds = []) {
  const ids = readRemovedCartIds();
  productIds.map(String).filter(Boolean).forEach((id) => ids.add(id));
  writeRemovedCartIds(ids);
}

export function unmarkRemovedCartItem(productId) {
  const id = String(productId || "");
  if (!id) return;
  const ids = readRemovedCartIds();
  ids.delete(id);
  writeRemovedCartIds(ids);
}

export function normalizeServerCart(payload) {
  const items = Array.isArray(payload?.items) ? payload.items : [];
  return items.map((item) => {
    const product = item.product || {};
    const id = product._id || item.product;
    const selectedUpgrades = normalizeUpgradeSelection(item?.selectedUpgrades);
    const resolvedUpgrades = resolveProductUpgradeSelection(product, selectedUpgrades);
    const pricing = getProductPricing(product);
    const upgradeDelta = Number(resolvedUpgrades.totalDelta || 0);
    const price = Number(pricing.currentPrice || 0) + upgradeDelta;
    const originalPrice = Number(pricing.originalPrice || 0) + upgradeDelta;
    const hasDiscount =
      Boolean(pricing.isDiscountActive) &&
      originalPrice > 0 &&
      originalPrice > price;

    return {
      _id: id,
      productId: id,
      lineKey:
        String(item?.lineKey || "").trim() ||
        buildCartLineKey(id, selectedUpgrades),
      selectedUpgrades: {
        ram: resolvedUpgrades.selectedUpgrades?.ram?.label || "",
        storage: resolvedUpgrades.selectedUpgrades?.storage?.label || "",
      },
      qty: normalizeQty(item.qty || 1),
      name: product.name,
      category: product.category || "",
      price,
      originalPrice: hasDiscount ? originalPrice : price,
      discountPrice: hasDiscount ? price : 0,
      hasDiscount,
      image: resolveProductImage(product.images?.[0] || product.image || ""),
      countInStock:
        product.countInStock ?? product.stock_quantity ?? product.stock ?? 0,
    };
  });
}

export function mergeCartItems(serverItems = [], localItems = []) {
  const map = new Map();
  const removedIds = readRemovedCartIds();

  normalizeCartItems(serverItems).forEach((item) => {
    const id = String(item.productId || item._id || "");
    const lineKey = String(item.lineKey || "").trim() || id;
    if (!removedIds.has(lineKey) && !removedIds.has(id)) {
      map.set(lineKey, item);
    }
  });

  normalizeCartItems(localItems).forEach((item) => {
    const id = String(item.productId || item._id || "");
    const lineKey = String(item.lineKey || "").trim() || id;
    if (!removedIds.has(lineKey) && !removedIds.has(id)) {
      map.set(lineKey, item);
    }
  });

  return Array.from(map.values());
}

export async function fetchServerCart(token) {
  const payload = await requestJson(API_BASE_CART, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return normalizeServerCart(payload);
}

export async function upsertServerCartItem(token, productId, payload) {
  await requestJson(`${API_BASE_CART}/${encodeURIComponent(productId)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      qty: normalizeQty(payload?.qty),
      lineKey: String(payload?.lineKey || "").trim(),
      selectedUpgrades: normalizeUpgradeSelection(payload?.selectedUpgrades),
    }),
  });
  unmarkRemovedCartItem(String(payload?.lineKey || productId));
}

export async function removeServerCartItem(token, productId, lineKey = "") {
  const search = lineKey ? `?lineKey=${encodeURIComponent(lineKey)}` : "";
  await requestJson(`${API_BASE_CART}/${encodeURIComponent(productId)}${search}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function clearServerCart(token) {
  await requestJson(API_BASE_CART, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
