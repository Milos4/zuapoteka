import React, { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import logo from "../assets/Logo1.png";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { SlLogout, SlHeart, SlUser } from "react-icons/sl";

import { useCart } from "../context/CartContext";

import "./NavBar.css";

const NavBar = () => {
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const [isVisible, setIsVisible] = useState(true);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let prevScrollPos = window.scrollY;
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setIsVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      prevScrollPos = currentScrollPos;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().username || "");
        } else {
          setUsername("");
        }
      } else {
        setUsername("");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setDropdownOpen(false);
    navigate("/prijava");
  };

  return (
    <nav className={`navbar ${isVisible ? "" : "hidden-navbar"}`}>
      <div className="left">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
      </div>

      <div className="center">
        <Link to="/pocetna">Početna</Link>
        <Link to="/prodavnica">Prodavnica</Link>
        <Link to="/o-nama">O nama</Link>
        <Link to="/kontakt">Kontakt</Link>
      </div>

      <div
        className="right"
        style={{ display: "flex", alignItems: "center", gap: "10px" }}
      >
        <Link
          to="/korpa"
          className="cart"
          style={{ display: "flex", alignItems: "center", gap: "5px" }}
        >
          <FaShoppingCart size={20} />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>

        {user ? (
          <div
            className="user-dropdown"
            ref={dropdownRef}
            style={{ position: "relative" }}
          >
            <div
              className="user-icon"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ display: "flex", alignItems: "center", padding: "5px" }}
            >
              <FaUser size={20} />
            </div>

            {dropdownOpen && (
              <div
                className="dropdown-menu"
                style={{
                  position: "absolute",
                  top: "120%",
                  right: 0,
                  background: "var(--zelena)",
                  border: "1px solid #ccc",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
                  borderRadius: "4px",
                  minWidth: "150px",
                  zIndex: 1000,
                }}
              >
                <div
                  style={{
                    padding: "10px",
                    fontWeight: "bold",
                    borderBottom: "1px solid #ccc",
                    color: "var(--bez)",
                    textAlign: "center",
                    fontSize: "20px",
                  }}
                >
                  {username || user?.email?.split("@")[0] || "Korisnik"}
                </div>

                <Link
                  to="/profil"
                  className="dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  <SlUser size={20} />
                  <span style={{ marginLeft: "10px" }}>Profil</span>
                </Link>

                <Link
                  to="/profil?tab=zelje"
                  className="dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  <SlHeart size={20} />
                  <span style={{ marginLeft: "10px" }}>Lista želja</span>
                </Link>

                <div
                  className="dropdown-item logout-link"
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}
                >
                  <SlLogout />
                  <span style={{ marginLeft: "10px" }}>Odjavi se</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/prijava"
            className="user-icon"
            style={{ display: "flex", alignItems: "center", padding: "5px" }}
          >
            <FaUser size={20} />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
