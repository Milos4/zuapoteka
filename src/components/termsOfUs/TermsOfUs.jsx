import React, { useRef } from 'react';
import './TermsOfUse.css'; // Pretpostavljamo da imate odgovarajući CSS

const sections = [
  { id: 'uvod', title: '1. Uvod' ,contetn: "Opšti uslovi Korištenjem Web Shop aplikacije (u daljem tekstu: aplikacija) saglasni ste sa uslovima i odredbama navedenim u ovom dokumentu. Molimo vas da ih pažljivo pročitate. Sve cijene prikazane u aplikaciji su izražene u konvertibilnim markama (BAM) i uključuju PDV. ZU Apoteke 'B Pharm' ulažu maksimalan trud da svi proizvodi budu prikazani sa tačnim nazivima, specifikacijama, fotografijama i cijenama. Ipak, ne možemo garantovati potpunu tačnost svih informacija. Zadržavamo pravo izmjene cijena i ponude bez prethodne najave. Prikazani artikli ne garantuju dostupnost na lageru u svakom trenutku. Porudžbine se obrađuju i šalju u roku od dva radna dana (vikendi i praznici nisu uključeni), u zavisnosti od raspoloživosti artikala. Ukoliko ne budemo u mogućnosti da isporučimo vašu narudžbu u navedenom roku, bićete blagovremeno obaviješteni, uz mogućnost da otkažete porudžbinu ili sačekate ponovnu dostupnost. Takođe ćemo vam predložiti zamjenski proizvod, ukoliko postoji."},
  { id: 'tacnost-informacija', title: '2. Tačnost informacija' },
  { id: 'privatnost', title: '3. Povjerljivost i privatnost' },
  { id: 'sigurnost', title: '4. Sigurnost i kolačići' },
  { id: 'kupovina', title: '5. Kako se kupuje preko aplikacije?' },
  { id: 'autorska-prava', title: '6. Autorsko pravo, ime Web shop, logo i oznake' },
  { id: 'boje-proizvoda', title: '7. Informacija o boji proizvoda' },
  { id: 'cijene', title: '8. Cijene proizvoda' },
  { id: 'povrat', title: '9. Povrat proizvoda' },
  { id: 'reklamacije', title: '10. Reklamacija' },
  { id: 'isporuka', title: '11. Isporuka' },
  { id: 'troskovi-isporuke', title: '12. Troškovi isporuke' },
  { id: 'zakonitost', title: '13. Zakonitost' },
  { id: 'izmjene', title: '14. Izmjene' },
  { id: 'pitanja', title: '15. Dodatna pitanja?' },
];

const TermsOfUse = () => {
  const sectionRefs = useRef({});

  const scrollToSection = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="terms-container">
      <aside className="terms-sidebar">
        <ul>
          {sections.map((section) => (
            <li key={section.id}>
              <button onClick={() => scrollToSection(section.id)}>
                {section.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <main className="terms-content">
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            ref={(el) => (sectionRefs.current[section.id] = el)}
          >
            <h2>{section.title}</h2>
            <p>
              {/* Ovdje unesite odgovarajući tekst za svaku sekciju */}
              {section.contetn}
            </p>
          </section>
        ))}
      </main>
    </div>
  );
};

export default TermsOfUse;
