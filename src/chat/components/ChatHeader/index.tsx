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

type ChatHeaderProps = {
  channelId: string;
  onChatDetailsClick: () => void;
  shouldShowChatDetails: boolean;
};

const ChatHeader = ({ channelId, onChatDetailsClick, shouldShowChatDetails }: ChatHeaderProps) => {
  const channel = useChannel(channelId);
  const { chatName, chatAvatar } = useChatInfo({ channel });

  return (
    <div className={styles.chatHeaderContainer} data-testid="chat-header">
      <div className={styles.channel}>
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
  );
};

export default (props: ChatHeaderProps) => {
  const CustomComponentFn = useCustomComponent<ChatHeaderProps>('ChatHeader');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <ChatHeader {...props} />;
};
