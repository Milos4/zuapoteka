// components/about/MissionSection.jsx
import React from "react";
import { sectionBox, sectionHeading, sectionParagraph } from "../../styles/commonStyles";

const MissionSection = () => {
  return (
    <div style={sectionBox}>
      <h2 style={sectionHeading}>Naša misija</h2>
      <p style={sectionParagraph}>
        Naša misija je biti prvi izbor za sve potrebe očuvanja zdravlja - kroz stručnu, odgovornu i posvećenu farmaceutsku uslugu.
      </p>
      <p style={sectionParagraph}>
        Cilj nam je izgradnja trajnog povjerenja pružanjem savremenih terapijskih rješenja i edukacije zajednice.
      </p>
    </div>
  );
};

export default MissionSection;
