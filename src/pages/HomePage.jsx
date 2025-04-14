import React from "react";
import Navbar from "../components/NavBar";
import Banner from "../components/Banner";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <div>
      <Navbar />
      {/* Ovde možeš dodati druge sekcije kao featured products itd. */}
      <Footer />
    </div>
  );
};

export default HomePage;
