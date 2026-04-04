"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  clearStoredCart,
  fetchServerCart,
  mergeCartItems,
  normalizeCartItems,
  normalizeQty,
  readStoredCart,
  syncCartToServer,
  writeStoredCart,
} from "@/lib/cart";
import { getProductStock } from "@/lib/products";
import { useAuth } from "./auth-provider";
import { useToast } from "./toast-provider";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { token, status: authStatus } = useAuth();
  const { pushToast } = useToast();
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const initializedRef = useRef(false);

  useEffect(() => {
    setItems(readStoredCart());
    setStatus("ready");
  }, []);

  useEffect(() => {
    if (authStatus !== "ready" || status !== "ready") return;
    let ignore = false;

    async function hydrateCart() {
      if (!token) {
        initializedRef.current = true;
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
      } finally {
        initializedRef.current = true;
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

  useEffect(() => {
    if (!token || !initializedRef.current || status !== "ready") return;
    const timer = window.setTimeout(() => {
      syncCartToServer(token, items).catch(() => {});
    }, 350);

    return () => window.clearTimeout(timer);
  }, [items, status, token]);

  const addItem = (product, qty = 1) => {
    const id = String(product?._id || product?.productId || "");
    if (!id) return;

    let toast = null;

    setItems((current) => {
      const nextItems = [...current];
      const index = nextItems.findIndex((item) => String(item.productId || item._id) === id);
      const stock = getProductStock(product) || 99;

      if (index >= 0) {
        const nextQty = normalizeQty((nextItems[index].qty || 1) + qty);
        if (nextQty > stock) {
          toast = { message: "You cannot add more than available stock", type: "warning" };
          return current;
        }
        nextItems[index] = { ...nextItems[index], qty: nextQty };
      } else {
        nextItems.push({
          _id: id,
          productId: id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || product.image || "",
          countInStock: stock,
          qty: normalizeQty(qty),
        });
      }

      toast = { message: `${product.name} added to cart`, type: "success" };
      return normalizeCartItems(nextItems);
    });

    if (toast) {
      pushToast(toast.message, toast.type);
    }
  };

  const updateQuantity = (productId, qty) => {
    if (Number(qty) <= 0) {
      removeItem(productId);
      return;
    }

    setItems((current) =>
      current.map((item) =>
        String(item.productId || item._id) === String(productId)
          ? { ...item, qty: normalizeQty(qty) }
          : item
      )
    );
  };

  const removeItem = (productId) => {
    setItems((current) =>
      current.filter((item) => String(item.productId || item._id) !== String(productId))
    );
    pushToast("Item removed from cart", "info");
  };

  const clearCart = () => {
    setItems([]);
    clearStoredCart();
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
