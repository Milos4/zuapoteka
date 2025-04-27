import { useState, useRef, useEffect } from 'react';
import { 
  Tablet, 
  Heart
} from 'lucide-react';

export default function PharmacySpecialOffers() {
  const [favorites, setFavorites] = useState([]);
  const containerRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const specialOffers = [
    { id: 1, name: 'Vitamin C 1000mg', discount: '30%', price: '8,90€', oldPrice: '12,70€', tag: 'AKCIJA' },
    { id: 2, name: 'Magnezijum kompleks', discount: '25%', price: '7,50€', oldPrice: '10,00€', tag: 'NOVO' },
    { id: 3, name: 'Multi-vitamin', discount: '20%', price: '15,60€', oldPrice: '19,50€', tag: 'AKCIJA' },
    { id: 4, name: 'Omega 3 kapsule', discount: '35%', price: '11,70€', oldPrice: '18,00€', tag: 'POPULARNO' },
    { id: 5, name: 'Probiotik forte', discount: '15%', price: '12,75€', oldPrice: '15,00€', tag: 'NOVO' },
    { id: 6, name: 'Cink + Selen', discount: '40%', price: '6,60€', oldPrice: '11,00€', tag: 'AKCIJA' },
    { id: 7, name: 'Kolagen u prahu', discount: '20%', price: '18,40€', oldPrice: '23,00€', tag: 'POPULARNO' },
    { id: 8, name: 'Kurkuma kapsule', discount: '25%', price: '9,00€', oldPrice: '12,00€', tag: 'NOVO' }
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
          container.scrollBy({ left: -320, behavior: 'smooth' });
          setTimeout(() => setIsScrolling(false), 300);
        }, 50);
      } else {
        // Normal scroll
        container.scrollBy({ left: -320, behavior: 'smooth' });
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
          container.scrollBy({ left: 320, behavior: 'smooth' });
          setTimeout(() => setIsScrolling(false), 300);
        }, 50);
      } else {
        // Normal scroll
        container.scrollBy({ left: 320, behavior: 'smooth' });
      }
    }
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
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
        Posebne ponude
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
          gap: '1.5rem',
          scrollSnapType: 'x mandatory'
        }}
      >
        {specialOffers.map((offer) => (
          <div 
            key={offer.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '0.75rem',
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
              minWidth: '160px',
              maxWidth: '160px',
              position: 'relative',
              scrollSnapAlign: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
            }}
          >
            {/* Tag */}
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: offer.tag === 'AKCIJA' ? '#FF6B6B' : offer.tag === 'NOVO' ? '#4ECDC4' : '#FFD166',
              color: 'white',
              fontSize: '0.6rem',
              fontWeight: 'bold',
              padding: '3px 6px',
              borderRadius: '3px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              {offer.tag}
            </div>
            
            {/* Favorite button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(offer.id);
              }}
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                zIndex: 5,
                padding: '5px'
              }}
            >
              <Heart 
                size={18} 
                fill={favorites.includes(offer.id) ? '#FF6B6B' : 'transparent'} 
                color={favorites.includes(offer.id) ? '#FF6B6B' : '#999'}
              />
            </button>
            
            {/* Product placeholder */}
            <div style={{
              height: '80px',
              background: '#f5f5f5',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.75rem'
            }}>
              <Tablet size={30} style={{ color: '#99BC85' }} />
            </div>
            
            {/* Product info */}
            <h3 style={{
              margin: '0 0 0.5rem 0',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              lineHeight: 1.2,
              color: '#333'
            }}>
              {offer.name}
            </h3>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              <span style={{
                background: '#006835',
                color: 'white',
                padding: '2px 5px',
                borderRadius: '3px',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                marginRight: '8px'
              }}>
                -{offer.discount}
              </span>
              <span style={{
                color: '#999',
                fontSize: '0.75rem',
                textDecoration: 'line-through'
              }}>
                {offer.oldPrice}
              </span>
            </div>
            
            <div style={{
              fontSize: '1.1rem',
              fontWeight: 'bold',
              color: '#006835'
            }}>
              {offer.price}
            </div>
            
            <button style={{
              marginTop: '0.75rem',
              padding: '5px 0',
              background: '#99BC85',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#006835'}
            onMouseLeave={e => e.currentTarget.style.background = '#99BC85'}
            >
              DODAJ U KORPU
            </button>
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