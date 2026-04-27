import { Product } from "../mock/products";

export type CartLine = {
  productId: Product["id"];
  qty: number;
};

export type CartState = {
  lines: CartLine[];
};

export type CartTotals = {
  itemsCount: number;
  subtotalKM: number;
};

