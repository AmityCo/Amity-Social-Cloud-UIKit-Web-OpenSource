import React from 'react';
import styles from './BlockedUserFeed.module.css';
import { EmptyContent } from '~/v4/social/internal-components/EmptyContent';
import BlockedUser from '~/v4/icons/BlockedUser';

interface BlockedUserFeedProps {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  infoElementId?: string;
}

export const BlockedUserFeed: React.FC<BlockedUserFeedProps> = ({
  pageId = '*',
  componentId = '*',
}) => {
  const elementId = 'blocked_user_feed';
  const infoElementId = 'blocked_user_feed_info';
  return (
    <EmptyContent
      pageId={pageId}
      componentId={componentId}
      elementId={elementId}
      infoElementId={infoElementId}
      defaultIcon={() => <BlockedUser className={styles.blockedUserFeed__icon} />}
    />
  );
};
