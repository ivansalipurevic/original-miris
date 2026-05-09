import { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";

type Doc = { title: string; body: ReactNode };

const content: Record<string, Doc> = {
  terms: {
    title: "Uslovi korišćenja",
    body: (
      <>
        <h2>Uslovi korišćenja – originalmiris.ba</h2>
        <p>
          Upotrebom ovih web stranica, odnosno bilo koje usluge iz ponude <strong>originalmiris.ba</strong>,
          prihvatate ovdje navedena pravila i uslove korištenja. Molimo Vas da ih pažljivo pročitate i
          poštujete. U slučaju nepoštivanja, korisnik može snositi posljedice u skladu sa važećim
          zakonima. Ukoliko se ne slažete sa pravilima i uslovima korištenja, molimo Vas da ne koristite
          ove web stranice.
        </p>

        <h3>SADRŽAJ WEB STRANICE</h3>
        <p>
          Sadržaji i servisi na <strong>originalmiris.ba</strong> dostupni su korisnicima, posjetiocima i
          poslovnim partnerima u skladu sa ovim uslovima. Namijenjeni su prvenstveno svima koji su
          zainteresovani za proizvode i usluge iz naše ponude.
        </p>
        <p>
          Materijali objavljeni na <strong>originalmiris.ba</strong> su komercijalnog i informativnog
          karaktera i mogu se koristiti isključivo u lične svrhe. Svrha stranice je informisanje korisnika
          o ponudi i omogućavanje lakšeg izbora proizvoda.
        </p>

        <h3>TAČNOST I ISTINITOST INFORMACIJA</h3>
        <p>
          <strong>originalmiris.ba</strong> nastoji preduzeti sve razumne mjere kako bi informacije na sajtu
          bile tačne i ažurne. Ipak, moguće su tehničke greške, propusti ili kašnjenja u ažuriranju
          podataka, te u takvim slučajevima ne preuzimamo odgovornost za eventualne netačnosti.
        </p>

        <h3>UPOTREBA DOSTUPNIH PODATAKA</h3>
        <p>Ova web stranica namijenjena je isključivo ličnoj i nekomercijalnoj upotrebi. Nije dozvoljeno:</p>
        <ul>
          <li>mijenjanje sadržaja</li>
          <li>umnožavanje i distribucija</li>
          <li>javno prikazivanje ili objavljivanje</li>
          <li>prodaja ili komercijalno korištenje informacija, softvera, proizvoda ili usluga sa sajta</li>
        </ul>
        <p>bez prethodne pismene saglasnosti vlasnika sajta.</p>

        <h3>AUTORSKA PRAVA</h3>
        <p>
          Vlasnik web stranice <strong>originalmiris.ba</strong> je nosilac prava na idejno rješenje, dizajn
          i sadržaj sajta. Sve softverske aplikacije, tekstovi, fotografije, grafike, logotipi i drugi
          materijali su zaštićeni autorskim i srodnim pravima.
        </p>
        <p>Sadržaji koji nisu u našem vlasništvu biće posebno označeni.</p>
        <p>
          Zabranjeno je korištenje bilo kojeg dijela sajta u komercijalne svrhe bez prethodne pismene
          dozvole. Neovlaštena upotreba smatra se povredom autorskih prava i može biti predmet pravnog
          postupka.
        </p>
        <p>
          Ako smatrate da je došlo do povrede autorskih prava, molimo da nas kontaktirate na:{" "}
          <strong>originalmirisbih@gmail.com</strong>
        </p>
        <p>Sva prava su zadržana.</p>

        <h3>ZABRANJENA I NEDOPUŠTENA UPOTREBA</h3>
        <p>
          Korištenjem sajta obavezujete se da nećete koristiti sadržaj i podatke sa{" "}
          <strong>originalmiris.ba</strong> u nezakonite ili ovim uslovima zabranjene svrhe.
        </p>

        <h3>LINKOVI KA DRUGIM SAJTOVIMA</h3>
        <p>
          Stranica može sadržavati linkove ka drugim web stranicama koje su u vlasništvu trećih lica. Ti
          linkovi služe samo kao dodatni izvor informacija. <strong>originalmiris.ba</strong> nema kontrolu
          nad njihovim sadržajem i ne snosi odgovornost za tačnost, politiku privatnosti ili bezbjednost
          tih stranica.
        </p>

        <h3>IZMJENE USLOVA KORIŠTENJA</h3>
        <p>
          <strong>originalmiris.ba</strong> zadržava pravo izmjene uslova korištenja u bilo kojem trenutku,
          bez prethodne najave. Izmjene stupaju na snagu danom objave na sajtu. Korisnici su dužni da
          periodično provjeravaju uslove korištenja.
        </p>

        <h3>MJERODAVNO PRAVO I NADLEŽNOST</h3>
        <p>
          Na tumačenje i primjenu ovih uslova primjenjuju se zakoni Bosne i Hercegovine. U slučaju spora
          nadležan je stvarno nadležni sud u Bosni i Hercegovini prema sjedištu trgovca.
        </p>
      </>
    ),
  },
  privacy: {
    title: "Politika privatnosti",
    body: (
      <>
        <h2>IZJAVA O PRIVATNOSTI – ORIGINALMIRIS.BA</h2>
        <p>
          Izjava o privatnosti služi prvenstveno zaštiti privatnosti naših korisnika. Stranice{" "}
          <strong>originalmiris.ba</strong> možete pregledavati slobodno, bez obaveze otkrivanja identiteta
          ili ostavljanja ličnih podataka. Ukoliko se odlučite za korištenje neke od naših usluga, potrebno
          je dostaviti tražene lične podatke kako bismo mogli isporučiti proizvod ili uslugu. Vaši lični
          podaci ostaju maksimalno zaštićeni.
        </p>
        <p>
          Prikupljamo samo podatke koji su neophodni za redovno obavljanje procedure vezane za odabrane
          usluge i koristimo isključivo informacije koje smo dobili direktno od Vas.
        </p>
        <p>
          U nastavku objašnjavamo razloge prikupljanja, način obrade i nivo zaštite Vaših ličnih podataka.
        </p>

        <h3>Prikupljanje informacija o Vama</h3>
        <p>
          <strong>originalmiris.ba</strong> prikuplja podatke o identitetu i druge lične podatke samo u
          slučaju kada se odlučite za slanje upita ili kupovinu proizvoda i usluga iz naše ponude, što
          podrazumijeva i postupak plaćanja i isporuke.
        </p>
        <p>
          Dolaskom na web adresu <strong>originalmiris.ba</strong>, naš server može automatski prikupljati
          tehničke informacije kao što su: IP adresa, tip pregledača, domen s kojeg dolazite, vrijeme
          pristupa, posjećene stranice i aktivnosti tokom korištenja sajta. Ovi podaci koriste se
          isključivo za statistiku i unapređenje kvaliteta web stranice.
        </p>
        <p>
          Naš server ne prikuplja Vašu e-mail adresu niti druge identifikacione podatke, osim u slučaju da
          ih dobrovoljno dostavite putem formi, narudžbe ili prijave.
        </p>

        <h3>Zaštita privatnosti korisnika</h3>
        <p>
          <strong>originalmiris.ba</strong> se obavezuje da čuva privatnost svih kupaca i korisnika.
          Prikupljamo samo osnovne i neophodne podatke potrebne za poslovanje, obradu narudžbi i
          komunikaciju sa korisnicima, u skladu sa dobrim poslovnim običajima i važećim propisima.
        </p>
        <p>
          Kupcima omogućavamo izbor, uključujući mogućnost da u svakom trenutku zatraže uklanjanje sa
          mailing lista koje se koriste za marketinške kampanje.
        </p>
        <p>
          Svi podaci o korisnicima čuvaju se kao povjerljivi i dostupni su samo zaposlenima i partnerima
          kojima su ti podaci nužni za izvršenje posla. Svi zaposleni i poslovni partneri obavezni su
          poštovati principe zaštite privatnosti.
        </p>

        <h3>Zaštita povjerljivih podataka o transakciji</h3>
        <p>
          Prilikom unosa podataka o platnoj kartici, povjerljive informacije prenose se putem javne mreže u
          zaštićenoj (kriptovanoj) formi uz korištenje SSL protokola i PKI sistema.
        </p>
        <p>
          Sigurnost podataka prilikom online plaćanja garantuje procesor platnih kartica i banka. Podaci o
          platnoj kartici ni u jednom trenutku nisu dostupni našem sistemu.
        </p>

        <h3>Korištenje prikupljenih informacija</h3>
        <p>Vaše lične podatke koristimo isključivo za:</p>
        <ul>
          <li>obradu i isporuku naručenih proizvoda i usluga</li>
          <li>slanje informacija potrebnih za realizaciju narudžbe i plaćanja</li>
          <li>dostavu računa i obavještenja vezanih za narudžbu</li>
          <li>komunikaciju putem e-maila ili telefona u vezi narudžbe</li>
          <li>
            povremeno obavještavanje o akcijama, posebnim ponudama i novostima (e-mail i/ili SMS), ukoliko
            za to postoji saglasnost
          </li>
        </ul>
        <p>Prikupljene podatke ne koristimo u druge svrhe.</p>

        <p>
          <strong>originalmiris.ba</strong> ne prodaje, ne iznajmljuje i ne ustupa lične podatke trećim
          licima, osim kada je to nužno za realizaciju usluge (npr. dostavne službe, platni procesori) ili
          kada to zahtijeva zakon.
        </p>
        <p>
          Ukoliko ne želite primati promotivne poruke, možete nas obavijestiti putem kontakt forme na sajtu
          i bićete uklonjeni sa liste u najkraćem mogućem roku.
        </p>
        <p>
          Lični podaci mogu biti otkriveni samo u slučaju zakonske obaveze ili sudskog naloga, te radi
          zaštite prava, sigurnosti korisnika ili javnosti.
        </p>

        <h3>Sigurnost prikupljenih informacija</h3>
        <p>
          <strong>originalmiris.ba</strong> preduzima tehničke i organizacione mjere zaštite kako bi svi
          prikupljeni podaci bili sigurni od gubitka, izmjene, neovlaštenog pristupa ili zloupotrebe.
        </p>
        <p>
          Kontakt forme, e-mail komunikacija i sistemi za narudžbu nalaze se u zaštićenom okruženju. Web
          server je zaštićen od neovlaštenih fizičkih i elektronskih pristupa.
        </p>
      </>
    ),
  },
  complaints: {
    title: "Reklamacije",
    body: (
      <>
        <h2>
          IZJAVA O ODUSTANKU OD UGOVORA O KUPOPRODAJI ZAKLJUČENOG NA DALJINU – BiH
        </h2>
        <p>
          U skladu sa važećim Zakonom o zaštiti potrošača u Bosni i Hercegovini, obrazac Izjave o odustanku
          od ugovora dostavlja se na e-mail adresu: <strong>originalmirisbih@gmail.com</strong>
        </p>
        <p>
          Potrošač ostvaruje pravo na odustanak od ugovora zaključenog na daljinu ili izvan poslovnih
          prostorija izjavom o odustanku od ugovora, ukoliko je izjava poslana trgovcu u roku od 14 dana od
          dana kada je roba prešla u posjed potrošača, odnosno treće osobe koju je potrošač odredio, a koja
          nije prevoznik.
        </p>
        <p>
          Odustajanjem od ugovora potrošač se oslobađa svih ugovornih obaveza, osim obaveze plaćanja
          troškova vraćanja robe.
        </p>
        <p>
          Proizvodi moraju biti nekorišteni, neoštećeni i u originalnoj ambalaži. Uz vraćenu robu potrebno
          je priložiti originalni račun i obrazac – Izjavu o odustanku od ugovora.
        </p>
        <p>
          Potrošač ima pravo da u roku od 14 dana od dana zaključenja ugovora na daljinu ili izvan poslovnih
          prostorija odustane od ugovora bez navođenja razloga.
        </p>
        <p>Izjava o odustanku od ugovora proizvodi pravno dejstvo od dana kada je poslana trgovcu.</p>
        <p>
          Ako potrošač ostvari pravo na odustanak, smatra se da ugovor nije ni zaključen, te nastaju
          međusobne obaveze povrata primljenog u skladu sa zakonom.
        </p>
        <p>
          Trgovac je dužan da potrošaču bez odlaganja izvrši povrat uplaćenih sredstava, a najkasnije u roku
          od 14 dana od dana prijema izjave o odustanku.
        </p>
        <p>
          Kod ugovora o prodaji robe zaključenog na daljinu ili izvan poslovnih prostorija, trgovac je dužan
          izvršiti povrat sredstava nakon što primi vraćenu robu ili dokaz da je roba poslana nazad, u
          zavisnosti od toga koja radnja je prva izvršena.
        </p>
        <p>
          Potrošač je dužan vratiti robu trgovcu bez odlaganja, a najkasnije u roku od 14 dana od dana slanja
          izjave o odustanku od ugovora.
        </p>

        <h3>Povrat sredstava plaćenih karticom</h3>
        <p>
          U slučaju vraćanja robe i povrata sredstava kupcu koji je platio platnom karticom, djelimično ili
          u cijelosti, povrat sredstava vrši se isključivo putem istog kartičnog načina plaćanja (VISA,
          MasterCard, Maestro, Dina ili druge podržane kartice), u skladu sa pravilima bankarskog sistema.
        </p>

        <p>
          Obrazac Izjave o odustanku od ugovora potrošač može zatražiti putem e-mail adrese:{" "}
          <strong>originalmirisbih@gmail.com</strong>
        </p>
      </>
    ),
  },
  shipping: {
    title: "Dostava",
    body: (
      <>
        <h2>Dostava</h2>
        <p>
          Dostava se vrši u saradnji sa kurirskom službom <strong>EuroExpress</strong> u cijeloj Bosni i
          Hercegovini.
        </p>
      </>
    ),
  },
};

export function PoliciesPage() {
  const { slug } = useParams();
  const doc = (slug && content[slug]) || null;

  return (
    <div className="page">
      <div className="pageHeader">
        <h1>{doc?.title ?? "Uslovi i pravila"}</h1>
        <div className="pageHeaderMeta">
          <Link className="link" to="/">
            Početna
          </Link>
        </div>
      </div>

      <section className="cardSurface prose">
        {doc ? doc.body : <p>Izaberite dokument iz footera.</p>}
      </section>
    </div>
  );
}

