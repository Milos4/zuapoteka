import React from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import TermsOfUs from "../components/termsOfUs/TermsOfUs";


const TermsOfUsPage = () => {
  return (
    <div>
      <Navbar />
      <TermsOfUs/>
      <Footer />
    </div>
  );
};

export default TermsOfUsPage;
