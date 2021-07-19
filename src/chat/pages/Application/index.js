import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChannelMembership, ChannelType, ChannelMembershipRepository } from '@amityco/js-sdk';
import { useIntl } from 'react-intl';

import { notification } from '~/core/components/Notification';
import RecentChat from '~/chat/components/RecentChat';
import Chat from '~/chat/components/Chat';
import ChatDetails from '~/chat/components/ChatDetails';

import { ApplicationContainer } from './styles';

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

  const handleChannelSelect = newChannelData => {
    if (currentChannelData?.channelId === newChannelData?.channelId) return;
    hideChatDetails();
    onChannelSelect(newChannelData);
    setCurrentChannelData(newChannelData);
  };

  const leaveChat = () => {
    const channelMembershipRepo = new ChannelMembershipRepository(currentChannelData?.channelId);

    channelMembershipRepo
      .leave()
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
  }, [defaultChannelId]);

  return (
    <ApplicationContainer>
      <RecentChat
        onChannelSelect={handleChannelSelect}
        selectedChannelId={currentChannelData?.channelId}
        membershipFilter={membershipFilter}
        onAddNewChannelClick={onAddNewChannel}
      />
      {currentChannelData && (
        <Chat
          channelId={currentChannelData.channelId}
          channelType={currentChannelData.channelType}
          shouldShowChatDetails={shouldShowChatDetails}
          onChatDetailsClick={showChatDetails}
        />
      )}
      {shouldShowChatDetails && currentChannelData && (
        <ChatDetails
          channelId={currentChannelData.channelId}
          onEditChatMemberClick={onEditChatMember}
          onMemberSelect={onMemberSelect}
          onClose={hideChatDetails}
          leaveChat={leaveChat}
        />
      )}
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
