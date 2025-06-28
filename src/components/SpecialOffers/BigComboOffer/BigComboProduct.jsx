import React from 'react';
import './BigComboProduct.css';
import EyeIcon from '../../Icons/EyeIcon';
import CartIcon from '../../Icons/CartIcon';


const BigComboProduct = ({ product1, product2, comboPrice, regularPrice }) => {
  const savings = regularPrice - comboPrice;
  
  return (
    <div className="big-combo-container">
      <div className="big-combo-header">
        <span className="big-combo-badge">KOMBO PAKET</span>
        <span className="big-combo-savings">Ušteda {savings} BAM</span>
      </div>
      
      <div className="big-products-diagonal">
      <div className="big-product-box first-product">
  <div className="image-window">
    {product1.image && <img src={product1.image} alt={product1.name} className="big-product-image" />}
  </div>
  <h3 className="big-product-name">{product1.name}</h3>
</div>
        <div className="big-product-box second-product">
  <div className="image-window">
    {product2.image && <img src={product2.image} alt={product2.name} className="big-product-image" />}
  </div>
  <h3 className="big-product-name">{product2.name}</h3>
</div>
      </div>
      
      <div className="big-combo-actions">
        <span className="big-action-btn big-eye-btn">
          <EyeIcon />
        </span>
        <span className="big-action-btn big-cart-btn">
          <CartIcon />
        </span>
       
      </div>
      
      <div className="big-combo-footer">
        <div className="price-container">
          <span className="big-regular-price">{regularPrice} BAM</span>
          <span className="big-combo-price">{comboPrice} BAM</span>
        </div>
        <p className="big-combo-description">Specijalna ponuda - uštedite {savings} BAM</p>
      </div>
    </div>
  );
};

export default BigComboProduct;