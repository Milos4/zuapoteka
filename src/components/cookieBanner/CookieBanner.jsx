import React, { useState, useEffect } from "react";
import "./CookieBanner.css";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Provjera da li je korisnik već prihvatio kolačiće
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner">
      <p>
        Koristimo kolačiće za unapređenje korisničkog iskustva. Nastavkom korištenja sajta
        prihvatate njihovu upotrebu. 
      </p>
      <button onClick={acceptCookies} className="cookie-button">
        U redu
      </button>
    </div>
  );
};

export default CookieBanner;