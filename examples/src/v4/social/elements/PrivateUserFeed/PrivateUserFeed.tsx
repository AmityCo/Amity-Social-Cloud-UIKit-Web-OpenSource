import React from 'react';
import styles from './PrivateUserFeed.module.css';
import { EmptyContent } from '~/v4/social/internal-components/EmptyContent';
import PrivateFeed from '~/v4/icons/PrivateFeed';

interface PrivateUserFeedProps {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  infoElementId?: string;
}

export const PrivateUserFeed: React.FC<PrivateUserFeedProps> = ({
  pageId = '*',
  componentId = '*',
}) => {
  const elementId = 'private_user_feed';
  const infoElementId = 'private_user_feed_info';
  return (
    <EmptyContent
      pageId={pageId}
      componentId={componentId}
      elementId={elementId}
      infoElementId={infoElementId}
      defaultIcon={() => <PrivateFeed className={styles.privateUserFeed__icon} />}
    />
  );
};
