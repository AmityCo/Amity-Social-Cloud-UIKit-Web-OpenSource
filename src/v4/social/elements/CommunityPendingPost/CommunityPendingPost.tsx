import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './CommunityPendingPost.module.css';
import { Button } from '~/v4/core/natives/Button/Button';

interface CommunityPendingPostProps {
  pageId?: string;
  componentId?: string;
  pendingPostsCount?: number;
  isPostOwner?: boolean;
  canReviewCommunityPosts?: boolean;
  onClick?: () => void;
}

export const CommunityPendingPost: React.FC<CommunityPendingPostProps> = ({
  pageId = '*',
  componentId = '*',
  pendingPostsCount = 0,
  onClick,
  isPostOwner,
  canReviewCommunityPosts,
}) => {
  const elementId = 'community_pending_post';
  const { config, themeStyles, accessibilityId, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Button
      className={styles.communityPendingPost__container}
      style={themeStyles}
      data-testid={accessibilityId}
      onPress={onClick}
    >
      <div className={styles.communityPendingPost__content}>
        <div className={styles.communityPendingPost__textContainer}>
          <div className={styles.communityPendingPost__title__wrapper}>
            <div className={styles.communityPendingPost__icon} />
            <Typography.BodyBold>Pending posts</Typography.BodyBold>
          </div>
          <Typography.Caption className={styles.communityPendingPost__subtext}>
            {isPostOwner
              ? pendingPostsCount == 1
                ? 'Your post is pending for review'
                : 'Your posts are pending for review'
              : canReviewCommunityPosts
                ? pendingPostsCount == 1
                  ? '1 post need approval'
                  : `${pendingPostsCount} posts need approval
                `
                : null}
          </Typography.Caption>
        </div>
      </div>
    </Button>
  );
};
