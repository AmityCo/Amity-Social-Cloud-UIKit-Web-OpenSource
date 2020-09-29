import React, { useState } from 'react';

import RecentChat from '~/messaging/components/RecentChat';
import { customizableComponent } from '~/core/hocs/customization';
import Chat from '~/messaging/components/Chat';
import ChatDetails from '~/messaging/components/ChatDetails';

import { ChatHomeContainer } from './styles';

// TODO add onCreateGroupChat
const ChatHome = () => {
  const [currentChannelId, setCurrenChannelId] = useState(null);

  const [showChatDetails, setShowChatDetails] = useState(false);

  const toggleShowChatDetails = () => setShowChatDetails(!showChatDetails);
  const hideChatDetails = () => setShowChatDetails(false);

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
      {showChatDetails && currentChannelId && (
        <ChatDetails
          key={currentChannelId}
          channelId={currentChannelId}
          onClose={hideChatDetails}
        />
      )}
    </ChatHomeContainer>
  );
};

export default customizableComponent('ChatHome', ChatHome);
