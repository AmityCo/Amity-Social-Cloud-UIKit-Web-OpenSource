import React from 'react';
import styles from './EmptyCommunityImageFeed.module.css';
import EmptyImage from '~/v4/icons/EmptyImage';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Typography } from '~/v4/core/components';

interface EmptyCommunityImageFeedProps {
  pageId?: string;
  componentId?: string;
}

export const EmptyCommunityImageFeed = ({
  pageId = '*',
  componentId = '*',
}: EmptyCommunityImageFeedProps) => {
  const elementId = 'empty_community_image_feed';

  const { themeStyles, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  return (
    <div
      style={themeStyles}
      data-testid={accessibilityId}
      className={styles.emptyCommunityImageFeed__container}
    >
      <IconComponent
        defaultIcon={() => <EmptyImage className={styles.emptyCommunityImageFeed__icon} />}
        imgIcon={() => <EmptyImage className={styles.emptyCommunityImageFeed__icon} />}
      />
      <div>
        <Typography.TitleBold className={styles.emptyCommunityImageFeed__text}>
          No photos yet
        </Typography.TitleBold>
      </div>
    </div>
  );
};
