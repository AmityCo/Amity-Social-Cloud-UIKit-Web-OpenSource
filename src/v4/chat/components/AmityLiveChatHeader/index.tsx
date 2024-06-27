import React from 'react';
import millify from 'millify';
import { FormattedMessage, useIntl } from 'react-intl';
import Chat from '~/v4/icons/Chat';
import UserRegular from '~/v4/icons/UserRegular';
import useConnectionStates from '~/social/hooks/useConnectionStates';
import ConnectionSpinner from '~/v4/icons/ConnectionSpinner';
import { Typography } from '~/v4/core/components';
import styles from './styles.module.css';
import useChatInfo from '~/v4/chat/hooks/useChatInfo';
import { Avatar } from '~/v4/core/components/Avatar/Avatar';
import { useAmityComponent } from '~/v4/core/hooks/uikit/index';

interface AmityLiveChatHeaderProps {
  channel: Amity.Channel | null;
  pageId?: string;
  componentId?: string;
}

export const AmityLiveChatHeader = ({ channel, pageId = '*' }: AmityLiveChatHeaderProps) => {
  const componentId = 'chat_header';
  const { themeStyles } = useAmityComponent({ pageId, componentId });
  const { chatName, chatAvatar } = useChatInfo({ channel });
  const { formatMessage } = useIntl();
  const isOnline = useConnectionStates();

  return (
    <div className={styles.messageListHeader} style={themeStyles}>
      <div className={styles.avatar}>
        <Avatar avatarUrl={chatAvatar} defaultImage={<Chat />} />
      </div>
      <div>
        <div className={styles.displayName}>
          <Typography.Title>{chatName || formatMessage({ id: 'loading' })}</Typography.Title>
        </div>
        <div className={styles.memberCount}>
          {isOnline ? (
            <>
              <UserRegular className={styles.memberIcon} />
              <Typography.Caption>
                {millify(channel?.memberCount || 0)}{' '}
                <FormattedMessage
                  id="plural.member"
                  values={{ amount: channel?.memberCount || 0 }}
                />
              </Typography.Caption>
            </>
          ) : (
            <>
              <ConnectionSpinner width={20} height={20} />
              <Typography.Caption>
                <FormattedMessage id="general.connection.waiting" />
              </Typography.Caption>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AmityLiveChatHeader;
