import React from 'react';
import { MenuOptionButton } from '~/v4/core/internal-components/MenuOptionButton';
import Flag from '~/v4/icons/Flag';
import Bin from '~/v4/icons/Bin';
import styles from './MessageOptions.module.css';

export interface MessageOptionsProps {
  isOwner: boolean;
  isModerator: boolean;
  messageId: string;
  syncState?: string;
  onReportMessage: () => void;
  onDeleteMessage: (messageId: string) => void;
  onClose: () => void;
}

export const MessageOptions: React.FC<MessageOptionsProps> = ({
  isOwner,
  isModerator,
  messageId,
  syncState,
  onReportMessage,
  onDeleteMessage,
  onClose,
}) => {
  const handleReportMessage = () => {
    onReportMessage();
    onClose();
  };

  const handleDeleteMessage = () => {
    onDeleteMessage(messageId);
    onClose();
  };

  return (
    <div className={styles.messageOptions}>
      {!isOwner && syncState !== 'error' && (
        <MenuOptionButton text="Report message" icon={<Flag />} onPress={handleReportMessage} />
      )}
      {(isOwner || isModerator) && (
        <MenuOptionButton
          text="Delete message"
          icon={<Bin />}
          onPress={handleDeleteMessage}
          isDanger={true}
        />
      )}
    </div>
  );
};
