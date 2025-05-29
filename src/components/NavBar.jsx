import React, { useState, useEffect } from "react";
import "./NavBar.css";
import logo from "../assets/Logo1.png";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaUser } from "react-icons/fa";

const NavBar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cart.length);
  }, []);

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

  return (
    <nav className={`navbar ${isVisible ? "" : "hidden-navbar"}`}>
      <div className="left">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <div className="center">
        <Link to="/pocetna">Početna</Link>
        <Link to="/prodavnica">Prodavnica</Link>
        <Link to="/o-nama">O nama</Link>
        <Link to="/kontakt">Kontakt</Link>
      </div>

      <div className="right">
        <Link to="/korpa" className="cart">
          <FaShoppingCart size={20} />
          <span className="cart-count">{cartCount}</span>
        </Link>
        <Link to="/prijava" className="user-icon">
          <FaUser size={20} />
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
