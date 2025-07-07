import React from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import FAQ from "../components/faq/FAQ";

const FAQPage = () => {
  return (
    <div
      style={{
        fontFamily: "'Arial', sans-serif",
        color: "#006835",
        lineHeight: 1.6,
        backgroundColor: "#FAF1E6",
      }}
    >
      <FAQ />
      <Footer />
    </div>
  );
};

export default FAQPage;
