import React from 'react';
import styles from './EmptyClipFeed.module.css';
import EmptyClip from '~/v4/icons/EmptyClip';
import { EmptyContent } from '~/v4/social/internal-components/EmptyContent/EmptyContent';

interface EmptyClipFeedProps {
  pageId?: string;
  componentId?: string;
}

export const EmptyClipFeed = ({ pageId = '*', componentId = '*' }: EmptyClipFeedProps) => {
  const elementId = 'empty_clip_feed';

  return (
    <EmptyContent
      pageId={pageId}
      componentId={componentId}
      elementId={elementId}
      defaultIcon={() => <EmptyClip className={styles.emptyClipFeed__icon} />}
      emptyContentClassName={styles.emptyClipFeed}
    />
  );
};
