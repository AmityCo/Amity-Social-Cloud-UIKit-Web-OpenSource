import React from 'react';
import styles from './PrivateUserVideoFeed.module.css';
import { EmptyContent } from '~/v4/social/internal-components/EmptyContent';
import PrivateFeed from '~/v4/icons/PrivateFeed';

interface PrivateUserVideoFeedProps {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  infoElementId?: string;
}

export const PrivateUserVideoFeed: React.FC<PrivateUserVideoFeedProps> = ({
  pageId = '*',
  componentId = '*',
}) => {
  const elementId = 'private_user_video_feed';
  const infoElementId = 'private_user_video_feed_info';
  return (
    <EmptyContent
      pageId={pageId}
      componentId={componentId}
      elementId={elementId}
      infoElementId={infoElementId}
      defaultIcon={() => <PrivateFeed className={styles.privateUserVideoFeed__icon} />}
    />
  );
};
