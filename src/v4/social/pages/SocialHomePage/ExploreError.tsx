import React from 'react';
import { Typography } from '~/v4/core/components/Typography';

import styles from './ExploreError.module.css';

const ExploreErrorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="62" height="42" viewBox="0 0 62 42" fill="none">
    <path
      d="M58.7773 0.841919C60.1484 0.841919 61.3086 2.00208 61.3086 3.37317V38.8107C61.3086 40.2872 60.1484 41.3419 58.7773 41.3419H5.62109C2.77344 41.3419 0.558594 39.1271 0.558594 36.2794V6.74817C0.558594 5.37708 1.61328 4.21692 3.08984 4.21692H7.30859V3.37317C7.30859 2.00208 8.36328 0.841919 9.83984 0.841919H58.7773ZM3.93359 36.2794C3.93359 37.2286 4.67188 37.9669 5.62109 37.9669C6.46484 37.9669 7.30859 37.2286 7.30859 36.2794V7.59192H3.93359V36.2794ZM57.9336 37.9669V4.21692H10.6836V36.2794V36.3849C10.6836 36.8068 10.4727 37.545 10.3672 37.9669H57.9336Z"
      fill="#EBECEF"
    />
  </svg>
);

export const ExploreError = () => {
  return (
    <div className={styles.exploreError}>
      <ExploreErrorIcon />
      <div className={styles.exploreError__text}>
        <Typography.Title>Something went wrong</Typography.Title>
        <Typography.Caption>Please try again.</Typography.Caption>
      </div>
    </div>
  );
};
