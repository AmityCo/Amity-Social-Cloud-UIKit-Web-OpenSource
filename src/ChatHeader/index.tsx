import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import { customizableComponent } from '../hoks/customization';

import { Avatar, ChatHeaderContainer, DetailsIcon } from './styles';

const ChatHeader = ({ onSubmit, onChatDetailsClick }) => (
  <ChatHeaderContainer>
    <Avatar />
    <DetailsIcon onClick={onChatDetailsClick} />
  </ChatHeaderContainer>
);

export default customizableComponent('ChatHeader')(ChatHeader);
