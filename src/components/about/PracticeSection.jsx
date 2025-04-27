// components/about/PracticeSection.jsx
import React from "react";
import { sectionBox, sectionHeading, sectionParagraph } from "../../styles/commonStyles";

const PracticeSection = () => {
  return (
    <div style={sectionBox}>
      <h2 style={sectionHeading}>Naša praksa</h2>
      <p style={sectionParagraph}>
        Apoteka Higra-Sarić njeguje principe Dobre apotekarske prakse. Svaki naš klijent može očekivati individualan pristup, diskreciju,
        i sveobuhvatan farmaceutski savjet uz najviši standard izdavanja lijekova i preporuka proizvoda.
      </p>
      
    </div>
  );
};

export default PracticeSection;
