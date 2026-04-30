"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  CART_ITEM_ADDED_EVENT,
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
import { getProductPrice, getProductStock, resolveProductImage } from "@/lib/products";
import { buildCartLineKey, resolveProductUpgradeSelection } from "@/lib/product-upgrades";
import { useAuth } from "./auth-provider";
import { useToast } from "./toast-provider";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { token, status: authStatus } = useAuth();
  const { pushToast } = useToast();
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    setItems(readStoredCart());
    setStatus("ready");
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
        setItems(merged);
        writeStoredCart(merged);
      } catch {
        if (!ignore) setItems(readStoredCart());
      }
    }

    hydrateCart();
    return () => {
      ignore = true;
    };
  }, [authStatus, status, token]);

  useEffect(() => {
    if (status !== "ready") return;
    writeStoredCart(items);
  }, [items, status]);

  async function restoreServerCartSnapshot(activeToken = token) {
    if (!activeToken) return;
    try {
      const serverItems = await fetchServerCart(activeToken);
      const normalized = normalizeCartItems(serverItems);
      setItems(normalized);
      writeStoredCart(normalized);
    } catch {
      setItems(readStoredCart());
    }
  }

  useEffect(() => {
    if (status !== "ready") return undefined;

    const handleStorageSync = (event) => {
      if (event && event.storageArea !== window.localStorage) return;
      setItems(readStoredCart());
    };

    window.addEventListener("storage", handleStorageSync);

    return () => {
      window.removeEventListener("storage", handleStorageSync);
    };
  }, [status]);

  const addItem = (product, qty = 1, options = {}) => {
    const id = String(product?._id || product?.productId || "");
    if (!id) return;
    const resolvedUpgrades = resolveProductUpgradeSelection(product, options?.selectedUpgrades);
    const selectedUpgrades = {
      ram: resolvedUpgrades.selectedUpgrades?.ram?.label || "",
      storage: resolvedUpgrades.selectedUpgrades?.storage?.label || "",
    };
    const lineKey = buildCartLineKey(id, selectedUpgrades);

    let toast = null;
    let serverQty = null;
    unmarkRemovedCartItem(lineKey);
    unmarkRemovedCartItem(id);

    setItems((current) => {
      const nextItems = [...current];
      const index = nextItems.findIndex((item) => String(item.lineKey || "") === lineKey);
      const stock = getProductStock(product) || 99;

      if (index >= 0) {
        const nextQty = normalizeQty((nextItems[index].qty || 1) + qty);
        if (nextQty > stock) {
          toast = { message: "You cannot add more than available stock", type: "warning" };
          return current;
        }
        nextItems[index] = { ...nextItems[index], qty: nextQty };
        serverQty = nextQty;
      } else {
        serverQty = normalizeQty(qty);
        nextItems.push({
          _id: id,
          productId: id,
          lineKey,
          name: product.name,
          price: Number(getProductPrice(product) || 0) + Number(resolvedUpgrades.totalDelta || 0),
          image: resolveProductImage(product.images?.[0] || product.image || ""),
          countInStock: stock,
          selectedUpgrades,
          qty: serverQty,
        });
      }

      toast = { message: `${product.name} added to cart`, type: "success" };
      const normalized = normalizeCartItems(nextItems);
      writeStoredCart(normalized);
      return normalized;
    });

    if (toast) {
      pushToast(toast.message, toast.type);
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(CART_ITEM_ADDED_EVENT, {
          detail: {
            productId: id,
            lineKey,
            name: product?.name || "",
            qty: Number(serverQty || qty || 1),
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
        pushToast("Cart sync issue detected. Refreshing cart.", "warning");
        restoreServerCartSnapshot(token);
      });
    }
  };

  const updateQuantity = (productId, qty, lineKeyInput = "") => {
    const id = String(productId || "");
    const lineKey = String(lineKeyInput || "").trim() || id;
    if (!id) return;
    let serverQty = null;
    let selectedUpgrades = {};

    setItems((current) => {
      const nextItems = current.map((item) =>
        String(item.lineKey || item.productId || item._id) === lineKey
          ? (() => {
              serverQty = Math.min(
                normalizeQty(qty),
                Number(item.countInStock) > 0 ? Number(item.countInStock) : 99
              );
              selectedUpgrades = item.selectedUpgrades || {};
              return { ...item, qty: serverQty };
            })()
          : item
        );
      writeStoredCart(nextItems);
      return nextItems;
    });

    if (token && serverQty) {
      upsertServerCartItem(token, id, {
        qty: serverQty,
        lineKey,
        selectedUpgrades,
      }).catch(() => {
        pushToast("Cart sync issue detected. Refreshing cart.", "warning");
        restoreServerCartSnapshot(token);
      });
    }
  };

  const removeItem = (productId, lineKeyInput = "") => {
    const id = String(productId || "");
    const lineKey = String(lineKeyInput || "").trim() || id;
    if (!id) return;
    const isLastVisibleItem =
      items.filter((item) => String(item.lineKey || item.productId || item._id) !== lineKey).length === 0;

    markRemovedCartItem(lineKey);
    setItems((current) => {
      const nextItems = current.filter((item) => String(item.lineKey || item.productId || item._id) !== lineKey);
      writeStoredCart(nextItems);
      return nextItems;
    });
    if (token) {
      if (isLastVisibleItem) {
        clearServerCart(token).catch(() => {
          pushToast("Cart sync issue detected. Refreshing cart.", "warning");
          restoreServerCartSnapshot(token);
        });
      } else {
        removeServerCartItem(token, id, lineKey).catch(() => {
          pushToast("Cart sync issue detected. Refreshing cart.", "warning");
          restoreServerCartSnapshot(token);
        });
      }
    }
    pushToast("Item removed from cart", "info");
  };

  const clearCart = () => {
    const productIds = items.map((item) => String(item.lineKey || item.productId || item._id)).filter(Boolean);
    markRemovedCartItems(productIds);
    setItems([]);
    clearStoredCart();
    if (token) {
      clearServerCart(token).catch(() => {
        pushToast("Cart sync issue detected. Refreshing cart.", "warning");
        restoreServerCartSnapshot(token);
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
