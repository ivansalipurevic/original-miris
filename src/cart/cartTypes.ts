import { Product } from "../mock/products";

export type CartLine = {
  productId: Product["id"];
  qty: number;
  addedAt: number;
};

export type CartState = {
  lines: CartLine[];
};

export type CartTotals = {
  itemsCount: number;
  subtotalKM: number;
  discountKM: number;
  /** Koji proizvod dobija −50% na 1 kom (pri ≥2 artikla: uvijek linija s najnižom jediničnom cijenom). */
  discountProductId: string | null;
  /** EuroExpress kada je neto (subtotal − popust) < 150 KM i ima stavki; inače 0. */
  shippingKM: number;
  totalKM: number;
};

