import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const WishlistCtx = createContext();

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    const raw = localStorage.getItem('wishlist');
    return raw ? JSON.parse(raw) : [];
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }, [items]);

  const add = (product) => {
    setItems((prev) => (prev.find((p) => p._id === product._id) ? prev : [...prev, product]));
  };
  const remove = (id) => setItems((prev) => prev.filter((p) => p._id !== id));
  const toggle = (product) => {
    setItems((prev) => (prev.find((p) => p._id === product._id) ? prev.filter((p) => p._id !== product._id) : [...prev, product]));
  };
  const has = (id) => items.some((p) => p._id === id);
  const count = useMemo(() => items.length, [items]);

  return (
    <WishlistCtx.Provider value={{ items, add, remove, toggle, has, count }}>
      {children}
    </WishlistCtx.Provider>
  );
}

export const useWishlist = () => useContext(WishlistCtx);