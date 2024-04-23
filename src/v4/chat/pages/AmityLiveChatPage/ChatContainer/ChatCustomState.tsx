import React from 'react';
import styles from './styles.module.css';

const ChatCustomState = ({ children }: { children?: React.ReactNode }) => {
  return <div className={styles.messageListPlaceholder}>{children}</div>;
};

export default ChatCustomState;
