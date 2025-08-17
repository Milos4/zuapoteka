import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "./ProductDetails.css";
import { useCart } from "../../context/CartContext";

import HeartIcon from "../Icons/HeartIcon";
import Popup from "../Popup";

const ProductDetails = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.velicine?.[0] || "");
  const [brand, setBrand] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [activeTab, setActiveTab] = useState("opis");

  const auth = getAuth();
  const user = auth.currentUser;
  const { addToCart } = useCart();

  const cijena = parseFloat(product.cijena || 0);
  const popust = parseFloat(product.popustProcenat || 0);
  const novaCijena = (cijena * (1 - popust / 100)).toFixed(2);

  const isClothing = product.kategorija?.toLowerCase() === "odjeca";

  useEffect(() => {
    const fetchBrand = async () => {
      if (!product.brandId) return;
      try {
        const brandRef = doc(db, "brands", product.brandId);
        const brandSnap = await getDoc(brandRef);
        if (brandSnap.exists()) {
          setBrand(brandSnap.data());
        }
      } catch (error) {
        console.error("Greška pri dohvatanju brenda:", error);
      }
    };
    fetchBrand();
  }, [product.brandId]);

  const handleAddToCart = () => {
    if (isClothing && !selectedSize) {
      setPopupMessage("Molimo odaberite veličinu.");
      setPopupOpen(true);
      return;
    }

    addToCart({ ...product, selectedSize }, quantity);
    setPopupMessage(`Dodano ${quantity} kom u korpu!`);
    setPopupOpen(true);
  };

  const handleAddToFavorites = async () => {
    if (!user) {
      setPopupMessage("Morate biti prijavljeni da biste dodali u favorite.");
      setPopupOpen(true);
      return;
    }

    const favRef = doc(db, "users", user.uid, "favorites", product.id);
    await setDoc(favRef, { ...product });
    setPopupMessage("Dodano u favorite!");
    setPopupOpen(true);
  };

  const handleIncrease = () => setQuantity((q) => q + 1);
  const handleDecrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  return (
    <div className="product-details-wrapper">
      <div className="product-image-container">
        <img
          src={product.slikaURL || "https://via.placeholder.com/400"}
          alt={product.naziv}
        />
      </div>

      <div className="product-main-info">
        <h2>{product.naziv}</h2>

        <div className="category">
          {product.kategorija}
          {product.subkategorije?.length ? ` → ${product.subkategorije.join(", ")}` : ""}
        </div>

        {/* Tabovi se prikazuju samo ako nije odjeća */}
        {!isClothing && (
          <div className="tab-buttons">
            <button
              className={activeTab === "opis" ? "active-tab" : ""}
              onClick={() => setActiveTab("opis")}
            >
              Opis
            </button>
            <button
              className={activeTab === "nacinUpotrebe" ? "active-tab" : ""}
              onClick={() => setActiveTab("nacinUpotrebe")}
            >
              Način upotrebe
            </button>
            <button
              className={activeTab === "sastav" ? "active-tab" : ""}
              onClick={() => setActiveTab("sastav")}
            >
              Sastav
            </button>
          </div>
        )}

        <div className="description">
          {activeTab === "opis" && (product.opis || "Nema opisa.")}
          {!isClothing && activeTab === "nacinUpotrebe" && (product.nacinUpotrebe || "Nema načina upotrebe.")}
          {!isClothing && activeTab === "sastav" && (product.sastav || "Nema sastava.")}
        </div>

        {brand && (
          <div className="brand-logo-wrapper">
            <img
              src={brand.imageUrl}
              alt="Brand logo"
              className="brand-logo-only"
            />
          </div>
        )}

        {/* Prikaz veličina samo za odjeću */}
        {isClothing && product.velicine?.length > 0 && (
          <div className="size-selector">
            <span>Veličina: </span>
            {product.velicine.map((size) => (
              <button
                key={size}
                className={`size-button ${selectedSize === size ? "selected" : ""}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="product-purchase">
        <div className="price-container">
          {popust > 0 ? (
            <>
              <div className="price-rows">
                <div className="original-price crossed">{cijena.toFixed(2)} BAM</div>
                <div className="discounted-price">{novaCijena} BAM</div>
              </div>
              <div className="discount-circle">-{popust}%</div>
            </>
          ) : (
            <div className="original-price">{cijena.toFixed(2)} BAM</div>
          )}

          <button
            className="favorite-icon-btn"
            onClick={handleAddToFavorites}
            aria-label="Dodaj u favorite"
            title="Dodaj u favorite"
          >
            <HeartIcon />
          </button>
        </div>

        <div className="purchase-controls">
          {product.naStanju ? (
            <>
              <div className="quantity-selector">
                <button className="quantity-button-1" onClick={handleDecrease}>
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  min="1"
                  className="quantity-input"
                  readOnly
                />
                <button className="quantity-button-2" onClick={handleIncrease}>
                  +
                </button>
              </div>

              <button className="add-to-cart" onClick={handleAddToCart}>
                Dodaj u korpu
              </button>
            </>
          ) : (
            <div className="out-of-stock">Nema na stanju</div>
          )}
        </div>
      </div>

      <Popup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        message={popupMessage}
      />
    </div>
  );
};

export default ProductDetails;
