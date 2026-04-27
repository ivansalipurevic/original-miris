export type FiltersState = {
  minPrice: number;
  maxPrice: number;
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
  const max = Math.max(0, Math.ceil(maxKnownPrice));
  const minValue = Math.max(0, Math.min(state.minPrice, state.maxPrice));
  const maxValue = Math.max(0, Math.max(state.minPrice, state.maxPrice));
  const minPct = max > 0 ? (minValue / max) * 100 : 0;
  const maxPct = max > 0 ? (maxValue / max) * 100 : 0;

  return (
    <div className="filters filtersPremium">
      <div className="filtersHeader">
        <div className="filtersTitle">Filteri</div>
        <button className="filtersClearLink" type="button" onClick={onClear}>
          Očisti
        </button>
      </div>

      <div className="filterBlock">
        <div className="filterTitle">Cijena (KM)</div>
        <div className="priceValues">
          <div className="pricePill">
            <span className="muted">Od</span> <strong>{minValue.toFixed(0)} KM</strong>
          </div>
          <div className="pricePill">
            <span className="muted">Do</span> <strong>{maxValue.toFixed(0)} KM</strong>
          </div>
        </div>

        <div
          className="priceSlider"
          style={
            {
              "--minPct": `${minPct}%`,
              "--maxPct": `${maxPct}%`,
            } as any
          }
        >
          <input
            aria-label="Minimalna cijena"
            className="priceRange"
            type="range"
            min={0}
            max={max}
            step={1}
            value={minValue}
            onChange={(e) => {
              const v = Math.max(0, Math.min(Number(e.target.value), maxValue));
              onChange({ ...state, minPrice: v });
            }}
          />
          <input
            aria-label="Maksimalna cijena"
            className="priceRange"
            type="range"
            min={0}
            max={max}
            step={1}
            value={maxValue}
            onChange={(e) => {
              const v = Math.max(minValue, Math.min(Number(e.target.value), max));
              onChange({ ...state, maxPrice: v });
            }}
          />
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

