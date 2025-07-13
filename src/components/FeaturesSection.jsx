import React from 'react';
import styles from './FeaturesSection.module.css';
import { CheckCircle, Truck, UserCircle, Lock } from 'lucide-react'; // Promenjeno sa LockKeyhole na Lock

const FeaturesSection = () => {
  return (
    <div className={styles.featuresContainer}>
      {/* 1. KVAČICA */}
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>
          <CheckCircle className={styles.icon} strokeWidth={1.5} absoluteStrokeWidth />
        </div>
        <h3>Ovlašćena apoteka</h3>
        <p>Certifikovani proizvodi</p>
      </div>

      {/* 2. KAMION */}
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>
          <Truck className={styles.icon} strokeWidth={1.5} absoluteStrokeWidth />
        </div>
        <h3>Dostava BiH</h3>
        <p>Brza isporuka 24-48h</p>
      </div>

      {/* 3. FARMACEUT */}
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>
          <UserCircle className={styles.icon} strokeWidth={1.5} absoluteStrokeWidth />
        </div>
        <h3>Savet farmaceuta</h3>
        <p>Besplatne konsultacije</p>
      </div>

      {/* 4. KATANAC - SAMO LOCK IKONICA BEZ KVAČICE */}
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>
          <Lock className={styles.icon} strokeWidth={1.5} absoluteStrokeWidth />
        </div>
        <h3>Sigurna kupovina</h3>
        <p>100% garancija</p>
      </div>
    </div>
  );
};

export default FeaturesSection;