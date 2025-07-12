import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./TripleBannerSlider.css";

// Default banners data
const defaultBanners = [
  {
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fexpera.ba%2F&psig=AOvVaw1VgwErwRMkBZG8TZZW205k&ust=1752365545963000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCRisGEto4DFQAAAAAdAAAAABAE",
    alt: "Banner 1",
    link: "/promotion1"
  },
  {
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fafarm.ba%2Fpage%2F2%2F%3Fadd-to-cart%3D29574&psig=AOvVaw1VgwErwRMkBZG8TZZW205k&ust=1752365545963000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCRisGEto4DFQAAAAAdAAAAABAL",
    alt: "Banner 2",
    link: "/promotion2"
  },
  {
    image: "https://via.placeholder.com/800x400?text=Banner+3",
    alt: "Banner 3",
    link: "/promotion3"
  },
  {
    image: "https://via.placeholder.com/800x400?text=Banner+4",
    alt: "Banner 4",
    link: "/promotion4"
  },
  {
    image: "https://via.placeholder.com/800x400?text=Banner+5",
    alt: "Banner 5",
    link: "/promotion5"
  },
  {
    image: "https://via.placeholder.com/800x400?text=Banner+6",
    alt: "Banner 6",
    link: "/promotion6"
  }
];

const TripleBannerSlider = ({ banners = defaultBanners }) => {
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

  const handleClick = (link) => {
    navigate(link);
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
                onClick={() => handleClick(banner.link)}
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