import React, { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

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

  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const navigate = useNavigate();

  // --- Scroll hide navbar ---
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

  // --- Normalizacija za č ć ž š đ ---
  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .replace(/č/g, "c")
      .replace(/ć/g, "c")
      .replace(/š/g, "s")
      .replace(/ž/g, "z")
      .replace(/đ/g, "dj");
  };

  // --- Fetch svi proizvodi (za search) ---
  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllProducts(productsData);
    };
    fetchProducts();
  }, []);

  // --- Search logika ---
  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setFilteredProducts([]);
      return;
    }

    const normalizedQuery = normalizeText(searchQuery);
    const queryWords = normalizedQuery.split(" ").filter(Boolean);

    const results = allProducts.filter((p) => {
      const nameNorm = normalizeText(p.naziv || "");
      return queryWords.every((word) => nameNorm.includes(word));
    });

    setFilteredProducts(results);
  }, [searchQuery, allProducts]);

  // --- Auth logika ---
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

  // --- Klik izvan dropdowna ---
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

  const handleSearchKey = (e) => {
    if (e.key === "Enter" && searchQuery.trim().length >= 3) {
      navigate(`/prodavnica?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
    }
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
    setSearchQuery("");
    setShowResults(false);
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

      <div className="navbar-search">
  <input
    type="text"
    placeholder="Pretraži..."
    className="search-input"
    value={searchQuery}
    onChange={(e) => {
      setSearchQuery(e.target.value);
      setShowResults(true);
    }}
    onKeyDown={handleSearchKey}
  />

  {showResults && searchQuery.trim().length >= 3 && (
    <div className="search-results">
      {filteredProducts.length > 0 ? (
        filteredProducts.slice(0, 5).map((p) => (
          <div
            key={p.id}
            className="search-item"
            onClick={() => handleProductClick(p.id)}
          >
            <img src={p.slikaURL} alt={p.naziv} />
            <div>
              <p className="search-name">{p.naziv}</p>
              <span className="search-price">{p.cijena} KM</span>
            </div>
          </div>
        ))
      ) : (
        <div className="search-no-results">Nema rezultata...</div>
      )}

      {filteredProducts.length > 5 && (
        <div
          className="search-show-all"
          onClick={() => {
            navigate(`/prodavnica?search=${encodeURIComponent(searchQuery.trim())}`);
            setShowResults(false);
          }}
        >
          Prikaži sve rezultate →
        </div>
      )}
    </div>
  )}
</div>


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
