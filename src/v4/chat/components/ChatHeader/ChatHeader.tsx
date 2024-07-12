import React from 'react';
import millify from 'millify';
import Chat from '~/v4/icons/Chat';
import UserRegular from '~/v4/icons/UserRegular';
import useConnectionStates from '~/social/hooks/useConnectionStates';
import ConnectionSpinner from '~/v4/icons/ConnectionSpinner';
import { Typography } from '~/v4/core/components';
import useChatInfo from '~/v4/chat/hooks/useChatInfo';
import { Avatar } from '~/v4/core/components/Avatar/Avatar';
import { useAmityComponent } from '~/v4/core/hooks/uikit/index';
import styles from './ChatHeader.module.css';

interface ChatHeaderProps {
  channel: Amity.Channel | null;
  pageId?: string;
  componentId?: string;
}

export const ChatHeader = ({ channel, pageId = '*' }: ChatHeaderProps) => {
  const componentId = 'chat_header';
  const { themeStyles } = useAmityComponent({ pageId, componentId });
  const { chatName, chatAvatar } = useChatInfo({ channel });
  const isOnline = useConnectionStates();

  return (
    <div className={styles.messageListHeader} style={themeStyles}>
      <div className={styles.avatar}>
        <Avatar avatarUrl={chatAvatar} defaultImage={<Chat />} />
      </div>
      <div>
        <div className={styles.displayName}>
          <Typography.Title>{chatName || 'Loading...'}</Typography.Title>
        </div>
        <div className={styles.memberCount}>
          {isOnline ? (
            <>
              <UserRegular className={styles.memberIcon} />
              <Typography.Caption>
                {millify(channel?.memberCount || 0)}{' '}
                {`${channel?.memberCount || 0} ${
                  channel?.memberCount === 1 ? 'member' : 'members'
                }`}
              </Typography.Caption>
            </>
          ) : (
            <>
              <ConnectionSpinner width={20} height={20} />
              <Typography.Caption>Waiting for connection...</Typography.Caption>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
