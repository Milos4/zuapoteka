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
          <a href="mailto:info@tvojadomena.rs" className="complaints-link">
            info@tvojadomena.rs
          </a>
          .
        </p>
        <p>
          Pogrešno isporučeni proizvodi biće{" "}
          <strong>besplatno zamenjeni</strong>. Molimo vas da odmah po prijemu
          proverite ispravnost sadržaja paketa u prisustvu dostavljača.
        </p>
        <p className="complaints-warning">
          Reklamacije koje se podnesu van navedenog roka od 24 časa neće biti
          uvažene.
        </p>
      </section>

      <section className="complaints-section">
        <h2>2. Povrat sredstava</h2>
        <p>
          U slučaju vraćanja robe i povrata novca kupcu koji je prethodno platio
          karticom, povrat se vrši isključivo putem platne kartice korišćene
          prilikom plaćanja (<strong>VISA, MasterCard, Maestro</strong>). Povrat
          će izvršiti banka na zahtev prodavca.
        </p>
      </section>

      <section className="complaints-section">
        <h2>3. Zaštita privatnosti korisnika</h2>
        <p>
          Obavezujemo se da ćemo čuvati privatnost svih naših korisnika.
          Prikupljamo samo podatke neophodne za realizaciju porudžbine i
          komunikaciju sa kupcima. Kupci uvek imaju pravo da se uklone sa
          mailing lista.
        </p>
        <p>
          Svi podaci se čuvaju strogo poverljivo i dostupni su samo zaposlenima
          kojima su potrebni za obavljanje posla.
        </p>
      </section>

      <section className="complaints-section">
        <h2>4. Sigurnost transakcija</h2>
        <p>
          Plaćanja putem kartica na našoj web prodavnici obavljaju se preko
          bezbednog sistema za online plaćanje – <strong>Monri</strong>. Vaši
          podaci su šifrovani i sigurni, a mi nikada ne dolazimo u kontakt sa
          kompletnim podacima vaše kartice.
        </p>
        <p>
          Sistem koristi napredne bezbednosne protokole uključujući{" "}
          <strong>SSL enkripciju</strong> i <strong>PCI DSS Level 1</strong>{" "}
          standard.
        </p>
      </section>
    </div>
  );
};

export default Complaints;
