import { useCallback, useEffect, useMemo, useState } from "react";
import { allProducts } from "../mock/products";
import { CartLine, CartState, CartTotals } from "./cartTypes";

const STORAGE_KEY = "original-miris:cart:v1";

function clampQty(qty: number) {
  if (!Number.isFinite(qty)) return 1;
  return Math.max(1, Math.min(99, Math.floor(qty)));
}

function safeParse(json: string | null): CartState | null {
  if (!json) return null;
  try {
    const data = JSON.parse(json);
    if (!data || typeof data !== "object") return null;
    const lines = Array.isArray(data.lines) ? data.lines : [];
    const cleaned: CartLine[] = lines
      .filter((l: any) => l && typeof l.productId === "string" && typeof l.qty === "number")
      .map((l: any) => ({ productId: l.productId, qty: clampQty(l.qty) }));
    return { lines: cleaned };
  } catch {
    return null;
  }
}

function computeTotals(state: CartState): CartTotals {
  const map = new Map(allProducts.map((p) => [p.id, p]));
  let itemsCount = 0;
  let subtotalKM = 0;
  for (const line of state.lines) {
    const p = map.get(line.productId);
    if (!p) continue;
    itemsCount += line.qty;
    subtotalKM += p.priceKM * line.qty;
  }
  return { itemsCount, subtotalKM };
}

export function useCartStore() {
  const [state, setState] = useState<CartState>(() => safeParse(localStorage.getItem(STORAGE_KEY)) ?? { lines: [] });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const totals = useMemo(() => computeTotals(state), [state]);

  const add = useCallback((productId: string, qty: number = 1) => {
    const q = clampQty(qty);
    setState((prev) => {
      const idx = prev.lines.findIndex((l) => l.productId === productId);
      if (idx === -1) return { lines: [...prev.lines, { productId, qty: q }] };
      const next = prev.lines.slice();
      next[idx] = { ...next[idx], qty: clampQty(next[idx].qty + q) };
      return { lines: next };
    });
  }, []);

  const remove = useCallback((productId: string) => {
    setState((prev) => ({ lines: prev.lines.filter((l) => l.productId !== productId) }));
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    setState((prev) => {
      const q = Math.max(0, Math.min(99, Math.floor(qty)));
      if (q <= 0) return { lines: prev.lines.filter((l) => l.productId !== productId) };
      const idx = prev.lines.findIndex((l) => l.productId === productId);
      if (idx === -1) return prev;
      const next = prev.lines.slice();
      next[idx] = { ...next[idx], qty: clampQty(q) };
      return { lines: next };
    });
  }, []);

  const clear = useCallback(() => setState({ lines: [] }), []);

  return { state, totals, add, remove, setQty, clear };
}

