import React from 'react';
import { useString } from '~/v4/core/localization';
import Star from '~/v4/icons/Star';
import styles from './AdsBadge.module.css';

export const AdsBadge = () => {
  return (
    <div className={styles.badge}>
      <div className={styles.badge__child}>
        <Star className={styles.badge__icon} />
        <div className={styles.badge__text}>{useString('amity_common_ad_sponsored')}</div>
      </div>
    </div>
  );
};
