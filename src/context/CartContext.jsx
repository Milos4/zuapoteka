// src/context/CartContext.jsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const auth = getAuth();

  const persistCart = useCallback(async (items, currentUser = user) => {
    if (currentUser) {
      const batch = writeBatch(db);
      const cartCollectionRef = collection(db, "users", currentUser.uid, "cart");
      const existingSnapshot = await getDocs(cartCollectionRef);

      existingSnapshot.docs.forEach((docSnap) => {
        if (!items.some((item) => item.id === docSnap.id)) {
          batch.delete(doc(db, "users", currentUser.uid, "cart", docSnap.id));
        }
      });

      items.forEach((item) => {
        const docRef = doc(db, "users", currentUser.uid, "cart", item.id);
        batch.set(docRef, item);
      });

      await batch.commit();
      return;
    }

    localStorage.setItem("cart", JSON.stringify(items));
  }, [user]);

  const refreshCartProducts = useCallback(async (items, currentUser = user) => {
    if (!items.length) {
      setCartItems([]);
      if (!currentUser) {
        localStorage.removeItem("cart");
      }
      return [];
    }

    const refreshedItems = await Promise.all(
      items.map(async (item) => {
        try {
          const productRef = doc(db, "products", item.id);
          const productSnap = await getDoc(productRef);

          if (!productSnap.exists()) {
            return item;
          }

          const freshProduct = productSnap.data();
          const sizeDoplata = Number(item.sizeDoplata || 0);
          const baseCijena = Number(freshProduct.cijena || 0);

          return {
            ...item,
            ...freshProduct,
            id: item.id,
            quantity: item.quantity,
            selectedSize: item.selectedSize || null,
            selectedColor: item.selectedColor || null,
            sizeDoplata,
            cijena: baseCijena + sizeDoplata,
          };
        } catch (error) {
          console.error("Greska pri osvjezavanju proizvoda u korpi:", error);
          return item;
        }
      })
    );

    setCartItems(refreshedItems);
    await persistCart(refreshedItems, currentUser);
    return refreshedItems;
  }, [persistCart, user]);

  const fetchCartFromFirestore = useCallback(async (currentUser) => {
    const cartRef = collection(db, "users", currentUser.uid, "cart");
    const snapshot = await getDocs(cartRef);
    const items = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    await refreshCartProducts(items, currentUser);
  }, [refreshCartProducts]);

  const mergeLocalCartToFirestore = useCallback(async (currentUser) => {
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];

    if (localCart.length === 0) return;

    const cartRef = collection(db, "users", currentUser.uid, "cart");
    const snapshot = await getDocs(cartRef);
    const firestoreCart = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    const mergedCartMap = new Map();

    firestoreCart.forEach((item) => {
      mergedCartMap.set(item.id, { ...item });
    });

    localCart.forEach((localItem) => {
      if (mergedCartMap.has(localItem.id)) {
        mergedCartMap.get(localItem.id).quantity += localItem.quantity;
      } else {
        mergedCartMap.set(localItem.id, { ...localItem });
      }
    });

    const mergedCart = Array.from(mergedCartMap.values());
    const batch = writeBatch(db);

    mergedCart.forEach((item) => {
      const docRef = doc(db, "users", currentUser.uid, "cart", item.id);
      batch.set(docRef, item);
    });

    await batch.commit();
    await refreshCartProducts(mergedCart, currentUser);
    localStorage.removeItem("cart");
  }, [refreshCartProducts]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await mergeLocalCartToFirestore(currentUser);
        await fetchCartFromFirestore(currentUser);
      } else {
        setUser(null);
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];
        await refreshCartProducts(localCart, null);
      }
    });

    return () => unsubscribe();
  }, [auth, fetchCartFromFirestore, mergeLocalCartToFirestore, refreshCartProducts]);

  const addToCart = async (product, quantity = 1) => {
    const normalizeSize = (size) =>
      size && typeof size === "object" ? size.broj : size;
    const normalizeColor = (color) =>
      color && typeof color === "object" ? color.name || color : color;

    const existingIndex = cartItems.findIndex(
      (item) =>
        item.id === product.id &&
        normalizeSize(item.selectedSize) === normalizeSize(product.selectedSize) &&
        normalizeColor(item.selectedColor) === normalizeColor(product.selectedColor)
    );

    const updatedCart = [...cartItems];

    if (existingIndex !== -1) {
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart.push({ ...product, quantity });
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

      snapshot.docs.forEach((docSnap) => {
        batch.delete(doc(db, "users", user.uid, "cart", docSnap.id));
      });

      await batch.commit();
    } else {
      localStorage.removeItem("cart");
    }
  };

  const removeFromCart = async (productId) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    setCartItems(updatedCart);

    if (user) {
      const docRef = doc(db, "users", user.uid, "cart", productId);
      await deleteDoc(docRef);
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    const updatedCart = [...cartItems];
    const index = updatedCart.findIndex((item) => item.id === productId);

    if (index !== -1) {
      if (newQuantity <= 0) {
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

  const refreshCart = useCallback(async () => {
    if (user) {
      await fetchCartFromFirestore(user);
      return;
    }

    const localCart = JSON.parse(localStorage.getItem("cart")) || [];
    await refreshCartProducts(localCart, null);
  }, [fetchCartFromFirestore, refreshCartProducts, user]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        setCartItems,
        clearCart,
        removeFromCart,
        updateQuantity,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
