const options = [
  "Featured",
  "Most relevant",
  "Najpopularniji",
  "Abeceda, A-Z",
  "Abeceda, Z-A",
  "Cijena, od najmanje ka najvećoj",
  "Cijena, od najveće ka najmanjoj",
  "Datum, starije ka novijem",
  "Datum, novije ka starijem",
];

export function SortSelect() {
  return (
    <label className="sort">
      <span className="muted">Sortiraj</span>
      <select disabled defaultValue={options[2]}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

