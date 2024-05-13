import React from 'react';
import styles from './Badge.module.css';
import { BadgeProps } from './types';

export const Badge = ({ icon, communityRole }: BadgeProps) => {
  return (
    <div className={styles.badge}>
      {icon}
      {communityRole}
    </div>
  );
};
