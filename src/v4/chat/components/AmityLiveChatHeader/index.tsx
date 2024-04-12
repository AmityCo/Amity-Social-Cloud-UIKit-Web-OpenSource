import React from 'react';
import millify from 'millify';
import { FormattedMessage, useIntl } from 'react-intl';
import UserAvatar from '~/v4/chat/components/UserAvatar';
import { backgroundImage as communityBackgroundImage } from '~/v4/icons/Community';
import UserRegular from '~/v4/icons/UserRegular';
import useConnectionStates from '~/social/hooks/useConnectionStates';
import ConnectionSpinner from '~/v4/icons/ConnectionSpinner';
import { Typography } from '~/v4/core/components';
import styles from './styles.module.css';
import useChatInfo from '~/v4/chat/hooks/useChatInfo';

interface AmityLiveChatHeaderProps {
  channel: Amity.Channel | null;
}

export const AmityLiveChatHeader = ({ channel }: AmityLiveChatHeaderProps) => {
  const { chatName, chatAvatar } = useChatInfo({ channel });
  const { formatMessage } = useIntl();
  const isOnline = useConnectionStates();

  return (
    <div className={styles.messageListHeader}>
      <UserAvatar avatarUrl={chatAvatar} defaultImage={communityBackgroundImage} />
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
