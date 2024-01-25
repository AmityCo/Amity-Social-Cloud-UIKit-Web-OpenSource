import React, { useState, useEffect } from 'react';
import { ChannelRepository, Client as ASCClient } from '@amityco/ts-sdk';
import { useIntl } from 'react-intl';

import { notification } from '~/core/components/Notification';
import RecentChat from '~/chat/components/RecentChat';
import Chat from '~/chat/components/Chat';
import ChatDetails from '~/chat/components/ChatDetails';

import { ApplicationContainer } from './styles';
import CreateChatModal from '~/chat/components/Chat/CreateChatModal';
import EditChatMemberModal from '~/chat/components/ChatDetails/EditChatMemberModal';

type PartialChannel = Pick<Amity.Channel, 'channelId' | 'type'>;

const ChatApplication = ({
  membershipFilter = 'all',
  defaultChannelId,
  onMemberSelect,
  onChannelSelect,
  onAddNewChannel,
  onEditChatMember,
}: {
  membershipFilter?: 'all' | 'member' | 'notMember';
  defaultChannelId: string | null;
  onMemberSelect?: (member: Amity.Membership<'channel'>) => void;
  onChannelSelect?: (channel: PartialChannel) => void;
  onAddNewChannel?: () => void;
  onEditChatMember?: ({
    channel,
    members,
  }: {
    channel: Amity.Channel;
    members: Amity.Membership<'channel'>[];
  }) => void;
}) => {
  const { formatMessage } = useIntl();
  const [currentChannelData, setCurrentChannelData] = useState<PartialChannel | null>(null);
  const [shouldShowChatDetails, setShouldShowChatDetails] = useState(false);

  const showChatDetails = () => setShouldShowChatDetails(true);
  const hideChatDetails = () => setShouldShowChatDetails(false);

  const [isChatModalOpened, setChatModalOpened] = useState(false);
  const [isEditChatMemberModalOpened, setIsEditChatMemberModalOpened] = useState(false);
  const openChatModal = () => setChatModalOpened(true);

  const handleChannelSelect = (newChannelData: PartialChannel) => {
    if (currentChannelData?.channelId === newChannelData?.channelId) {
      return;
    }
    hideChatDetails();
    setCurrentChannelData(newChannelData);
    onChannelSelect?.(newChannelData);
  };

  const leaveChat = async () => {
    if (!currentChannelData?.channelId) return;
    try {
      await ChannelRepository.leaveChannel(currentChannelData.channelId);

      notification.success({
        content: formatMessage({ id: 'chat.leaveChat.success' }),
      });
      setCurrentChannelData(null);
    } catch {
      notification.error({
        content: formatMessage({ id: 'chat.leaveChat.error' }),
      });
    }
  };

  useEffect(() => {
    async function startUnreadSync() {
      return ASCClient.startUnreadSync();
    }

    startUnreadSync();

    return () => {
      ASCClient.stopUnreadSync();
    };
  }, []);

  useEffect(() => {
    if (!defaultChannelId) return;
    handleChannelSelect({ channelId: defaultChannelId, type: 'standard' });
  }, [defaultChannelId]);

  return (
    <ApplicationContainer>
      <RecentChat
        selectedChannelId={currentChannelData?.channelId}
        membershipFilter={membershipFilter}
        onChannelSelect={handleChannelSelect}
        onAddNewChannelClick={() => {
          openChatModal();
          onAddNewChannel?.();
        }}
      />
      {currentChannelData ? (
        <Chat
          channelId={currentChannelData.channelId}
          shouldShowChatDetails={shouldShowChatDetails}
          onChatDetailsClick={showChatDetails}
        />
      ) : null}
      {shouldShowChatDetails && currentChannelData ? (
        <ChatDetails
          channelId={currentChannelData.channelId}
          leaveChat={leaveChat}
          onEditChatMemberClick={(newData) => {
            setIsEditChatMemberModalOpened(true);
            onEditChatMember?.(newData);
          }}
          onMemberSelect={onMemberSelect}
          onClose={hideChatDetails}
        />
      ) : null}
      {isChatModalOpened ? <CreateChatModal onClose={() => setChatModalOpened(false)} /> : null}
      {isEditChatMemberModalOpened && currentChannelData ? (
        <EditChatMemberModal
          channelId={currentChannelData?.channelId}
          onClose={() => setIsEditChatMemberModalOpened(false)}
        />
      ) : null}
    </ApplicationContainer>
  );
};

export default ChatApplication;
