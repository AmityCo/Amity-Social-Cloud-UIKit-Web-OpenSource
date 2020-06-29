import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import { MessageComposeBarInput } from './styles';

const MessageComposeBar = ({ onSubmit }) => {
  const [message, setMessage] = useState('');

  return (
    <MessageComposeBarInput
      placeholder="Type your message..."
      type="text"
      value={message}
      onChange={e => setMessage(e.target.value)}
      onKeyPress={e => {
        if (e.key === 'Enter' && message !== '') {
          onSubmit(message);
          setMessage('');
        }
      }}
    />
  );
};

export default MessageComposeBar;
