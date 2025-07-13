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
import { auth, db } from "../../../firebase";

import DiscountProduct from "../DiscountProduct";
import NewProduct from "../NewProduct";
import RegularProduct from "../RegularProduct";
import Popup from "../../Popup";
import { useCart } from "../../../context/CartContext";

import "./TopProducts.css";

const categoriesFilter = [
  "Imunitet",
 
  "Mama i bebe", 
  "Dijetetika i samoliječenje",
];

const TopProducts = () => {
  const [productsByCategory, setProductsByCategory] = useState({
    "Imunitet": [],
    "Mama i bebe": [],
    "Dijetetika i samoliječenje": [],
  });
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [user, setUser] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);
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
        const productsRef = collection(db, "products");
        const snapshot = await getDocs(productsRef);
        const allProducts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filtered = {};
        categoriesFilter.forEach(cat => filtered[cat] = []);

        allProducts.forEach(product => {
          const kategorija = product.kategorija || product.category || "";
          if (categoriesFilter.includes(kategorija)) {
            filtered[kategorija].push(product);
          }
        });

        // Ograničavamo na 5 proizvoda po kategoriji
        Object.keys(filtered).forEach(key => {
          filtered[key] = filtered[key].slice(0, 5);
        });

        setProductsByCategory(filtered);
      } catch (error) {
        console.error("Greška pri dohvatanju proizvoda:", error);
      }
    };

    fetchProducts();

    return () => unsubscribe();
  }, []);

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

  const shortDescription = (text) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.slice(0, 4).join(" ") + (words.length > 4 ? "..." : "");
  };

  const renderProduct = (product, index) => {
    if (!product) return null;

    const price = parseFloat(product.cijena) || 0;
    const description = product.opis
      ? product.opis.split(" ").slice(0, 4).join(" ") + "..."
      : "";

    const inWishlist = wishlistItems.includes(product.id);

    const commonProps = {
      key: product.id || index,
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

  return (
    <div className="top-products-container">
      <h2 className="top-products-title">Naši najbolji proizvodi</h2>
      <div className="top-products-grid">
        {categoriesFilter.map((category) => (
          <div key={category} className="product-column">
            <h3 className="column-title">{category}</h3>
            <div className="product-grid">
              {productsByCategory[category]?.length > 0 ? (
                productsByCategory[category].map((product, idx) => renderProduct(product, idx))
              ) : (
                <p>Trenutno nema proizvoda</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <Popup isOpen={showPopup} message={popupMessage} onClose={handleClosePopup} />
    </div>
  );
};

export default TopProducts;