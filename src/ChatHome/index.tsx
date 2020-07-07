import React, { useState, useEffect } from 'react';
import { ChannelRepository } from 'eko-sdk';

import { customizableComponent } from '../hoks/customization';
import useLiveObject from '../hooks/useLiveObject';
import RecentChat from '../RecentChat';
import Chat from '../Chat';

import { ChatHomeContainer } from './styles';

const channelRepo = new ChannelRepository();

const ChatHome = () => {
  const [currentChannelId, setCurrenChannelId] = useState(null);

  return (
    <ChatHomeContainer>
      <RecentChat onChannelClick={setCurrenChannelId} selectedChannelId={currentChannelId} />
      {currentChannelId && <Chat key={currentChannelId} channelId={currentChannelId} />}
    </ChatHomeContainer>
  );
};

export default customizableComponent('ChatHome')(ChatHome);
