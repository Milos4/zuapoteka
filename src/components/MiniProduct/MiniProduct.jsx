// components/MiniProduct/MiniProduct.jsx
import { useState } from 'react';
import styles from './MiniProduct.module.css';
import { products } from './MiniProductData';
import EyeIcon from '../Icons/EyeIcon';
import CartIcon from '../Icons/CartIcon';
import HeartIcon from '../Icons/HeartIcon';
import CheckIcon from '../Icons/CheckIcon';

const MiniProduct = () => {
  const [hoveredProduct, setHoveredProduct] = useState(null);

  return (
    <div className={styles.productsRow}>
      {products.map((product) => (
        <div 
          key={product.id}
          className={styles.productCard}
          onMouseEnter={() => setHoveredProduct(product.id)}
          onMouseLeave={() => setHoveredProduct(null)}
        >
          {/* Hover overlay */}
          {hoveredProduct === product.id && (
            <div className={styles.hoverOverlay}>
              <div className={styles.horizontalIcons}>
                <button className={`${styles.iconButton} ${styles.eyeButton}`}>
                  <EyeIcon size={16} />
                </button>
                <button className={`${styles.iconButton} ${styles.heartButton}`}>
                  <HeartIcon size={16} />
                </button>
                <button className={`${styles.iconButton} ${styles.cartButton}`}>
                  <CartIcon size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Product content */}
          <div className={styles.imageWrapper}>
            <div className={styles.imagePlaceholder}></div>
          </div>
          
          <div className={styles.dividerLine}></div>
          
          <div className={styles.textWrapper}>
            <div className={styles.contentTop}>
              <h3 className={styles.productTitle}>{product.name}</h3>
              <p className={styles.productDescription}>{product.type}</p>
            </div>
            <div className={styles.contentBottom}>
              <div className={styles.availability}>
                <span className={styles.checkbox}><CheckIcon size={14} /></span> Na stanju
              </div>
              <div className={styles.price}>{product.price} RSD</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MiniProduct;