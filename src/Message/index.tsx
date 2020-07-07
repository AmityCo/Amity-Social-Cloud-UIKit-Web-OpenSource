import React, { useState } from 'react';
import { customizableComponent } from '../hoks/customization';

import { MessageContainer } from './styles';

const MessageContent = ({ data, type }) => {
  switch (type) {
    case 'text':
      return data.text || null;
    case 'custom':
      return JSON.stringify(data);

    case 'image':
    case 'file':
    default:
      return 'Unsupported message format';
  }
};

const Message = ({ data, type }) => {
  console.log('data, type', data, type);
  return (
    <MessageContainer>
      <MessageContent data={data} type={type} />
    </MessageContainer>
  );
};

export default customizableComponent('Message')(Message);
