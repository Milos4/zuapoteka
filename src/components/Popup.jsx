import React from 'react';
import './Popup.css';

const Popup = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="popup-overlay" onClick={handleOverlayClick}>
      <div className="popup-container">
        <div className="popup-content">
          <p className="popup-message">{message}</p>
          <button className="popup-ok-button" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;