import React from "react";
import styles from "./FreeShippingBanner.module.css";
import { Truck } from "lucide-react";

const FreeShippingBanner = () => {
  return (
    <div className={styles.bannerWrapper}>
      <div className={styles.bannerContent}>
        <Truck className={styles.icon} strokeWidth={1.5} />
        <div className={styles.text}>
          <h3>Besplatna dostava</h3>
          <p>Za sve narudžbe iznad <strong>60 KM</strong> na teritoriji BiH</p>
        </div>
      </div>
    </div>
  );
};

export default FreeShippingBanner;