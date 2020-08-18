import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import { customizableComponent } from '../hoks/customization';

import {
  MessageComposeBarContainer,
  MessageComposeBarInput,
  ImageMessageIcon,
  FileMessageIcon,
  SendMessageIcon,
} from './styles';

const MessageComposeBar = ({ onSubmit }) => {
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (message === '') return;
    onSubmit(message);
    setMessage('');
  };

  return (
    <MessageComposeBarContainer>
      <ImageMessageIcon />
      <FileMessageIcon />
      <MessageComposeBarInput
        placeholder="Type your message..."
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && sendMessage()}
      />
      <SendMessageIcon onClick={sendMessage} />
    </MessageComposeBarContainer>
  );
};

export default customizableComponent('MessageComposeBar')(MessageComposeBar);
