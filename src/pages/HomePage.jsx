import React from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import BannerSlider from "../components/BannerSlider";
import PharmacyCategories from "../components/PharmacyCategories";
import SpecialOffers from "../components/SpecialOffers/SpecialOffers";
import ComboOffer from "../components/SpecialOffers/ComboOffer";
import BigComboProduct from "../components/SpecialOffers/BigComboOffer";
import MiniProduct from "../components/MiniProduct";
const banners = [
  {
    image:
      "https://www.nescafe.com/au/sites/default/files/2024-03/NESTHA1560---Cafe-Creations-and-Loreal-promo_2880x1200px_FA.jpg",
    alt: "Loreal 30% popust",
    link: "/shop?brand=Loreal&discount=30",
  },
  {
    image:
      "https://images-static.nykaa.com/uploads/5d65f189-346b-412d-aca6-784644225651.jpg?tr=cm-pad_resize,w-600",
    alt: "Nivea 20% popust",
    link: "/shop?brand=Nivea&discount=20",
  },
  {
    image:
      "https://api.watsons.com.ph/medias/WP.-1-Main-Banner-MNY-1260x526.jpg?context=bWFzdGVyfGltYWdlc3w4MzIzNXxpbWFnZS9qcGVnfGFHRmtMMmhqTlM4eE5qQXpPVEl4TmpJNE16WTNPQzlYVUM0Z01TQk5ZV2x1SUVKaGJtNWxjaUJOVGxrZ01USTJNSGcxTWpZdWFuQm58Yjc5YTg2MTUyYWYyZWVjZjRlNzVkNjk0NDI5NDkyYjY4MzQxOTAzMTI0ZTBjODE0NzkyYzNkZjE4NGU5MjYzNw",
    alt: "Maybelline Akcija",
    link: "/shop?brand=Maybelline",
  },
];

const HomePage = () => {
  return (
    <div style={{ backgroundColor: "#FAF1E6" }}>
      <Navbar />
      <BannerSlider banners={banners} />
      <PharmacyCategories />
      <SpecialOffers />
      <ComboOffer
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
      <Footer />
    </div>
  );
};

export default HomePage;
