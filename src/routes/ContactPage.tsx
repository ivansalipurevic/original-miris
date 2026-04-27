export function ContactPage() {
  return (
    <div className="page contactPage">
      <div className="pageHeader contactPageHeader">
        <div>
          <p className="contactEyebrow">Kontakt</p>
          <h1>Javite nam se</h1>
        </div>
      </div>

      <p className="contactLead muted">
        Imate pitanje o parfemu, dostavi ili narudžbi? Popunite formu — odgovaramo u najkraćem roku.
      </p>

      <div className="contactGrid">
        <section className="contactCard contactCardForm">
          <div className="contactCardHead">
            <h2 className="contactCardTitle">Pišite nam</h2>
            <p className="contactCardDesc muted">Odgovaramo u roku od jednog radnog dana.</p>
          </div>

          <form
            className="form contactForm"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <label className="field contactField">
              <span className="label">Ime i prezime</span>
              <input className="contactInput" type="text" name="name" placeholder="Vaše ime" autoComplete="name" />
            </label>
            <label className="field contactField">
              <span className="label">Email</span>
              <input
                className="contactInput"
                type="email"
                name="email"
                placeholder="vas@email.com"
                autoComplete="email"
              />
            </label>
            <label className="field contactField">
              <span className="label">Poruka</span>
              <textarea className="contactInput contactTextarea" name="message" placeholder="Vaša poruka..." rows={6} />
            </label>
            <button className="contactSubmit" type="submit" disabled>
              Pošalji poruku
            </button>
          </form>
        </section>

        <aside className="contactCard contactCardInfo">
          <div className="contactCardHead">
            <h2 className="contactCardTitle contactCardTitleOnDark">Kontakt podaci</h2>
            <p className="contactCardDesc contactCardDescOnDark">Direktan kontakt za brze informacije.</p>
          </div>

          <ul className="contactInfoList">
            <li className="contactInfoRow">
              <span className="contactInfoIconWrap" aria-hidden="true">
                <svg className="contactInfoSvg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.6 4.2h10.8c.7 0 1.2.6 1.2 1.2v13.2c0 .7-.5 1.2-1.2 1.2H6.6c-.7 0-1.2-.5-1.2-1.2V5.4c0-.6.5-1.2 1.2-1.2z"
                  />
                  <path strokeWidth="1.75" strokeLinecap="round" d="M9 18h6" />
                </svg>
              </span>
              <div>
                <div className="contactInfoLabel">Telefon</div>
                <div className="contactInfoValue">
                  <a className="contactInfoLink" href="tel:+38765999794">
                    +38765999794
                  </a>
                </div>
              </div>
            </li>
            <li className="contactInfoRow">
              <span className="contactInfoIconWrap" aria-hidden="true">
                <svg className="contactInfoSvg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 7.5l7.2 4.8 7.2-4.8M4.5 7.5h15v10.5a1.2 1.2 0 0 1-1.2 1.2H5.7a1.2 1.2 0 0 1-1.2-1.2V7.5z"
                  />
                </svg>
              </span>
              <div>
                <div className="contactInfoLabel">Email</div>
                <div className="contactInfoValue">
                  <a className="contactInfoLink" href="mailto:info@originalmiris.ba">
                    info@originalmiris.ba
                  </a>
                </div>
              </div>
            </li>
            <li className="contactInfoRow">
              <span className="contactInfoIconWrap" aria-hidden="true">
                <svg className="contactInfoSvg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="7.5" strokeWidth="1.75" />
                  <path strokeWidth="1.75" strokeLinecap="round" d="M12 8.2V12l2.6 1.5" />
                </svg>
              </span>
              <div>
                <div className="contactInfoLabel">Radno vrijeme</div>
                <div className="contactInfoValue">Pon–Pet · 09:00–17:00</div>
              </div>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
