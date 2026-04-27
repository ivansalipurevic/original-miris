import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiltersPanel, FiltersState } from "../components/FiltersPanel";
import { Pagination } from "../components/Pagination";
import { ProductGrid } from "../components/ProductGrid";
import { SortSelect } from "../components/SortSelect";
import { allProducts, mensProducts, womensProducts } from "../mock/products";

export type ProductsMode = "all" | "za_nju" | "za_njega";

const defaultFilters: FiltersState = {
  inStock: false,
  outOfStock: false,
  minPrice: "",
  maxPrice: "",
};

function parsePrice(input: string): number | null {
  const normalized = input.replace(",", ".").trim();
  if (!normalized) return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

export function ProductsPage({ mode }: { mode: ProductsMode }) {
  const PAGE_SIZE = 16;
  const title =
    mode === "all"
      ? "Svi proizvodi"
      : mode === "za_nju"
        ? "Za nju"
        : "Za njega";

  const products =
    mode === "all" ? allProducts : mode === "za_nju" ? womensProducts : mensProducts;

  const maxKnownPrice = useMemo(() => {
    const m = products.reduce((acc, p) => (p.priceKM > acc ? p.priceKM : acc), 0);
    return Math.max(0, m);
  }, [products]);

  const [filters, setFilters] = useState<FiltersState>(defaultFilters);
  const [searchParams, setSearchParams] = useSearchParams();

  function setPage(nextPage: number) {
    const safe = Math.max(1, Math.min(totalPages, nextPage));
    const next = new URLSearchParams(searchParams);
    next.set("page", String(safe));
    setSearchParams(next);
  }

  const pageFromUrl = useMemo(() => {
    const raw = searchParams.get("page") ?? "1";
    const n = Number(raw);
    return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    const min = parsePrice(filters.minPrice);
    const max = parsePrice(filters.maxPrice);

    return products.filter((p) => {
      if (filters.inStock || filters.outOfStock) {
        const ok =
          (filters.inStock && p.available === true) ||
          (filters.outOfStock && p.available === false);
        if (!ok) return false;
      }
      if (min !== null && p.priceKM < min) return false;
      if (max !== null && p.priceKM > max) return false;
      return true;
    });
  }, [products, filters]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE)),
    [filteredProducts.length],
  );

  const page = Math.min(pageFromUrl, totalPages);

  useEffect(() => {
    // when switching between All/Women/Men, jump back to page 1
    const next = new URLSearchParams(searchParams);
    next.set("page", "1");
    setSearchParams(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const pagedProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, page]);

  return (
    <div className="page">
      <div className="pageHeader">
        <h1>{title}</h1>
        <div className="pageHeaderMeta">
          <div className="muted">{filteredProducts.length} artikala</div>
          <SortSelect />
        </div>
      </div>

      <div className="catalog">
        <aside className="catalogSidebar">
          <FiltersPanel
            state={filters}
            maxKnownPrice={maxKnownPrice}
            resultsCount={filteredProducts.length}
            onChange={(next) => {
              setFilters(next);
              const p = new URLSearchParams(searchParams);
              p.set("page", "1");
              setSearchParams(p);
            }}
            onClear={() => {
              setFilters(defaultFilters);
              const p = new URLSearchParams(searchParams);
              p.set("page", "1");
              setSearchParams(p);
            }}
          />
        </aside>
        <section className="catalogMain">
          <ProductGrid products={pagedProducts} />
          <div className="catalogPager">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={(next) => {
                setPage(next);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

