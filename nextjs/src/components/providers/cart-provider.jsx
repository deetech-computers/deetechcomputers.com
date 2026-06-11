"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import {
  CART_ITEM_ADDED_EVENT,
  CART_UPDATED_EVENT,
  clearStoredCart,
  fetchServerCart,
  clearServerCart,
  markRemovedCartItem,
  markRemovedCartItems,
  mergeCartItems,
  normalizeCartItems,
  normalizeQty,
  removeServerCartItem,
  readStoredCart,
  unmarkRemovedCartItem,
  upsertServerCartItem,
  writeStoredCart,
} from "@/lib/cart";
import { getProductStock, optimizeCloudinaryImage } from "@/lib/products";
import { getProductPricing } from "@/lib/product-pricing";
import { buildCartLineKey, resolveProductUpgradeSelection } from "@/lib/product-upgrades";
import { useAuth } from "./auth-provider";
import { useToast } from "./toast-provider";

const CartContext = createContext(null);

function serializeCartItems(items = []) {
  return JSON.stringify(normalizeCartItems(items));
}

let cartStoreSnapshot = {
  items: [],
  status: "loading",
};

const cartStoreListeners = new Set();

function emitCartStore() {
  cartStoreListeners.forEach((listener) => listener());
}

function subscribeCartStore(listener) {
  cartStoreListeners.add(listener);
  return () => {
    cartStoreListeners.delete(listener);
  };
}

function getCartStoreSnapshot() {
  return cartStoreSnapshot;
}

function setCartStoreSnapshot(nextSnapshot) {
  const nextItems = normalizeCartItems(nextSnapshot?.items || []);
  const nextStatus = nextSnapshot?.status || "loading";
  const itemsChanged = serializeCartItems(cartStoreSnapshot.items) !== serializeCartItems(nextItems);
  const statusChanged = cartStoreSnapshot.status !== nextStatus;
  if (!itemsChanged && !statusChanged) return;
  cartStoreSnapshot = {
    items: nextItems,
    status: nextStatus,
  };
  emitCartStore();
}

function getCartItemLineKey(item) {
  return String(item?.lineKey || item?.productId || item?._id || "").trim();
}

function hasCartLine(items, lineKey) {
  const target = String(lineKey || "").trim();
  if (!target) return false;
  return (items || []).some((item) => getCartItemLineKey(item) === target);
}

function getStockLimitMessage(stock) {
  const available = Math.max(0, Number(stock || 0));
  if (available <= 0) return "This product is out of stock.";
  if (available === 1) return "Only 1 item is available for this product.";
  return `Only ${available} items are available for this product.`;
}

