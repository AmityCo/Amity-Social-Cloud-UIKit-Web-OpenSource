import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { SendMessage } from '~/icons';

import styles from './styles.module.css';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

interface MessageComposeBarProps {
  onSubmit: (message: string) => void;
}

const MessageComposeBar = ({ onSubmit }: MessageComposeBarProps) => {
  const [message, setMessage] = useState('');

  const { formatMessage } = useIntl();

  const sendMessage = () => {
    if (message === '') return;
    onSubmit(message);
    setMessage('');
  };

  return (
    <div className={styles.messageComposeBarContainer}>
      <input
        className={styles.messageComposeBarInput}
        data-testid="message-compose-bar-input"
        type="text"
        value={message}
        placeholder={formatMessage({ id: 'MessageComposeBar.placeholder' })}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
        onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
          e.key === 'Enter' && sendMessage()
        }
      />
      <SendMessage
        className={styles.sendMessageIcon}
        data-testid="message-compose-bar-send-message-button"
        onClick={sendMessage}
        width={28}
        height={28}
      />
    </div>
  );
};

export default (props: MessageComposeBarProps) => {
  const CustomComponentFn = useCustomComponent<MessageComposeBarProps>('MessageComposerBar');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <MessageComposeBar {...props} />;
};
