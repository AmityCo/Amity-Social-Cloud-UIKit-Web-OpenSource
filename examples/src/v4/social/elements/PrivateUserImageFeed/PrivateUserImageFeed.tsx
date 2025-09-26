import React from 'react';
import styles from './PrivateUserImageFeed.module.css';
import { EmptyContent } from '~/v4/social/internal-components/EmptyContent';
import PrivateFeed from '~/v4/icons/PrivateFeed';

interface PrivateUserImageFeedProps {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  infoElementId?: string;
}

export const PrivateUserImageFeed: React.FC<PrivateUserImageFeedProps> = ({
  pageId = '*',
  componentId = '*',
}) => {
  const elementId = 'private_user_image_feed';
  const infoElementId = 'private_user_image_feed_info';
  return (
    <EmptyContent
      pageId={pageId}
      componentId={componentId}
      elementId={elementId}
      infoElementId={infoElementId}
      defaultIcon={() => <PrivateFeed className={styles.privateUserImageFeed__icon} />}
    />
  );
};
