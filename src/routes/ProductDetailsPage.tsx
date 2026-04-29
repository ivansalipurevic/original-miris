import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { allProducts } from "../mock/products";
import { useCart } from "../cart/CartContext";

function formatKM(value: number) {
  return `${value.toFixed(2).replace(".", ",")} KM`;
}

function splitNotes(text: string) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const sections: Array<{ title: string; items: string[] }> = [];
  let current: { title: string; items: string[] } | null = null;

  function pushCurrent() {
    if (current && (current.items.length || current.title)) sections.push(current);
    current = null;
  }

  for (const line of lines) {
    const isHeading =
      /^(gornje|srednje|bazne)\s+note$/i.test(line) ||
      /^(top|middle|heart|base)\s+notes$/i.test(line) ||
      /^(gornje|srednje|bazne)\s+note:?$/i.test(line);

    if (isHeading) {
      pushCurrent();
      current = { title: line.toUpperCase().replace(/:$/, ""), items: [] };
      continue;
    }

    if (!current) current = { title: "", items: [] };

    // split comma separated values into clean list items
    const parts = line
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length >= 2) current.items.push(...parts);
    else current.items.push(line);
  }

  pushCurrent();

  // If no headings detected, return single section
  if (!sections.some((s) => s.title)) return [{ title: "", items: lines }];
  return sections;
}

