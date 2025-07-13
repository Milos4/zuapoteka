import React from 'react';
import './Popupyn.css';

const Popupyn = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="popupyn-overlay" onClick={handleOverlayClick}>
      <div className="popupyn-box">
        <p className="popupyn-message">{message}</p>
        <div className="popupyn-buttons">
          <button className="popupyn-button popupyn-button-confirm" onClick={onConfirm}>
            DA
          </button>
          <button className="popupyn-button popupyn-button-cancel" onClick={onClose}>
            NE
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popupyn;