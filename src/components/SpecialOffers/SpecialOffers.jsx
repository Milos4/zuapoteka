import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // 👈 Dodato
import { db } from "../../firebase";

import DiscountProduct from "./DiscountProduct";
import NewProduct from "./NewProduct";
import RegularProduct from "./RegularProduct";
import Arrows from "../arrows/Arrows";
import { useCart } from "../../context/CartContext";


import "./special-offers.css";

const SpecialOffers = () => {
  const [products, setProducts] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 6;
  const navigate = useNavigate(); // 👈 Hook za navigaciju
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const allProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const shuffled = allProducts.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 10);
        setProducts(selected);
      } catch (error) {
        console.error("Greška pri dohvatanju proizvoda:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleNext = () => {
    setStartIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  const handlePrev = () => {
    setStartIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const renderProduct = (product) => {
    if (!product) return null;

    const price = parseFloat(product.cijena) || 0;
    const description = product.opis
      ? product.opis.split(" ").slice(0, 4).join(" ") + "..."
      : "";

    const commonProps = {
      key: product.id,
      name: product.naziv,
      description,
      price: price.toFixed(2),
      image: product.slikaURL,
      onView: () => handleViewProduct(product.id), 
       onAddToCart: () => addToCart(product),// 👈 klik handler
    };

    if (product.naPopustu) {
      const popust = parseFloat(product.popustProcenat) || 0;
      const novaCijena = price - (price * popust) / 100;

      return (
        <DiscountProduct
          {...commonProps}
          price={novaCijena.toFixed(2)}
          oldPrice={price.toFixed(2)}
        />
      );
    }

    if (product.novo) {
      return <NewProduct {...commonProps} />;
    }

    return <RegularProduct {...commonProps} />;
  };

  const visibleProducts = [];
  for (let i = 0; i < Math.min(visibleCount, products.length); i++) {
    const index = (startIndex + i) % products.length;
    const product = products[index];
    if (product) {
      visibleProducts.push(renderProduct(product));
    }
  }

  return (
    <div className="special-offers-container">
      {products.length > visibleCount && (
        <Arrows onPrevClick={handlePrev} onNextClick={handleNext} />
      )}
      <div className="product-grid">
        {visibleProducts.length > 0 ? visibleProducts : <p>Učitavanje proizvoda...</p>}
      </div>
    </div>
  );
};

export default SpecialOffers;
