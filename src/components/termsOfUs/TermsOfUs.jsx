import React from "react";
import "./TermsOfUse.css";

const sections = [
  { id: "usage", title: "1. Opšti uslovi" },
  { id: "privacy", title: "2. Politika privatnosti" },
  { id: "cookies", title: "3. Politika kolačića" },
  { id: "orders", title: "4. Obrada porudžbina" },
  { id: "restrictions", title: "5. Ograničenja i zakon" },
  { id: "ownership", title: "6. Prava i vlasništvo" },
];

export default function TermsOfUse() {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="terms-container">
      <nav className="terms-sidebar">
        <ul>
          {sections.map((section) => (
            <li key={section.id} onClick={() => scrollToSection(section.id)}>
              {section.title}
            </li>
          ))}
        </ul>
      </nav>

      <div className="terms-content">
        <section id="usage">
          <h2>1. Opšti uslovi korišćenja</h2>
          <p>
            Korišćenjem sajta prihvatate sve uslove navedene u ovom dokumentu.
            Platforma omogućava online pregled i poručivanje proizvoda koje nudi
            Apoteka Higra-Šarić iz Bijeljine.
          </p>
        </section>

        <section id="privacy">
          <h2>2. Politika privatnosti</h2>
          <p>
            Lični podaci korisnika se obrađuju u skladu sa zakonima o zaštiti
            podataka. Korisnik ima pravo na uvid, izmenu i brisanje svojih
            podataka. Podaci se ne dijele trećim licima bez saglasnosti.
          </p>
        </section>

        <section id="cookies">
          <h2>3. Politika kolačića</h2>
          <p>
            Koristimo kolačiće za unapređenje korisničkog iskustva. Možete ih
            isključiti u podešavanjima pretraživača, ali to može uticati na
            funkcionalnost sajta.
          </p>
        </section>

        <section id="orders">
          <h2>4. Obrada porudžbina</h2>

          <h3>4.1 Dodavanje u korpu</h3>
          <p>
            Korisnik može slobodno pregledati proizvode i dodavati željene
            artikle u korpu bez registracije. Cena, količina i naziv proizvoda
            su jasno istaknuti.
          </p>

          <h3>4.2 Checkout proces</h3>
          <p>
            Prilikom završetka porudžbine korisnik unosi lične podatke, adresu i
            broj telefona. Ukoliko želi isporuku poštom, mora označiti tu
            opciju.
          </p>

          <h3>4.3 Potvrda porudžbine</h3>
          <p>
            Nakon što narudžbina bude poslata, osoblje apoteke Higra-Šarić
            telefonski kontaktira korisnika radi potvrde. Tek nakon potvrde,
            porudžbina se obrađuje i šalje ako je dostava odabrana.
          </p>

          <h3>4.4 Pratite porudžbine</h3>
          <p>
            Registrovani korisnici mogu videti status svojih porudžbina u
            korisničkom nalogu. Apoteka može izmeniti ili otkazati porudžbinu u
            slučaju nedostupnosti proizvoda.
          </p>
        </section>

        <section id="restrictions">
          <h2>5. Ograničenja i zakon</h2>
          <p>
            Sajt omogućava samo prikaz i porudžbinu proizvoda koji su dozvoljeni
            za online prodaju bez recepta (dodaci ishrani, kozmetika i slični
            proizvodi). Ne vrši se prodaja lekova na recept putem sajta.
          </p>
          <p>
            Apoteka Higra-Šarić odgovorna je za poštovanje važećih zakona i
            regulativa u vezi sa prometom farmaceutskih proizvoda.
          </p>
        </section>
        <section id="ownership">
          <h2>7. Prava i vlasništvo</h2>
          {/* <p>
            Platformu tehnički održava i razvija firma <strong>4Fusion</strong>,
            ali svi proizvodi, opisi, slike i informacije predstavljene na sajtu
            su isključivo u vlasništvu <strong>Apoteke Higra-Šarić</strong>.
          </p> */}
          <p>
            Apoteka Higra-Šarić zadržava sva prava u vezi sa sadržajem, ponudom
            i komercijalnim aktivnostima na sajtu. Nijedan deo sajta ne sme se
            kopirati ili koristiti u druge svrhe bez izričite saglasnosti
            apoteke.
          </p>
        </section>
      </div>
    </div>
  );
}
