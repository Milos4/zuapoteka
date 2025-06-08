import React from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import DInfo from "../components/deliveryInformation/DeliveryInformation";

const DeliveryInformationPage = () => {
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
      <DInfo />
      <Footer />
    </div>
  );
};

export default DeliveryInformationPage;
