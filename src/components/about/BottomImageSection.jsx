import React from "react";

const BottomImageSection = () => {
  return (
    <div className="bottom-image-section">
      <div className="bottom-box">
        <div className="gradient-bar" />

        <h2>Hvala Vam na ukazanom povjerenju</h2>

        <p>
          Apoteka Higra-Sarić je tu da Vam pruži podršku u očuvanju i unapređenju zdravlja. 
          Naše stručno osoblje Vam je uvijek na raspolaganju za savjet i pomoć pri izboru terapije, suplemenata i proizvoda za njegu.
        </p>

        <h3>Vaše zdravlje je naša briga</h3>

        <p className="signature">
          Srdačno,<br />
          <span>Tim Apoteke Higra-Sarić</span>
        </p>
      </div>

      <style>{`
        .bottom-image-section {
          background-color: #FAF1E6;
          padding: 4rem 5%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .bottom-box {
          background-color: #99BC85;
          width: 80%;
          max-width: 70%;
          padding: 3rem 2rem;
          border-radius: 1rem;
          text-align: center;
          color: #F1F7EE;
          border: 2px solid rgba(255,255,255,0.3);
          box-shadow: 
            0 8px 20px rgba(0,0,0,0.15),
            inset 0 0 30px rgba(255,255,255,0.1);
          transition: all 0.4s ease-in-out;
          position: relative;
          z-index: 1;
          overflow: hidden;
        }

        .bottom-box:hover {
          box-shadow: 
            0 10px 30px rgba(0,0,0,0.2),
            inset 0 0 50px rgba(255,255,255,0.2),
            0 0 30px 5px rgba(255,255,255,0.3);
          transform: translateY(-5px);
          border-color: rgba(255,255,255,0.5);
        }

        .bottom-box h2 {
          font-size: clamp(1.6rem, 5vw, 2.5rem);
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #fff;
        }

        .bottom-box p {
          font-size: clamp(1rem, 3vw, 1.3rem);
          margin-bottom: 2rem;
          line-height: 1.6;
          color: #F1F7EE;
        }

        .bottom-box h3 {
          font-size: clamp(1.3rem, 4vw, 2rem);
          font-weight: 600;
          margin: 1.5rem 0 1rem;
          color: #E1F0DA;
        }

        .bottom-box .signature {
          font-style: italic;
          margin-top: 1rem;
          font-size: clamp(0.9rem, 2.5vw, 1.2rem);
        }

        .bottom-box .signature span {
          display: inline-block;
          margin-top: 0.5rem;
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 3px;
          color: #E1F0DA;
        }

        .gradient-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: linear-gradient(90deg, rgba(255,255,255,0.3), #99BC85, rgba(255,255,255,0.3));
          background-size: 200% 100%;
          animation: gradientShift 3s linear infinite;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        /* 📱 Mobile stilovi */
        @media (max-width: 768px) {
          .bottom-image-section {
            padding: 2rem 1rem;
          }

          .bottom-box {
            width: 100%;
            max-width: 100%;
            padding: 2rem 1rem;
            border-radius: 0.8rem;
          }

          .bottom-box h2 {
            font-size: 1.5rem;
          }

          .bottom-box p {
            font-size: 1rem;
          }

          .bottom-box h3 {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default BottomImageSection;
