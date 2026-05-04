import { PropsWithChildren, useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { allProducts } from "../mock/products";
import { useCart } from "../cart/CartContext";

import "../style.css";

type NavItem = { to: string; label: string };

const navItems: NavItem[] = [
  { to: "/", label: "Početna" },
  { to: "/products", label: "Svi proizvodi" },
  { to: "/collections/za-njega", label: "Muška kolekcija" },
  { to: "/collections/za-nju", label: "Ženska kolekcija" },
  { to: "/utisci", label: "Utisci" },
];

export function AppShell({ children }: PropsWithChildren) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchDraft, setSearchDraft] = useState("");
  const headerSearchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutDoneId, setCheckoutDoneId] = useState<string | null>(null);
  const [checkout, setCheckout] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    address: "",
    note: "",
    payment: "cash" as "cash" | "card",
  });
  const [checkoutErrors, setCheckoutErrors] = useState<Record<string, string>>({});
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const cart = useCart();

  const isCatalog = useMemo(
    () => location.pathname === "/products" || location.pathname.startsWith("/collections/"),
    [location.pathname],
  );
  const urlQ = searchParams.get("q") ?? "";
  const searchInputValue = isCatalog ? urlQ : searchDraft;
  const cartProducts = useMemo(() => new Map(allProducts.map((p) => [p.id, p])), []);

  const newestCartProductId = useMemo(() => {
    if (!cart.state.lines.length) return null;
    const newest = cart.state.lines.reduce((acc, l) => (!acc || l.addedAt > acc.addedAt ? l : acc), null as any);
    return newest?.productId ?? null;
  }, [cart.state.lines]);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsCartOpen(false);
    setIsSearchOpen(false);
    setIsCheckoutOpen(false);
    setCheckoutDoneId(null);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  useEffect(() => {
    if (isSearchOpen && !isCatalog) {
      setSearchDraft("");
    }
  }, [isSearchOpen, isCatalog]);

  useEffect(() => {
    if (!isSearchOpen) return;
    searchInputRef.current?.focus();
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return;
    const onDown = (e: MouseEvent) => {
      if (headerSearchRef.current?.contains(e.target as Node)) return;
      setIsSearchOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [isSearchOpen]);

  function submitSearchFromDraft() {
    const trimmed = searchDraft.trim();
    const next = new URLSearchParams();
    if (trimmed) next.set("q", trimmed);
    navigate({ pathname: "/products", search: next.toString() });
    setIsSearchOpen(false);
  }

  const year = useMemo(() => new Date().getFullYear(), []);

  function validateCheckout() {
    const errors: Record<string, string> = {};
    if (!checkout.fullName.trim()) errors.fullName = "Unesi ime i prezime.";
    if (!checkout.phone.trim()) errors.phone = "Unesi broj telefona.";
    if (checkout.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkout.email.trim())) {
      errors.email = "Unesi ispravan email.";
    }
    if (!checkout.city.trim()) errors.city = "Unesi grad.";
    if (!checkout.address.trim()) errors.address = "Unesi adresu.";
    setCheckoutErrors(errors);
    return Object.keys(errors).length === 0;
  }

  return (
    <div className="app">
      <div className="topbar" aria-label="Promo informacije">
        <div className="topbarViewport">
          <div className="topbarTrack">
            <div className="topbarGroup">
              <span className="topbarItem">BESPLATNA DOSTAVA ZA NARUDŽBE VEĆE OD 150 KM</span>
              <span className="topbarSep" aria-hidden="true" />
              <span className="topbarItem">100% ORIGINALNI PARFEMI</span>
              <span className="topbarSep" aria-hidden="true" />
              <span className="topbarItem">POVRAĆAJ NOVCA 14 DANA</span>
              <span className="topbarSep" aria-hidden="true" />
              <span className="topbarItem">DOSTAVA 1–3 RADNA DANA</span>
              <span className="topbarSep" aria-hidden="true" />
            </div>
            <div className="topbarGroup" aria-hidden="true">
              <span className="topbarItem">BESPLATNA DOSTAVA ZA NARUDŽBE VEĆE OD 150 KM</span>
              <span className="topbarSep" aria-hidden="true" />
              <span className="topbarItem">100% ORIGINALNI PARFEMI</span>
              <span className="topbarSep" aria-hidden="true" />
              <span className="topbarItem">POVRAĆAJ NOVCA 14 DANA</span>
              <span className="topbarSep" aria-hidden="true" />
              <span className="topbarItem">DOSTAVA 1–3 RADNA DANA</span>
              <span className="topbarSep" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      <header className="header">
        <div className="headerInner">
          <div className="headerStart">
            <button className="burger" type="button" onClick={() => setIsMenuOpen((v) => !v)} aria-expanded={isMenuOpen}>
              <span className="burgerBars" aria-hidden="true" />
              <span className="srOnly">Meni</span>
            </button>
          </div>

          <Link className="brand" to="/">
            <img className="brandLogo" src="/novilogo.png" alt="Original Parfem" />
            <span className="brandText">ORIGINAL PARFEM</span>
          </Link>

          <div className="headerActions">
            <div className="headerSearchWrap" ref={headerSearchRef}>
              <button
                type="button"
                className="searchTrigger"
                aria-expanded={isSearchOpen}
                aria-controls="header-search-popover"
                id="header-search-open"
                onClick={() => setIsSearchOpen((v) => !v)}
              >
                <span className="srOnly">Pretraga</span>
                <svg className="searchTriggerSvg" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <circle cx="10.5" cy="10.5" r="6.25" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M15.4 15.4 21 21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              {isSearchOpen ? (
                <div className="searchPopover" id="header-search-popover" role="search">
                  <label className="search search--popover">
                    <span className="srOnly">Pretraga parfema</span>
                    <span className="searchIcon" aria-hidden="true" />
                    <input
                      ref={searchInputRef}
                      className="searchInput"
                      value={searchInputValue}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (isCatalog) {
                          setSearchParams((prev) => {
                            const next = new URLSearchParams(prev);
                            if (v.trim()) next.set("q", v);
                            else next.delete("q");
                            next.set("page", "1");
                            return next;
                          });
                        } else {
                          setSearchDraft(v);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key !== "Enter") return;
                        e.preventDefault();
                        if (isCatalog) setIsSearchOpen(false);
                        else submitSearchFromDraft();
                      }}
                      placeholder="Pretraži parfeme…"
                      autoComplete="off"
                    />
                    {searchInputValue.trim() ? (
                      <button
                        type="button"
                        className="searchClear"
                        onClick={() => {
                          if (isCatalog) {
                            setSearchParams((prev) => {
                              const next = new URLSearchParams(prev);
                              next.delete("q");
                              next.set("page", "1");
                              return next;
                            });
                          } else {
                            setSearchDraft("");
                          }
                        }}
                        aria-label="Očisti pretragu"
                      >
                        ×
                      </button>
                    ) : null}
                  </label>
                </div>
              ) : null}
            </div>
            <button className="cartBtn" type="button" onClick={() => setIsCartOpen(true)}>
              <span className="cartIcon" aria-hidden="true" />
              <span className="cartLabel">Korpa</span> <span className="pill">{cart.totals.itemsCount}</span>
            </button>
          </div>

          <nav className="nav" aria-label="Glavna navigacija">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                className={({ isActive }) => (isActive ? "navLink active" : "navLink")}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {isMenuOpen ? (
          <div className="mobileNav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                className={({ isActive }) => (isActive ? "mobileLink active" : "mobileLink")}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        ) : null}
      </header>

      <main className="content">{children}</main>

      <footer className="footer">
        <div className="footerInner">
          <div className="footerCol">
            <div className="footerTitle">originalmiris.ba</div>
            <div className="footerMeta muted">© {year} originalmiris.ba</div>
          </div>

          <div className="footerCol">
            <div className="footerTitle">Uslovi i pravila</div>
            <Link className="footerLink" to="/policies/terms">
              Uslovi korišćenja
            </Link>
            <Link className="footerLink" to="/policies/privacy">
              Politika privatnosti
            </Link>
            <Link className="footerLink" to="/policies/complaints">
              Reklamacije
            </Link>
            <Link className="footerLink" to="/policies/shipping">
              Dostava
            </Link>
          </div>

          <div className="footerCol">
            <div className="footerTitle">Pratite nas</div>
            <a className="footerLink" href="#" onClick={(e) => e.preventDefault()}>
              Facebook
            </a>
            <a className="footerLink" href="#" onClick={(e) => e.preventDefault()}>
              Instagram
            </a>
          </div>
        </div>
      </footer>

      {isCartOpen ? (
        <div className="drawerOverlay" role="dialog" aria-modal="true" aria-labelledby="drawer-cart-title">
          <button className="drawerBackdrop" type="button" onClick={() => setIsCartOpen(false)} aria-label="Zatvori korpu" />
          <div className="drawer">
            <div className="drawerHeader">
              <div className="drawerHeaderText">
                <h2 id="drawer-cart-title" className="drawerTitle">
                  Korpa
                </h2>
                <p className="drawerSubtitle">Pregled narudžbe</p>
              </div>
              <button className="drawerClose" type="button" onClick={() => setIsCartOpen(false)}>
                <span className="drawerCloseIcon" aria-hidden="true" />
                <span className="srOnly">Zatvori</span>
              </button>
            </div>
            <div className="drawerBody">
              <div className="drawerMeta">
                <span className="drawerMetaLabel">Artikala</span>
                <span className="drawerMetaValue">{cart.totals.itemsCount}</span>
              </div>

              {cart.state.lines.length === 0 ? (
                <div className="emptyCart">
                  <div className="emptyCartIcon" aria-hidden="true" />
                  <div className="emptyTitle">Korpa je prazna</div>
                  <p className="emptyDesc muted">Dodaj parfeme iz kolekcije — ovdje će se pojaviti tvoji izbori.</p>
                  <Link className="drawerCta" to="/products" onClick={() => setIsCartOpen(false)}>
                    Nastavi kupovinu
                  </Link>
                </div>
              ) : (
                <>
                  <div className="cartLines">
                    {cart.state.lines.map((line) => {
                      const p = cartProducts.get(line.productId);
                      if (!p) return null;
                      const isDiscounted = cart.totals.itemsCount >= 2 && newestCartProductId === p.id;
                      const lineTotal = isDiscounted
                        ? p.priceKM * Math.max(0, line.qty - 1) + p.priceKM * 0.5
                        : p.priceKM * line.qty;
                      return (
                        <div className="cartLine" key={line.productId}>
                          <div className="cartThumb">
                            {p.imageUrl ? <img src={p.imageUrl} alt={p.name} /> : null}
                          </div>
                          <div className="cartLineMain">
                            <div className="cartLineName">{p.name}</div>
                            <div className="cartLineMeta">
                              <span className="muted">{p.priceKM.toFixed(2).replace(".", ",")} KM</span>
                            </div>
                            <div className="cartQty">
                              <button type="button" className="qtyBtn" onClick={() => cart.setQty(p.id, line.qty - 1)}>
                                −
                              </button>
                              <span className="qtyVal">{line.qty}</span>
                              <button type="button" className="qtyBtn" onClick={() => cart.setQty(p.id, line.qty + 1)}>
                                +
                              </button>
                              <button type="button" className="removeBtn" onClick={() => cart.remove(p.id)}>
                                Ukloni
                              </button>
                            </div>
                          </div>
                          <div className="cartLineTotal">
                            {lineTotal.toFixed(2).replace(".", ",")} KM
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="cartSummary">
                    {cart.totals.itemsCount === 1 ? (
                      <div className="muted" style={{ fontSize: 12, lineHeight: 1.4 }}>
                        Dodaj još 1 parfem i <strong>drugi</strong> dobija <strong>50% popusta</strong>.
                      </div>
                    ) : null}
                    <div className="cartSummaryRow">
                      <span className="muted">Subtotal</span>
                      <span className="cartSummaryValue">
                        {cart.totals.subtotalKM.toFixed(2).replace(".", ",")} KM
                      </span>
                    </div>
                    {cart.totals.discountKM > 0 ? (
                      <div className="cartSummaryRow">
                        <span className="muted">Popust (2. parfem -50%)</span>
                        <span className="cartSummaryValue">
                          -{cart.totals.discountKM.toFixed(2).replace(".", ",")} KM
                        </span>
                      </div>
                    ) : null}
                    <div className="cartSummaryRow">
                      <span className="muted">Ukupno</span>
                      <span className="cartSummaryValue">
                        {cart.totals.totalKM.toFixed(2).replace(".", ",")} KM
                      </span>
                    </div>
                    <div className="cartActions">
                      <button
                        className="cartActionBtn cartActionBtn--primary"
                        type="button"
                        onClick={() => {
                          setCheckoutErrors({});
                          setCheckoutDoneId(null);
                          setIsCheckoutOpen(true);
                        }}
                      >
                        Naruči
                      </button>
                      <button className="cartActionBtn" type="button" onClick={cart.clear}>
                        Očisti korpu
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {isCartOpen && isCheckoutOpen ? (
        <div className="checkoutOverlay" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
          <button
            className="checkoutBackdrop"
            type="button"
            onClick={() => setIsCheckoutOpen(false)}
            aria-label="Zatvori naručivanje"
          />
          <div className="checkoutModal">
            <div className="checkoutHeader">
              <div className="checkoutHeaderText">
                <div className="checkoutKicker">Naručivanje</div>
                <h2 id="checkout-title" className="checkoutTitle">
                  Podaci za dostavu
                </h2>
                <p className="checkoutSub muted">
                  Ukupno: <strong>{cart.totals.totalKM.toFixed(2).replace(".", ",")} KM</strong> ({cart.totals.itemsCount} artikala)
                </p>
              </div>
              <button className="checkoutClose" type="button" onClick={() => setIsCheckoutOpen(false)}>
                <span className="drawerCloseIcon" aria-hidden="true" />
                <span className="srOnly">Zatvori</span>
              </button>
            </div>

            {checkoutDoneId ? (
              <div className="checkoutDone">
                <div className="doneTitle">Narudžba je zaprimljena</div>
                <p className="doneDesc muted">
                  Broj narudžbe: <strong>{checkoutDoneId}</strong>. Kontaktiraćemo te uskoro radi potvrde.
                </p>
                <button
                  className="drawerCta"
                  type="button"
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setIsCartOpen(false);
                  }}
                >
                  Zatvori
                </button>
              </div>
            ) : (
              <form
                className="checkoutForm"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!validateCheckout()) return;
                  const id = `OM-${Math.random().toString(16).slice(2, 8).toUpperCase()}`;
                  setCheckoutDoneId(id);
                  cart.clear();
                }}
              >
                <div className="checkoutGrid">
                  <label className="field">
                    <span className="fieldLabel">Ime i prezime *</span>
                    <input
                      className={checkoutErrors.fullName ? "fieldInput fieldInput--err" : "fieldInput"}
                      value={checkout.fullName}
                      onChange={(e) => setCheckout((s) => ({ ...s, fullName: e.target.value }))}
                      placeholder="Unesi ime i prezime"
                    />
                    {checkoutErrors.fullName ? <span className="fieldErr">{checkoutErrors.fullName}</span> : null}
                  </label>

                  <label className="field">
                    <span className="fieldLabel">Telefon *</span>
                    <input
                      className={checkoutErrors.phone ? "fieldInput fieldInput--err" : "fieldInput"}
                      value={checkout.phone}
                      onChange={(e) => setCheckout((s) => ({ ...s, phone: e.target.value }))}
                      placeholder="Unesi broj telefona"
                    />
                    {checkoutErrors.phone ? <span className="fieldErr">{checkoutErrors.phone}</span> : null}
                  </label>

                  <label className="field">
                    <span className="fieldLabel">Email</span>
                    <input
                      className={checkoutErrors.email ? "fieldInput fieldInput--err" : "fieldInput"}
                      value={checkout.email}
                      onChange={(e) => setCheckout((s) => ({ ...s, email: e.target.value }))}
                      placeholder="Unesi email (opcionalno)"
                      inputMode="email"
                    />
                    {checkoutErrors.email ? <span className="fieldErr">{checkoutErrors.email}</span> : null}
                  </label>

                  <label className="field">
                    <span className="fieldLabel">Grad *</span>
                    <input
                      className={checkoutErrors.city ? "fieldInput fieldInput--err" : "fieldInput"}
                      value={checkout.city}
                      onChange={(e) => setCheckout((s) => ({ ...s, city: e.target.value }))}
                      placeholder="Unesi grad"
                    />
                    {checkoutErrors.city ? <span className="fieldErr">{checkoutErrors.city}</span> : null}
                  </label>

                  <label className="field field--full">
                    <span className="fieldLabel">Adresa *</span>
                    <input
                      className={checkoutErrors.address ? "fieldInput fieldInput--err" : "fieldInput"}
                      value={checkout.address}
                      onChange={(e) => setCheckout((s) => ({ ...s, address: e.target.value }))}
                      placeholder="Unesi adresu"
                    />
                    {checkoutErrors.address ? <span className="fieldErr">{checkoutErrors.address}</span> : null}
                  </label>

                  <label className="field field--full">
                    <span className="fieldLabel">Napomena (opcionalno)</span>
                    <textarea
                      className="fieldInput fieldTextarea"
                      value={checkout.note}
                      onChange={(e) => setCheckout((s) => ({ ...s, note: e.target.value }))}
                      placeholder="Unesi napomenu (opcionalno)"
                      rows={3}
                    />
                  </label>
                </div>

                <div className="payBox">
                  <div className="payTitle">Način plaćanja</div>
                  <label className="payOpt">
                    <input
                      type="radio"
                      name="payment"
                      checked={checkout.payment === "cash"}
                      onChange={() => setCheckout((s) => ({ ...s, payment: "cash" }))}
                    />
                    <span>Pouzećem (gotovina)</span>
                  </label>
                  <label className="payOpt">
                    <input
                      type="radio"
                      name="payment"
                      checked={checkout.payment === "card"}
                      onChange={() => setCheckout((s) => ({ ...s, payment: "card" }))}
                    />
                    <span>Karticom (pri preuzimanju)</span>
                  </label>
                </div>

                <div className="checkoutActions">
                  <button className="drawerCta" type="submit">
                    Naruči
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

