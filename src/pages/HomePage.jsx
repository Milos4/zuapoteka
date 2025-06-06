import React from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import BannerSlider from '../components/BannerSlider'; 
import PharmacyCategories from "../components/PharmacyCategories";
import SpecialOffers from "../components/SpecialOffers/SpecialOffers";
import ComboOffer from "../components/SpecialOffers/ComboOffer";
import BigComboProduct from "../components/SpecialOffers/BigComboOffer";
import MiniProduct from "../components/MiniProduct";
const banners = [
  {
    image: 'https://cdn.pixabay.com/photo/2021/10/11/17/54/technology-6701504_1280.jpg',
    alt: 'Loreal 30% popust',
    link: '/shop?brand=Loreal&discount=30'
  },
  {
    image: 'https://cdn.pixabay.com/photo/2016/11/21/15/46/computer-1846056_1280.jpg',
    alt: 'Nivea 20% popust',
    link: '/shop?brand=Nivea&discount=20'
  },
  {
    image: 'https://cdn.pixabay.com/photo/2017/04/23/19/30/earth-2254769_1280.jpg',
    alt: 'Maybelline Akcija',
    link: '/shop?brand=Maybelline'
  }
];

const HomePage = () => {
  return (
    <div style={{ backgroundColor: '#FAF1E6' }}>
      <Navbar />
      <BannerSlider banners={banners} />
<PharmacyCategories />
<SpecialOffers />
<ComboOffer 
  product1={{
    image: '/putanja/do/slike1.jpg',
    name: 'Proizvod 1'
  }}
  product2={{
    image: '/putanja/do/slike2.jpg',
    name: 'Proizvod 2'
  }}
  comboPrice={2999}
  regularPrice={3999}
/>
<BigComboProduct 
  product1={{
    image: '/putanja/do/slike1.jpg',
    name: 'Premium Proizvod 1'
  }}
  product2={{
    image: '/putanja/do/slike2.jpg',
    name: 'Premium Proizvod 2'
  }}
  comboPrice={4999}
  regularPrice={6999}
/>
<MiniProduct />
      {/* Ovde možeš dodati druge sekcije kao featured products itd. */}
      <Footer />
    </div>
  );
};

export default HomePage;
