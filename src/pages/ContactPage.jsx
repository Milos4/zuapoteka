import React from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import Contact from "../components/contact/Contact";

const ContactPage = () => {
  return (
    <div
      style={{
        fontFamily: "'Arial', sans-serif",
        color: "#333",
        lineHeight: 1.6,
        backgroundColor: "#FAF1E6",
      }}
    >
      <Navbar />
      <Contact />
      <Footer />
    </div>
  );
};

export default ContactPage;
