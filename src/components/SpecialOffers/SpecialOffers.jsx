import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase";

import DiscountProduct from "./DiscountProduct";
import NewProduct from "./NewProduct";
import RegularProduct from "./RegularProduct";
import Arrows from "../arrows/Arrows";
import Popup from "../Popup";
import { useCart } from "../../context/CartContext";

import "./special-offers.css";

const SpecialOffers = () => {
  const [products, setProducts] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [user, setUser] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);

  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  const isMobile = windowWidth <= 768;

const handleToggleActive = (id) => {
  const el = document.getElementById(`product-${id}`);
  if (el) {
    el.classList.toggle("active");
  }
};

  useEffect(() => {
    // Praćenje promene veličine ekrana
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Vidljiv broj proizvoda na osnovu širine ekrana
  const visibleCount = windowWidth <= 1024 ? 1 : 6;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const q = query(
          collection(db, "wishlist"),
          where("userId", "==", currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const wishlistIds = snapshot.docs.map((doc) => doc.data().productId);
        setWishlistItems(wishlistIds);
      }
    });

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

    return () => unsubscribe();
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

  const handleAddToFavorite = async (product) => {
  if (!user) {
    setPopupMessage("Morate biti ulogovani da biste dodali proizvod u listu želja!");
    setShowPopup(true);
    return;
  }

  try {
    const wishlistRef = collection(db, "users", user.uid, "favorites");

    // Provera da li je proizvod već dodat
    const q = query(wishlistRef, where("productId", "==", product.id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      setPopupMessage("Ovaj proizvod je već u listi želja!");
      setShowPopup(true);
      return;
    }

    // Podaci za dodavanje
    const wishlistData = {
      productId: product.id,
      naziv: product.naziv,
      cijena: product.cijena,
      slikaURL: product.slikaURL,
      kategorija: product.kategorija || "Nepoznato",
      naPopustu: product.naPopustu || false,
      popustProcenat: product.popustProcenat || 0,
      brandImageUrl: product.brandImageUrl || "",
      dateAdded: new Date().toISOString(),
    };

    // Dodavanje u favorites podkolekciju korisnika
    await addDoc(wishlistRef, wishlistData);

    setWishlistItems((prev) => [...prev, product.id]);
    setPopupMessage("Proizvod je dodat u listu želja!");
    setShowPopup(true);
  } catch (error) {
    console.error("Greška:", error);
    setPopupMessage("Greška pri dodavanju u listu želja!");
    setShowPopup(true);
  }
};

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const renderProduct = (product) => {
    if (!product) return null;

    const price = parseFloat(product.cijena) || 0;
    const description = product.opis
      ? product.opis.split(" ").slice(0, 4).join(" ") + "..."
      : "";

    const inWishlist = wishlistItems.includes(product.id);

    const commonProps = {
      key: product.id,
      name: product.naziv,
      description,
      price: price.toFixed(2),
      image: product.slikaURL,
      onView: () => handleViewProduct(product.id),
      onAddToCart: () => addToCart(product),
      onAddToFavorites: () => handleAddToFavorite(product),
      inWishlist,
      onClick: isMobile ? () => handleToggleActive(product.id) : undefined,
  id: `product-${product.id}`,
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

  // Prikaz vidljivih proizvoda
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
    {/* Strelice su sada prisutne i na mobilnom i desktopu */}
    {products.length > 1 && (
      <Arrows onPrevClick={handlePrev} onNextClick={handleNext} />
    )}

    <div className="product-grid">
      {visibleProducts.length > 0 ? visibleProducts : <p>Učitavanje proizvoda...</p>}
    </div>

    <Popup isOpen={showPopup} message={popupMessage} onClose={handleClosePopup} />
  </div>
);
};

export default SpecialOffers;
