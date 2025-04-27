import { useState, useRef, useEffect } from 'react';
import { 
  Brain, 
  Thermometer, 
  Eye, 
  Utensils, 
  Bone, 
  Wheat, 
  Heart, 
  Tablet, 
  Baby,
  Droplets,
  Stethoscope,
  Sun
} from 'lucide-react';

export default function PharmacyCategories() {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const containerRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const categories = [
    { id: 1, name: 'GLAVOBOLJA', icon: Brain, desc: 'Umirenje bola' },
    { id: 2, name: 'PREHLADA', icon: Thermometer, desc: 'Liječenje simptoma' },
    { id: 3, name: 'UMOR', icon: Eye, desc: 'Regeneracija' },
    { id: 4, name: 'PROBAVA', icon: Utensils, desc: 'Uravnoteženje' },
    { id: 5, name: 'ZGLOBOVI', icon: Bone, desc: 'Pokretljivost' },
    { id: 6, name: 'ALERGIJE', icon: Wheat, desc: 'Ublažavanje' },
    { id: 7, name: 'SRCE', icon: Heart, desc: 'Podrška' },
    { id: 8, name: 'VITAMINI', icon: Tablet, desc: 'Energija' },
    { id: 9, name: 'ZA DJECU', icon: Baby, desc: 'Njega' },
    { id: 10, name: 'DERMOKOZMETIKA', icon: Droplets, desc: 'Hidratacija' },
    { id: 11, name: 'KRVNI PRITISAK', icon: Stethoscope, desc: 'Kontrola' },
    { id: 12, name: 'ZAŠTITA OD SUNCA', icon: Sun, desc: 'Prevencija' }
  ];

  const handleScrollLeft = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const isAtStart = container.scrollLeft < 10;
      
      if (isAtStart) {
        // Jump to end without animation
        setIsScrolling(true);
        container.scrollLeft = container.scrollWidth;
        
        // Then scroll back a bit with animation
        setTimeout(() => {
          container.scrollBy({ left: -240, behavior: 'smooth' });
          setTimeout(() => setIsScrolling(false), 300);
        }, 50);
      } else {
        // Normal scroll
        container.scrollBy({ left: -240, behavior: 'smooth' });
      }
    }
  };

  const handleScrollRight = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10;
      
      if (isAtEnd) {
        // Jump to start without animation
        setIsScrolling(true);
        container.scrollLeft = 0;
        
        // Then scroll forward a bit with animation
        setTimeout(() => {
          container.scrollBy({ left: 240, behavior: 'smooth' });
          setTimeout(() => setIsScrolling(false), 300);
        }, 50);
      } else {
        // Normal scroll
        container.scrollBy({ left: 240, behavior: 'smooth' });
      }
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1rem 0',
      position: 'relative',
      backgroundColor: 'transparent',
      overflow: 'hidden'
    }}>
      <h2 style={{
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#006835',
        marginBottom: '1rem',
        fontWeight: 'bold'
      }}>
        Kategorije proizvoda
      </h2>

      {/* Scroll kontrole - povećan razmak od sadržaja */}
      <button 
        onClick={handleScrollLeft}
        style={{
          position: 'absolute',
          left: '5px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          background: 'rgba(255,255,255,0.9)',
          border: 'none',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#99BC85'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006835">
          <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <button 
        onClick={handleScrollRight}
        style={{
          position: 'absolute',
          right: '5px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          background: 'rgba(255,255,255,0.9)',
          border: 'none',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#99BC85'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006835">
          <path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Glavni kontejner - povećan razmak od strelica */}
      <div 
        ref={containerRef}
        style={{
          display: 'flex',
          padding: '0 3rem',
          width: '100%',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          gap: '1rem',
          scrollSnapType: 'x mandatory'
        }}
      >
        {categories.map((category, index) => (
          <div 
            key={category.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '1rem',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              minWidth: '100px',
              maxWidth: '100px',
              scrollSnapAlign: 'center',
              transform: hoveredCategory === category.id ? 'translateY(-5px)' : 'none',
              filter: hoveredCategory === category.id ? 'drop-shadow(0 10px 15px rgba(0,104,53,0.2))' : 'none'
            }}
            onMouseEnter={() => setHoveredCategory(category.id)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            {/* Ikonica sa efektima */}
            <div style={{
              position: 'relative',
              padding: '1rem',
              borderRadius: '50%',
              marginBottom: '0.75rem',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              backgroundColor: hoveredCategory === category.id ? 'rgba(153, 188, 133, 0.2)' : 'rgba(245, 245, 245, 0.7)',
              transform: hoveredCategory === category.id ? 'scale(1.1)' : 'scale(1)'
            }}>
              <category.icon 
                size={22} 
                style={{
                  color: hoveredCategory === category.id ? '#006835' : '#555',
                  transition: 'all 0.3s ease'
                }} 
              />
              
              {/* Pulse efekt */}
              {hoveredCategory === category.id && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: '50%',
                  border: '2px solid rgba(153, 188, 133, 0.3)',
                  animation: 'pulse 1.5s infinite',
                  pointerEvents: 'none'
                }}></div>
              )}
            </div>
            
            {/* Tekstualni sadržaj */}
            <div style={{ textAlign: 'center' }}>
              <p style={{
                fontWeight: 'bold',
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                margin: 0,
                marginBottom: '0.25rem',
                color: hoveredCategory === category.id ? '#006835' : '#555',
                transition: 'all 0.3s ease'
              }}>{category.name}</p>
              
              <p style={{
                fontSize: '0.65rem',
                color: hoveredCategory === category.id ? '#99BC85' : '#777',
                transition: 'all 0.3s ease',
                fontWeight: '500'
              }}>
                {category.desc}
              </p>
            </div>

            {/* Donja linija */}
            {hoveredCategory === category.id && (
              <div style={{
                position: 'absolute',
                bottom: '0',
                left: '50%',
                width: '1.5rem',
                height: '2px',
                backgroundColor: '#99BC85',
                borderRadius: '1px',
                transform: 'translateX(-50%)',
                filter: 'drop-shadow(0 0 3px #99BC85)',
                animation: 'grow 0.3s ease-out'
              }}></div>
            )}
          </div>
        ))}
      </div>

      {/* Animacije */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes pulse {
            0% { transform: scale(0.9); opacity: 0.7; }
            70% { transform: scale(1.3); opacity: 0; }
            100% { transform: scale(1.3); opacity: 0; }
          }
          @keyframes grow {
            from { width: 0; opacity: 0; }
            to { width: 1.5rem; opacity: 1; }
          }
          ::-webkit-scrollbar {
            display: none;
          }
        `
      }} />
    </div>
  );
}