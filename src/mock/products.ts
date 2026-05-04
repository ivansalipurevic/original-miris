export * from "./products.generated";
import { allProducts } from "./products.generated";
import type { Product } from "./products.generated";

/** Četiri parfema za blok „Naša preporuka“ na početnoj (id moraju postojati u allProducts). */
const STAFF_PICK_IDS = [
  "maison-francis-kurkdjian-baccarat-rouge-540-edp",
  "creed-aventus",
  "tom-ford-tobacco-vanille",
  "miss-dior-cherie-eau-de-parfum",
] as const;

export const staffPickProducts: Product[] = STAFF_PICK_IDS.map((id) => allProducts.find((p) => p.id === id)).filter(
  (p): p is Product => p != null,
);
