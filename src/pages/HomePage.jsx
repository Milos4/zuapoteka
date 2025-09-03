import React, { useState, useEffect } from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import BannerSlider from "../components/BannerSlider";
import PharmacyCategories from "../components/PharmacyCategories";
import SpecialOffers from "../components/SpecialOffers/SpecialOffers";
import ComboOffer from "../components/SpecialOffers/ComboOffer";
import BigComboProduct from "../components/SpecialOffers/BigComboOffer";
import MiniProduct from "../components/MiniProduct";
import TopProducts from "../components/SpecialOffers/TopProducts/TopProducts";
import TripleBannerSlider from "../components/TripleBannerSlider";
import FeaturesSection from "../components/FeaturesSection";
import BrandSlider from "../components/BrandSlider";
import BrandCarousel from "../components/BrandCarousel";

import UpdateMissingFields from "./UpdateMissingFields";


import biodermaBanner from "../assets/banners/Bioderma20.jpg";
import laRocheBanner from "../assets/banners/LaRoche10.jpg";
import vichyBanner from "../assets/banners/Vichy10.jpg";
import ceraVeBanner from "../assets/banners/CeraVe10.jpg";


const banners = [
  {
    image:biodermaBanner,
    alt: "Maybelline Akcija",
    filters: {
      brand: "Nivea",
      discount: true,
    },
  },
  {
    image: laRocheBanner,
    alt: "Skincare proizvodi",
    filters: {
      category: "Mama i bebe",
    },
  },
  {
    image: vichyBanner,
    alt: "Novo u ponudi",
    filters: {
      new: true,
    },
  },

   {
    image: ceraVeBanner,
    alt: "Novo u ponudi",
    filters: {
      new: true,
    },
  },
];

const HomePage = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div
      style={{
        fontFamily: "'Arial', sans-serif",
        color: "#333",
        lineHeight: 1.6,
        backgroundColor: "#FAF1E6",
      }}
    >

      <BannerSlider banners={banners.slice(0, 4)} />
      
      <PharmacyCategories />
      <SpecialOffers />
      
      {/* Prvi TripleBannerSlider - koristi prve 3 bannera */}
      {!isMobile && <TripleBannerSlider banners={banners.slice(0, 6)} />}
      
      {/* Drugi TripleBannerSlider - koristi sledeće 3 bannera (ako postoje)
     {banners.length > 3 && (
         <TripleBannerSlider banners={banners.slice(3, 6)} />*/}
      <FeaturesSection />
      <TopProducts />
      {/*<ComboOffer
        product1={{
          image: "/putanja/do/slike1.jpg",
          name: "Proizvod 1",
        }}
        product2={{
          image: "/putanja/do/slike2.jpg",
          name: "Proizvod 2",
        }}
        comboPrice={299}
        regularPrice={399}
      />
      <BigComboProduct
        product1={{
          image: "/putanja/do/slike1.jpg",
          name: "Premium Proizvod 1",
        }}
        product2={{
          image: "/putanja/do/slike2.jpg",
          name: "Premium Proizvod 2",
        }}
        comboPrice={49}
        regularPrice={69}
      />
      <MiniProduct />
      {/* Ovde možeš dodati druge sekcije kao featured products itd. */}
      <BrandCarousel />
      <Footer />
    </div>
  );
};

export default HomePage;
