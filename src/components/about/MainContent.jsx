import React from "react";
import { sectionBox, sectionHeading, sectionParagraph } from "../../styles/commonStyles";
import MissionSection from "./MissionSection";
import PracticeSection from "./PracticeSection";
import apotekarka5 from "../../assets/Slika1.jpg";
import WelcomeSection from "./WelcomeSection";

const MainContent = () => {
  return (
    <div style={{
      backgroundColor: '#FAF1E6',
      display: 'flex',
      flexWrap: 'wrap',
      padding: '2rem 5%',
      gap: '2rem',
      justifyContent: 'center',
      alignItems: 'flex-start',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Leva strana - 3 sekcije */}
      <div style={{
        flex: '1 1 600px', // Fleksibilna širina, minimalno 600px
        display: 'flex',
        flexDirection: 'column',
        gap: '3rem',
        maxWidth: '100%',
      }}>
        <WelcomeSection />
        <MissionSection />
        <PracticeSection />
      </div>

      {/* Desna strana - Slika */}
      <div style={{
        flex: '1 1 400px', // Fleksibilna širina, minimalno 400px
        minWidth: '300px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <img
          src={apotekarka5}
          alt="Farmaceutski tim"
          style={{
            width: '100%',
            height: 'auto',
            maxWidth: '600px', // Maksimalna širina slike
            borderRadius: '10px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
            objectFit: 'cover',
          }}
        />
      </div>
    </div>
  );
};

export default MainContent;