import React from 'react';
import styles from './EmptyUserImageFeed.module.css';
import EmptyImagePost from '~/v4/icons/EmptyImagePost';
import { EmptyContent } from '~/v4/social/internal-components/EmptyContent/EmptyContent';

interface EmptyUserImageFeedProps {
  pageId?: string;
  componentId?: string;
}

export const EmptyUserImageFeed = ({
  pageId = '*',
  componentId = '*',
}: EmptyUserImageFeedProps) => {
  const elementId = 'empty_user_image_feed';

  return (
    <EmptyContent
      pageId={pageId}
      componentId={componentId}
      elementId={elementId}
      defaultIcon={() => <EmptyImagePost className={styles.emptyUserImageFeed__icon} />}
    />
  );
};
