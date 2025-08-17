// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDocs, setDoc,writeBatch ,deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await mergeLocalCartToFirestore(currentUser);
        fetchCartFromFirestore(currentUser);
      } else {
        setUser(null);
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(localCart);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchCartFromFirestore = async (user) => {
    const cartRef = collection(db, "users", user.uid, "cart");
    const snapshot = await getDocs(cartRef);
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setCartItems(items);
  };

const mergeLocalCartToFirestore = async (user) => {
  const localCart = JSON.parse(localStorage.getItem("cart")) || [];

  if (localCart.length === 0) return; // Nema šta da spaja

  // Učitaj Firestore korpu
  const cartRef = collection(db, "users", user.uid, "cart");
  const snapshot = await getDocs(cartRef);
  const firestoreCart = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Spoji korpe: uzmi sva jedinstvena id i saberi quantity ako se poklapaju
  const mergedCartMap = new Map();

  // Dodaj Firestore korpu u mapu
  firestoreCart.forEach(item => {
    mergedCartMap.set(item.id, { ...item });
  });

  // Dodaj ili saberi lokalnu korpu
  localCart.forEach(localItem => {
    if (mergedCartMap.has(localItem.id)) {
      mergedCartMap.get(localItem.id).quantity += localItem.quantity;
    } else {
      mergedCartMap.set(localItem.id, { ...localItem });
    }
  });

  // Pretvori mapu nazad u niz
  const mergedCart = Array.from(mergedCartMap.values());

  // Upisi spojenu korpu u Firestore
  const batch = writeBatch(db);
  mergedCart.forEach(item => {
    const docRef = doc(db, "users", user.uid, "cart", item.id);
    batch.set(docRef, item);
  });
  await batch.commit();

  // Postavi spojenu korpu u state
  setCartItems(mergedCart);

  // Obrisi lokalnu korpu
  localStorage.removeItem("cart");
};


  const addToCart = async (product, quantity = 1) => {
const existingIndex = cartItems.findIndex(
  (item) =>
    item.id === product.id &&
    item.selectedSize === product.selectedSize // ista veličina = ista stavka
);    let updatedCart;

    if (existingIndex !== -1) {
     updatedCart = [...cartItems, { ...product, quantity, selectedSize: product.selectedSize }];

      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart = [...cartItems, { ...product, quantity }];
    }

    setCartItems(updatedCart);

    if (user) {
      const docRef = doc(db, "users", user.uid, "cart", product.id);
      await setDoc(docRef, updatedCart.find((item) => item.id === product.id));
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  
  const clearCart = async () => {
    setCartItems([]);

    if (user) {
      const cartRef = collection(db, "users", user.uid, "cart");
      const snapshot = await getDocs(cartRef);
      const batch = writeBatch(db);
      snapshot.docs.forEach(docSnap => {
        batch.delete(doc(db, "users", user.uid, "cart", docSnap.id));
      });
      await batch.commit();
    } else {
      localStorage.removeItem("cart");
    }
  };

  const removeFromCart = async (productId) => {
  const updatedCart = cartItems.filter(item => item.id !== productId);
  setCartItems(updatedCart);

  if (user) {
    // Briši iz Firestore
    const docRef = doc(db, "users", user.uid, "cart", productId);
    await deleteDoc(docRef);
  } else {
    // Ažuriraj localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  }
};

const updateQuantity = async (productId, newQuantity) => {
  let updatedCart = [...cartItems];
  const index = updatedCart.findIndex(item => item.id === productId);

  if (index !== -1) {
    if (newQuantity <= 0) {
      // Ako je količina 0 ili manje, ukloni proizvod
      return removeFromCart(productId);
    }
    updatedCart[index].quantity = newQuantity;
    setCartItems(updatedCart);

    if (user) {
      const docRef = doc(db, "users", user.uid, "cart", productId);
      await setDoc(docRef, updatedCart[index]);
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  }
};

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartCount, addToCart ,setCartItems,clearCart,  removeFromCart,
  updateQuantity   }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
