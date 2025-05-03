// ComboProduct.jsx
import React from 'react';
import './special-offers.css';
import EyeIcon from '../Icons/EyeIcon';
import CartIcon from '../Icons/CartIcon';
import HeartIcon from '../Icons/HeartIcon';

const ComboProduct = ({ product1, product2, comboPrice }) => {
  return (
    <div className="product-card combo">
      <div className="combo-image-box">
        <div className="circle-container">
          <div className="image-circle first-circle">
            {product1.image && <img src={product1.image} alt={product1.name} />}
          </div>
          <div className="plus-sign">+</div>
          <div className="image-circle second-circle">
            {product2.image && <img src={product2.image} alt={product2.name} />}
          </div>
        </div>
        
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

      <div className="combo-details">
        <h3>Kombinacija paket</h3>
        <p className="combo-products-names">{product1.name} + {product2.name}</p>
        <p className="combo-description">Specijalna ponuda - uštedite kupovinom u kombinaciji</p>
        
        <div className="price-box combo-price-box">
          <span className="new-price">{comboPrice} RSD</span>
          <span className="combo-savings">Ušteda XX RSD</span>
        </div>
      </div>
    </div>
  );
};

export default ComboProduct;