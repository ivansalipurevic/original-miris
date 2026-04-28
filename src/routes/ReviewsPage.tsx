import { Link } from "react-router-dom";

type Review = {
  name: string;
  city: string;
  rating: number;
  text: string;
  badge?: string;
};

const reviews: Review[] = [
  {
    name: "Amina",
    city: "Sarajevo",
    rating: 5,
    badge: "Brza dostava",
    text: "Parfem je došao uredno zapakovan, miris traje cijeli dan. Isporuka za 2 dana — sve preporuke.",
  },
  {
    name: "Marko",
    city: "Banja Luka",
    rating: 5,
    badge: "Original",
    text: "Uzeo sam 2 parfema i oba su top. Sve kao što je opisano, bez ikakvih iznenađenja.",
  },
  {
    name: "Lejla",
    city: "Tuzla",
    rating: 5,
    badge: "Pakovanje",
    text: "Pakovanje je premium, a miris identičan kao u parfimeriji. Definitivno naručujem opet.",
  },
  {
    name: "Nikola",
    city: "Mostar",
    rating: 5,
    badge: "Pouzećem",
    text: "Naručio sam pouzećem — sve prošlo glatko. Kurir ljubazan, parfem vrhunski.",
  },
  {
    name: "Selma",
    city: "Zenica",
    rating: 5,
    badge: "Preporuka",
    text: "Prvi put naručujem online parfem i baš sam zadovoljna. Cijena super, miris dugo traje.",
  },
  {
    name: "Adnan",
    city: "Bihać",
    rating: 5,
    badge: "Popust",
    text: "Akcija za drugi parfem mi je spasila budžet. Kvalitet 10/10, isporuka brza.",
  },
];

function Stars({ count }: { count: number }) {
  const full = Math.max(0, Math.min(5, count));
  return (
    <div className="stars" aria-label={`${full} od 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < full ? "star star--on" : "star"} aria-hidden="true">
          ★
        </span>
      ))}
    </div>
  );
}

export function ReviewsPage() {
  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <p className="reviewsEyebrow">Utisci kupaca</p>
          <h1>1000+ zadovoljnih kupaca</h1>
        </div>
        <div className="pageHeaderMeta">
          <Link className="btnGhost" to="/products">
            Pogledaj ponudu
          </Link>
        </div>
      </div>

      <section className="reviewsHero">
        <div className="reviewsHeroCard">
          <div className="reviewsHeroTop">
            <div className="reviewsScore">
              <div className="reviewsScoreNum">4,9</div>
              <div className="reviewsScoreMeta">
                <Stars count={5} />
                <div className="muted">na osnovu 1.000+ narudžbi</div>
              </div>
            </div>
            <div className="reviewsBadges" aria-label="Razlozi">
              <div className="reviewsBadge">Brza dostava</div>
              <div className="reviewsBadge">Provjereno porijeklo</div>
              <div className="reviewsBadge">Sigurna kupovina</div>
            </div>
          </div>
          <p className="reviewsHeroCopy">
            Ovo su primjeri komentara naših kupaca. Cilj nam je jednostavan: <strong>originalni parfemi</strong>, brza isporuka i iskustvo kupovine koje je lako ponoviti.
          </p>
        </div>
      </section>

      <section className="reviewsGrid" aria-label="Recenzije">
        {reviews.map((r) => (
          <article key={`${r.name}-${r.city}-${r.badge ?? ""}`} className="reviewCard">
            <header className="reviewHead">
              <div className="reviewPerson">
                <div className="reviewName">{r.name}</div>
                <div className="reviewMeta muted">
                  {r.city} · <Stars count={r.rating} />
                </div>
              </div>
              {r.badge ? <div className="reviewPill">{r.badge}</div> : null}
            </header>
            <p className="reviewText">“{r.text}”</p>
          </article>
        ))}
      </section>

      <section className="reviewsBottom">
        <div className="reviewsBottomCard">
          <div className="reviewsBottomTitle">Spreman/na za narudžbu?</div>
          <p className="reviewsBottomText muted">
            Dostava je <strong>besplatna</strong> za narudžbe preko <strong>150 KM</strong>. Drugi parfem u korpi dobija <strong>50% popusta</strong>.
          </p>
          <div className="reviewsBottomCtas">
            <Link className="btnPrimary" to="/products">
              Kreni sa kupovinom
            </Link>
            <Link className="btnGhost" to="/policies/uslovi-i-pravila">
              Uslovi i pravila
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

