import React from 'react';
import styles from './BlockedUserVideoFeed.module.css';
import { EmptyContent } from '~/v4/social/internal-components/EmptyContent';
import BlockedUser from '~/v4/icons/BlockedUser';

interface BlockedUserVideoFeedProps {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  infoElementId?: string;
}

export const BlockedUserVideoFeed: React.FC<BlockedUserVideoFeedProps> = ({
  pageId = '*',
  componentId = '*',
}) => {
  const elementId = 'blocked_user_image_feed';
  const infoElementId = 'blocked_user_image_feed_info';
  return (
    <EmptyContent
      pageId={pageId}
      componentId={componentId}
      elementId={elementId}
      infoElementId={infoElementId}
      defaultIcon={() => <BlockedUser className={styles.blockedUserVideoFeed__icon} />}
    />
  );
};
