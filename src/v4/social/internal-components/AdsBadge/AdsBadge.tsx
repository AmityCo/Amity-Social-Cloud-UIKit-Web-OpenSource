import React from 'react';
import Star from '~/v4/icons/Star';
import styles from './AdsBadge.module.css';

export const AdsBadge = () => {
  return (
    <div className={styles.badge}>
      <div className={styles.badge__child}>
        <Star className={styles.badge__icon} />
        <div className={styles.badge__text}>Premium Sponser</div>
      </div>
    </div>
  );
};
