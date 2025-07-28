import React from 'react';
import './special-offers.css';
import EyeIcon from '../Icons/EyeIcon';
import CartIcon from '../Icons/CartIcon';
import HeartIcon from '../Icons/HeartIcon';

const DiscountProduct = ({ image, name, description, price, oldPrice, onView, onAddToCart, onAddToFavorites,   onClick,     
  id   }) => {
  return (
    <div className="product-card discount"onClick={onClick} id={id}>
      <div className="badge discount">-20%</div>
      <div className="image-box">
        {image ? <img src={image} alt={name} /> : null}

        <div className="actions-overlay">
          <span className="action-btn eye-btn" onClick={onView}><EyeIcon /></span>
          <span className="action-btn cart-btn" onClick={onAddToCart}><CartIcon /></span>
          <span className="action-btn heart-btn" onClick={onAddToFavorites}><HeartIcon /></span>
        </div>
      </div>

      <h3>{name}</h3>
      <p>{description}</p>
      <div className="price-box">
        <span className="old-price">{oldPrice} BAM</span>
        <span className="new-price">{price} BAM</span>
      </div>
    </div>
  );
};

export default DiscountProduct;
