// components/about/WelcomeSection.jsx
import React from "react";
import { sectionBox, sectionHeading, sectionParagraph } from "../../styles/commonStyles";

const WelcomeSection = () => {
  return (
    <div style={sectionBox}>
      <h2 style={sectionHeading}>Dobrodošli u Apoteku "Higra-Sarić"</h2>
      <p style={sectionParagraph}>
      Sa tradicijom dugom preko dvije decenije, Apoteka "Higra-Sarić" postala je simbol povjerenja i kvaliteta u farmaceutskoj zaštiti zdravlja. 
      Naš stručni tim svakodnevno ulaže napore da vam pruži personalizovanu podršku i najviši nivo usluge.
      </p>
      <p style={sectionParagraph}>
      Danas, kroz dvije moderno opremljene apoteke, nastavljamo da rastemo zajedno sa našim klijentima.
      </p>
    </div>
  );
};

export default WelcomeSection;
