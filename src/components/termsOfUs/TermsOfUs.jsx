import React from "react";
import "./TermsOfUse.css";

const sections = [
  { id: "usage", title: "1. Opšti uslovi" },
  { id: "privacy", title: "2. Politika privatnosti" },
  { id: "cookies", title: "3. Politika kolačića" },
  { id: "orders", title: "4. Obrada narudžbi" },
  { id: "restrictions", title: "5.Ograničenja" },
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
            Korišćenjem sajta prihvatate uslove i pravila navedena u ovom
            dokumentu. Molimo vas da ih pažljivo pročitate.
          </p>
        </section>

        <section id="privacy">
          <h2>2. Politika privatnosti</h2>
          <p>
            Vaši lični podaci se obrađuju u skladu sa zakonima o zaštiti
            podataka. Ne delimo informacije trećim stranama bez vašeg pristanka.
          </p>
        </section>

        <section id="cookies">
          <h2>3. Politika kolačića</h2>
          <p>
            Na sajtu koristimo kolačiće kako bismo poboljšali korisničko
            iskustvo. Možete ih onemogućiti u podešavanjima vašeg pretraživača.
          </p>
        </section>

        <section id="orders">
          <h2>4. Obrada narudžbi</h2>
          <p>
            Sve porudžbine se obrađuju u najkraćem mogućem roku. Zadržavamo
            pravo na izmenu cena i dostupnosti proizvoda bez prethodne najave.
            Prodaja lekova bez recepta je u skladu sa važećim zakonima. Ne
            vršimo isporuku proizvoda van teritorije Srbije. Prodaja lekova bez
            recepta je u skladu sa važećim zakonima. Ne vršimo isporuku
            proizvoda van teritorije Srbije. Prodaja lekova bez recepta je u
            skladu sa važećim zakonima. Ne vršimo isporuku proizvoda van
            teritorije Srbije. Prodaja lekova bez recepta je u skladu sa važećim
            zakonima. Ne vršimo isporuku proizvoda van teritorije Srbije.
          </p>
        </section>

        <section id="restrictions">
          <h2>5. Ograničenja</h2>
          <p>
            Prodaja lekova bez recepta je u skladu sa važećim zakonima. Ne
            vršimo isporuku proizvoda van teritorije Srbije. Prodaja lekova bez
            recepta je u skladu sa važećim zakonima. Ne vršimo isporuku
            proizvoda van teritorije Srbije. Prodaja lekova bez recepta je u
            skladu sa važećim zakonima. Ne vršimo isporuku proizvoda van
            teritorije Srbije. Prodaja lekova bez recepta je u skladu sa važećim
            zakonima. Ne vršimo isporuku proizvoda van teritorije Srbije.
            Prodaja lekova bez recepta je u skladu sa važećim zakonima. Ne
            vršimo isporuku proizvoda van teritorije Srbije. Prodaja lekova bez
            recepta je u skladu sa važećim zakonima. Ne vršimo isporuku
            proizvoda van teritorije Srbije. Prodaja lekova bez recepta je u
            skladu sa važećim zakonima. Ne vršimo isporuku proizvoda van
            teritorije Srbije. Prodaja lekova bez recepta je u skladu sa važećim
            zakonima. Ne vršimo isporuku proizvoda van teritorije Srbije.
            Prodaja lekova bez recepta je u skladu sa važećim zakonima. Ne
            vršimo isporuku proizvoda van teritorije Srbije. Prodaja lekova bez
            recepta je u skladu sa važećim zakonima. Ne vršimo isporuku
            proizvoda van teritorije Srbije. Prodaja lekova bez recepta je u
            skladu sa važećim zakonima. Ne vršimo isporuku proizvoda van
            teritorije Srbije. Prodaja lekova bez recepta je u skladu sa važećim
            zakonima. Ne vršimo isporuku proizvoda van teritorije Srbije.
            Prodaja lekova bez recepta je u skladu sa važećim zakonima. Ne
            vršimo isporuku proizvoda van teritorije Srbije. Prodaja lekova bez
            recepta je u skladu sa važećim zakonima. Ne vršimo isporuku
            proizvoda van teritorije Srbije. Prodaja lekova bez recepta je u
            skladu sa važećim zakonima. Ne vršimo isporuku proizvoda van
            teritorije Srbije. Prodaja lekova bez recepta je u skladu sa važećim
            zakonima. Ne vršimo isporuku proizvoda van teritorije Srbije.
          </p>
        </section>
      </div>
    </div>
  );
}
