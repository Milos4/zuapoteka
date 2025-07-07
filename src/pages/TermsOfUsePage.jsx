import React from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import TermsOfUs from "../components/termsOfUs/TermsOfUs";

const TermsOfUsPage = () => {
  return (
    <div
      style={{
        fontFamily: "'Arial', sans-serif",
        color: "#006835",
        lineHeight: 1.6,
        backgroundColor: "#FAF1E6",
      }}
    >
      <TermsOfUs />
      <Footer />
    </div>
  );
};

export default TermsOfUsPage;
