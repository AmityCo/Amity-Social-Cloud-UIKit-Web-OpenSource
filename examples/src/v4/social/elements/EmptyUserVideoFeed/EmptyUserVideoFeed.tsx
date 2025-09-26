import React from 'react';
import styles from './EmptyUserVideoFeed.module.css';
import EmptyVideoPost from '~/v4/icons/EmptyVideoPost';
import { EmptyContent } from '~/v4/social/internal-components/EmptyContent/EmptyContent';

interface EmptyUserVideoFeedProps {
  pageId?: string;
  componentId?: string;
}

export const EmptyUserVideoFeed = ({
  pageId = '*',
  componentId = '*',
}: EmptyUserVideoFeedProps) => {
  const elementId = 'empty_user_video_feed';

  return (
    <EmptyContent
      pageId={pageId}
      componentId={componentId}
      elementId={elementId}
      defaultIcon={() => <EmptyVideoPost className={styles.emptyUserVideoFeed__icon} />}
    />
  );
};
