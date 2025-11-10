import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartCtx = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const raw = localStorage.getItem('cart');
    return raw ? JSON.parse(raw) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const add = (product, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((p) => p._id === product._id);
      if (found) return prev.map((p) => (p._id === product._id ? { ...p, quantity: p.quantity + qty } : p));
      return [...prev, { ...product, quantity: qty }];
    });
  };
  const remove = (id) => setItems((prev) => prev.filter((p) => p._id !== id));
  const update = (id, qty) => setItems((prev) => prev.map((p) => (p._id === id ? { ...p, quantity: qty } : p)));
  const clear = () => setItems([]);

  const cartCount = useMemo(() => items.reduce((s, it) => s + it.quantity, 0), [items]);
  const total = useMemo(() => items.reduce((s, it) => s + it.quantity * (it.price || 0), 0), [items]);

  return (
    <CartCtx.Provider value={{ items, add, remove, update, clear, cartCount, total }}>
      {children}
    </CartCtx.Provider>
  );
}

export const useCart = () => useContext(CartCtx);