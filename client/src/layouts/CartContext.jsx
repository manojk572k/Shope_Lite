import React, { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // {id, title, price, qty}

  function addToCart(product) {
    setItems((prev) => {
      const found = prev.find((x) => x.id === product.id);
      if (found) {
        return prev.map((x) => (x.id === product.id ? { ...x, qty: x.qty + 1 } : x));
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }

  function removeFromCart(id) {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  function changeQty(id, qty) {
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, qty: Math.max(1, qty) } : x))
    );
  }

  function clearCart() {
    setItems([]);
  }

  const total = useMemo(
    () => items.reduce((sum, x) => sum + x.price * x.qty, 0),
    [items]
  );

  const value = useMemo(
    () => ({ items, addToCart, removeFromCart, changeQty, clearCart, total }),
    [items, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
