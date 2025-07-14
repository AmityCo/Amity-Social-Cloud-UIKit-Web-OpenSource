import React from 'react';
import styles from './MessageBubbleSkeleton.module.css';

export const MessageBubbleSkeleton = () => {
  return (
    <div className={styles.messageBubbleSkeleton__container}>
      <div className={styles.messageBubbleSkeleton__firstLine} />
      <div className={styles.messageBubbleSkeleton__secondLine} />
    </div>
  );
};
