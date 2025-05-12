import React from 'react';
import './Arrows.css';

const Arrows = ({ onPrevClick, onNextClick, className }) => {
  return (
    <div className={`arrows-container ${className || ''}`}>
      <button 
        className="arrow-btn prev-arrow" 
        onClick={onPrevClick}
        aria-label="Prethodni proizvod"
      >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      
      <button 
        className="arrow-btn next-arrow" 
        onClick={onNextClick}
        aria-label="Sledeći proizvod"
      >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};

export default Arrows;