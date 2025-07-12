import React from 'react';
import RegularProduct from '../RegularProduct';
import DiscountProduct from '../DiscountProduct';
import NewProduct from '../NewProduct';
import './TopProducts.css';

const TopProducts = () => {
  // Definišemo proizvode po kolonama
  const leftColumnProducts = [
    { type: 'discount', name: "Vitamin C Complex", description: "Dnevna doza vitamina za imunitet.", price: "399", oldPrice: "499" },
    { type: 'new', name: "Omega 3 Premium", description: "Za bolju energiju i koncentraciju.", price: "699" },
    { type: 'regular', name: "Multivitamin Gold", description: "Podrška imunitetu i vitalnosti.", price: "599" },
    { type: 'discount', name: "Vitamin D3", description: "Za jake kosti i imunitet.", price: "299", oldPrice: "399" },
    { type: 'regular', name: "Probiotici Plus", description: "Za zdravu probavu.", price: "549" },
  ];

  const centerColumnProducts = [
    { type: 'new', name: "Collagen Beauty", description: "Za kožu i zdravlje kose.", price: "799" },
    { type: 'regular', name: "Magnesium Plus", description: "Za mišiće i nervni sistem.", price: "449" },
    { type: 'discount', name: "Biotin Hair", description: "Za jaku kosu i nokte.", price: "349", oldPrice: "449" },
    { type: 'new', name: "Curcumin Extra", description: "Prirodni antioksidant.", price: "599" },
    { type: 'regular', name: "Zeleni čaj", description: "Za detox i energiju.", price: "399" },
  ];

  const rightColumnProducts = [
    { type: 'regular', name: "Ashwagandha", description: "Za smanjenje stresa.", price: "649" },
    { type: 'discount', name: "Spirulina", description: "Superfood za energiju.", price: "449", oldPrice: "549" },
    { type: 'new', name: "Koenzim Q10", description: "Za srce i energiju.", price: "899" },
    { type: 'regular', name: "Ginkgo Biloba", description: "Za pamćenje i koncentraciju.", price: "499" },
    { type: 'discount', name: "Melatonin", description: "Za bolji san.", price: "299", oldPrice: "399" },
  ];

  // Funkcija za prikazivanje odgovarajuće komponente
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

  return (
    <div className="top-products-container">
      <h2 className="top-products-title">Naši najbolji proizvodi</h2>
      <div className="top-products-grid">
        {/* Lijeva kolona */}
        <div className="product-column">
          <h3 className="column-title">Vitamini</h3>
          {leftColumnProducts.map((product, index) => renderProduct(product, index))}
        </div>

        {/* Srednja kolona */}
        <div className="product-column">
          <h3 className="column-title">Ljepota</h3>
          {centerColumnProducts.map((product, index) => renderProduct(product, index))}
        </div>

        {/* Desna kolona */}
        <div className="product-column">
          <h3 className="column-title">Wellness</h3>
          {rightColumnProducts.map((product, index) => renderProduct(product, index))}
        </div>
      </div>
    </div>
  );
};

export default TopProducts;