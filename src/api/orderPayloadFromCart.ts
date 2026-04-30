import { allProducts } from "../mock/products";
import type { CartState, CartTotals } from "../cart/cartTypes";
import type { OrderPayload } from "./placeOrder";

export function orderPayloadFromCart(input: {
  cart: CartState;
  totals: CartTotals;
  customer: OrderPayload["customer"];
}): OrderPayload {
  const map = new Map(allProducts.map((p) => [p.id, p]));
  const items = input.cart.lines
    .map((line) => {
      const p = map.get(line.productId);
      if (!p) return null;
      return { name: p.name, qty: line.qty, priceKM: p.priceKM };
    })
    .filter(Boolean);

  return {
    customer: input.customer,
    items: items as NonNullable<(typeof items)[number]>[],
    totals: {
      subtotalKM: input.totals.subtotalKM,
      discountKM: input.totals.discountKM,
      totalKM: input.totals.totalKM,
    },
  };
}

