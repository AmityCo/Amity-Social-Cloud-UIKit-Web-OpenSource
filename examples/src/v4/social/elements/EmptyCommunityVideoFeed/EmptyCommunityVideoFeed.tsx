import React from 'react';
import styles from './EmptyCommunityVideoFeed.module.css';
import EmptyVideo from '~/v4/icons/EmptyVideo';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Typography } from '~/v4/core/components';

interface EmptyCommunityVideoFeedProps {
  pageId?: string;
  componentId?: string;
}

export const EmptyCommunityVideoFeed = ({
  pageId = '*',
  componentId = '*',
}: EmptyCommunityVideoFeedProps) => {
  const elementId = 'empty_community_video_feed';

  const { themeStyles, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  return (
    <div
      style={themeStyles}
      data-testid={accessibilityId}
      className={styles.emptyCommunityVideoFeed__container}
    >
      <IconComponent
        defaultIcon={() => <EmptyVideo className={styles.emptyCommunityVideoFeed__icon} />}
        imgIcon={() => <EmptyVideo className={styles.emptyCommunityVideoFeed__icon} />}
      />
      <div>
        <Typography.TitleBold className={styles.emptyCommunityVideoFeed__text}>
          No videos yet
        </Typography.TitleBold>
      </div>
    </div>
  );
};
