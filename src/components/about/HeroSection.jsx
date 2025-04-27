import React from "react";
import slikaAp1 from "../../assets/slikaAp1.jpg";

const HeroSection = () => {
  return (
    <div style={{
      minHeight: '30vh', // Koristimo minHeight umjesto height za bolju responzivnost
      height: 'auto', // Dopušta sekciji da se proširi po potrebi
      backgroundImage: `url(${slikaAp1})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'local', // Bolje ponašanje pri zumiranju
      display: 'flex',
      alignItems: 'center',
      justifyContent: { xs: 'center', md: 'flex-start' }, // Centrirano na malim ekranima, lijevo na velikim
      position: 'relative',
      marginBottom: '4rem',
      padding: '2rem 5%',
      overflow: 'hidden',
      boxSizing: 'border-box',
    }}>
      <div style={{
        backgroundColor: 'rgba(0, 104, 53, 0.65)',
        padding: 'clamp(1.5rem, 3vw, 3rem) clamp(1rem, 2vw, 2rem)', // Responsiv padding
        borderRadius: '1rem',
        color: '#F1F7EE',
        textAlign: 'left',
        maxWidth: '50%', // Na malim ekranima zauzima više prostora
        width: '100%',
        boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(10px)',
        border: '2px solid #ffffff',
        margin: { xs: '0 auto', md: '0' }, // Centriranje na malim ekranima
      }}>
        <h1 style={{
          fontFamily: `'Dancing Script', cursive`,
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: '700',
          marginBottom: '1rem',
          lineHeight: '1.2',
          animation: 'wiggle 2s infinite ease-in-out',
          textAlign: { xs: 'center', md: 'left' }, // Centriranje teksta na malim ekranima
        }}>
          O nama
        </h1>
        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.8rem)', // Još responzivniji tekst
          fontWeight: '300',
          fontStyle: 'italic',
          lineHeight: '1.5',
          textAlign: { xs: 'center', md: 'left' }, // Centriranje teksta na malim ekranima
        }}>
          Vaš partner za zdravlje i savjetovanje
        </p>
      </div>

      <style>
        {`
          @keyframes wiggle {
            0% { transform: rotate(-1deg); }
            50% { transform: rotate(1deg); }
            100% { transform: rotate(-1deg); }
          }
          @media (max-width: 768px) {
            .hero-content {
              max-width: 100% !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default HeroSection;