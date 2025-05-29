import React from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import Complaints from "../components/complaints/Complaints";

const ComplaintsPage = () => {
  return (
    <div
      style={{
        fontFamily: "'Arial', sans-serif",
        color: "#006835",
        lineHeight: 1.6,
        backgroundColor: "#FAF1E6",
      }}
    >
      <Navbar />
      <Complaints />
      <Footer />
    </div>
  );
};

export default ComplaintsPage;
