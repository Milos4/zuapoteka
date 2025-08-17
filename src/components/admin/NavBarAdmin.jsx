import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import "./NavBarAdmin.css";

const NavBarAdmin = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/prijava");
  };

  // Zatvaranje dropdown-a klikom van njega
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar-admin">
      <div className="admin-left">
        {/* Uklonjen Proizvodi link */}
        <Link to="/admin/korisnici">Korisnici</Link>

        {/* Dropdown za Dodavanje */}
        <div className="dropdown-wrapper" ref={dropdownRef}>
          <span
            className="dropdown-toggle"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Dodaj ▼
          </span>
          {dropdownOpen && (
            <div className="admin-dropdown">
              <Link
                to="/admin/dodaj-proizvod"
                onClick={() => setDropdownOpen(false)}
              >
                Dodaj proizvod
              </Link>
              <Link
                to="/admin/dodaj-brend"
                onClick={() => setDropdownOpen(false)}
              >
                Dodaj brand
              </Link>
              <Link
                to="/admin/dodaj-sliku"
                onClick={() => setDropdownOpen(false)}
              >
                Dodaj sliku
              </Link>
                     <Link
                to="/admin/dodaj-odjecu"
                onClick={() => setDropdownOpen(false)}
              >
                Dodaj Odjecu
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="admin-right">
        <span className="logout-link" onClick={handleLogout}>
          Odjavi se
        </span>
      </div>
    </nav>
  );
};

export default NavBarAdmin;
