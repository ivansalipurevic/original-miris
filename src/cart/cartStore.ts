import { useCallback, useEffect, useMemo, useState } from "react";
import { allProducts } from "../mock/products";
import { CartLine, CartState, CartTotals } from "./cartTypes";

const STORAGE_KEY = "original-miris:cart:v2";

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
      .map((l: any, idx: number) => ({
        productId: l.productId,
        qty: clampQty(l.qty),
        addedAt: typeof l.addedAt === "number" ? l.addedAt : Date.now() + idx,
      }));
    return { lines: cleaned };
  } catch {
    return null;
  }
}

const FREE_SHIPPING_FROM_MERCHANDISE_KM = 150;
const SHIPPING_EUROEXPRESS_KM = 12;

function computeTotals(state: CartState): CartTotals {
  const map = new Map(allProducts.map((p) => [p.id, p]));
  let itemsCount = 0;
  let subtotalKM = 0;
  let discountKM = 0;
  let discountProductId: string | null = null;

  type LineAgg = { productId: string; priceKM: number };
  const byProductMinPrice: LineAgg[] = [];
  for (const line of state.lines) {
    const p = map.get(line.productId);
    if (!p) continue;
    itemsCount += line.qty;
    subtotalKM += p.priceKM * line.qty;
    byProductMinPrice.push({ productId: line.productId, priceKM: p.priceKM });
  }

  // Promo: 50% na 1 kom najjeftinijeg parfema kada je u korpi 2+ artikla.
  if (itemsCount >= 2 && byProductMinPrice.length) {
    let minUnit = Infinity;
    for (const row of byProductMinPrice) minUnit = Math.min(minUnit, row.priceKM);
    const tied = byProductMinPrice.filter((r) => r.priceKM === minUnit).map((r) => r.productId);
    discountProductId = tied.sort()[0] ?? null;
    const p = discountProductId ? map.get(discountProductId) : undefined;
    if (p) discountKM = p.priceKM * 0.5;
  }

  const merchandiseKM = Math.max(0, subtotalKM - discountKM);
  const shippingKM =
    merchandiseKM > 0 && merchandiseKM < FREE_SHIPPING_FROM_MERCHANDISE_KM ? SHIPPING_EUROEXPRESS_KM : 0;
  const totalKM = merchandiseKM + shippingKM;
  return { itemsCount, subtotalKM, discountKM, discountProductId, shippingKM, totalKM };
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
      if (idx === -1) return { lines: [...prev.lines, { productId, qty: q, addedAt: Date.now() }] };
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

