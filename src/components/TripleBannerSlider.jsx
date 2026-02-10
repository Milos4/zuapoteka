import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./TripleBannerSlider.css";


const TripleBannerSlider = ({ banners  }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  // Group banners into sets of 3
  const groupBanners = (bannersArray) => {
    const grouped = [];
    for (let i = 0; i < bannersArray.length; i += 3) {
      grouped.push(bannersArray.slice(i, i + 3));
    }
    return grouped;
  };

  const groupedBanners = groupBanners(banners);
  const extendedBanners = [...groupedBanners, ...groupedBanners, ...groupedBanners];
  const startingIndex = groupedBanners.length;

  useEffect(() => {
    setCurrentIndex(startingIndex);
  }, [startingIndex]);

  const goToSlide = useCallback(
    (newIndex) => {
      if (isAnimating) return;

      setIsAnimating(true);
      setTransitionEnabled(true);
      setCurrentIndex(newIndex);

      setTimeout(() => {
        if (newIndex >= groupedBanners.length * 2) {
          setTransitionEnabled(false);
          setCurrentIndex(newIndex - groupedBanners.length);
        } else if (newIndex < groupedBanners.length) {
          setTransitionEnabled(false);
          setCurrentIndex(newIndex + groupedBanners.length);
        }
        setIsAnimating(false);
      }, 800);
    },
    [groupedBanners.length, isAnimating]
  );

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

const handleClick = (banner) => {
  const filters = banner.filters || {};
  const query = new URLSearchParams();

  // Ako postoji konkretan proizvod, koristi productName
  if (filters.productName) {
    query.append("productName", filters.productName);
  } else {
    if (filters.brand) query.append("brand", filters.brand);
    if (filters.category) query.append("kategorija", filters.category);
    if (filters.discount) query.append("naPopustu", "true");
    if (filters.new) query.append("novo", "true");
  }

  navigate(`/prodavnica?${query.toString()}`);
};


  return (
    <div className="triple-banner-slider">
      <div
        className="triple-banner-wrapper"
        style={{
          transform: `translateX(-${(currentIndex * 100) / extendedBanners.length}%)`,
          transition: transitionEnabled ? "transform 0.8s ease" : "none",
          width: `${extendedBanners.length * 100}%`,
        }}
      >
        {extendedBanners.map((group, groupIndex) => (
          <div key={groupIndex} className="triple-banner-group">
            {group.map((banner, bannerIndex) => (
              <div
                key={`${groupIndex}-${bannerIndex}`}
                className="triple-banner-slide"
                onClick={() => handleClick(banner)}
              >
                <img src={banner.image} alt={banner.alt} />
              </div>
            ))}
          </div>
        ))}
      </div>
      <button
        className="triple-banner-button left"
        onClick={prevSlide}
        disabled={isAnimating}
      >
        ‹
      </button>
      <button
        className="triple-banner-button right"
        onClick={nextSlide}
        disabled={isAnimating}
      >
        ›
      </button>
    </div>
  );
};

export default TripleBannerSlider;