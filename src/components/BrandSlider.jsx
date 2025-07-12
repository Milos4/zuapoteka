import React, { useState, useEffect, useRef } from 'react';
import Arrows from './arrows/Arrows';
import './brand-slider.css';

// Import slika
import A_DERMA from '../assets/brands/A_DERMA.webp';
import APIVITA from '../assets/brands/APIVITA.png';
import AVENE from '../assets/brands/AVENE.png';
import BIODERMA from '../assets/brands/BIODERMA.png';
import CERAVE from '../assets/brands/CERAVE.png';
import EUCERIN from '../assets/brands/EUCERIN.png';
import FILLERINA from '../assets/brands/FILLERINA.webp';
import GAMARDE from '../assets/brands/GAMARDE.png';
import HAWKINS_BRIMBLE from '../assets/brands/HAWKINS_BRIMBLE.png';
import KLORANE from '../assets/brands/KLORANE.png';
import LA_ROCHE_POSAY from '../assets/brands/LA_ROCHE_POSAY.png';
import SKEYNDOR from '../assets/brands/SKEYNDOR.png';
import SKINCODE from '../assets/brands/SKINCODE.png';
import SVR from '../assets/brands/SVR.png';
import URIAGE from '../assets/brands/URIAGE.png';
import VICHY from '../assets/brands/VICHY.png';

const BrandSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const sliderRef = useRef(null);
  const autoScrollRef = useRef(null);
  const animationRef = useRef(null);

  // Niz sa svim slikama brendova
  const brandImages = [
    A_DERMA, APIVITA, AVENE, BIODERMA, CERAVE, EUCERIN, FILLERINA, GAMARDE,
    HAWKINS_BRIMBLE, KLORANE, LA_ROCHE_POSAY, SKEYNDOR, SKINCODE, SVR, URIAGE, VICHY,
     A_DERMA, APIVITA, AVENE, BIODERMA, CERAVE, EUCERIN, FILLERINA, GAMARDE,
    HAWKINS_BRIMBLE, KLORANE, LA_ROCHE_POSAY, SKEYNDOR, SKINCODE, SVR, URIAGE, VICHY,
     A_DERMA, APIVITA, AVENE, BIODERMA, CERAVE, EUCERIN, FILLERINA, GAMARDE,
    HAWKINS_BRIMBLE, KLORANE, LA_ROCHE_POSAY, SKEYNDOR, SKINCODE, SVR, URIAGE, VICHY,
     A_DERMA, APIVITA, AVENE, BIODERMA, CERAVE, EUCERIN, FILLERINA, GAMARDE,
    HAWKINS_BRIMBLE, KLORANE, LA_ROCHE_POSAY, SKEYNDOR, SKINCODE, SVR, URIAGE, VICHY,
     A_DERMA, APIVITA, AVENE, BIODERMA, CERAVE, EUCERIN, FILLERINA, GAMARDE,
    HAWKINS_BRIMBLE, KLORANE, LA_ROCHE_POSAY, SKEYNDOR, SKINCODE, SVR, URIAGE, VICHY,
     A_DERMA, APIVITA, AVENE, BIODERMA, CERAVE, EUCERIN, FILLERINA, GAMARDE,
    HAWKINS_BRIMBLE, KLORANE, LA_ROCHE_POSAY, SKEYNDOR, SKINCODE, SVR, URIAGE, VICHY,
     A_DERMA, APIVITA, AVENE, BIODERMA, CERAVE, EUCERIN, FILLERINA, GAMARDE,
    HAWKINS_BRIMBLE, KLORANE, LA_ROCHE_POSAY, SKEYNDOR, SKINCODE, SVR, URIAGE, VICHY,
     A_DERMA, APIVITA, AVENE, BIODERMA, CERAVE, EUCERIN, FILLERINA, GAMARDE,
    HAWKINS_BRIMBLE, KLORANE, LA_ROCHE_POSAY, SKEYNDOR, SKINCODE, SVR, URIAGE, VICHY,
     A_DERMA, APIVITA, AVENE, BIODERMA, CERAVE, EUCERIN, FILLERINA, GAMARDE,
    HAWKINS_BRIMBLE, KLORANE, LA_ROCHE_POSAY, SKEYNDOR, SKINCODE, SVR, URIAGE, VICHY,
     A_DERMA, APIVITA, AVENE, BIODERMA, CERAVE, EUCERIN, FILLERINA, GAMARDE,
    HAWKINS_BRIMBLE, KLORANE, LA_ROCHE_POSAY, SKEYNDOR, SKINCODE, SVR, URIAGE, VICHY,
     A_DERMA, APIVITA, AVENE, BIODERMA, CERAVE, EUCERIN, FILLERINA, GAMARDE,
    HAWKINS_BRIMBLE, KLORANE, LA_ROCHE_POSAY, SKEYNDOR, SKINCODE, SVR, URIAGE, VICHY,
     A_DERMA, APIVITA, AVENE, BIODERMA, CERAVE, EUCERIN, FILLERINA, GAMARDE,
    HAWKINS_BRIMBLE, KLORANE, LA_ROCHE_POSAY, SKEYNDOR, SKINCODE, SVR, URIAGE, VICHY,
     A_DERMA, APIVITA, AVENE, BIODERMA, CERAVE, EUCERIN, FILLERINA, GAMARDE,
    HAWKINS_BRIMBLE, KLORANE, LA_ROCHE_POSAY, SKEYNDOR, SKINCODE, SVR, URIAGE, VICHY,
     A_DERMA, APIVITA, AVENE, BIODERMA, CERAVE, EUCERIN, FILLERINA, GAMARDE,
    HAWKINS_BRIMBLE, KLORANE, LA_ROCHE_POSAY, SKEYNDOR, SKINCODE, SVR, URIAGE, VICHY
  ];

  // Kreiranje beskonačnog niza - 3x ponavljanje za smooth beskonačan loop
  const infiniteBrands = [...brandImages, ...brandImages, ...brandImages];
  const brandWidth = 178; // 150 + 20 gap + 8 margin sa obje strane
  const totalWidth = infiniteBrands.length * brandWidth;
  const singleSetWidth = brandImages.length * brandWidth;

  useEffect(() => {
  if (isAutoScrolling && !isDragging) {
    autoScrollRef.current = setInterval(() => {
      setCurrentIndex(prevIndex => {
        let newIndex = prevIndex + 1;

        // Ako prelazi desni kraj drugog seta
        if (newIndex >= brandImages.length * 2) {
          // Odmah prebacujemo na sredinu, ali bez animacije
          newIndex = brandImages.length;
          setCurrentTranslate(-newIndex * brandWidth);
          setPrevTranslate(-newIndex * brandWidth);

          // Privremeno isključi animaciju
          if (sliderRef.current) {
            sliderRef.current.style.transition = 'none';
            sliderRef.current.style.transform = `translateX(${-newIndex * brandWidth}px)`;

            // Vraćamo animaciju nakon sledećeg frame-a
            requestAnimationFrame(() => {
              if (sliderRef.current) {
                sliderRef.current.style.transition = 'transform 0.3s ease-out';
              }
            });
          }
        } else {
          // Normalno premeštanje
          const newTranslate = -newIndex * brandWidth;
          setCurrentTranslate(newTranslate);
          setPrevTranslate(newTranslate);
        }

        return newIndex;
      });
    }, 2500);
  }

  return () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
  };
}, [isAutoScrolling, isDragging, brandImages.length, brandWidth]);


  // Postavi početni indeks na srednji set za beskonačan loop
  useEffect(() => {
    const middleIndex = brandImages.length;
    setCurrentIndex(middleIndex);
    setCurrentTranslate(-middleIndex * brandWidth);
    setPrevTranslate(-middleIndex * brandWidth);
  }, [brandImages.length, brandWidth]);

  // Smooth animacija
  const animate = () => {
    if (isDragging) {
      if (sliderRef.current) {
        sliderRef.current.style.transform = `translateX(${currentTranslate}px)`;
      }
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  // Mouse event handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setIsAutoScrolling(false);
    setStartX(e.clientX);
    
    if (sliderRef.current) {
      sliderRef.current.style.cursor = 'grabbing';
    }
    
    animationRef.current = requestAnimationFrame(animate);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const currentX = e.clientX;
    const diff = currentX - startX;
    const newTranslate = prevTranslate + diff;
    
    // Ograniči drag da ne ide van granica
    const minTranslate = -(infiniteBrands.length - 1) * brandWidth;
    const maxTranslate = 0;
    
    setCurrentTranslate(Math.max(minTranslate, Math.min(newTranslate, maxTranslate)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    if (sliderRef.current) {
      sliderRef.current.style.cursor = 'grab';
    }
    
    // Izračunaj trenutni indeks na osnovu trenutne pozicije
    let newIndex = Math.round(-currentTranslate / brandWidth);
    
    // Wrap around logika za beskonačan loop
    if (newIndex < 0) {
      // Ako je otišao lijevo previše, prebaci na kraj srednjeg seta
      newIndex = brandImages.length * 2 - 1;
    } else if (newIndex >= infiniteBrands.length) {
      // Ako je otišao desno previše, prebaci na početak srednjeg seta
      newIndex = brandImages.length;
    }
    
    setCurrentIndex(newIndex);
    const finalTranslate = -newIndex * brandWidth;
    setCurrentTranslate(finalTranslate);
    setPrevTranslate(finalTranslate);
    
    // Nastavi auto-scroll nakon 3 sekunde
    setTimeout(() => {
      setIsAutoScrolling(true);
    }, 3000);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (sliderRef.current) {
        sliderRef.current.style.cursor = 'grab';
      }
      
      // Izračunaj trenutni indeks na osnovu trenutne pozicije
      let newIndex = Math.round(-currentTranslate / brandWidth);
      
      // Wrap around logika za beskonačan loop
      if (newIndex < 0) {
        // Ako je otišao lijevo previše, prebaci na kraj srednjeg seta
        newIndex = brandImages.length * 2 - 1;
      } else if (newIndex >= infiniteBrands.length) {
        // Ako je otišao desno previše, prebaci na početak srednjeg seta
        newIndex = brandImages.length;
      }
      
      setCurrentIndex(newIndex);
      const finalTranslate = -newIndex * brandWidth;
      setCurrentTranslate(finalTranslate);
      setPrevTranslate(finalTranslate);
      
      setTimeout(() => {
        setIsAutoScrolling(true);
      }, 3000);
    }
  };

  // Touch events za mobilne uređaje
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setIsAutoScrolling(false);
    setStartX(e.touches[0].clientX);
    animationRef.current = requestAnimationFrame(animate);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    const newTranslate = prevTranslate + diff;
    
    // Ograniči drag da ne ide van granica
    const minTranslate = -(infiniteBrands.length - 1) * brandWidth;
    const maxTranslate = 0;
    
    setCurrentTranslate(Math.max(minTranslate, Math.min(newTranslate, maxTranslate)));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // Izračunaj trenutni indeks na osnovu trenutne pozicije
    let newIndex = Math.round(-currentTranslate / brandWidth);
    
    // Wrap around logika za beskonačan loop
    if (newIndex < 0) {
      // Ako je otišao lijevo previše, prebaci na kraj srednjeg seta
      newIndex = brandImages.length * 2 - 1;
    } else if (newIndex >= infiniteBrands.length) {
      // Ako je otišao desno previše, prebaci na početak srednjeg seta
      newIndex = brandImages.length;
    }
    
    setCurrentIndex(newIndex);
    const finalTranslate = -newIndex * brandWidth;
    setCurrentTranslate(finalTranslate);
    setPrevTranslate(finalTranslate);
    
    // Nastavi auto-scroll nakon 3 sekunde
    setTimeout(() => {
      setIsAutoScrolling(true);
    }, 3000);
  };

  // Ažuriranje transform-a kada se menja currentIndex automatski
  useEffect(() => {
    if (!isDragging) {
      const newTranslate = -currentIndex * brandWidth;
      setCurrentTranslate(newTranslate);
      setPrevTranslate(newTranslate);
    }
  }, [currentIndex, isDragging, brandWidth]);

  return (
    <div className="brand-slider-container">
      <div 
        ref={sliderRef}
        className="brands-grid"
        style={{
          transform: `translateX(${currentTranslate}px)`,
          width: `${totalWidth}px`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {infiniteBrands.map((brand, index) => (
          <div key={`brand-${index}`} className="brand-item">
            <div className="brand-image-container">
              <img 
                src={brand} 
                alt={`Brand ${(index % brandImages.length) + 1}`} 
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

export default BrandSlider;