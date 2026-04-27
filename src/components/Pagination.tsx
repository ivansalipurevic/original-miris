import { useMemo } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function range(from: number, to: number) {
  const out: number[] = [];
  for (let i = from; i <= to; i++) out.push(i);
  return out;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (nextPage: number) => void;
}) {
  const safePage = clamp(page, 1, Math.max(1, totalPages));

  const items = useMemo(() => {
    if (totalPages <= 7) return range(1, totalPages);

    const windowSize = 2;
    const start = Math.max(2, safePage - windowSize);
    const end = Math.min(totalPages - 1, safePage + windowSize);

    const pages: Array<number | "…"> = [1];
    if (start > 2) pages.push("…");
    pages.push(...range(start, end));
    if (end < totalPages - 1) pages.push("…");
    pages.push(totalPages);
    return pages;
  }, [safePage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Paginacija">
      <button
        type="button"
        className="pageBtn pageBtn--nav"
        onClick={() => onPageChange(safePage - 1)}
        disabled={safePage <= 1}
        aria-label="Prethodna stranica"
      >
        Prethodna
      </button>

      <div className="pageNums" role="list">
        {items.map((it, idx) =>
          it === "…" ? (
            <span key={`e-${idx}`} className="pageEllipsis" aria-hidden>
              …
            </span>
          ) : (
            <button
              key={it}
              type="button"
              className={it === safePage ? "pageBtn pageBtn--active" : "pageBtn"}
              onClick={() => onPageChange(it)}
              aria-current={it === safePage ? "page" : undefined}
              role="listitem"
            >
              {it}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        className="pageBtn pageBtn--nav"
        onClick={() => onPageChange(safePage + 1)}
        disabled={safePage >= totalPages}
        aria-label="Sljedeća stranica"
      >
        Sljedeća
      </button>
    </nav>
  );
}

