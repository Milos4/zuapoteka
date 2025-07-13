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
  const visibleCount = 6;
  const navigate = useNavigate();
  const { addToCart } = useCart();

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
    if (user) {
      try {
        const wishlistRef = collection(db, "wishlist");
        const q = query(
          wishlistRef,
          where("userId", "==", user.uid),
          where("productId", "==", product.id)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setPopupMessage("Ovaj proizvod je već u listi želja!");
          setShowPopup(true);
          return;
        }

        const wishlistData = {
          userId: user.uid,
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

        const docRef = await addDoc(wishlistRef, wishlistData);

        setWishlistItems((prev) => [...prev, product.id]);
        setPopupMessage("Proizvod je dodat u listu želja!");
        setShowPopup(true);
      } catch (error) {
        console.error("Greška:", error);
        setPopupMessage("Greška pri dodavanju u listu želja!");
        setShowPopup(true);
      }
    } else {
      setPopupMessage("Morate biti ulogovani da biste dodali proizvod u listu želja!");
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
      inWishlist, // 🔴 Dodajemo prop da srce zna kad da pocrveni
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

      <Popup isOpen={showPopup} message={popupMessage} onClose={handleClosePopup} />
    </div>
  );
};

export default SpecialOffers;
