import React, { useState, useEffect } from 'react';

import { customizableComponent } from '../hoks/customization';

import { ChatItemContainer } from './styles';

const ChatItem = ({ channelId, selected, onSelect }) => (
  <ChatItemContainer onClick={() => onSelect(channelId)} selected={selected}>
    {channelId}
  </ChatItemContainer>
);

export default customizableComponent('ChatItem')(ChatItem);
