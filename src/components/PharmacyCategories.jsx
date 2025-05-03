import { useState } from 'react';
import { 
  PlusCircle, 
  Leaf, 
  Activity, 
  Baby, 
  Shield, 
  Apple 
} from 'lucide-react';

export default function PharmacyCategories() {
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = [
    { 
      id: 1, 
      name: 'DODACI ISHRANI', 
      icon: PlusCircle,
      desc: 'Energija & Imunitet',
      details: ['Za energiju', 'Imunitet podrška'],
      color: '#4CAF50'
    },
    { 
      id: 2, 
      name: 'KOZMETIKA I NEGA', 
      icon: Leaf,
      desc: 'Nega kože',
      details: ['Nega kože', 'Prirodni sastojci'],
      color: '#8BC34A'
    },
    { 
      id: 3, 
      name: 'MEDICINSKI APARATI', 
      icon: Activity,
      desc: 'Kućna dijagnostika',
      details: ['Kućna dijagnostika', 'Precizna merenja'],
      color: '#009688'
    },
    { 
      id: 4, 
      name: 'MAMA I BEBA', 
      icon: Baby,
      desc: 'Nežna nega',
      details: ['Nežna nega', 'Bezbedno za bebe'],
      color: '#FF9800'
    },
    { 
      id: 5, 
      name: 'ZAŠTITA I HIGIJENA', 
      icon: Shield,
      desc: 'Dezinfekcija',
      details: ['Dezinfekcija', 'Zdravlje prvo'],
      color: '#3F51B5'
    },
    { 
      id: 6, 
      name: 'ZDRAVA ISHRANA', 
      icon: Apple,
      desc: 'Prirodna energija',
      details: ['Prirodna energija', 'Balans u ishrani'],
      color: '#FF5722'
    }
  ];

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '3rem 1rem',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: 'transparent'  // Ovdje je uklonjena pozadinska boja
    }}>
      {/* Novi naslov sa akcentom */}
      <div style={{
        textAlign: 'center',
        marginBottom: '2.5rem',
        position: 'relative',
        paddingBottom: '1rem'
      }}>
<h2 style={{
  fontSize: '2.2rem',
  color: '#4CAF50',  // Ostatak teksta je obična zelena
  margin: '0',
  fontWeight: '700',
  letterSpacing: '0.5px',
  display: 'inline-block',
  background: 'transparent'  // Bez gradijenta za ostatak naslova
}}>
  Važno za <span style={{
    background: 'linear-gradient(to right, #FFEB3B, #FF9800)',  // Gradijent od žute (#FFEB3B) do narandžaste (#FF9800)
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  }}>VAŠE</span> zdravlje<span style={{
    background: 'linear-gradient(to right, #FFEB3B, #FF9800)',  // Isti gradijent za "!"
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  }}>!</span>
</h2>
<div style={{
  position: 'absolute',
  bottom: '0',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '100px',
  height: '4px',
  background: 'linear-gradient(to right, #FFEB3B, #FF9800)',  // Gradijent linija ispod
  borderRadius: '2px'
}}></div>


      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'stretch',
        flexWrap: 'nowrap',
        gap: '0.5rem',
        overflow: 'hidden',
        padding: '0 0.5rem'
      }}>
        {categories.map((category) => (
          <div 
            key={category.id}
            style={{
              borderRadius: '12px',
              background: activeCategory === category.id 
                ? `linear-gradient(145deg, ${category.color}40, ${category.color}20)` 
                : 'transparent', 
              boxShadow: activeCategory === category.id
                ? `0 6px 16px ${category.color}30`
                : '0 4px 12px rgba(0,0,0,0.06)',
              transition: 'all 0.4s ease',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              border: activeCategory === category.id 
                ? `2px solid ${category.color}` 
                : '1px solid rgba(0,0,0,0.05)',
              height: '100px',
              width: '210px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              padding: '0.8rem',
              transform: 'none', // Uklađeno sa hover efekatom
              zIndex: activeCategory === category.id ? 1 : 'auto',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={() => setActiveCategory(category.id)}
            onMouseLeave={() => setActiveCategory(null)}
            onClick={() => alert(`You clicked on ${category.name}`)} // Sample click effect
          >
            {/* Ikonica */}
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: activeCategory === category.id 
                ? `${category.color}20` 
                : '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '1rem',
              transition: 'all 0.4s ease',
              border: activeCategory === category.id 
                ? `2px solid ${category.color}` 
                : '2px solid #e0e0e0',
              boxShadow: activeCategory === category.id
                ? `0 0 0 4px ${category.color}10`
                : 'none',
              flexShrink: 0
            }}>
              <category.icon 
                size={22} 
                style={{
                  color: activeCategory === category.id ? category.color : '#555',
                  transition: 'all 0.3s ease'
                }} 
              />
            </div>
            
            {/* Text content */}
            <div style={{ 
              textAlign: 'left',
              width: '100%'
            }}>
              <h3 style={{
                fontWeight: '700',
                fontSize: '0.8rem',
                margin: '0 0 0.2rem 0',
                color: activeCategory === category.id ? category.color : '#333',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.4px'
              }}>
                {category.name}
              </h3>
              
              <p style={{
                fontSize: '0.7rem',
                margin: '0 0 0.3rem 0',
                color: activeCategory === category.id ? category.color : '#666',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}>
                {category.desc}
              </p>
              
              <div style={{
                display: 'flex',
                justifyContent: 'flex-start',
                gap: '0.3rem',
                flexWrap: 'wrap'
              }}>
                {category.details.map((detail, i) => (
                  <span key={i} style={{
                    fontSize: '0.6rem',
                    padding: '0.2rem 0.4rem',
                    background: activeCategory === category.id 
                      ? `${category.color}15` 
                      : '#f5f5f5',
                    color: activeCategory === category.id ? category.color : '#555',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease',
                    border: activeCategory === category.id 
                      ? `1px solid ${category.color}30` 
                      : '1px solid #e0e0e0',
                    fontWeight: '500'
                  }}>
                    {detail}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}