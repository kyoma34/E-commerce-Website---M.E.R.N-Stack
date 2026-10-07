import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const save = (next) => {
    setItems(next);
    localStorage.setItem("cart", JSON.stringify(next));
  };

  const addItem = (product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      const next = existing
        ? prev.map((i) => i._id === product._id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...product, qty: 1 }];
      localStorage.setItem("cart", JSON.stringify(next));
      return next;
    });
  };

  const removeItem = (id) => {
    const next = items.filter((i) => i._id !== id);
    save(next);
  };

  const updateQty = (id, qty) => {
    if (qty < 1) { removeItem(id); return; }
    const next = items.map((i) => i._id === id ? { ...i, qty } : i);
    save(next);
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("cart");
  };

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}