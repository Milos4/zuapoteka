import React from "react";
import "./Complaints.css";

const Complaints = () => {
  return (
    <div className="complaints-container">
      <h1 className="complaints-title">Politika reklamacija i povrata</h1>

      <section className="complaints-section">
        <h2>1. Reklamacije na proizvod</h2>
        <p>
          Ukoliko ste primili pogrešan proizvod ili proizvod sa oštećenjem,
          dužni ste da u roku od <strong>24 časa</strong> od prijema pošiljke
          kontaktirate našu korisničku podršku putem e-mail adrese:{" "}
          <a href="mailto:info@apoteka-higrasaric.ba" className="complaints-link">
            info@apoteka-higrasaric.ba
          </a>
          .
        </p>
        <p>
          Pogrešno isporučeni proizvodi biće <strong>besplatno zamijenjeni</strong>. 
          Molimo vas da odmah po prijemu provjerite ispravnost sadržaja paketa u prisustvu dostavljača.
        </p>
        <p className="complaints-warning">
          Reklamacije koje se podnesu van navedenog roka od 24 časa neće biti
          uvažene.
        </p>
      </section>

      <section className="complaints-section">
        <h2>2. Povrat sredstava</h2>
        <p>
          Ukoliko dođe do vraćanja proizvoda, povrat sredstava izvršava se
          <strong>gotovinom pouzećem prilikom preuzimanja ili direktno u apoteci</strong>.
          Online plaćanje karticama trenutno nije dostupno.
        </p>
      </section>

      <section className="complaints-section">
        <h2>3. Zaštita privatnosti korisnika</h2>
        <p>
          Obavezujemo se da ćemo čuvati privatnost svih naših korisnika.
          Prikupljamo samo podatke neophodne za realizaciju porudžbine i
          komunikaciju sa kupcima. Kupci uvijek imaju pravo da se uklone sa
          mailing lista.
        </p>
        <p>
          Svi podaci čuvaju se strogo povjerljivo i dostupni su samo zaposlenima
          kojima su potrebni za obavljanje posla.
        </p>
      </section>

      <section className="complaints-section">
        <h2>4. Sigurnost transakcija</h2>
        <p>
          Plaćanje se vrši **gotovinom pouzećem prilikom dostave ili lično u apoteci**.
          Vaši podaci su sigurni jer ne unosite kartice na web sajtu.
        </p>
      </section>
    </div>
  );
};

export default Complaints;
