import { API_BASE_CART } from "./config";
import { requestJson } from "./http";
import { getProductPrice, resolveProductImage } from "./products";

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

    const normalized = {
      ...item,
      _id: item._id || item.productId || id,
      productId: item.productId || item._id || id,
      qty: normalizeQty(item.qty || item.quantity || 1),
    };

    map.set(id, normalized);
  });

  return Array.from(map.values());
}

export function readStoredCart() {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CART_KEY) || "[]");
    const removedIds = readRemovedCartIds();
    return normalizeCartItems(Array.isArray(parsed) ? parsed : []).filter(
      (item) => !removedIds.has(String(item.productId || item._id))
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

    return {
      _id: id,
      productId: id,
      qty: normalizeQty(item.qty || 1),
      name: product.name,
      price: getProductPrice(product),
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
    const id = String(item.productId || item._id);
    if (!removedIds.has(id)) {
      map.set(id, item);
    }
  });

  normalizeCartItems(localItems).forEach((item) => {
    const id = String(item.productId || item._id);
    if (!removedIds.has(id)) {
      map.set(id, item);
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

export async function upsertServerCartItem(token, productId, qty) {
  await requestJson(`${API_BASE_CART}/${encodeURIComponent(productId)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ qty: normalizeQty(qty) }),
  });
  unmarkRemovedCartItem(productId);
}

export async function removeServerCartItem(token, productId) {
  await requestJson(`${API_BASE_CART}/${encodeURIComponent(productId)}`, {
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
