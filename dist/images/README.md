## Slike za sajt

U ovaj folder ubacuj slike koje želiš da koristiš na sajtu.

### Kako se koriste

- Direktno u HTML/CSS: `url(/images/naziv-fajla.jpg)`
- U React-u:
  - `<img src="/images/naziv-fajla.jpg" alt="..." />`
  - ili background: `style={{ backgroundImage: "url(/images/naziv-fajla.jpg)" }}`

### Napomena

Ovaj folder je u `public/`, pa se fajlovi serviraju 1:1 bez bundlovanja.

