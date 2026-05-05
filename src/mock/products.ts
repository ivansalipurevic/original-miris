export * from "./products.generated";
import { allProducts } from "./products.generated";
import type { Product } from "./products.generated";

/** Četiri parfema za blok „Naša preporuka“ na početnoj (id moraju postojati u allProducts). */
const STAFF_PICK_IDS = [
  "mancera-red-tobacco",
  "creed-aventus",
  "tom-ford-tobacco-vanille",
  "essential-parfums-bois-imperial",
] as const;

export const staffPickProducts: Product[] = STAFF_PICK_IDS.map((id) => allProducts.find((p) => p.id === id)).filter(
  (p): p is Product => p != null,
);