export function ProductDetailsPage() {
  const { handle } = useParams();
  const { add, state } = useCart();

  const product = useMemo(() => allProducts.find((p) => p.id === handle), [handle]);
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="page">
        <div className="pageHeader">
          <h1>Proizvod nije pronađen</h1>
        </div>
        <Link className="btnGhost" to="/products">
          Nazad na proizvode
        </Link>
      </div>
    );
  }

  const hasDiscount = typeof product.compareAtPriceKM === "number";
  const savingsKM = hasDiscount ? Math.max(0, (product.compareAtPriceKM ?? 0) - product.priceKM) : 0;
  const savingsPct = hasDiscount && product.compareAtPriceKM ? Math.round((savingsKM / product.compareAtPriceKM) * 100) : 0;
  const isInCart = state.lines.some((l) => l.productId === product.id);
  const safeQty = Math.max(1, Math.min(99, Math.floor(qty || 1)));

  return (
    <div className="page page--details">
      <div className="details">
        <section className="detailsMedia">
          <div className="detailsCrumbs">
            <Link className="crumb" to="/">
              Početna
            </Link>
            <span className="crumbSep" aria-hidden>
              /
            </span>
            <Link className="crumb" to="/products">
              Svi proizvodi
            </Link>
            <span className="crumbSep" aria-hidden>
              /
            </span>
            <span className="crumbCurrent">{product.name}</span>
          </div>

          {product.imageUrl ? (
            <img className="detailsImg" src={product.imageUrl} alt={product.name} />
          ) : (
            <div className="productImgPlaceholder" aria-hidden />
          )}
        </section>

        <aside className="detailsBuy">
          <div className="detailsSticky">
            {product.brand ? <div className="detailsBrand">{product.brand}</div> : null}
            <h1 className="detailsTitle">{product.name}</h1>
            {product.sizeML ? (
              <div className="detailsMetaRow" aria-label="Detalji proizvoda">
                <div className="detailsMetaPill">{product.sizeML} ml</div>
              </div>
            ) : null}

            <div className="detailsPriceRow">
              <div className={hasDiscount ? "detailsPrices detailsPrices--sale" : "detailsPrices"}>
                {hasDiscount ? (
                  <>
                    <div className="priceOld" aria-label={`Stara cijena: ${formatKM(product.compareAtPriceKM!)}`}>
                      {formatKM(product.compareAtPriceKM!)}
                    </div>
                    <div className="priceNow" aria-label={`Snižena cijena: ${formatKM(product.priceKM)}`}>
                      {formatKM(product.priceKM)}
                    </div>
                  </>
                ) : (
                  <div className="priceNow" aria-label={`Cijena: ${formatKM(product.priceKM)}`}>
                    {formatKM(product.priceKM)}
                  </div>
                )}
              </div>
              {hasDiscount ? (
                <div className="detailsSavePill" title={`Ušteda: ${formatKM(savingsKM)}`}>
                  -{savingsPct}% ({formatKM(savingsKM)})
                </div>
              ) : null}
            </div>

            <div className="detailsBuyActions" aria-label="Kupovina">
              <div className="detailsQty" aria-label="Količina">
                <button
                  className="qtyBtn"
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, Math.floor((q || 1) - 1)))}
                  aria-label="Smanji količinu"
                >
                  −
                </button>
                <div className="qtyVal" aria-label={`Količina: ${safeQty}`}>
                  {safeQty}
                </div>
                <button
                  className="qtyBtn"
                  type="button"
                  onClick={() => setQty((q) => Math.min(99, Math.floor((q || 1) + 1)))}
                  aria-label="Povećaj količinu"
                >
                  +
                </button>
              </div>

              <button
                className={isInCart ? "detailsAdd detailsAdd--added" : "detailsAdd"}
                type="button"
                onClick={() => add(product.id, safeQty)}
                disabled={false}
              >
                {isInCart ? `Dodaj još (x${safeQty})` : `Dodaj u korpu (x${safeQty})`}
              </button>
            </div>

            <div className="detailsTrust">
              <div className="trustItem">
                <span className="trustDot" aria-hidden />
                Brza isporuka 1–3 radna dana
              </div>
              <div className="trustItem">
                <span className="trustDot" aria-hidden />
                Plaćanje pouzećem ili karticom
              </div>
              <div className="trustItem">
                <span className="trustDot" aria-hidden />
                1000+ zadovoljnih kupaca
              </div>
            </div>

            <div className="detailsBox">
              <div className="detailsBoxTitle">Opis proizvoda</div>
              <div className="detailsDesc">
                {product.description ? (
                  <div className="detailsNotes">
                    {splitNotes(product.description).map((sec, idx) => (
                      <div key={`${idx}-${sec.title}`} className="noteSection">
                        {sec.title ? <div className="noteTitle">{sec.title}</div> : null}
                        <ul className="noteList">
                          {sec.items.map((it) => (
                            <li key={`${sec.title}-${it}`}>{it}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="muted">Opis nije dostupan.</p>
                )}
              </div>
            </div>

            <div className="detailsBox detailsBox--muted">
              <div className="detailsInfoGrid">
                <div className="infoRow">
                  <div className="infoKey">Dostava</div>
                  <div className="infoVal">
                    Dostava je{" "}
                    <span className="infoEmph">besplatna</span> za narudžbe preko{" "}
                    <span className="infoHighlight">150 KM</span>.
                  </div>
                </div>
                <div className="infoRow">
                  <div className="infoKey">Povrat</div>
                  <div className="infoVal">
                    Detalji povrata i reklamacija su u{" "}
                    <Link className="inlineLink" to="/policies/uslovi-i-pravila">
                      Uslovima i pravilima
                    </Link>
                    .
                  </div>
                </div>
              </div>
              <div className="detailsInfoCtas" aria-label="Korisni linkovi">
                <Link className="detailsCta" to="/utisci">
                  Utisci
                </Link>
                <Link className="detailsCta detailsCta--ghost" to="/policies/uslovi-i-pravila">
                  Uslovi i pravila
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="detailsMobileBar" role="region" aria-label="Kupovina">
        <div className="detailsMobileBarInner">
          <div className="detailsMobilePrice">
            {hasDiscount ? (
              <>
                <div className="priceOld">{formatKM(product.compareAtPriceKM!)}</div>
                <div className="priceNow">{formatKM(product.priceKM)}</div>
              </>
            ) : (
              <div className="priceNow">{formatKM(product.priceKM)}</div>
            )}
          </div>
          <div className="detailsMobileQty" aria-label="Količina">
            <button
              className="qtyBtn"
              type="button"
              onClick={() => setQty((q) => Math.max(1, Math.floor((q || 1) - 1)))}
              aria-label="Smanji količinu"
            >
              −
            </button>
            <div className="qtyVal" aria-label={`Količina: ${safeQty}`}>
              {safeQty}
            </div>
            <button
              className="qtyBtn"
              type="button"
              onClick={() => setQty((q) => Math.min(99, Math.floor((q || 1) + 1)))}
              aria-label="Povećaj količinu"
            >
              +
            </button>
          </div>
          <button
            className={isInCart ? "detailsAdd detailsAdd--added" : "detailsAdd"}
            type="button"
            onClick={() => add(product.id, safeQty)}
            disabled={false}
          >
            {isInCart ? `Dodaj x${safeQty}` : `Dodaj x${safeQty}`}
          </button>
        </div>
      </div>
    </div>
  );
}

