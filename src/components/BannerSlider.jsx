import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './BannerSlider.css';

const BannerSlider = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  // Create extended array with banners at the beginning and end for infinite effect
  const extendedBanners = [...banners, ...banners, ...banners];
  
  // Start from the middle set to allow movements in both directions
  const startingIndex = banners.length;

  // Initialize with the middle set
  useEffect(() => {
    setCurrentIndex(startingIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToSlide = useCallback((newIndex) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTransitionEnabled(true);
    setCurrentIndex(newIndex);
    
    // Reset position after animation if we've moved to a clone
    setTimeout(() => {
      // If we moved to the right clone set
      if (newIndex >= banners.length * 2) {
        setTransitionEnabled(false);
        setCurrentIndex(newIndex - banners.length);
      }
      // If we moved to the left clone set
      else if (newIndex < banners.length) {
        setTransitionEnabled(false);
        setCurrentIndex(newIndex + banners.length);
      }
      setIsAnimating(false);
    }, 800);
  }, [banners.length, isAnimating]);

  const nextSlide = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        nextSlide();
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isAnimating, nextSlide]);

  const handleClick = () => {
    // Get the actual banner index accounting for the cloned sets
    const realIndex = currentIndex % banners.length;
    navigate(banners[realIndex].link);
  };

  return (
    <div className="banner-slider" ref={sliderRef}>
      <div
        className="banner-wrapper"
        onClick={handleClick}
        style={{
          transform: `translateX(-${(currentIndex * 100) / extendedBanners.length}%)`,
          transition: transitionEnabled ? 'transform 0.8s ease' : 'none',
          width: `${extendedBanners.length * 100}%`
        }}
      >
        {extendedBanners.map((banner, index) => (
          <div 
            key={index}
            className="banner-slide"
            style={{ width: `${100 / extendedBanners.length}%` }}
          >
            <img
              src={banner.image}
              alt={banner.alt}
            />
          </div>
        ))}
      </div>
      <button
        className="banner-button left"
        onClick={prevSlide}
        disabled={isAnimating}
      >‹</button>
      <button
        className="banner-button right"
        onClick={nextSlide}
        disabled={isAnimating}
      >›</button>
    </div>
  );
};

export default BannerSlider;