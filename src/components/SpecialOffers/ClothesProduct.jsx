import React, { useState } from 'react';
import './special-offers.css';
import EyeIcon from '../Icons/EyeIcon';
import CartIcon from '../Icons/CartIcon';
import HeartIcon from '../Icons/HeartIcon';

const ClothesProduct = ({
  image,
  name,
  description,
  price,
  onView,
  onAddToCart,
  onAddToFavorites,
  onClick,
  id,
  sizes = [] // npr. ["S","M","L","XL"] ili ["40","41","42"]
}) => {
  const [selectedSize, setSelectedSize] = useState('');

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!selectedSize) return;
    onAddToCart?.({ id, name, price, size: selectedSize });
  };

  const handleView = (e) => {
    e.stopPropagation();
    onView?.();
  };

  const handleFav = (e) => {
    e.stopPropagation();
    onAddToFavorites?.();
  };

  return (
    <div className="product-card clothes" onClick={onClick} id={id}>
      <div className="image-box">
        {image && <img src={image} alt={name} />}

        <div className="actions-overlay">
          <span className="action-btn eye-btn" onClick={handleView}><EyeIcon /></span>
          <span
            className={`action-btn cart-btn ${!selectedSize ? 'disabled' : ''}`}
            onClick={handleAddToCart}
            title={!selectedSize ? 'Odaberite veličinu' : 'Dodaj u korpu'}
          >
            <CartIcon />
          </span>
          <span className="action-btn heart-btn" onClick={handleFav}><HeartIcon /></span>
        </div>
      </div>

      <h3>{name}</h3>
      <p>{description}</p>

      {/* Veličine */}
      {sizes.length > 0 && (
        <div className="size-group">
          <span className="size-label">Veličina:</span>
          <div className="size-chips">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                className={`size-chip ${selectedSize === s ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(s);
                }}
              >
                {s}
              </button>
            ))}
          </div>
          {!selectedSize && (
            <div className="size-hint">Odaberite veličinu prije dodavanja u korpu</div>
          )}
        </div>
      )}

      <div className="price-box">
        <span className="new-price">{price} BAM</span>
      </div>
    </div>
  );
};

export default ClothesProduct;
