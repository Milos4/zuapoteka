import React, { useEffect, useRef, useState, useCallback } from "react";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom"; // dodano
import "./BrandCarousel.css";

const AUTO_ROTATE_INTERVAL = 3500;

const BrandCarousel = () => {
  const [brands, setBrands] = useState([]);
  const [visibleCount, setVisibleCount] = useState(window.innerWidth <= 768 ? 2 : 5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragTranslateX, setDragTranslateX] = useState(0);
  const autoRotateTimer = useRef(null);
  const brandsListRef = useRef(null);
  const transitionTimeout = useRef(null);

  const navigate = useNavigate(); // hook za navigaciju

  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    const fetchBrands = async () => {
      const q = query(collection(db, "brands"), limit(10));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBrands(data);
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(window.innerWidth <= 768 ? 2 : 5);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const extendedBrands = [...brands, ...brands, ...brands];
  const baseLength = brands.length;
  const startIndex = baseLength;

  useEffect(() => {
    if (brands.length > 0) {
      setCurrentIndex(startIndex);
      setDragTranslateX(0);
    }
  }, [brands]);

  useEffect(() => {
    if (brands.length === 0) return;
    if (autoRotateTimer.current) clearInterval(autoRotateTimer.current);

    if (!isDragging) {
      autoRotateTimer.current = setInterval(() => {
        moveToIndex(currentIndex + 1);
      }, AUTO_ROTATE_INTERVAL);
    }
    return () => clearInterval(autoRotateTimer.current);
  }, [brands.length, isDragging, currentIndex]);

  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const moveToIndex = useCallback(
    (newIndex) => {
      if (transitionTimeout.current) return;
      setTransitionEnabled(true);
      setCurrentIndex(newIndex);

      transitionTimeout.current = setTimeout(() => {
        setTransitionEnabled(false);
        if (newIndex >= baseLength * 2) {
          setCurrentIndex(newIndex - baseLength);
        } else if (newIndex < baseLength) {
          setCurrentIndex(newIndex + baseLength);
        }
        transitionTimeout.current = null;
      }, 500);
    },
    [baseLength]
  );

  const next = () => {
    if (isDragging || transitionTimeout.current) return;
    moveToIndex(currentIndex + 1);
  };
  const prev = () => {
    if (isDragging || transitionTimeout.current) return;
    moveToIndex(currentIndex - 1);
  };

  const onDragStart = (clientX) => {
    if (transitionTimeout.current) return;
    setIsDragging(true);
    setDragStartX(clientX);
    if (autoRotateTimer.current) clearInterval(autoRotateTimer.current);
  };

  const onDragMove = (clientX) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStartX;
    setDragTranslateX(deltaX);
  };

  const onDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const itemWidth = brandsListRef.current
      ? brandsListRef.current.firstChild.getBoundingClientRect().width
      : 0;
    const gap = 20;
    const threshold = (itemWidth + gap) / 3;

    if (dragTranslateX > threshold) {
      prev();
    } else if (dragTranslateX < -threshold) {
      next();
    } else {
      moveToIndex(currentIndex);
    }
    setDragTranslateX(0);
  };

  const getTranslateX = () => {
    if (!brandsListRef.current) return 0;
    const itemWidth = brandsListRef.current.firstChild
      ? brandsListRef.current.firstChild.getBoundingClientRect().width
      : 0;
    const gap = 20;
    return -currentIndex * (itemWidth + gap) + dragTranslateX;
  };

  // 👉 klik na brand
  const handleBrandClick = (name) => {
    navigate(`/prodavnica?brand=${name}`);
  };

  return (
    <div className="brand-carousel-container">
      <button className="arrow-button arrow-left" onClick={prev} aria-label="Previous brands">
        &#8249;
      </button>

      <div
        className="brands-wrapper"
        onMouseDown={(e) => onDragStart(e.clientX)}
        onMouseMove={(e) => onDragMove(e.clientX)}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
      >
        <div
          className={`brands-list ${isDragging ? "dragging" : ""}`}
          style={{
            transform: `translateX(${getTranslateX()}px)`,
            transition: transitionEnabled ? "transform 0.5s ease" : "none",
          }}
          ref={brandsListRef}
        >
          {extendedBrands.map((brand, idx) => (
            <div
              className="brand-item"
              key={`${brand.id}-${idx}`}
              onClick={() => handleBrandClick(brand.name)} // klik
              style={{ cursor: "pointer" }}
            >
              <img
                src={brand.imageUrl}
                alt={brand.name}
                className="brand-image"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      <button className="arrow-button arrow-right" onClick={next} aria-label="Next brands">
        &#8250;
      </button>
    </div>
  );
};

export default BrandCarousel;
