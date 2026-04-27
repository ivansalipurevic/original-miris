import { Link } from "react-router-dom";
import { ProductGrid } from "../components/ProductGrid";
import { discountedProducts } from "../mock/products";

export function HomePage() {
  return (
    <div className="page">
      <section className="hero">
        <div className="heroLayout">
          <div className="heroInner">
          <h1 className="heroTitle">Originalni parfemi</h1>
          <p className="heroSubtitle">
            Provjereno porijeklo i kvalitet. Statični UI klon, bez kupovine i bez logike.
          </p>
          <div className="heroCtas">
            <Link className="btnPrimary" to="/products">
              Pogledaj ponudu
            </Link>
            <Link className="btnGhost" to="/contact">
              Kontakt
            </Link>
          </div>
          </div>

          <div className="heroMedia">
            <img className="heroLogo" src="/logoparfem.png" alt="Original Miris" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="sectionHeader">
          <h2>KOLEKCIJE</h2>
        </div>
        <div className="collections">
          <Link className="collectionCard collectionCard--mens" to="/collections/za-njega" aria-label="Za njega, muška kolekcija">
            <img className="collectionImg" src="/mens.png" alt="" aria-hidden />
            <div className="collectionShade" aria-hidden />
            <div className="collectionContent">
              <div className="collectionTitle">Za njega</div>
              <div className="collectionHint">Muška kolekcija</div>
            </div>
          </Link>
          <Link className="collectionCard collectionCard--womens" to="/collections/za-nju" aria-label="Za nju, ženska kolekcija">
            <img className="collectionImg" src="/girls.png" alt="" aria-hidden />
            <div className="collectionShade" aria-hidden />
            <div className="collectionContent">
              <div className="collectionTitle">Za nju</div>
              <div className="collectionHint">Ženska kolekcija</div>
            </div>
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="sectionHeader">
          <h2>Zašto kupiti kod nas?</h2>
        </div>
        <div className="infoPanel">
          <p>
            Kupovina kod nas znači sigurnost i kvalitet. Svi parfemi su <strong>100% originalni</strong>, sa
            porijeklom iz provjerenih evropskih distributerskih kanala. Bez sumnje - samo autentični mirisi
            koji traju!
          </p>
        </div>
      </section>

      <section className="section">
        <div className="sectionHeader">
          <h2>NA POPUSTU</h2>
        </div>
        <ProductGrid products={discountedProducts.slice(0, 8)} />
      </section>

      <section className="section">
        <div className="sectionHeader">
          <h2>ZVIJEZDA GODINE!</h2>
        </div>
        <div className="feature featureSpotlight">
          <div className="featureBody">
            <p className="featureEyebrow">Izdvajamo</p>
            <h3 className="featureHeading">Tom Ford Tobacco Vanille</h3>
            <p className="featureSub">Eau de Parfum · Private Blend</p>
            <p className="featureCopy">
              Orijentalni začinski miris za žene i muškarce: lista duvana i začini u otvaranju, mahune tonke,
              cvijet duvana, vanilija i kakao u srcu, a zatim drvene note i sušeno voće u bazi — sofisticiran,
              topao i neodoljivo luksuzan.
            </p>
            <div className="featureCtas">
              <button className="featureBtn" type="button" disabled>
                Kupi odmah
              </button>
            </div>
          </div>
          <div className="featureMedia">
            <img className="featureImg" src="/tomford.png" alt="Tom Ford Tobacco Vanille EDP" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="benefits">
          <div className="benefitCard">
            <div className="benefitTitle">originalni parfemi</div>
            <div className="benefitText">
              Provjereno porijeklo iz pouzdanih distributerskih kanala. Samo autentični mirisi i kvalitet na
              koji možeš računati.
            </div>
          </div>
          <div className="benefitCard">
            <div className="benefitTitle">povraćaj novca</div>
            <div className="benefitText">
              Kupuj bez brige. Ako nisi zadovoljan, povraćaj novca je moguć u roku od 14 dana, uz jasna
              pravila i jednostavnu proceduru.
            </div>
          </div>
          <div className="benefitCard">
            <div className="benefitTitle">brza dostava</div>
            <div className="benefitText">
              Brza obrada i isporuka u roku od 1–2 radna dana. Pakovanje je sigurno, a informacije o
              isporuci jasne i transparentne.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

