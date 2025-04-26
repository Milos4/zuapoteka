// src/pages/AboutPage.js

import React from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import slikaAp1 from "../assets/slikaAp1.jpg";
import apotekarka5 from "../assets/apotekarka5.jpg";


const AboutPage = () => {
  return (
    <div style={styles.aboutContainer}>
      <Navbar />

      {/* Hero Section */}
      <div style={{ ...styles.heroSection, backgroundImage: `url(${slikaAp1})` }}>
        <div style={styles.heroOverlay}>
          <h1 style={styles.heroTitle}>O nama</h1>
          <p style={styles.heroSubtitle}>Vaš partner za zdravlje i savjetovanje</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.contentSection}>
        <div style={styles.contentBox}>
          <h2 style={styles.sectionTitle}>Dobrodošli u Apoteku "Higra-Sarić"</h2>
          <p style={styles.paragraph}>
            Sa tradicijom dugom preko dvije decenije, Apoteka "Higra-Sarić" postala je simbol povjerenja i kvaliteta u farmaceutskoj zaštiti zdravlja.
            Naš stručni tim svakodnevno ulaže napore da vam pruži personalizovanu podršku i najviši nivo usluge.
            Vođeni idejom da zdravlje nema alternativu, neprestano se usavršavamo, prateći najsavremenije farmaceutske prakse i inovacije.
            Posvećeni smo tome da svaki naš klijent osjeti sigurnost, stručnost i toplinu već pri prvom dolasku.
            Bilo da vam je potrebna stručna konsultacija, pomoć u izboru terapije ili savjet za očuvanje zdravlja, mi smo tu da vam budemo pouzdan partner na svakom koraku.
            Vaše povjerenje nam je najveća nagrada i svakodnevna inspiracija da budemo još bolji.
          </p>
          <p style={styles.paragraph}>
            Danas, kroz dvije moderno opremljene apoteke, nastavljamo da rastemo zajedno sa našim klijentima, oslanjajući se na znanje, iskustvo i najnovije farmaceutske standarde.
          </p>
        </div>

        <div style={styles.contentBox}>
          <img src={apotekarka5} alt="Farmaceutski tim" style={styles.teamImage} />
        </div>

        {/* Mission Section */}
        <div style={styles.contentBox}>
          <h2 style={styles.sectionTitle}>Naša misija</h2>
          <p style={styles.paragraph}>
            Naša misija je biti prvi izbor za sve potrebe očuvanja zdravlja - kroz stručnu, odgovornu i posvećenu farmaceutsku uslugu.
            Cilj nam je izgradnja trajnog povjerenja pružanjem savremenih terapijskih rješenja i edukacije zajednice.
          </p>
        </div>

        {/* Practice Section */}
        <div style={styles.contentBox}>
          <h2 style={styles.sectionTitle}>Naša praksa</h2>
          <p style={styles.paragraph}>
            Apoteka Higra-Sarić njeguje principe Dobre apotekarske prakse. Svaki naš klijent može očekivati individualan pristup, diskreciju,
            i sveobuhvatan farmaceutski savjet uz najviši standard izdavanja lijekova i preporuka proizvoda.
          </p>
          <p style={styles.paragraph}>
            Zahvaljujemo se na povjerenju koje nam ukazujete. Naš cilj je da vaše zdravlje ostane na prvom mjestu - uz stručnu podršku i osmijeh našeg tima.
          </p>
          <p style={styles.signature}>Vaše zdravlje, naša odgovornost. Srdačno, Higra-Sarić</p>
        </div>
      </div>
        
      {/* Values Section */}
      <div style={styles.valuesContainer}>
        <div style={{ ...styles.valueBox, backgroundColor: '#E4EFE7' }}>
          <div style={styles.icon}>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3V21" stroke="#006835" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 6L5 18" stroke="#006835" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 18L5 6" stroke="#006835" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 style={styles.valueTitle}>Stručnost</h3>
          <p style={styles.valueText}>
            Naši farmaceuti neprestano unapređuju svoje znanje kako bi vam pružili najbolji savjet i vrhunsku uslugu, prateći najnovije standarde moderne farmacije.
          </p>
        </div>

        <div style={{ ...styles.valueBox, backgroundColor: '#E4EFE7' }}>
          <div style={styles.icon}>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 12H16" stroke="#006835" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8V16" stroke="#006835" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#006835" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 style={styles.valueTitle}>Povjerenje</h3>
          <p style={styles.valueText}>
            Gradimo odnose povjerenja sa našim klijentima kroz personalizovanu pažnju, diskreciju i iskrenu brigu za vaše zdravlje.
          </p>
        </div>

        <div style={{ ...styles.valueBox, backgroundColor: '#E4EFE7' }}>
          <div style={styles.icon}>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#006835" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8V12L15 15" stroke="#006835" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 style={styles.valueTitle}>Dostupnost</h3>
          <p style={styles.valueText}>
            Uvijek smo uz vas kada vam je potrebna stručna pomoć, savjet ili podrška, dostupni svakog radnog dana i vikendom.
          </p>
        </div>
      </div>

      {/* Bottom Image Section */}
      <div style={{ ...styles.heroSection, height: '30vh', marginBottom: '0' }}>
        <div style={styles.heroOverlay}>
          <h2 style={styles.heroTitle}>Hvala Vam na ukazanom povjerenju</h2>
          <p style={styles.heroSubtitle}>Vaše zdravlje je naša briga</p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// Stilovi
const styles = {
  aboutContainer: {
    fontFamily: "'Arial', sans-serif",
    color: '#006835',
    lineHeight: 1.6,
    backgroundColor: '#FAF1E6',
  },
  heroSection: {
    height: '30vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '2rem',
  },
  heroOverlay: {
    backgroundColor: 'rgba(0, 104, 53, 0.5)',
    padding: '2rem',
    textAlign: 'center',
    color: '#F1F7EE',
    width: '80%',
    borderRadius: '10px',
  },
  heroTitle: {
    fontSize: '3rem',
    marginBottom: '1rem',
    fontWeight: '700',
  },
  heroSubtitle: {
    fontSize: '1.5rem',
    fontWeight: '300',
  },
  contentSection: {
    backgroundColor: '#FAF1E6',
    display: 'flex',
    flexWrap: 'wrap',
    padding: '2rem 5%',
    gap: '2rem',
    justifyContent: 'center',
    marginBottom: '3rem',
  },
  contentBox: {
    backgroundColor: '#E4EFE7',
    flex: '1 1 45%',
    minWidth: '300px',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    borderTop: '5px solid #006835',
  },
  sectionTitle: {
    color: '#006835',
    marginBottom: '1.5rem',
    fontSize: '2rem',
  },
  sectionTitleCentered: {
    color: '#006835',
    marginBottom: '1.5rem',
    fontSize: '2rem',
    textAlign: 'center',
  },
  paragraph: {
    marginBottom: '1rem',
    fontSize: '1.5rem',
  },
  paragraphCentered: {
    marginBottom: '1rem',
    fontSize: '1.5rem',
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
  },
  teamImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    objectFit: 'cover',
  },
  valuesContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '2rem 5%',
    flexWrap: 'wrap',
    gap: '2rem',
    marginBottom: '3rem',
  },
  valueBox: {
    flex: '1',
    minWidth: '250px',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    borderTop: '5px solid #006835',
    textAlign: 'center',
  },
  icon: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  valueTitle: {
    color: '#006835',
    marginBottom: '1rem',
    fontSize: '1.5rem',
  },
  valueText: {
    fontSize: '1.5rem',
    lineHeight: 1.5,
  },
  signature: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: '2rem',
    color: '#006835',
    fontSize: '1.2rem',
  },
};

export default AboutPage;