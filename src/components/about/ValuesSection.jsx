
import { sectionBox, sectionHeading, sectionParagraph } from "../../styles/commonStyles";
import   React,{useState, useEffect } from "react";


const ValuesSection = () => {

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center', // Centriranje svih kartica unutar roditeljskog elementa
      padding: '2rem 5%',
      marginBottom: '3rem',
      gap: '2%', // Razmak između kartica
          flexWrap: 'wrap',
             flexDirection: isMobile ? "column" : "row"
    }}>
      <div style={{
        ...sectionBox,
   flex: isMobile ? '1 1 100%' : '1 1 32%',
        minWidth: isMobile ? '100%' : '30%',
        maxWidth: isMobile ? '100%' : '32%',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}>
      <svg width="80" height="80" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
  {/* Krug sa gradientom i sjendom */}
  <circle cx="25" cy="25" r="22" fill="url(#circleGradient)" stroke="#006835" strokeWidth="0.5"/>
  
  {/* Sjena ispod kvačice */}
  <path d="M15 25L22 32L35 15" stroke="rgba(0,0,0,0.2)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  
  {/* Glavna kvačica sa 3D efektom */}
  <path 
    d="M15 25L22 32L35 15" 
    stroke="url(#checkGradient)" 
    strokeWidth="3" 
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      filter: "drop-shadow(0 2px 4px rgba(0,104,53,0.3))"
    }}
  >
    <animate 
      attributeName="stroke-dashoffset"
      values="30;0"
      dur="0.6s"
      begin="0.1s"
      fill="freeze"
      calcMode="spline"
      keySplines="0.4 0 0.2 1"
    />
  </path>
  
  {/* Dvostruki krug za dodatni efekt */}
  <circle cx="25" cy="25" r="18" stroke="rgba(0,104,53,0.15)" strokeWidth="2" fill="none"/>
  
  {/* Definicije gradijenata */}
  <defs>
    <linearGradient id="checkGradient" x1="15" y1="25" x2="35" y2="15" gradientUnits="userSpaceOnUse">
      <stop stopColor="#00C853"/>
      <stop offset="1" stopColor="#006835"/>
    </linearGradient>
    
    <radialGradient id="circleGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(25 25) rotate(90) scale(22)">
      <stop stopColor="#f5fff9"/>
      <stop offset="1" stopColor="#e0f5e9"/>
    </radialGradient>
    
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
</svg>
        </div>
        <h3 style={sectionHeading}>Stručnost</h3>
        <p style={sectionParagraph}>
          Naši farmaceuti neprestano unapređuju svoje znanje kako bi vam pružili najbolji savjet i vrhunsku uslugu, prateći najnovije standarde moderne farmacije.
        </p>
      </div>

      <div style={{
        ...sectionBox,
      flex: isMobile ? '1 1 100%' : '1 1 32%',
        minWidth: isMobile ? '100%' : '30%',
        maxWidth: isMobile ? '100%' : '32%',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}>
          <svg width="80" height="80" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
  {/* Krug sa gradientom */}
  <circle cx="25" cy="25" r="22" fill="url(#circleGradient)" stroke="#006835" strokeWidth="0.5"/>
  
  {/* Sjena plus znaka */}
  <path d="M15 25H35M25 15V35" stroke="rgba(0,0,0,0.2)" strokeWidth="3" strokeLinecap="round"/>
  
  {/* Glavni plus sa 3D efektom */}
  <path 
    d="M15 25H35M25 15V35" 
    stroke="url(#plusGradient)" 
    strokeWidth="3" 
    strokeLinecap="round"
    style={{
      filter: "drop-shadow(0 2px 4px rgba(0,104,53,0.3))"
    }}
  >
    <animate 
      attributeName="opacity"
      values="0;1"
      dur="0.4s"
      begin="0.1s"
      fill="freeze"
    />
  </path>
  
  {/* Dvostruki krug */}
  <circle cx="25" cy="25" r="18" stroke="rgba(0,104,53,0.15)" strokeWidth="2" fill="none"/>
  
  <defs>
    <linearGradient id="plusGradient" x1="15" y1="25" x2="35" y2="25" gradientUnits="userSpaceOnUse">
      <stop stopColor="#00C853"/>
      <stop offset="1" stopColor="#006835"/>
    </linearGradient>
    
    <radialGradient id="circleGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(25 25) rotate(90) scale(22)">
      <stop stopColor="#f5fff9"/>
      <stop offset="1" stopColor="#e0f5e9"/>
    </radialGradient>
  </defs>
</svg>
        </div>
        <h3 style={sectionHeading}>Povjerenje</h3>
        <p style={sectionParagraph}>
          Gradimo odnose povjerenja sa našim klijentima kroz personalizovanu pažnju, diskreciju i iskrenu brigu za vaše zdravlje.
        </p>
      </div>

      <div style={{
        ...sectionBox,
 flex: isMobile ? '1 1 100%' : '1 1 32%',
        minWidth: isMobile ? '100%' : '30%',
        maxWidth: isMobile ? '100%' : '32%',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}>
          <svg width="80" height="80" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
  {/* Krug sa gradientom */}
  <circle cx="25" cy="25" r="22" fill="url(#circleGradient)" stroke="#006835" strokeWidth="0.5"/>
  
  {/* Sjena kazaljki */}
  <path d="M25 15V25L30 30" stroke="rgba(0,0,0,0.2)" strokeWidth="2" strokeLinecap="round"/>
  
  {/* Glavne kazaljke sa efektom */}
  <path 
    d="M25 15V25L30 30" 
    stroke="url(#clockGradient)" 
    strokeWidth="2" 
    strokeLinecap="round"
    style={{
      filter: "drop-shadow(0 1px 2px rgba(0,104,53,0.3))"
    }}
  >
    <animateTransform
      attributeName="transform"
      type="rotate"
      from="0 25 25"
      to="360 25 25"
      dur="8s"
      repeatCount="indefinite"
    />
    
  </path>
  
  {/* Centar sata */}
  <circle cx="25" cy="25" r="2" fill="#006835"/>
  
  {/* Dvostruki krug */}
  <circle cx="25" cy="25" r="18" stroke="rgba(0,104,53,0.15)" strokeWidth="2" fill="none"/>
  
  <defs>
    <linearGradient id="clockGradient" x1="25" y1="15" x2="30" y2="30" gradientUnits="userSpaceOnUse">
      <stop stopColor="#00C853"/>
      <stop offset="1" stopColor="#006835"/>
    </linearGradient>
    
    <radialGradient id="circleGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(25 25) rotate(90) scale(22)">
      <stop stopColor="#f5fff9"/>
      <stop offset="1" stopColor="#e0f5e9"/>
    </radialGradient>
  </defs>
</svg>
        </div>
        <h3 style={sectionHeading}>Dostupnost</h3>
        <p style={sectionParagraph}>
          Uvijek smo uz vas kada vam je potrebna stručna pomoć, savjet ili podrška, dostupni svakog radnog dana i vikendom.
        </p>
      </div>
    </div>
  );
};

export default ValuesSection;
