import React from 'react';
import './special-offers.css';
import EyeIcon from '../Icons/EyeIcon';
import CartIcon from '../Icons/CartIcon';
import HeartIcon from '../Icons/HeartIcon';

const RegularProduct = ({
  image,
  name,
  description,
  price,
  onView,
  onAddToCart,
  onAddToFavorites
}) => {
  return (
    <div className="product-card regular">
      <div className="image-box">
        {image && <img src={image} alt={name} />}

        <div className="actions-overlay">
          <span className="action-btn eye-btn" onClick={onView}><EyeIcon /></span>
          <span className="action-btn cart-btn" onClick={onAddToCart}><CartIcon /></span>
          <span className="action-btn heart-btn" onClick={onAddToFavorites}><HeartIcon /></span>
        </div>
      </div>

      <h3>{name}</h3>
      <p>{description}</p>
      <div className="price-box">
        <span className="new-price">{price} BAM</span>
      </div>
    </div>
  );
};


export default RegularProduct;
