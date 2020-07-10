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

  const [showChatDetails, setShowChatDetails] = useState(true);

  const toggleShowChatDetails = () => setShowChatDetails(!showChatDetails);

  return (
    <ChatHomeContainer>
      <RecentChat onChannelClick={setCurrenChannelId} selectedChannelId={currentChannelId} />
      {currentChannelId && (
        <Chat
          key={currentChannelId}
          channelId={currentChannelId}
          onChatDetailsClick={toggleShowChatDetails}
        />
      )}
      {showChatDetails && 'details'}
    </ChatHomeContainer>
  );
};

export default customizableComponent('ChatHome')(ChatHome);
