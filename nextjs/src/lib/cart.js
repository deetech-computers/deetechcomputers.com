import { API_BASE_CART } from "./config";
import { requestJson } from "./http";

const CART_KEY = "cart";
const MAX_QTY = 99;

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
    return normalizeCartItems(Array.isArray(parsed) ? parsed : []);
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
      price: product.price,
      image: product.images?.[0] || product.image || "",
      countInStock:
        product.countInStock ?? product.stock_quantity ?? product.stock ?? 0,
    };
  });
}

export function mergeCartItems(serverItems = [], localItems = []) {
  const map = new Map();

  normalizeCartItems(serverItems).forEach((item) => {
    map.set(String(item.productId || item._id), item);
  });

  normalizeCartItems(localItems).forEach((item) => {
    map.set(String(item.productId || item._id), item);
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

export async function syncCartToServer(token, items) {
  const normalized = normalizeCartItems(items).map((item) => ({
    productId: item.productId || item._id,
    qty: normalizeQty(item.qty),
  }));

  const serverItems = await fetchServerCart(token).catch(() => []);
  const serverIds = new Set(serverItems.map((item) => String(item.productId || item._id)));
  const localIds = new Set(normalized.map((item) => String(item.productId)));
  for (const serverId of serverIds) {
    if (!localIds.has(serverId)) {
      await requestJson(`${API_BASE_CART}/${encodeURIComponent(serverId)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }
  for (const item of normalized) {
    await requestJson(`${API_BASE_CART}/${encodeURIComponent(item.productId)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ qty: item.qty }),
    });
  }
}
