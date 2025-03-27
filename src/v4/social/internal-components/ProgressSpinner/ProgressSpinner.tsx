import React from 'react';
import styles from './ProgressSpinner.module.css';

export const ProgressSpinner = ({ progress }: { progress: number }) => {
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  const angle = normalizedProgress * 3.6; // Convert percentage to degrees

  return (
    <div className={styles.progress__spinner}>
      <div
        className={styles.progress__ring}
        style={{
          background: `conic-gradient(
            var(--asc-color-primary-default) ${angle}deg,
            white ${angle}deg 360deg
          )`,
        }}
      ></div>
    </div>
  );
};
