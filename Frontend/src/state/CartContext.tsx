import React, { createContext, useContext, useState } from "react";

/* =========================
   TYPES
========================= */
export interface Variant {
  weightLabel: string;
  weightInGrams: number;
  mrp: number;
  offerPrice: number;
}

export interface CartItem {
  productId: number;
  name: string;
  imageUrl: string;
  variants: Variant[];
  selectedVariantIndex: number;
  base100gPrice?: number;
  qty: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQty: (index: number, qty: number) => void;
  changeVariant: (index: number, variantIndex: number) => void;
  removeItem: (index: number) => void;
  clearCart: () => void; // ✅ REQUIRED
}

/* =========================
   CONTEXT
========================= */
const CartContext = createContext<CartContextType | null>(null);

/* =========================
   PROVIDER
========================= */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setItems((prev) => {
      const idx = prev.findIndex(p => p.productId === item.productId);

      if (idx !== -1) {
        const copy = [...prev];
        copy[idx].qty += item.qty;
        return copy;
      }
      return [...prev, item];
    });
  };

  const updateQty = (index: number, qty: number) => {
    setItems(prev => {
      const copy = [...prev];
      copy[index].qty = Math.max(1, qty);
      return copy;
    });
  };

  const changeVariant = (index: number, variantIndex: number) => {
    setItems(prev => {
      const copy = [...prev];
      copy[index].selectedVariantIndex = variantIndex;
      return copy;
    });
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQty,
        changeVariant,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}