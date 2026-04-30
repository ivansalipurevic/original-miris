export type OrderItem = {
  name: string;
  qty: number;
  priceKM?: number | null;
};

export type OrderPayload = {
  customer: {
    email: string;
    fullName?: string;
    phone?: string;
    address?: string;
    city?: string;
    note?: string;
  };
  items: OrderItem[];
  totals?: {
    subtotalKM?: number;
    discountKM?: number;
    totalKM?: number;
  };
};

export async function placeOrder(payload: OrderPayload) {
  const res = await fetch("/api/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = typeof data?.error === "string" ? data.error : "Order request failed";
    throw new Error(msg);
  }
  return data as { ok: true };
}

