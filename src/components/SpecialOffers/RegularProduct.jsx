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
  onAddToFavorites,
   onClick,     
  id   
}) => {
  return (
    <div className="product-card regular" 
    onClick={onClick} id={id}>
      <div className="image-box">
        {image && <img src={image} alt={name} />}

        <div className="actions-overlay">
          <span className="action-btn eye-btn"       onClick={(e) => {
              e.stopPropagation(); // sprječava klik kartice
              onView();
            }}><EyeIcon /></span>
          <span className="action-btn cart-btn"      onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}><CartIcon /></span>
          <span className="action-btn heart-btn" onClick={(e) => {
              e.stopPropagation();
              onAddToFavorites();
            }}><HeartIcon /></span>
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
