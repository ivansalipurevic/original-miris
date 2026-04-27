export type FiltersState = {
  inStock: boolean;
  outOfStock: boolean;
  minPrice: string;
  maxPrice: string;
};

export function FiltersPanel({
  state,
  maxKnownPrice,
  resultsCount,
  onChange,
  onClear,
}: {
  state: FiltersState;
  maxKnownPrice: number;
  resultsCount: number;
  onChange: (next: FiltersState) => void;
  onClear: () => void;
}) {
  return (
    <div className="filters filtersPremium">
      <div className="filtersHeader">
        <div className="filtersTitle">Filteri</div>
        <button className="filtersClearLink" type="button" onClick={onClear}>
          Očisti
        </button>
      </div>

      <div className="filterBlock">
        <div className="filterTitle">Dostupnost</div>
        <label className="checkRow">
          <input
            className="filterCheckbox"
            type="checkbox"
            checked={state.outOfStock}
            onChange={(e) => onChange({ ...state, outOfStock: e.target.checked })}
          />
          <span className="checkLabel">Nema na stanju</span>
        </label>
        <label className="checkRow">
          <input
            className="filterCheckbox"
            type="checkbox"
            checked={state.inStock}
            onChange={(e) => onChange({ ...state, inStock: e.target.checked })}
          />
          <span className="checkLabel">Na stanju</span>
        </label>
      </div>

      <div className="filterBlock">
        <div className="filterTitle">Cijena (KM)</div>
        <div className="rangeRow">
          <div className="rangeField">
            <label className="rangeLabel muted" htmlFor="filter-min">
              Od
            </label>
            <input
              id="filter-min"
              className="filterInput"
              inputMode="decimal"
              placeholder="0"
              value={state.minPrice}
              onChange={(e) => onChange({ ...state, minPrice: e.target.value })}
            />
          </div>
          <div className="rangeSep muted" aria-hidden="true">
            —
          </div>
          <div className="rangeField">
            <label className="rangeLabel muted" htmlFor="filter-max">
              Do
            </label>
            <input
              id="filter-max"
              className="filterInput"
              inputMode="decimal"
              placeholder={maxKnownPrice.toFixed(2).replace(".", ",")}
              value={state.maxPrice}
              onChange={(e) => onChange({ ...state, maxPrice: e.target.value })}
            />
          </div>
        </div>
        <div className="muted small filterHint">
          Najviša cijena u ovoj listi: {maxKnownPrice.toFixed(2).replace(".", ",")} KM
        </div>
      </div>

      <div className="filtersFooter">
        <span className="filtersCount">{resultsCount}</span>
        <span className="filtersCountLabel">artikala odgovara filterima</span>
      </div>

      <button className="filtersResetBtn" type="button" onClick={onClear}>
        Očisti sve filtere
      </button>
    </div>
  );
}

