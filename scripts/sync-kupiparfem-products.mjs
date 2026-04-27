import { writeFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";

const BASE = "https://kupiparfem.com";

async function fetchJson(path, { retries = 4 } = {}) {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;
  let lastErr;
  for (let i = 0; i <= retries; i++) {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch(url, {
        headers: {
          "user-agent": "original-miris (static UI sync script)",
          accept: "application/json,text/plain,*/*",
        },
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      return await res.json();
    } catch (e) {
      lastErr = e;
      await delay(650 * (i + 1));
    } finally {
      clearTimeout(t);
    }
  }
  throw lastErr;
}

function asNumber(n) {
  const v = Number(n);
  return Number.isFinite(v) ? v : null;
}

function kmFromCentsOrString(n) {
  // Shopify JSON sometimes returns strings like "123.00"
  const v = asNumber(n);
  if (v === null) return null;
  return v;
}

async function fetchAllProducts() {
  const first = await fetchJson("/products.json?limit=250");
  let products = first.products ?? [];

  // If paging exists, keep going until empty.
  for (let page = 2; page < 50; page++) {
    const next = await fetchJson(`/products.json?limit=250&page=${page}`);
    const batch = next.products ?? [];
    if (!batch.length) break;
    products = products.concat(batch);
  }
  return products;
}

async function fetchCollectionHandles(handle) {
  let out = [];
  for (let page = 1; page < 50; page++) {
    const json = await fetchJson(`/collections/${handle}/products.json?limit=250&page=${page}`);
    const products = json.products ?? [];
    if (!products.length) break;
    out = out.concat(products);
  }
  return new Set(out.map((p) => p.handle).filter(Boolean));
}

async function fetchProductDetailsByHandle(handle) {
  // Shopify storefront endpoint includes the same description users see on the product page.
  // Returns { description, images, featured_image, vendor, available, variants... }
  return await fetchJson(`/products/${handle}.js`);
}

function toTSString(s) {
  return JSON.stringify(s);
}

function pickPrice(product) {
  const v = product?.variants?.[0];
  const price = kmFromCentsOrString(v?.price);
  const compare = kmFromCentsOrString(v?.compare_at_price);
  return { priceKM: price ?? 0, compareAtPriceKM: compare ?? undefined };
}

function pickAvailable(product) {
  const v = product?.variants?.[0];
  if (typeof v?.available === "boolean") return v.available;
  return Boolean(product?.available);
}

function pickImage(product) {
  const img = product?.image?.src || product?.images?.[0]?.src || null;
  return img ?? undefined;
}

function stripHtml(html) {
  if (!html) return "";
  return String(html)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let i = 0;
  const workers = Array.from({ length: Math.max(1, limit) }, async () => {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  });
  await Promise.all(workers);
  return results;
}

async function main() {
  const [all, zaNju, zaNjega] = await Promise.all([
    fetchAllProducts(),
    fetchCollectionHandles("za-nju"),
    fetchCollectionHandles("muska-kolekcija"),
  ]);

  const handles = all.map((p) => p.handle).filter(Boolean);
  const detailsByHandle = new Map();
  const details = await mapLimit(handles, 8, async (handle) => {
    try {
      const d = await fetchProductDetailsByHandle(handle);
      return { handle, d };
    } catch (e) {
      return { handle, d: null };
    }
  });
  for (const { handle, d } of details) detailsByHandle.set(handle, d);

  const rows = [];
  for (const prod of all) {
    const { priceKM, compareAtPriceKM } = pickPrice(prod);
    const handle = prod.handle;
    const details = handle ? detailsByHandle.get(handle) : null;

    const available = true;
    const imageUrl = details?.featured_image
      ? `https:${String(details.featured_image).startsWith("//") ? details.featured_image : details.featured_image}`
      : pickImage(prod);

    const descriptionHtml = details?.description ?? prod?.body_html;
    const description = stripHtml(descriptionHtml);
    const brand = details?.vendor ? String(details.vendor) : prod?.vendor ? String(prod.vendor) : undefined;

    // map to collection based on actual collection membership
    // if in both, use a simple name heuristic to avoid misclassification
    const inMens = zaNjega.has(handle);
    const inWomens = zaNju.has(handle);
    const title = String(prod.title || "").toLowerCase();
    const looksWomens = /\b(woman|women|femme|pour femme|donna|for her|her)\b/i.test(title);
    const collection =
      inMens && !inWomens
        ? "za_njega"
        : inWomens && !inMens
          ? "za_nju"
          : inMens && inWomens
            ? looksWomens
              ? "za_nju"
              : "za_njega"
            : "za_nju";
    rows.push({
      id: String(handle || prod.id),
      name: String(prod.title || handle),
      description,
      brand,
      priceKM,
      compareAtPriceKM,
      available,
      collection,
      imageUrl,
    });
  }

  const out = `/* eslint-disable */
// AUTO-GENERATED by scripts/sync-kupiparfem-products.mjs
// Source: ${BASE} (Shopify products.json)
export type CollectionKey = "za_nju" | "za_njega";

export type Product = {
  id: string;
  name: string;
  description: string;
  brand?: string;
  priceKM: number;
  compareAtPriceKM?: number;
  available: boolean;
  collection: CollectionKey;
  imageUrl?: string;
};

export const allProducts: Product[] = [
${rows
  .map((r) => {
    const parts = [
      `id: ${toTSString(r.id)}`,
      `name: ${toTSString(r.name)}`,
      `description: ${toTSString(r.description ?? "")}`,
      r.brand ? `brand: ${toTSString(r.brand)}` : null,
      `priceKM: ${Number(r.priceKM)}`,
      r.compareAtPriceKM ? `compareAtPriceKM: ${Number(r.compareAtPriceKM)}` : null,
      `available: ${Boolean(r.available)}`,
      `collection: ${toTSString(r.collection)}`,
      r.imageUrl ? `imageUrl: ${toTSString(r.imageUrl)}` : null,
    ].filter(Boolean);
    return `  { ${parts.join(", ")} },`;
  })
  .join("\n")}
];

export const womensProducts = allProducts.filter((x) => x.collection === "za_nju");
export const mensProducts = allProducts.filter((x) => x.collection === "za_njega");
export const discountedProducts = allProducts.filter((x) => typeof x.compareAtPriceKM === "number");
`;

  await writeFile(new URL("../src/mock/products.generated.ts", import.meta.url), out, "utf8");
  console.log(`Generated ${rows.length} products -> src/mock/products.generated.ts`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

