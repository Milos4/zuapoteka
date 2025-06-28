import React from "react";
import "../complaints/Complaints.css";

const CustomerSupport = () => {
  return (
    <div className="complaints-container">
      <h1 className="complaints-title">Korisnička podrška</h1>

      <section className="complaints-section">
        <h2>1. Kontakt informacije</h2>
        <p>
          Naš tim za korisničku podršku dostupan vam je svakog radnog dana od{" "}
          <strong>09:00 do 17:00</strong>.
        </p>
        <p>
          📧{" "}
          <a href="mailto:podrska@tvojadomena.ba" className="complaints-link">
            podrska@tvojadomena.ba
          </a>
        </p>
        <p>📞 062/123-456</p>
        <p>📍 Apoteka Higra Saric, Bijeljina</p>
      </section>

      <section className="complaints-section">
        <h2>2. Način naručivanja</h2>
        <p>
          Narudžbine možete izvršiti putem naše online platforme jednostavnim
          dodavanjem proizvoda u korpu i popunjavanjem obrasca za narudžbu.
        </p>
        <p>
          Nakon što pošaljete narudžbu, dobićete potvrdu putem e-maila. Naš tim
          će vas kontaktirati ukoliko bude bilo potrebe za dodatnim
          informacijama.
        </p>
      </section>

      <section className="complaints-section">
        <h2>3. Načini plaćanja</h2>
        <p>
          Trenutno ne prihvatamo online plaćanje karticama. Dostupni načini
          plaćanja su:
        </p>
        <ul>
          <li>
            💵 Gotovina pouzećem (prilikom isporuke putem kurirske službe)
          </li>
          <li>🏪 Plaćanje prilikom ličnog preuzimanja u apoteci</li>
        </ul>
        <p>
          Sve cijene prikazane na sajtu su izražene u konvertibilnim markama
          (KM) i uključuju PDV.
        </p>
      </section>

      <section className="complaints-section">
        <h2>4. Isporuka i rokovi</h2>
        <p>
          Isporuku vršimo na teritoriji Bosne i Hercegovine putem brze pošte.
        </p>
        <p>
          Rok isporuke je obično <strong>1 do 3 radna dana</strong>, u
          zavisnosti od lokacije.
        </p>
        <p>
          Cijena dostave iznosi <strong>10,00 KM</strong> za sve narudžbe do 60
          KM. Za narudžbe iznad <strong>60,00 KM</strong>, dostava je{" "}
          <strong>besplatna</strong>.
        </p>
      </section>

      <section className="complaints-section">
        <h2>5. Farmaceutski savjeti</h2>
        <p>
          Naš stručni tim farmaceuta stoji vam na raspolaganju za pitanja o
          pravilnoj upotrebi lijekova, doziranju, interakcijama, kao i izboru
          odgovarajućih dodataka ishrani i dermokozmetike.
        </p>
        <p>
          Slobodno nam se obratite ukoliko niste sigurni koji proizvod da
          izaberete.
        </p>
      </section>

      <section className="complaints-section">
        <h2>6. Reklamacije i povrat</h2>
        <p>
          Detaljnu politiku reklamacija i povrata možete pronaći na našoj
          stranici{" "}
          <a href="/reklamacije" className="complaints-link">
            Reklamacije
          </a>
          .
        </p>
        <p>
          Ukoliko imate problem sa isporukom, oštećenim proizvodom ili želite da
          prijavite reklamaciju, molimo vas da nas kontaktirate odmah po prijemu
          pošiljke.
        </p>
      </section>

      <section className="complaints-section">
        <h2>7. Povrat i otkazivanje narudžbe</h2>
        <p>
          Ukoliko želite da otkažete narudžbu, molimo vas da to učinite što
          prije putem e-maila ili telefona.
        </p>
        <p>
          Povrat sredstava je moguć samo u slučaju kada je proizvod greškom
          poslan ili je došlo do oštećenja u transportu.
        </p>
      </section>

      <section className="complaints-section">
        <h2>8. Povjerljivost podataka</h2>
        <p>
          Svi vaši lični podaci koriste se isključivo za obradu narudžbi i neće
          biti proslijeđeni trećim licima.
        </p>
        <p>
          Poštujemo vašu privatnost i obavezujemo se da vaše podatke čuvamo u
          skladu sa važećim zakonima o zaštiti privatnosti.
        </p>
      </section>

      <section className="complaints-section">
        <h2>9. Dodatne informacije</h2>
        <p>
          Za najčešće postavljana pitanja, posjetite{" "}
          <a href="/pitanja" className="complaints-link">
            Pitanja za shop
          </a>
          .
        </p>
        <p>
          Uslove korištenja sajta i kupovine pročitajte na{" "}
          <a href="/uslovi-koristenja" className="complaints-link">
            Uslovi korištenja
          </a>
          .
        </p>
      </section>
    </div>
  );
};

export default CustomerSupport;
