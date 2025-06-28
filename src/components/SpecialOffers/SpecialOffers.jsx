import React, { useState } from 'react';
import RegularProduct from './RegularProduct';
import DiscountProduct from './DiscountProduct';
import NewProduct from './NewProduct';
import Arrows from '../arrows/Arrows';
import './special-offers.css';


// ... i tako dalje

// ... i tako dalje

const SpecialOffers = () => {
  // Definišemo sve proizvode u nizu
  const products = [
    { type: 'regular', name: "1", description: "Dnevna doza vitamina.", price: "599" },
    { type: 'discount', name: "2", description: "Za bolju energiju.", price: "399", oldPrice: "499" },
    { type: 'new', name: "3", description: "Podrška imunitetu.", price: "699" },
    { type: 'new', name: "4",description: "Za kožu i imunitet.", price: "499" },
    { type: 'regular', name: "5", description: "Dnevna doza vitamina.", price: "599" },
    { type: 'regular', name: "6", description: "Dnevna doza vitamina.", price: "599" },
    { type: 'regular', name: "7", description: "Dnevna doza vitamina.", price: "599" },
    { type: 'regular', name: "8", description: "Dnevna doza vitamina.", price: "599" },
    { type: 'regular', name: "9", description: "Dnevna doza vitamina.", price: "599" },
    { type: 'regular', name: "10", description: "Dnevna doza vitamina.", price: "599" },
  ];

  // Stanje za praćenje trenutno vidljivih proizvoda
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 6; // Broj vidljivih proizvoda
  
  // Funkcija za pomeranje unapred
  const handleNext = () => {
    setStartIndex((prevIndex) => (prevIndex + 1) % products.length);
  };
  
  // Funkcija za pomeranje unazad
  const handlePrev = () => {
    setStartIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
  };
  
  // Funkcija za prikazivanje odgovarajuće komponente u zavisnosti od tipa proizvoda
  const renderProduct = (product, index) => {
    switch (product.type) {
      case 'discount':
        return <DiscountProduct key={index} name={product.name} description={product.description} price={product.price} oldPrice={product.oldPrice} />;
      case 'new':
        return <NewProduct key={index} name={product.name} description={product.description} price={product.price} />;
      default:
        return <RegularProduct key={index} name={product.name} description={product.description} price={product.price} />;
    }
  };

  // Kreiramo niz proizvoda koji će biti prikazani, uzimajući u obzir infinite scroll
  // Prikazujemo samo onoliko proizvoda koliko stane u jedan red
  const visibleProducts = [];
  for (let i = 0; i < visibleCount; i++) {
    const index = (startIndex + i) % products.length;
    visibleProducts.push(renderProduct(products[index], i));
  }

  return (
    <div className="special-offers-container">
      <Arrows onPrevClick={handlePrev} onNextClick={handleNext} />
      <div className="product-grid">
        {visibleProducts}
      </div>
    </div>
  );
};

export default SpecialOffers;