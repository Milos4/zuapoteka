import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/Logo1.png";
import { useCart } from "../context/CartContext";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import "./MobileNavbar.css";
import { FaShoppingCart, FaUser } from "react-icons/fa";

const MobileNavbar = () => {
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");

  // search
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const navigate = useNavigate();

  // ucitavanje proizvoda
  useEffect(() => {
    const fetchProducts = async () => {
      const snap = await getDocs(collection(db, "products"));
      setAllProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetchProducts();
  }, []);

  // filtriranje
  useEffect(() => {
    if (searchQuery.trim().length >= 3) {
      const filtered = allProducts.filter((p) =>
        p.naziv.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchQuery, allProducts]);

  // auth
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

  const handleSearchKey = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/prodavnica?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
    }
  };

  const handleProductClick = (id) => {
    navigate(`/proizvod/${id}`);
    setShowResults(false);
  };

  return (
    <>
      <div className="mobile-nav-wrapper">
        <div className="mobile-nav-bar">
          {/* logo */}
          <Link to="/" className="mobile-nav-logo">
            <img src={logo} alt="Logo" className="logo" />
          </Link>

          {/* 🔎 search */}
          <div className="mobile-search">
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
                  <>
                    {filteredProducts.slice(0, 5).map((p) => (
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
                    ))}
                    {filteredProducts.length > 5 && (
                      <div
                        className="search-show-all"
                        onClick={() => {
                          navigate(
                            `/prodavnica?search=${encodeURIComponent(
                              searchQuery.trim()
                            )}`
                          );
                          setShowResults(false);
                        }}
                      >
                        Prikaži sve rezultate →
                      </div>
                    )}
                  </>
                ) : (
                  <div className="search-no-results">Nema rezultata...</div>
                )}
              </div>
            )}
          </div>

          {/* icons */}
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

      {/* side menu */}
      <div className={`mobile-nav-side-menu ${menuOpen ? "open" : ""}`}>
        {user ? (
          <>
            <div className="mobile-nav-user">
              <FaUser size={22} /> {username}
            </div>
            <Link to="/profil?tab=zelje" onClick={toggleMenu}>
              Lista želja
            </Link>
            <Link to="/profil?tab=istorija" onClick={toggleMenu}>
              Moje narudžbe
            </Link>
          </>
        ) : (
          <>
            <Link to="/prijava" onClick={toggleMenu}>
              Prijava
            </Link>
            <Link to="/registracija" onClick={toggleMenu}>
              Registracija
            </Link>
          </>
        )}

        <Link to="/" onClick={toggleMenu}>Početna</Link>
        <Link to="/prodavnica" onClick={toggleMenu}>Prodavnica</Link>
        <Link to="/o-nama" onClick={toggleMenu}>O nama</Link>
        <Link to="/kontakt" onClick={toggleMenu}>Kontakt</Link>

        {user && (
          <button onClick={handleLogout} className="mobile-nav-logout">
            Odjavi se
          </button>
        )}
      </div>

      {menuOpen && (
        <div className="mobile-nav-overlay" onClick={toggleMenu}></div>
      )}
    </>
  );
};

export default MobileNavbar;