export function CartProvider({ children }) {
  const { token, status: authStatus } = useAuth();
  const { pushToast } = useToast();
  const { items, status } = useSyncExternalStore(
    subscribeCartStore,
    getCartStoreSnapshot,
    getCartStoreSnapshot
  );

  useEffect(() => {
    setCartStoreSnapshot({
      items: readStoredCart(),
      status: "ready",
    });
  }, []);

  useEffect(() => {
    if (authStatus !== "ready" || status !== "ready") return;
    let ignore = false;

    async function hydrateCart() {
      if (!token) {
        return;
      }

      try {
        const serverItems = await fetchServerCart(token);
        if (ignore) return;
        const merged = mergeCartItems(serverItems, readStoredCart());
        setCartStoreSnapshot({
          items: merged,
          status: "ready",
        });
        writeStoredCart(merged);
      } catch {
        if (!ignore) {
          setCartStoreSnapshot({
            items: readStoredCart(),
            status: "ready",
          });
        }
      }
    }

    hydrateCart();
    return () => {
      ignore = true;
    };
  }, [authStatus, status, token]);

  async function restoreServerCartSnapshot(activeToken = token) {
    if (!activeToken) return;
    try {
      const serverItems = await fetchServerCart(activeToken);
      const normalized = normalizeCartItems(serverItems);
      setCartStoreSnapshot({
        items: normalized,
        status: "ready",
      });
      writeStoredCart(normalized);
    } catch {
      setCartStoreSnapshot({
        items: readStoredCart(),
        status: "ready",
      });
    }
  }

  async function reconcileServerCartAfterFailure(activeToken, validate, warningMessage = "Cart sync issue detected. Refreshing cart.") {
    if (!activeToken) return false;
    try {
      const serverItems = await fetchServerCart(activeToken);
      const normalized = normalizeCartItems(serverItems);
      const isValid = typeof validate === "function" ? validate(normalized) : false;
      setCartStoreSnapshot({
        items: normalized,
        status: "ready",
      });
      writeStoredCart(normalized);
      if (!isValid) {
        pushToast(warningMessage, "warning");
      }
      return isValid;
    } catch {
      pushToast(warningMessage, "warning");
      setCartStoreSnapshot({
        items: readStoredCart(),
        status: "ready",
      });
      return false;
    }
  }

  useEffect(() => {
    if (status !== "ready") return undefined;

    const syncFromStorage = () => {
      const nextItems = readStoredCart();
      setCartStoreSnapshot({
        items: nextItems,
        status: "ready",
      });
    };

    const handleStorageSync = (event) => {
      if (event?.type === "storage" && event.storageArea !== window.localStorage) return;
      syncFromStorage();
    };

    window.addEventListener("storage", handleStorageSync);
    window.addEventListener(CART_UPDATED_EVENT, handleStorageSync);

    return () => {
      window.removeEventListener("storage", handleStorageSync);
      window.removeEventListener(CART_UPDATED_EVENT, handleStorageSync);
    };
  }, [status]);

  const addItem = (product, qty = 1, options = {}) => {
    const id = String(product?._id || product?.productId || "");
    if (!id) return;
    const resolvedUpgrades = resolveProductUpgradeSelection(product, options?.selectedUpgrades);
    const pricing = getProductPricing(product);
    const upgradeDelta = Number(resolvedUpgrades.totalDelta || 0);
    const livePrice = Number(pricing.currentPrice || 0) + upgradeDelta;
    const originalPrice = Number(pricing.originalPrice || 0) + upgradeDelta;
    const hasDiscount =
      Boolean(pricing.isDiscountActive) &&
      originalPrice > 0 &&
      originalPrice > livePrice;
    const selectedUpgrades = {
      ram: resolvedUpgrades.selectedUpgrades?.ram?.label || "",
      storage: resolvedUpgrades.selectedUpgrades?.storage?.label || "",
    };
    const lineKey = buildCartLineKey(id, selectedUpgrades);

    let toast = null;
    let serverQty = null;
    let nextItems = null;
    unmarkRemovedCartItem(lineKey);
    unmarkRemovedCartItem(id);

    {
      const workingItems = [...cartStoreSnapshot.items];
      const index = workingItems.findIndex((item) => String(item.lineKey || "") === lineKey);
      const stock = getProductStock(product) || 99;

      if (index >= 0) {
        const nextQty = normalizeQty((workingItems[index].qty || 1) + qty);
        if (nextQty > stock) {
          toast = { message: getStockLimitMessage(stock), type: "warning" };
          nextItems = null;
        } else {
          workingItems[index] = { ...workingItems[index], qty: nextQty };
          serverQty = nextQty;
        }
      } else {
        const requestedQty = normalizeQty(qty);
        if (requestedQty > stock) {
          toast = { message: getStockLimitMessage(stock), type: "warning" };
          nextItems = null;
        } else {
          serverQty = requestedQty;
          workingItems.push({
            _id: id,
            productId: id,
            lineKey,
            name: product.name,
            category: product.category || "",
            price: livePrice,
            originalPrice: hasDiscount ? originalPrice : livePrice,
            discountPrice: hasDiscount ? livePrice : 0,
            hasDiscount,
            image: optimizeCloudinaryImage(product.images?.[0] || product.image || "", { width: 160, height: 160 }),
            countInStock: stock,
            selectedUpgrades,
            qty: serverQty,
          });
        }
      }

      if (serverQty) {
        toast = { message: `${product.name} added to cart`, type: "success" };
        nextItems = normalizeCartItems(workingItems);
        setCartStoreSnapshot({
          items: nextItems,
          status: "ready",
        });
        writeStoredCart(nextItems);
      }
    }

    if (toast) {
      pushToast(toast.message, toast.type);
    }
    if (typeof window !== "undefined" && serverQty) {
      window.dispatchEvent(
        new CustomEvent(CART_ITEM_ADDED_EVENT, {
          detail: {
            productId: id,
            lineKey,
            name: product?.name || "",
            qty: Number(serverQty),
          },
        })
      );
    }
    if (token && serverQty) {
      upsertServerCartItem(token, id, {
        qty: serverQty,
        lineKey,
        selectedUpgrades,
      }).catch(() => {
        reconcileServerCartAfterFailure(
          token,
          (serverItems) =>
            serverItems.some(
              (item) => getCartItemLineKey(item) === lineKey && Number(item.qty || 0) === Number(serverQty || 0)
            )
        );
      });
    }
  };

  const updateQuantity = (productId, qty, lineKeyInput = "") => {
    const id = String(productId || "");
    const lineKey = String(lineKeyInput || "").trim() || id;
    if (!id) return;
    const targetItem = items.find(
      (item) => String(item.lineKey || item.productId || item._id) === lineKey
    );
    if (!targetItem) return;

    const stockLimit = Number(targetItem.countInStock) > 0 ? Number(targetItem.countInStock) : 99;
    const requestedQty = normalizeQty(qty);
    const nextQty = Math.min(requestedQty, stockLimit);
    let serverQty = null;
    let nextItems = null;
    const selectedUpgrades = targetItem.selectedUpgrades || {};

    serverQty = nextQty;
    nextItems = normalizeCartItems(
      cartStoreSnapshot.items.map((item) =>
        String(item.lineKey || item.productId || item._id) === lineKey
          ? { ...item, qty: nextQty }
          : item
      )
    );
    setCartStoreSnapshot({
      items: nextItems,
      status: "ready",
    });
    writeStoredCart(nextItems);

    if (requestedQty > stockLimit) {
      pushToast(getStockLimitMessage(stockLimit), "warning");
    }

    if (token && serverQty) {
      upsertServerCartItem(token, id, {
        qty: serverQty,
        lineKey,
        selectedUpgrades,
      }).catch(() => {
        reconcileServerCartAfterFailure(
          token,
          (serverItems) =>
            serverItems.some(
              (item) => getCartItemLineKey(item) === lineKey && Number(item.qty || 0) === Number(serverQty || 0)
            )
        );
      });
    }
  };

  const removeItem = (productId, lineKeyInput = "") => {
    const id = String(productId || "");
    const lineKey = String(lineKeyInput || "").trim() || id;
    if (!id) return;
    const targetItem = items.find(
      (item) => String(item.lineKey || item.productId || item._id) === lineKey
    );
    if (!targetItem) return;

    const isLastVisibleItem =
      items.filter((item) => String(item.lineKey || item.productId || item._id) !== lineKey).length === 0;

    markRemovedCartItem(lineKey);
    const nextItems = normalizeCartItems(
      cartStoreSnapshot.items.filter((item) => String(item.lineKey || item.productId || item._id) !== lineKey)
    );
    setCartStoreSnapshot({
      items: nextItems,
      status: "ready",
    });
    writeStoredCart(nextItems);
    if (token) {
      if (isLastVisibleItem) {
        clearServerCart(token).catch(() => {
          reconcileServerCartAfterFailure(
            token,
            (serverItems) => serverItems.length === 0
          );
        });
      } else {
        removeServerCartItem(token, id, lineKey).catch(() => {
          reconcileServerCartAfterFailure(
            token,
            (serverItems) => !hasCartLine(serverItems, lineKey)
          );
        });
      }
    }
    const productName = String(targetItem?.name || "").trim();
    pushToast(productName ? `${productName} removed from cart` : "Item removed from cart", "info");
  };

  const clearCart = () => {
    const productIds = items.map((item) => String(item.lineKey || item.productId || item._id)).filter(Boolean);
    markRemovedCartItems(productIds);
    setCartStoreSnapshot({
      items: [],
      status: "ready",
    });
    clearStoredCart();
    if (token) {
      clearServerCart(token).catch(() => {
        reconcileServerCartAfterFailure(
          token,
          (serverItems) => serverItems.length === 0
        );
      });
    }
    pushToast("Cart cleared", "info");
  };

  const value = useMemo(() => {
    const count = items.reduce((sum, item) => sum + Number(item.qty || 0), 0);
    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0),
      0
    );

    return {
      items,
      status,
      count,
      subtotal,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    };
  }, [items, status]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
