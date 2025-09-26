import React from 'react';
import { Pin } from '~/v4/icons/Pin';
import styles from './styles.module.css';

interface PinnedMessageProps {
  message: string;
  onClose?: () => void;
}

const PinnedMessage: React.FC<PinnedMessageProps> = ({ message, onClose }) => {
  return (
    <div className={styles.pinnedMessageContainer}>
      <div className={styles.pinnedMessageContent}>
        <Pin className={styles.pinIcon} />
        <div className={styles.messageText}>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default PinnedMessage;
