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
  joinRequestsCount?: number;
  isShowJoinRequest?: boolean;
  isShowPendingPost?: boolean;
}

export const CommunityPendingPost: React.FC<CommunityPendingPostProps> = ({
  pageId = '*',
  componentId = '*',
  pendingPostsCount = 0,
  onClick,
  isPostOwner,
  canReviewCommunityPosts,
  joinRequestsCount = 0,
  isShowJoinRequest = false,
  isShowPendingPost = false,
}) => {
  const elementId = 'community_pending_post';
  const { config, themeStyles, accessibilityId, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  const pendingPostsCountNumber = pendingPostsCount > 10 ? '10+' : pendingPostsCount;
  const joinRequestsCountNumber = joinRequestsCount > 10 ? '10+' : joinRequestsCount;

  const getOwnerPostMessage = () => {
    return pendingPostsCount === 1
      ? 'Your post is pending for review'
      : 'Your posts are pending for review';
  };

  const getPendingPostsMessage = () => {
    return pendingPostsCount === 1
      ? '1 post requires approval'
      : `${pendingPostsCountNumber} posts require approval`;
  };

  const getJoinRequestsMessage = () => {
    return joinRequestsCount === 1
      ? '1 join request requires approval'
      : `${joinRequestsCountNumber} join requests require approval`;
  };

  const getCombinedMessage = () => {
    const postsText = pendingPostsCount === 1 ? '1 post' : `${pendingPostsCountNumber} posts`;
    const requestsText =
      joinRequestsCount === 1 ? '1 request' : `${joinRequestsCountNumber} requests`;
    return `${postsText} and ${requestsText} require approval`;
  };

  const renderTextBanner = () => {
    if (isPostOwner) {
      return getOwnerPostMessage();
    }

    if (canReviewCommunityPosts) {
      if (isShowPendingPost && !isShowJoinRequest) {
        return getPendingPostsMessage();
      }

      if (isShowJoinRequest && !isShowPendingPost) {
        return getJoinRequestsMessage();
      }

      return getCombinedMessage();
    }

    return null;
  };

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
            <Typography.BodyBold>Pending requests</Typography.BodyBold>
          </div>
          <Typography.Caption className={styles.communityPendingPost__subtext}>
            {renderTextBanner()}
          </Typography.Caption>
        </div>
      </div>
    </Button>
  );
};
