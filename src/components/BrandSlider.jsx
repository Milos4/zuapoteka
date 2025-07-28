import React, { useEffect, useState, useRef } from "react";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../firebase";
import "./brand-slider.css";

const BrandCarousel = () => {
  const [brands, setBrands] = useState([]);
  const [visibleCount, setVisibleCount] = useState(window.innerWidth <= 768 ? 2 : 5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  // Fetch max 10 brands from Firestore
  useEffect(() => {
    const fetchBrands = async () => {
      const q = query(collection(db, "brands"), limit(10));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBrands(data);
    };
    fetchBrands();
  }, []);

  // Update visible count on resize
  useEffect(() => {
    const onResize = () => {
      setVisibleCount(window.innerWidth <= 768 ? 2 : 5);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Auto rotate logic
  useEffect(() => {
    if (brands.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % brands.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [brands]);

  // Drag/Touch scroll handling
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  const onMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX;
    scrollLeftStart.current = currentIndex;
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    const diff = e.pageX - startX.current;
    if (Math.abs(diff) > 30) {
      if (diff > 0) {
        // drag right, show previous
        setCurrentIndex((prev) => (prev - 1 + brands.length) % brands.length);
      } else {
        // drag left, show next
        setCurrentIndex((prev) => (prev + 1) % brands.length);
      }
      startX.current = e.pageX; // reset startX to prevent multiple changes in one drag
    }
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  const onTouchStart = (e) => {
    isDragging.current = true;
    startX.current = e.touches[0].clientX;
    scrollLeftStart.current = currentIndex;
  };

  const onTouchMove = (e) => {
    if (!isDragging.current) return;
    const diff = e.touches[0].clientX - startX.current;
    if (Math.abs(diff) > 30) {
      if (diff > 0) {
        setCurrentIndex((prev) => (prev - 1 + brands.length) % brands.length);
      } else {
        setCurrentIndex((prev) => (prev + 1) % brands.length);
      }
      startX.current = e.touches[0].clientX;
    }
  };

  const onTouchEnd = () => {
    isDragging.current = false;
  };

  // Izračunaj pomeraj za transform:
  // Svaki brend ima širinu: (100% - gap* (visibleCount-1)) / visibleCount
  // Gap je 20px
  // Pomeraš ceo flex-lej aut levo za currentIndex * (itemWidth + gap)
  // Ali jer je fleks, koristićemo procentualni pomeraj

  // % po jednom itemu sa gapom: (100 / visibleCount) + (gap* (visibleCount-1)) => gap je 20px ali u % teško - radićemo približno

  // Bolje je da pomeramo po elementima sa flex-shrink 0 i margin gap

  // Tako da pomeramo ceo container sa transform: translateX(- offset)
  // Offset = currentIndex * (itemWidth + gap)
  // itemWidth u px: računamo iz ref, ali za sad možemo approximirati

  // Da pojednostavimo, item width u % je (100% - totalGap) / visibleCount
  // Gap u % = (visibleCount -1) * 20px / containerWidth * 100%

  const containerWidth = containerRef.current?.clientWidth || 1200;
  const gapPx = 20;
  const totalGapPx = gapPx * (visibleCount - 1);
  const itemWidthPx = (containerWidth - totalGapPx) / visibleCount;
  const offset = (itemWidthPx + gapPx) * currentIndex;

  return (
    <div
      className="brand-slider-container"
      ref={containerRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ overflow: "hidden" }}
    >
      <div
        className="brands-grid"
        style={{
          transform: `translateX(-${offset}px)`,
          transition: isDragging.current ? "none" : "transform 0.5s ease",
        }}
      >
        {brands.map((brand) => (
          <div className="brand-item" key={brand.id}>
            <div className="brand-image-container">
              <img
                src={brand.imageUrl}
                alt={brand.name}
                className="brand-image"
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandCarousel;
