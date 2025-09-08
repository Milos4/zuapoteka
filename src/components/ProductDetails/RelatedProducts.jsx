// src/components/ProductDetails/RelatedProducts.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";

import DiscountProduct from "../SpecialOffers/DiscountProduct";
import NewProduct from "../SpecialOffers/NewProduct";
import RegularProduct from "../SpecialOffers/RegularProduct";
import Arrows from "../arrows/Arrows";
import Popup from "../Popup";
import { useCart } from "../../context/CartContext";

import "./relatedProducts.css";

const RelatedProducts = ({ product }) => {
  const [products, setProducts] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const navigate = useNavigate();
  const { addToCart } = useCart();
  const isMobile = windowWidth <= 768;

  const handleToggleActive = (id) => {
    const el = document.getElementById(`product-${id}`);
    if (el) {
      el.classList.toggle("active");
    }
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleCount = windowWidth <= 1024 ? 1 : 6;

  useEffect(() => {
    if (!product) return;

    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const allProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const category = product.kategorija;
        const subcategory = product.subkategorija || null;

        let selectedProducts = [];

        // 1️⃣ Uzmi proizvode iz iste podkategorije
        if (subcategory) {
          const fromSub = allProducts.filter(
            p => p.kategorija === category && p.subkategorija === subcategory && p.id !== product.id
          );
          const shuffledSub = fromSub.sort(() => 0.5 - Math.random());
          selectedProducts = shuffledSub.slice(0, 10);
        }

        // 2️⃣ Dopuni sa iste kategorije (ako nema dovoljno)
        if (selectedProducts.length < 10) {
          const needed = 10 - selectedProducts.length;
          const fromCategory = allProducts.filter(
            p => p.kategorija === category && p.id !== product.id && !selectedProducts.some(sp => sp.id === p.id)
          );
          const shuffledCat = fromCategory.sort(() => 0.5 - Math.random());
          selectedProducts = [...selectedProducts, ...shuffledCat.slice(0, needed)];
        }

        // 3️⃣ Fallback: dopuni sa bilo kojih proizvoda
        if (selectedProducts.length < 10) {
          const needed = 10 - selectedProducts.length;
          const remaining = allProducts.filter(p => !selectedProducts.some(sp => sp.id === p.id) && p.id !== product.id);
          const shuffledRemaining = remaining.sort(() => 0.5 - Math.random());
          selectedProducts = [...selectedProducts, ...shuffledRemaining.slice(0, needed)];
        }

        setProducts(selectedProducts);
      } catch (error) {
        console.error("Greška pri dohvatanju proizvoda:", error);
      }
    };

    fetchProducts();
  }, [product]);

  const handleNext = () => setStartIndex(prev => (prev + 1) % products.length);
  const handlePrev = () => setStartIndex(prev => (prev - 1 + products.length) % products.length);
  const handleViewProduct = (productId) => navigate(`/product/${productId}`);
  const handleClosePopup = () => setShowPopup(false);

  const renderProduct = (p) => {
    if (!p) return null;

    const price = parseFloat(p.cijena) || 0;
    const description = p.opis ? p.opis.split(" ").slice(0, 4).join(" ") + "..." : "";

    const commonProps = {
      key: p.id,
      name: p.naziv,
      description,
      price: price.toFixed(2),
      image: p.slikaURL,
      onView: () => handleViewProduct(p.id),
      onAddToCart: () => addToCart(p),
      onAddToFavorites: () => {
        setPopupMessage("Funkcija lista želja još nije aktivna");
        setShowPopup(true);
      },
      onClick: isMobile ? () => handleToggleActive(p.id) : () => handleViewProduct(p.id),
      id: `product-${p.id}`,
    };

    if (p.naPopustu) {
      const popust = parseFloat(p.popustProcenat) || 0;
      const novaCijena = price - (price * popust) / 100;
      return <DiscountProduct {...commonProps} price={novaCijena.toFixed(2)} oldPrice={price.toFixed(2)} />;
    }

    if (p.novo) return <NewProduct {...commonProps} />;

    return <RegularProduct {...commonProps} />;
  };

  const visibleProducts = [];
  for (let i = 0; i < Math.min(visibleCount, products.length); i++) {
    const index = (startIndex + i) % products.length;
    const p = products[index];
    if (p) visibleProducts.push(renderProduct(p));
  }

  return (
    <div>
      <div className="related-title-container">
        <h1 className="h1-releted">Slični proizvodi</h1>
      </div>
      <div className="related-products-container">
        {products.length > 1 && <Arrows onPrevClick={handlePrev} onNextClick={handleNext} />}
        <div className="related-products-grid">
          {visibleProducts.length > 0 ? visibleProducts : <p>Učitavanje proizvoda...</p>}
        </div>
        <Popup isOpen={showPopup} message={popupMessage} onClose={handleClosePopup} />
      </div>
    </div>
  );
};

export default RelatedProducts;
 