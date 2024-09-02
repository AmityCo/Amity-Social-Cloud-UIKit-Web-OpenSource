import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './CommunityPendingPost.module.css';

interface CommunityPendingPostProps {
  pageId?: string;
  componentId?: string;
  pendingPostsCount?: number;
}

export const CommunityPendingPost: React.FC<CommunityPendingPostProps> = ({
  pageId = '*',
  componentId = '*',
  pendingPostsCount = 0,
}) => {
  const elementId = 'community_pending_post';
  const { config, themeStyles, accessibilityId, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <div
      className={styles.communityPendingPost__container}
      style={themeStyles}
      data-qa-anchor={accessibilityId}
    >
      <div className={styles.communityPendingPost__content}>
        <div className={styles.communityPendingPost__textContainer}>
          <div className={styles.communityPendingPost__title__wrapper}>
            <div className={styles.communityPendingPost__icon} />
            <Typography.BodyBold>Pending posts</Typography.BodyBold>
          </div>
          <Typography.Caption className={styles.communityPendingPost__subtext}>
            {pendingPostsCount == 1
              ? '1 post need approval'
              : `${pendingPostsCount} posts need approval`}
          </Typography.Caption>
        </div>
      </div>
    </div>
  );
};
