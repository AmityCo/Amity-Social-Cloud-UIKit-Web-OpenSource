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
  joinRequestsCount = 0,
  isShowJoinRequest = false,
  isShowPendingPost = false,
}) => {
  const elementId = 'community_pending_post';
  const { config, themeStyles, accessibilityId, isExcluded, resolveText } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  const pendingPostsCountNumber = pendingPostsCount > 10 ? '10+' : pendingPostsCount;
  const joinRequestsCountNumber = joinRequestsCount > 10 ? '10+' : joinRequestsCount;

  const getOwnerPostMessage = () => {
    return pendingPostsCount === 1
      ? resolveText('amity_social_label_community_posts_pending_review')
      : resolveText('amity_social_label_community_posts_pending_review');
  };

  const getPendingPostsMessage = () => {
    const postLabel =
      pendingPostsCount === 1
        ? resolveText('amity_social_label_community_post_label')
        : resolveText('amity_social_label_community_posts_label');
    const countText = pendingPostsCount === 1 ? '1' : String(pendingPostsCountNumber);
    const subjectText = `${countText} ${postLabel}`;
    return pendingPostsCount === 1
      ? resolveText('amity_social_button_community_requires_approval', subjectText)
      : resolveText('amity_social_button_community_require_approval', subjectText);
  };

  const getJoinRequestsMessage = () => {
    const requestLabel =
      joinRequestsCount === 1
        ? resolveText('amity_social_label_community_join_request_label')
        : resolveText('amity_social_label_community_join_requests_label');
    const countText = joinRequestsCount === 1 ? '1' : String(joinRequestsCountNumber);
    const subjectText = `${countText} ${requestLabel}`;
    return joinRequestsCount === 1
      ? resolveText('amity_social_button_community_requires_approval', subjectText)
      : resolveText('amity_social_button_community_require_approval', subjectText);
  };

  const getCombinedMessage = () => {
    const postsLabel =
      pendingPostsCount === 1
        ? resolveText('amity_social_label_community_post_label')
        : resolveText('amity_social_label_community_posts_label');
    const requestsLabel =
      joinRequestsCount === 1
        ? resolveText('amity_social_label_community_join_request_label')
        : resolveText('amity_social_label_community_join_requests_label');
    const postsText = `${pendingPostsCount === 1 ? '1' : pendingPostsCountNumber} ${postsLabel}`;
    const requestsText = `${joinRequestsCount === 1 ? '1' : joinRequestsCountNumber} ${requestsLabel}`;
    const andLabel = resolveText('amity_social_button_community_and');
    return resolveText(
      'amity_social_button_community_require_approval',
      `${postsText} ${andLabel} ${requestsText}`,
    );
  };

  const renderTextBanner = () => {
    if (isPostOwner) {
      return getOwnerPostMessage();
    }

    if (isShowPendingPost && isShowJoinRequest) {
      return getCombinedMessage();
    }

    if (isShowJoinRequest) {
      return getJoinRequestsMessage();
    }

    if (isShowPendingPost) {
      return getPendingPostsMessage();
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
            <Typography.BodyBold>
              {resolveText('amity_social_button_pending_requests')}
            </Typography.BodyBold>
          </div>
          <Typography.Caption className={styles.communityPendingPost__subtext}>
            {renderTextBanner()}
          </Typography.Caption>
        </div>
      </div>
    </Button>
  );
};
