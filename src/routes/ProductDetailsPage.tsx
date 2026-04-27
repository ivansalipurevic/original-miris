import { Link, useParams } from "react-router-dom";
import { useMemo } from "react";
import { allProducts } from "../mock/products";
import { useCart } from "../cart/CartContext";

function formatKM(value: number) {
  return `${value.toFixed(2).replace(".", ",")} KM`;
}

export function ProductDetailsPage() {
  const { handle } = useParams();
  const { add, state } = useCart();

  const product = useMemo(() => allProducts.find((p) => p.id === handle), [handle]);

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

  return (
    <div className="page">
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

            <div className="detailsPriceRow">
              <div className={hasDiscount ? "detailsPrices detailsPrices--sale" : "detailsPrices"}>
                {hasDiscount ? (
                  <>
                    <div className="priceOld">{formatKM(product.compareAtPriceKM!)}</div>
                    <div className="priceNow">{formatKM(product.priceKM)}</div>
                  </>
                ) : (
                  <div className="priceNow">{formatKM(product.priceKM)}</div>
                )}
              </div>
              {hasDiscount ? (
                <div className="detailsSavePill" title={`Ušteda: ${formatKM(savingsKM)}`}>
                  -{savingsPct}% ({formatKM(savingsKM)})
                </div>
              ) : null}
            </div>

            <button
              className={isInCart ? "detailsAdd detailsAdd--added" : "detailsAdd"}
              type="button"
              onClick={() => add(product.id, 1)}
              disabled={false}
            >
              {isInCart ? "Dodato u korpu" : "Dodaj u korpu"}
            </button>

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
                Podrška: Kontakt stranica
              </div>
            </div>

            <div className="detailsBox">
              <div className="detailsBoxTitle">Opis proizvoda</div>
              <div className="detailsDesc">
                {product.description ? (
                  product.description.split("\n").map((line, idx) =>
                    line.trim() ? (
                      <p key={`${idx}-${line}`}>{line}</p>
                    ) : (
                      <div key={`sp-${idx}`} style={{ height: 8 }} />
                    ),
                  )
                ) : (
                  <p className="muted">Opis nije dostupan.</p>
                )}
              </div>
            </div>

            <div className="detailsBox detailsBox--muted">
              <div className="detailsInfoGrid">
                <div className="infoRow">
                  <div className="infoKey">Dostava</div>
                  <div className="infoVal">Za narudžbe iznad 150 KM dostava je besplatna.</div>
                </div>
                <div className="infoRow">
                  <div className="infoKey">Povrat</div>
                  <div className="infoVal">Pogledaj uslove u “Uslovi i pravila”.</div>
                </div>
              </div>
              <div className="detailsInfoLinks">
                <Link className="detailsMiniLink" to="/contact">
                  Kontakt
                </Link>
                <span className="miniSep" aria-hidden>
                  ·
                </span>
                <Link className="detailsMiniLink" to="/policies/uslovi-i-pravila">
                  Uslovi i pravila
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

