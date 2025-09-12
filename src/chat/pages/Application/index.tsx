import React, { useState, useEffect } from 'react';
import { ChannelRepository, Client as ASCClient } from '@amityco/ts-sdk';
import { useIntl } from 'react-intl';

import RecentChat from '~/chat/components/RecentChat';
import Chat from '~/chat/components/Chat';
import ChatDetails from '~/chat/components/ChatDetails';

import styles from './styles.module.css';

import CreateChatModal from '~/chat/components/Chat/CreateChatModal';
import EditChatMemberModal from '~/chat/components/ChatDetails/EditChatMemberModal';
import NewChatView from '~/chat/components/NewChatModal';
import NewGroupModal from '~/chat/components/NewGroupModal';
import { useNotifications } from '~/core/providers/NotificationProvider';
import { Typography } from '~/v4/core/components';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import NewChat from '~/v4/icons/NewChat';
import Follow from '~/v4/icons/Follow';
import NewGroup from '~/v4/icons/NewGroup';

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
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const notification = useNotifications();

  const { isDesktop } = useResponsive();

  const showChatDetails = () => setShouldShowChatDetails(true);
  const hideChatDetails = () => setShouldShowChatDetails(false);

  const [isChatModalOpened, setChatModalOpened] = useState(false);
  const [isEditChatMemberModalOpened, setIsEditChatMemberModalOpened] = useState(false);
  const [isNewChatModalOpened, setIsNewChatModalOpened] = useState(false);
  const [isNewGroupModalOpened, setIsNewGroupModalOpened] = useState(false);
  const openChatModal = () => setChatModalOpened(true);
  const [showNewMessage, setShowNewMessage] = useState(false);

  const handleChannelSelect = (newChannelData: PartialChannel) => {
    if (currentChannelData?.channelId === newChannelData?.channelId) {
      return;
    }
    hideChatDetails();
    setCurrentChannelData(newChannelData);

    if (isDesktop === false) {
      setShowChatOnMobile(true);
    }

    onChannelSelect?.(newChannelData);
  };

  const handleBackToRecentChats = () => {
    setShowChatOnMobile(false);
    setCurrentChannelData(null);
    hideChatDetails();
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
    if (!defaultChannelId) return;
    handleChannelSelect({ channelId: defaultChannelId, type: 'standard' });
  }, [defaultChannelId]);

  useEffect(() => {
    if (defaultChannelId && isDesktop === false) {
      setShowChatOnMobile(true);
    }
  }, [defaultChannelId, isDesktop]);

  console.log('🚀 ~ currentChannelData?.channelId:', currentChannelData?.channelId);

  return (
    <div className={styles.applicationContainer}>
      {!isNewChatModalOpened && (
        <div className={styles.chatHeader}>
          <Typography.SubTitleBold>Community Chat</Typography.SubTitleBold>
          <div
            className={styles.newChatContainer}
            onClick={() => setShowNewMessage(!showNewMessage)}
          >
            <NewChat className={styles.newChatIcon} />
          </div>
          {showNewMessage && (
            <div className={styles.newChatPopup}>
              <div
                className={styles.newChatPopupItem}
                onClick={() => {
                  setIsNewChatModalOpened(true);
                  setShowNewMessage(false);
                }}
              >
                <Follow width={24} height={24} />
                <Typography.Body>Nuova conversazione</Typography.Body>
              </div>
              <div
                className={styles.newChatPopupItem}
                onClick={() => {
                  setIsNewGroupModalOpened(true);
                  setShowNewMessage(false);
                }}
              >
                <NewGroup width={24} height={24} />
                <Typography.Body>Nuovo gruppo</Typography.Body>
              </div>
            </div>
          )}
        </div>
      )}
      {isNewChatModalOpened ? (
        <div className={`${styles.chatContainer} ${showChatOnMobile ? styles.mobileShowChat : ''}`}>
          <NewChatView
            onClose={() => setIsNewChatModalOpened(false)}
            onChannelCreated={(channelId: string) => {
              handleChannelSelect({ channelId, type: 'conversation' });
            }}
          />
        </div>
      ) : (
        <div className={`${styles.chatContainer} ${showChatOnMobile ? styles.mobileShowChat : ''}`}>
          <div className={!isDesktop ? styles.mobileRecentOnly : ''}>
            <RecentChat
              selectedChannelId={currentChannelData?.channelId}
              membershipFilter={membershipFilter}
              onChannelSelect={handleChannelSelect}
              onAddNewChannelClick={() => {
                openChatModal();
                onAddNewChannel?.();
              }}
            />
          </div>
          {currentChannelData && (
            <div className={`${styles.chatSection} ${!isDesktop ? styles.mobileChatOnly : ''}`}>
              <Chat
                channelId={currentChannelData.channelId}
                shouldShowChatDetails={false}
                onChatDetailsClick={showChatDetails}
                onBackClick={!isDesktop ? handleBackToRecentChats : undefined}
              />
            </div>
          )}
          {shouldShowChatDetails && currentChannelData && (
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
          )}
        </div>
      )}
      {isChatModalOpened ? <CreateChatModal onClose={() => setChatModalOpened(false)} /> : null}
      {isEditChatMemberModalOpened && currentChannelData ? (
        <EditChatMemberModal
          channelId={currentChannelData?.channelId}
          onClose={() => setIsEditChatMemberModalOpened(false)}
        />
      ) : null}
      <NewGroupModal
        isOpen={isNewGroupModalOpened}
        onClose={() => setIsNewGroupModalOpened(false)}
      />
    </div>
  );
};

export default ChatApplication;
