import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { FiltersPanel, FiltersState } from "../components/FiltersPanel";
import { Pagination } from "../components/Pagination";
import { ProductGrid } from "../components/ProductGrid";
import { allProducts, mensProducts, womensProducts } from "../mock/products";

export type ProductsMode = "all" | "za_nju" | "za_njega";

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

  const defaultFilters = useMemo<FiltersState>(
    () => ({ minPrice: 0, maxPrice: Math.max(0, Math.ceil(maxKnownPrice)) }),
    [maxKnownPrice],
  );
  const [filters, setFilters] = useState<FiltersState>(defaultFilters);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const q = searchParams.get("q") ?? "";
  const prevCatalogPath = useRef<string | null>(null);

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
    const min = Number.isFinite(filters.minPrice) ? filters.minPrice : 0;
    const max = Number.isFinite(filters.maxPrice) ? filters.maxPrice : Math.ceil(maxKnownPrice);
    const needle = q.trim().toLowerCase();

    return products.filter((p) => {
      if (needle) {
        const hay = `${p.name ?? ""} ${p.brand ?? ""} ${p.description ?? ""}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      if (p.priceKM < min) return false;
      if (p.priceKM > max) return false;
      return true;
    });
  }, [products, filters, q, maxKnownPrice]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE)),
    [filteredProducts.length],
  );

  const page = Math.min(pageFromUrl, totalPages);

  useEffect(() => {
    const p = location.pathname;
    if (prevCatalogPath.current !== null && prevCatalogPath.current !== p) {
      setSearchParams((sp) => {
        const next = new URLSearchParams(sp);
        next.set("page", "1");
        next.delete("q");
        return next;
      });
      setFilters({ minPrice: 0, maxPrice: defaultFilters.maxPrice });
    }
    prevCatalogPath.current = p;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, defaultFilters.maxPrice]);

  useEffect(() => {
    // keep slider bounds in sync when dataset changes
    setFilters((prev) => {
      const max = defaultFilters.maxPrice;
      const nextMin = Math.max(0, Math.min(prev.minPrice, max));
      const nextMax = Math.max(nextMin, Math.min(prev.maxPrice, max));
      if (nextMin === prev.minPrice && nextMax === prev.maxPrice) return prev;
      return { minPrice: nextMin, maxPrice: nextMax };
    });
  }, [defaultFilters.maxPrice]);

  const pagedProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, page]);

  return (
    <div className="page">
      <div className="pageHeader">
        <h1>{title}</h1>
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

