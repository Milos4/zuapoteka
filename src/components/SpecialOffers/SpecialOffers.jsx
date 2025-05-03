import React from 'react';
import RegularProduct from './RegularProduct';
import DiscountProduct from './DiscountProduct';
import GiftProduct from './GiftProduct';
import NewProduct from './NewProduct';
import './special-offers.css';
import ComboProduct from './ComboProduct';

const SpecialOffers = () => {
  return (
    <div className="product-grid">
      <RegularProduct name="Vitamin C" description="Dnevna doza vitamina." price="599" />
      <DiscountProduct name="Magnezijum" description="Za bolju energiju." price="399" oldPrice="499" />
      <NewProduct name="Imunoflor" description="Podrška imunitetu." price="699" />
      <GiftProduct name="Cink" description="Za kožu i imunitet." price="499" />
   
    </div>
  );
};

export default SpecialOffers;
