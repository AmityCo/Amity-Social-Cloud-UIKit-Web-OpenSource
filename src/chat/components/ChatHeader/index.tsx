import React, { useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { ChannelRepository } from '@amityco/ts-sdk';

import UserAvatar from '~/chat/components/UserAvatar';
import { backgroundImage as userBackgroundImage } from '~/icons/User';
import { backgroundImage as communityBackgroundImage } from '~/icons/Community';
import useChatInfo from '~/chat/hooks/useChatInfo';
import { BarsIcon } from '~/icons';

import styles from './styles.module.css';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';
import useChannel from '~/chat/hooks/useChannel';
import { Button } from '~/v4/core/components';
import ChevronLeft from '~/v4/icons/ChevronLeft';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useGroupInfo } from '~/v4/chat/hooks/useGroupInfo';
import { useResponsive } from '~/v4/core/hooks/useResponsive';

type ChatHeaderProps = {
  channelId: string;
  onChatDetailsClick: () => void;
  shouldShowChatDetails: boolean;
  onBackClick?: () => void;
};

const ChatHeader = ({
  channelId,
  onChatDetailsClick,
  shouldShowChatDetails,
  onBackClick,
}: ChatHeaderProps) => {
  const channel = useChannel(channelId);
  const { chatName, chatAvatar } = useChatInfo({ channel });
  const { onClickUser } = useNavigation();
  const { openGroupInfo, GroupInfoComponent } = useGroupInfo({
    pageId: '*',
    componentId: 'chat_header',
  });
  const { isDesktop } = useResponsive();

  const handleHeaderClick = () => {
    if (channel?.metadata?.isDirectChat) {
      // Direct chat: could navigate to user profile if otherUserId is available
      // For now, just open group info for both cases
      openGroupInfo(channel);
    } else if (!channel?.metadata?.isDirectChat) {
      // Group chat: apri info gruppo
      openGroupInfo(channel);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleHeaderClick();
    }
  };

  return (
    <>
      <div className={styles.chatHeaderContainer} data-testid="chat-header">
        {onBackClick && (
          <Button variant="ghost" onClick={onBackClick} className={styles.backButton}>
            <ChevronLeft width={16} height={16} />
          </Button>
        )}
        <div
          className={styles.channel}
          onClick={handleHeaderClick}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
        >
          <UserAvatar
            avatarUrl={chatAvatar || undefined}
            defaultImage={
              channel?.memberCount && channel.memberCount > 2
                ? communityBackgroundImage
                : userBackgroundImage
            }
          />
          <div className={styles.channelInfo} data-testid="chat-header-channel-info">
            <div className={styles.channelName} data-testid="chat-header-channel-info-channel-name">
              {chatName}
            </div>
          </div>
        </div>
        {shouldShowChatDetails && (
          <BarsIcon
            className={styles.detailsIcon}
            onClick={onChatDetailsClick}
            width={24}
            height={24}
          />
        )}
      </div>

      {/* Componente GroupInfo per mobile */}
      <GroupInfoComponent channel={channel} />
    </>
  );
};

export default (props: ChatHeaderProps) => {
  const CustomComponentFn = useCustomComponent<ChatHeaderProps>('ChatHeader');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <ChatHeader {...props} />;
};
