import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc , collection, addDoc, serverTimestamp} from "firebase/firestore";

import { db } from "../../firebase";
import "./ProductDetails.css";
import { useCart } from "../../context/CartContext";

import HeartIcon from "../Icons/HeartIcon";
import Popup from "../Popup";

const ProductDetails = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
const [selectedSize, setSelectedSize] = useState("");
const [selectedColor, setSelectedColor] = useState("");
  const [brand, setBrand] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [activeTab, setActiveTab] = useState("opis");

  const [freshProduct, setFreshProduct] = useState(product);

  const auth = getAuth();
  const user = auth.currentUser;
  const { addToCart } = useCart();

  const cijena = parseFloat(freshProduct.cijena || 0);
  const naPopustu = freshProduct.naPopustu === true;
  const popust = parseFloat(freshProduct.popustProcenat || 0);
  const novaCijena = (cijena * (1 - popust / 100)).toFixed(2);

const kategorijaLower = product.kategorija?.toLowerCase();
const hasSizes = kategorijaLower === "odjeca" || kategorijaLower === "obuca";
const isObuca = kategorijaLower === "obuca";

const [showInquiry, setShowInquiry] = useState(false);
const [inquiryEmail, setInquiryEmail] = useState("");
const [sendingInquiry, setSendingInquiry] = useState(false);

const COLOR_MAP = {
  crna: "#000000",
  bijela: "#ffffff",
  siva: "#9e9e9e",
  plava: "#1976d2",
  crvena: "#d32f2f",
  zelena: "#388e3c",
  žuta: "#fbc02d",
  braon: "#6d4c41",
};
const getColorValue = (color) =>
  COLOR_MAP[color?.toLowerCase()] || "#cccccc";

const handleSendInquiry = async () => {
  if (!inquiryEmail || !inquiryEmail.includes("@")) {
    setPopupMessage("Unesite ispravan email.");
    setPopupOpen(true);
    return;
  }

  try {
    setSendingInquiry(true);

    await addDoc(collection(db, "productInquiries"), {
      productId: product.id,
      productName: product.naziv,
      email: inquiryEmail,
      answered: false,
      createdAt: serverTimestamp(),
    });

    setPopupMessage("Upit je poslan. Javićemo vam se na email.");
    setPopupOpen(true);
    setShowInquiry(false);
    setInquiryEmail("");
  } catch (err) {
    console.error(err);
    setPopupMessage("Greška prilikom slanja upita.");
    setPopupOpen(true);
  } finally {
    setSendingInquiry(false);
  }
};

  useEffect(() => {
    const fetchProduct = async () => {
      if (!product.id) return;
      try {
        const productRef = doc(db, "products", product.id);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          setFreshProduct(productSnap.data());
        }
      } catch (error) {
        console.error("Greška pri dohvatanju proizvoda:", error);
      }
    };
    fetchProduct();
  }, [product.id]);

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
  console.log(freshProduct);

  if (hasSizes && !selectedSize) {
    setPopupMessage(
      kategorijaLower === "obuca"
        ? "Molimo odaberite broj."
        : "Molimo odaberite veličinu."
    );
    setPopupOpen(true);
    return;
  }
  if (isObuca && !selectedColor) {
  setPopupMessage("Molimo odaberite boju.");
  setPopupOpen(true);
  return;
}

  addToCart(
    {
      ...product,
      selectedSize: hasSizes ? selectedSize : null,
        selectedColor: isObuca ? selectedColor : null,
    },
    quantity
  );

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
          {product.subkategorije?.length
            ? ` → ${product.subkategorije.join(", ")}`
            : ""}
        </div>

        {/* Tabovi se prikazuju samo ako nije odjeća */}
        {!hasSizes && (
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
          {!hasSizes && activeTab === "nacinUpotrebe" &&
            (product.nacinUpotrebe || "Nema načina upotrebe.")}
          {!hasSizes && activeTab === "sastav" && 
            (product.sastav || "Nema sastava.")}
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
       {hasSizes && product.velicine?.length > 0 && (
  <div className="size-selector">
    <span>
      {kategorijaLower === "obuca" ? "Broj:" : "Veličina:"}
    </span>

    {product.velicine.map((size) => (
      <button
        key={size}
        className={`size-button ${
          selectedSize === size ? "selected" : ""
        }`}
        onClick={() => setSelectedSize(size)}
      >
        {size}
      </button>
    ))}

    {!selectedSize && (
      <div className="size-warning">
        Odaberite {kategorijaLower === "obuca" ? "broj" : "veličinu"}
      </div>
    )}
  </div>
)}
    {/* ====== BOJA (SAMO ZA OBUĆU) ====== */}
{isObuca && product.boje?.length > 0 && (
  <div className="color-selector">
    <span>Boja:</span>

    <div className="color-buttons">
      {product.boje.map((color) => (
       <button
  key={color}
  className={`color-button ${
    selectedColor === color ? "selected" : ""
  }`}
  onClick={() => setSelectedColor(color)}
>
  <span
    className="color-dot"
    style={{ backgroundColor: getColorValue(color) }}
  />
  {color}
</button>
      ))}
    </div>

    {!selectedColor && (
      <div className="color-warning">
        Odaberite boju
      </div>
    )}
  </div>
)}
      </div>
      

      <div className="product-purchase">
        {product.naStanju && (
  <div className="price-container">
    {popust > 0 && naPopustu ? (
      <>
        <div className="price-rows">
          <div className="original-price crossed">
            {cijena.toFixed(2)} BAM
          </div>
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
)}

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
           <div className="out-of-stock-wrapper">
  <div className="out-of-stock">Nema na stanju</div>

  <div className="out-of-stock-txt">Popunite formular sa Vašim e-mailom kako bismo Vas obavijestili o dostupnosti i cijeni ovog proizvoda.</div>

  {!showInquiry ? (
    <button
      className="inquiry-btn"
      onClick={() => setShowInquiry(true)}
    >
      Pošalji upit
    </button>
  ) : (
    <div className="inquiry-form">
      <input
        type="email"
        placeholder="Vaš email"
        value={inquiryEmail}
        onChange={(e) => setInquiryEmail(e.target.value)}
      />
      <button
        onClick={handleSendInquiry}
        disabled={sendingInquiry}
      >
        {sendingInquiry ? "Slanje..." : "Pošalji"}
      </button>
    </div>
  )}
</div>
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
