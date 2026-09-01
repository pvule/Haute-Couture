/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useMemo, useState } from "react";

export const CartContext = createContext(null);

const STORAGE_KEY = "mon_app2_cart_v1";

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function normalizeCart(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((x) => x && typeof x.id === "string")
    .map((x) => ({
      id: x.id,
      title: typeof x.title === "string" ? x.title : "",
      price: typeof x.price === "number" ? x.price : Number(x.price) || 0,
      qty: typeof x.qty === "number" ? x.qty : Number(x.qty) || 0,
      image: typeof x.image === "string" ? x.image : "",
    }))
    .filter((x) => x.qty > 0);
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    if (!canUseLocalStorage()) return [];

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? normalizeCart(JSON.parse(raw)) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (!canUseLocalStorage()) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const cartCount = useMemo(() => items.reduce((sum, it) => sum + it.qty, 0), [items]);
  const cartTotal = useMemo(
    () => items.reduce((sum, it) => sum + it.qty * it.price, 0),
    [items]
  );

  function addItem(product, qty = 1) {
    setItems((prev) => {
      const p = {
        id: String(product.id),
        title: product.title,
        price: product.price,
        image: product.image,
        qty: Math.max(1, qty),
      };

      const idx = prev.findIndex((x) => x.id === p.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + p.qty };
        return copy;
      }
      return [...prev, p];
    });
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  function setQty(id, qty) {
    setItems((prev) => {
      const nextQty = Math.trunc(qty);
      if (!Number.isFinite(nextQty) || nextQty <= 0) return prev.filter((x) => x.id !== id);
      return prev.map((x) => (x.id === id ? { ...x, qty: nextQty } : x));
    });
  }

  function clearCart() {
    setItems([]);
  }

  function replaceItems(nextItems) {
    setItems(normalizeCart(nextItems));
  }

  const value = {
    items,
    cartCount,
    cartTotal,
    addItem,
    setQty,
    removeItem,
    clearCart,
    replaceItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

