import React from 'react';
import './special-offers.css';
import EyeIcon from '../Icons/EyeIcon';
import CartIcon from '../Icons/CartIcon';
import HeartIcon from '../Icons/HeartIcon';

const DiscountProduct = ({ image, name, description, price, oldPrice }) => {
  return (
    <div className="product-card discount">
      <div className="badge discount">-20%</div>
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
        <span className="old-price">{oldPrice} BAM </span>
        <span className="new-price">{price} BAM</span>
      </div>
    </div>
  );
};

export default DiscountProduct;
