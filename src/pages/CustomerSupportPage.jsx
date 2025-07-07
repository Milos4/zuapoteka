import React from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import CSupport from "../components/customerSupport/CustomerSupport";

const CustomerSupportPage = () => {
  return (
    <div
      style={{
        fontFamily: "'Arial', sans-serif",
        color: "#333",
        lineHeight: 1.6,
        backgroundColor: "#FAF1E6",
      }}
    >
      <CSupport />
      <Footer />
    </div>
  );
};

export default CustomerSupportPage;
