import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import customizableComponent from '~/core/hocs/customization';

import {
  MessageComposeBarContainer,
  MessageComposeBarInput,
  // ImageMessageIcon,
  // FileMessageIcon,
  SendMessageIcon,
} from './styles';

const MessageComposeBar = ({ onSubmit }) => {
  const [message, setMessage] = useState('');

  const { formatMessage } = useIntl();

  const sendMessage = () => {
    if (message === '') return;
    onSubmit(message);
    setMessage('');
  };

  return (
    <MessageComposeBarContainer>
      <MessageComposeBarInput
        data-qa-anchor="message-compose-bar-input"
        type="text"
        value={message}
        placeholder={formatMessage({ id: 'MessageComposeBar.placeholder' })}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <SendMessageIcon
        data-qa-anchor="message-compose-bar-send-message-button"
        onClick={sendMessage}
      />
    </MessageComposeBarContainer>
  );
};

export default customizableComponent('MessageComposeBar', MessageComposeBar);
