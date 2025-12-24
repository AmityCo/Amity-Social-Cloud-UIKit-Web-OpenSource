import React from 'react';
import { Typography } from '~/v4/core/components';
import styles from './CountdownSpinner.module.css';

export interface CountdownSpinnerProps {
  countdown: number;
  className?: string;
}

export const CountdownSpinner: React.FC<CountdownSpinnerProps> = ({ countdown, className }) => {
  return (
    <div className={`${styles.countdownSpinner} ${className || ''}`}>
      <div className={styles.countdownSpinner__spinner} />
      <Typography.BodyBold className={styles.countdownSpinner__countdown}>
        {countdown}
      </Typography.BodyBold>
    </div>
  );
};
