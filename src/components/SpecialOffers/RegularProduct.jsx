// RegularProduct.jsx
import React from 'react';
import './special-offers.css';
import EyeIcon from '../Icons/EyeIcon';
import CartIcon from '../Icons/CartIcon';
import HeartIcon from '../Icons/HeartIcon';

const RegularProduct = ({ image, name, description, price }) => {
  return (
    <div className="product-card regular">
      <div className="image-box">
        {image ? <img src={image} alt={name} /> : null}
        
        {/* Dugmići preko slike */}
        <div className="actions-overlay">
        <span className="action-btn eye-btn">
  <EyeIcon />
</span>
<span className="action-btn cart-btn">
  <CartIcon />
</span>
<span className="action-btn heart-btn">
  <HeartIcon />
</span>

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
