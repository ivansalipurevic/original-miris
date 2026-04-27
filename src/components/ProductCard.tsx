import { Product } from "../mock/products";
import { Link } from "react-router-dom";
import { useCart } from "../cart/CartContext";

function formatKM(value: number) {
  return `${value.toFixed(2).replace(".", ",")} KM`;
}

export function ProductCard({ product }: { product: Product }) {
  const hasDiscount = typeof product.compareAtPriceKM === "number";
  const { add, state } = useCart();
  const isInCart = state.lines.some((l) => l.productId === product.id);

  return (
    <article className="productCard">
      <Link className="productLink" to={`/product/${product.id}`} aria-label={`Detalji: ${product.name}`}>
        {product.imageUrl ? (
          <img className="productImg" src={product.imageUrl} alt={product.name} loading="lazy" />
        ) : (
          <div className="productImgPlaceholder" aria-hidden="true" />
        )}
      </Link>

      <div className="productBody">
        <Link className="productName productNameLink" to={`/product/${product.id}`}>
          {product.name}
        </Link>

        <div className={`productPrices${hasDiscount ? " productPrices--sale" : ""}`}>
          {hasDiscount ? (
            <div className="priceSaleRow">
              <span className="priceOld">{formatKM(product.compareAtPriceKM!)}</span>
              <span className="priceNow">{formatKM(product.priceKM)}</span>
            </div>
          ) : (
            <span className="priceNow">{formatKM(product.priceKM)}</span>
          )}
        </div>

        <button className={isInCart ? "btnAdd btnAdd--added" : "btnAdd"} type="button" onClick={() => add(product.id, 1)}>
          {isInCart ? "Dodato" : "Dodaj u korpu"}
        </button>
      </div>
    </article>
  );
}

