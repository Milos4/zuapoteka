import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, } from "lucide-react";
import logo from "../assets/Logo1.png";
import { useCart } from "../context/CartContext";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import "./MobileNavbar.css";
import { FaShoppingCart, FaUser,FaX } from "react-icons/fa";

const MobileNavbar = () => {
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().username || user.email);
        }
      } else {
        setUsername("");
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleLogout = async () => {
    await signOut(auth);
    setMenuOpen(false);
    navigate("/prijava");
  };

  return (
    <>
      <div className="mobile-nav-wrapper">
        <div className="mobile-nav-bar">
          <Link to="/" className="mobile-nav-logo">
            <img src={logo} alt="Logo" className="logo" />
          </Link>

          <div className="mobile-nav-icons">
            <Link to="/korpa" className="mobile-nav-cart-icon">
              <FaShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="mobile-nav-cart-count">{cartCount}</span>
              )}
            </Link>
            <button className="mobile-nav-menu-toggle" onClick={toggleMenu}>
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      <div className={`mobile-nav-side-menu ${menuOpen ? "open" : ""}`}>
        {user ? (
          <>
            <div className="mobile-nav-user"><FaUser size={22} /> {username}</div>
            <Link to="/profil?tab=zelje" onClick={toggleMenu}>Lista želja</Link>
            <Link to="/profil?tab=istorija" onClick={toggleMenu}>Moje narudžbe</Link>
          </>
        ) : (
          <>
            <Link to="/prijava" onClick={toggleMenu}>Prijava</Link>
            <Link to="/registracija" onClick={toggleMenu}>Registracija</Link>
          </>
        )}

        <Link to="/" onClick={toggleMenu}>Početna</Link>
        <Link to="/prodavnica" onClick={toggleMenu}>Prodavnica</Link>
        <Link to="/o-nama" onClick={toggleMenu}>O nama</Link>
        <Link to="/kontakt" onClick={toggleMenu}>Kontakt</Link>

        {user && (
          <button
            onClick={handleLogout}
            className="mobile-nav-logout"
          >
            Odjavi se
          </button>
        )}
      </div>

      {/* Background overlay */}
      {menuOpen && <div className="mobile-nav-overlay" onClick={toggleMenu}></div>}
    </>
  );
};

export default MobileNavbar;
