import React from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import HeroSection from "../components/about/HeroSection";
import MainContent from "../components/about/MainContent";

import ValuesSection from "../components/about/ValuesSection";
import BottomImageSection from "../components/about/BottomImageSection";

const AboutPage = () => {
  return (
    <div style={{
      fontFamily: "'Arial', sans-serif",
      color: '#006835',
      lineHeight: 1.6,
      backgroundColor: '#FAF1E6',
    }}>
      <Navbar />
      <HeroSection />
      <MainContent />
      <ValuesSection />
      <BottomImageSection />
      <Footer />
    </div>
  );
};

export default AboutPage;