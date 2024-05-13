import React from 'react';
import clsx from 'clsx';
import styles from './LoadingIndicator.module.css';

interface LoadingIndicatorProps {
  progress?: number;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ progress }) => {
  const indicatorStyle = {
    width: `${progress || 0}%`,
  };

  return <div className={clsx(styles.loadingIndicator)} style={indicatorStyle} />;
};
