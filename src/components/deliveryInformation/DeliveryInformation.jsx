import React from "react";
import "../complaints/Complaints.css";

const DeliveryInformation = () => {
  return (
    <div className="complaints-container">
      <h1 className="complaints-title">Informacije o dostavi</h1>

      <section className="complaints-section">
        <h2>1. Vrijeme isporuke</h2>
        <p>
          Porudžbine obrađujemo u roku od <strong>1 radnog dana</strong>, a
          dostava se vrši u roku od <strong>1 do 3 radna dana</strong>, u
          zavisnosti od lokacije kupca.
        </p>
        <p>
          Isporuka se vrši radnim danima od 8h do 17h putem kurirske službe sa
          kojom imamo saradnju.
        </p>
      </section>

      <section className="complaints-section">
        <h2>2. Troškovi dostave</h2>
        <p>
          Trošak dostave iznosi <strong>11 KM</strong> za porudžbine ispod 60
          KM. Za porudžbine iznad 60 KM, dostava je <strong>besplatna</strong>.
        </p>
       </section>
{/* 
  <section className="complaints-section">
    <h2>3. Praćenje pošiljke</h2>
    <p>
      Nakon što pošiljka bude predata kurirskoj službi, dobićete mejl sa
      brojem za praćenje. Status isporuke možete pratiti putem sajta
      kurirske službe.
    </p>
  </section>
*/}

    </div>
  );
};

export default DeliveryInformation;
