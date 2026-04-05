"use client";

export const WISHLIST_STORAGE_KEY = "deetech:wishlist";

function normalizeWishlistEntry(item) {
  if (!item) return null;

  if (typeof item === "string" || typeof item === "number") {
    const id = String(item).trim();
    return id ? { id, addedAt: null } : null;
  }

  if (typeof item === "object") {
    const id = String(item.id || item.productId || item._id || "").trim();
    if (!id) return null;

    return {
      id,
      addedAt: item.addedAt ? String(item.addedAt) : null,
    };
  }

  return null;
}

export function readWishlistEntries() {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];

    const deduped = new Map();
    for (const item of parsed) {
      const entry = normalizeWishlistEntry(item);
      if (!entry) continue;

      const existing = deduped.get(entry.id);
      if (!existing) {
        deduped.set(entry.id, entry);
        continue;
      }

      if (!existing.addedAt && entry.addedAt) {
        deduped.set(entry.id, entry);
      }
    }

    return [...deduped.values()];
  } catch {
    return [];
  }
}

export function readWishlistIds() {
  return readWishlistEntries().map((item) => item.id);
}

export function writeWishlistEntries(items) {
  if (typeof window === "undefined") return;

  const normalized = Array.isArray(items)
    ? items.map(normalizeWishlistEntry).filter(Boolean)
    : [];

  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(normalized));
}

export function addWishlistEntry(id) {
  const productId = String(id || "").trim();
  if (!productId) return readWishlistEntries();

  const current = readWishlistEntries();
  if (current.some((item) => item.id === productId)) {
    return current;
  }

  const next = [{ id: productId, addedAt: new Date().toISOString() }, ...current];
  writeWishlistEntries(next);
  return next;
}

export function removeWishlistEntry(id) {
  const productId = String(id || "").trim();
  const next = readWishlistEntries().filter((item) => item.id !== productId);
  writeWishlistEntries(next);
  return next;
}

export function clearWishlistEntries() {
  writeWishlistEntries([]);
  return [];
}
