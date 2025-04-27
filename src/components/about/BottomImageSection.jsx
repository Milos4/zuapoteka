import React from "react";

const BottomImageSection = () => {
  return (
    <div style={{
      backgroundColor: '#FAF1E6',
      padding: '4rem 5%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Dekorativni elementi */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(153,188,133,0.2) 0%, transparent 70%)',
        zIndex: '0',
      }}/>
      
      <div style={{
        position: 'absolute',
        bottom: '-30px',
        left: '-30px',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(153,188,133,0.2) 0%, transparent 70%)',
        zIndex: '0',
      }}/>

      {/* Glavni sadržaj */}
      <div style={{
        backgroundColor: '#99BC85', // Nova zelena boja
        width: '80%',
        maxWidth: '70%',
        padding: '3rem 2rem',
        borderRadius: '1rem',
        textAlign: 'center',
        color: '#F1F7EE',
        border: '2px solid rgba(255,255,255,0.3)',
        boxShadow: `
          0 8px 20px rgba(0,0,0,0.15),
          inset 0 0 30px rgba(255,255,255,0.1)
        `,
        transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
        position: 'relative',
        zIndex: '1',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = `
          0 10px 30px rgba(0,0,0,0.2),
          inset 0 0 50px rgba(255,255,255,0.2),
          0 0 30px 5px rgba(255,255,255,0.3)
        `;
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = `
          0 8px 20px rgba(0,0,0,0.15),
          inset 0 0 30px rgba(255,255,255,0.1)
        `;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
      }}
      >
        {/* Gradijentni overlay */}
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '5px',
          background: 'linear-gradient(90deg, rgba(255,255,255,0.3), #99BC85, rgba(255,255,255,0.3))',
          backgroundSize: '200% 100%',
          animation: 'gradientShift 3s linear infinite',
        }}/>

        <h2 style={{
          fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
          fontWeight: '700',
          marginBottom: '1.5rem',
          position: 'relative',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          color: '#FFF',
        }}>
          Hvala Vam na ukazanom povjerenju
        </h2>

        <p style={{
          fontSize: 'clamp(1rem, 3vw, 1.4rem)',
          fontWeight: '400',
          marginBottom: '2rem',
          lineHeight: '1.6',
          position: 'relative',
          color: '#F1F7EE',
        }}>
          Apoteka Higra-Sarić je tu da Vam pruži podršku u očuvanju i unapređenju zdravlja. 
          Naše stručno osoblje Vam je uvijek na raspolaganju za savjet i pomoć pri izboru terapije, suplemenata i proizvoda za njegu.
        </p>

        <h3 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          fontWeight: '600',
          marginBottom: '1rem',
          marginTop: '1.5rem',
          position: 'relative',
          color: '#E1F0DA',
        }}>
          Vaše zdravlje je naša briga
        </h3>

        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
          fontWeight: '400',
          marginTop: '1rem',
          fontStyle: 'italic',
          position: 'relative',
          color: '#FFF',
        }}>
          Srdačno,<br/>
          <span style={{ 
            display: 'inline-block',
            marginTop: '0.5rem',
            fontWeight: '600',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
            textDecorationThickness: '1px',
            color: '#E1F0DA',
          }}>
            Tim Apoteke Higra-Sarić
          </span>
        </p>
      </div>

      {/* Globalne animacije */}
      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
        `}
      </style>
    </div>
  );
};

export default BottomImageSection;