import { createContext, PropsWithChildren, useContext } from "react";
import { useCartStore } from "./cartStore";

type CartApi = ReturnType<typeof useCartStore>;

const CartContext = createContext<CartApi | null>(null);

export function CartProvider({ children }: PropsWithChildren) {
  const api = useCartStore();
  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

