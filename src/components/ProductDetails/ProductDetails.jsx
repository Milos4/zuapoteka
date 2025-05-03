import React, { useState } from 'react';
import './ProductDetails.css';

const ProductDetails = ({ product }) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => setQuantity((q) => q + 1);
  const handleDecrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const discountedPrice = (product.price * (1 - product.discount / 100)).toFixed(2);

  return (
    <div className="product-details-wrapper">
      {/* Leva strana – Slika proizvoda */}
      <div className="product-image-container">
        <img src={product.imageUrl || 'https://via.placeholder.com/220'} alt={product.name} />
      </div>

      {/* Srednji deo – Informacije o proizvodu */}
      <div className="product-main-info">
        <h2>{product.name}</h2>
        <div className="category">
          {product.category}
          {product.subCategory ? ` → ${product.subCategory}` : ''}
        </div>
        <div className="description">{product.description}</div>
        <img
          src={product.brandImageUrl || 'https://via.placeholder.com/100x40?text=Brend'}
          alt={product.brand}
          className="brand-logo"
        />
      </div>

      {/* Desna strana – Cena, popust i kupovina */}
      <div className="product-purchase">
        <div className="price-info">
          <div className="original-price">{product.price.toFixed(2)} RSD</div>

          {product.discount > 0 && (
            <>
              <div className="discounted-price">{discountedPrice} RSD</div>
              <div className="discount-circle">-{product.discount}%</div>
            </>
          )}
        </div>

        {product.stockQuantity ? (
          <>
            <div className="quantity-selector">
              <button className="quantity-button" onClick={handleDecrease}>−</button>
              <input
                type="number"
                value={quantity}
                min="1"
                className="quantity-input"
                readOnly
              />
              <button className="quantity-button" onClick={handleIncrease}>+</button>
            </div>

            <button className="add-to-cart">Dodaj u korpu</button>
          </>
        ) : (
          <div className="out-of-stock">Nema na stanju</div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
