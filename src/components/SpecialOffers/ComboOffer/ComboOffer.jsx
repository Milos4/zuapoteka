import React from 'react';
import './ComboOffer.css';
import EyeIcon from '../../Icons/EyeIcon';
import CartIcon from '../../Icons/CartIcon';
import HeartIcon from '../../Icons/HeartIcon';

const ComboOffer = ({ product1, product2, comboPrice, regularPrice }) => {
  const savings = regularPrice - comboPrice;
  
  return (
    <div className="combo-offer-card">
      <div className="combo-header">
        <span className="combo-badge">1+1 PONUDA</span>
        <span className="combo-savings">Ušteda {savings} BAM</span>
      </div>
      
      <div className="combo-images-container">
        <div className="combo-circle first-product">
          {product1.image && <img src={product1.image} alt={product1.name} />}
        </div>
        
        <div className="plus-sign">+</div>
        
        <div className="combo-circle second-product">
          {product2.image && <img src={product2.image} alt={product2.name} />}
        </div>
      </div>
      
      <div className="combo-actions">
        <span className="action-btn eye-btn">
          <EyeIcon />
        </span>
        <span className="action-btn cart-btn">
          <CartIcon />
        </span>
      
      </div>
      
      <div className="combo-details">
        <h3 className="combo-title">{product1.name} + {product2.name}</h3>
        <p className="combo-description">Kupite oba proizvoda zajedno po specijalnoj cijeni</p>
        
        <div className="combo-prices">
          <span className="regular-price">{regularPrice} BAM</span>
          <span className="combo-price">{comboPrice} BAM</span>
        </div>
      </div>
    </div>
  );
};

export default ComboOffer;