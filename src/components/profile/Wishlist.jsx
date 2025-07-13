import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Wishlist.css";
import { SlBasket, SlTrash, SlEye } from "react-icons/sl";
import Popup from "../Popup";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchWishlistItems(currentUser.uid);
      } else {
        setWishlistItems([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchWishlistItems = async (userId) => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "wishlist"),
        where("userId", "==", userId)
      );
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWishlistItems(items);
    } catch (error) {
      console.error("Greška pri dohvatanju wishlist-a:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (wishlistItemId) => {
    try {
      await deleteDoc(doc(db, "wishlist", wishlistItemId));
      setWishlistItems((prev) =>
        prev.filter((item) => item.id !== wishlistItemId)
      );
      setPopupMessage("Proizvod je uklonjen iz liste želja!");
      setShowPopup(true);
    } catch (error) {
      console.error("Greška pri uklanjanju iz wishlist-a:", error);
      setPopupMessage("Greška pri uklanjanju iz liste želja!");
      setShowPopup(true);
    }
  };

  const handleAddToCart = (item) => {
    const product = {
      id: item.productId,
      naziv: item.naziv,
      cijena: item.cijena,
      slikaURL: item.slikaURL,
      kategorija: item.kategorija,
      naPopustu: item.naPopustu,
      popustProcenat: item.popustProcenat,
      brandImageUrl: item.brandImageUrl,
    };

    addToCart(product);
    setPopupMessage("Proizvod je dodat u korpu!");
    setShowPopup(true);
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  if (!user) {
    return (
      <div className="wishlist-container">
        <div className="wishlist-empty-state">
          <h2 className="wishlist-title">Moja lista želja</h2>
          <p className="wishlist-empty">
            Morate biti ulogovani da vidite svoju listu želja.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="wishlist-container">
        <div className="wishlist-empty-state">
          <h2 className="wishlist-title">Moja lista želja</h2>
          <p className="wishlist-empty">Učitavanje...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <h2 className="wishlist-title">Moja lista želja</h2>
      {wishlistItems.length === 0 ? (
        <div className="wishlist-empty-state">
          <p className="wishlist-empty">Vaša lista želja je prazna.</p>
        </div>
      ) : (
        <div className="wishlist-items">
          {wishlistItems.map((item) => {
            const novaCijena = item.naPopustu
              ? (item.cijena * (1 - item.popustProcenat / 100)).toFixed(2)
              : null;

            return (
              <div key={item.id} className="wishlist-item">
                <div className="wishlist-left">
                  <img
                    src={item.slikaURL}
                    alt="Proizvod"
                    className="wishlist-product-img"
                  />
                </div>

                <div className="wishlist-middle">
                  <h3 className="wishlist-naziv">{item.naziv}</h3>
                  <p className="wishlist-kategorija">{item.kategorija}</p>
                  {item.brandImageUrl && (
                    <img
                      src={item.brandImageUrl}
                      alt="Brend"
                      className="wishlist-brand-logo"
                    />
                  )}
                </div>

                <div className="wishlist-right">
                  <div className="wishlist-cijena">
                    {item.naPopustu ? (
                      <>
                        <span className="old-price">{item.cijena} KM</span>
                        <span className="new-price">{novaCijena} KM</span>
                      </>
                    ) : (
                      <span className="current-price">{item.cijena} KM</span>
                    )}
                  </div>
                  <div className="wishlist-actions">
                    <button
                      title="Dodaj u korpu"
                      onClick={() => handleAddToCart(item)}
                      className="wishlist-btn cart-btn"
                    >
                      <SlBasket />
                    </button>
                    <button
                      title="Vidi proizvod"
                      onClick={() => handleViewProduct(item.productId)}
                      className="wishlist-btn view-btn"
                    >
                      <SlEye />
                    </button>
                    <button
                      title="Ukloni iz liste"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      className="wishlist-btn remove-btn"
                    >
                      <SlTrash />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Popup komponenta */}
      <Popup
        isOpen={showPopup}
        message={popupMessage}
        onClose={handleClosePopup}
      />
    </div>
  );
};

export default Wishlist;
