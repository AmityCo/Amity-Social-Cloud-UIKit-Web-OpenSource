import React, { useState } from 'react';

import { customizableComponent } from 'hocs/customization';
import RecentChat from 'components/RecentChat';
import Chat from 'components/Chat';
import ChatDetails from 'components/ChatDetails';

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

export default customizableComponent('ChatHome')(ChatHome);
