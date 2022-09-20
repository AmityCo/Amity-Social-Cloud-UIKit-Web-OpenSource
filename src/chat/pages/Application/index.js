import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChannelMembership, ChannelType, ChannelRepository } from '@amityco/js-sdk';
import { useIntl } from 'react-intl';

import { notification } from '~/core/components/Notification';
import RecentChat from '~/chat/components/RecentChat';
import Chat from '~/chat/components/Chat';
import ChatDetails from '~/chat/components/ChatDetails';

import { ApplicationContainer } from './styles';
import CreateChatModal from '~/chat/components/Chat/CreateChatModal';

const ChatApplication = ({
  membershipFilter,
  defaultChannelId,
  onMemberSelect,
  onChannelSelect,
  onAddNewChannel,
  onEditChatMember,
}) => {
  const { formatMessage } = useIntl();
  const [currentChannelData, setCurrentChannelData] = useState(null);
  const [shouldShowChatDetails, setShouldShowChatDetails] = useState(false);

  const showChatDetails = () => setShouldShowChatDetails(true);
  const hideChatDetails = () => setShouldShowChatDetails(false);

  const [isChatModalOpened, setChatModalOpened] = useState(false);
  const openChatModal = () => setChatModalOpened(true);

  const handleChannelSelect = (newChannelData) => {
    if (currentChannelData?.channelId === newChannelData?.channelId) return;
    hideChatDetails();
    onChannelSelect(newChannelData);
    setCurrentChannelData(newChannelData);
  };

  const leaveChat = () => {
    ChannelRepository.leaveChannel(currentChannelData?.channelId)
      .then(() => {
        notification.success({
          content: formatMessage({ id: 'chat.leaveChat.success' }),
        });
      })
      .catch(() => {
        notification.error({
          content: formatMessage({ id: 'chat.leaveChat.error' }),
        });
      });

    setCurrentChannelData(null);
  };

  useEffect(() => {
    if (!defaultChannelId) return;
    handleChannelSelect({ channelId: defaultChannelId, channelType: ChannelType.Standard });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultChannelId]);

  return (
    <ApplicationContainer>
      <RecentChat
        selectedChannelId={currentChannelData?.channelId}
        membershipFilter={membershipFilter}
        onChannelSelect={handleChannelSelect}
        onAddNewChannelClick={() => {
          openChatModal();
          onAddNewChannel();
        }}
      />
      {currentChannelData && (
        <Chat
          channelId={currentChannelData.channelId}
          shouldShowChatDetails={shouldShowChatDetails}
          onChatDetailsClick={showChatDetails}
        />
      )}
      {shouldShowChatDetails && currentChannelData && (
        <ChatDetails
          channelId={currentChannelData.channelId}
          leaveChat={leaveChat}
          onEditChatMemberClick={onEditChatMember}
          onMemberSelect={onMemberSelect}
          onClose={hideChatDetails}
        />
      )}
      {isChatModalOpened && <CreateChatModal onClose={() => setChatModalOpened(false)} />}
    </ApplicationContainer>
  );
};

ChatApplication.propTypes = {
  membershipFilter: PropTypes.oneOf(Object.values(ChannelMembership)),
  defaultChannelId: PropTypes.string,
  onMemberSelect: PropTypes.func,
  onChannelSelect: PropTypes.func,
  onAddNewChannel: PropTypes.func,
  onEditChatMember: PropTypes.func,
};

ChatApplication.defaultProps = {
  membershipFilter: ChannelMembership.None,
  defaultChannelId: null,
  onMemberSelect: () => {},
  onChannelSelect: () => {},
  onAddNewChannel: () => {},
  onEditChatMember: () => {},
};

export default ChatApplication;
