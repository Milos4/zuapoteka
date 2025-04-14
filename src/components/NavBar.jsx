import React, { useState, useEffect } from 'react';
import './NavBar.css';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';

const NavBar = () => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartCount(cart.length);
  }, []);

  return (
    <nav className="navbar">
      <div className="left">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <div className="center">
        <Link to="/">Početna</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/about">O nama</Link>
        <Link to="/contact">Kontakt</Link>
      </div>

      <div className="right">
        <Link to="/cart" className="cart">
          <FaShoppingCart size={20} />
          <span className="cart-count">{cartCount}</span>
        </Link>
        <Link to="/login" className="user-icon">
          <FaUser size={20} />
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;