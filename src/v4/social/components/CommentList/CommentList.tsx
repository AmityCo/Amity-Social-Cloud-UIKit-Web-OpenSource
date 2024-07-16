import React, { useRef } from 'react';

import { Comment } from '~/v4/social/components/Comment/Comment';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import useCommentsCollection from '~/v4/social/hooks/collections/useCommentsCollection';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import useUserSubscription from '~/v4/core/hooks/subscriptions/useUserSubscription';
import { CommentRepository, SubscriptionLevels } from '@amityco/ts-sdk';
import useCommunitySubscription from '~/v4/core/hooks/subscriptions/useCommunitySubscription';
import { usePaginator } from '~/v4/core/hooks/usePaginator';
import { CommentAd } from '~/v4/social/internal-components/CommentAd/CommentAd';
import styles from './CommentList.module.css';
import useCommunityStoriesSubscription from '~/v4/social/hooks/useCommunityStoriesSubscription';
import { Typography } from '~/v4/core/components';

type CommentListProps = {
  referenceId: string;
  referenceType: Amity.CommentReferenceType;
  pageId?: string;
  onClickReply: (comment: Amity.Comment) => void;
  limit?: number;
  includeDeleted?: boolean;
  community?: Amity.Community;
  post?: Amity.Post;
  shouldAllowInteraction?: boolean;
};

const isAmityAd = (item: Amity.Comment | Amity.InternalComment | Amity.Ad): item is Amity.Ad => {
  return 'adId' in item;
};

export const CommentList = ({
  referenceId,
  referenceType,
  pageId = '*',
  onClickReply,
  limit = 5,
  includeDeleted = false,
  community,
  post,
  shouldAllowInteraction = true,
}: CommentListProps) => {
  const componentId = 'comment_tray_component';

  const { themeStyles, accessibilityId } = useAmityComponent({
    componentId,
    pageId,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const intersectionRef = useRef<HTMLDivElement>(null);

  const { items, loadMore, hasMore, isLoading } = usePaginator({
    fetcher: CommentRepository.getComments,
    params: {
      referenceId,
      referenceType,
      limit,
      includeDeleted,
    },
    placement: 'comment' as Amity.AdPlacement,
    pageSize: 5,
    getItemId: (item) => item.commentId,
    shouldCall: true,
  });

  useIntersectionObserver({
    ref: intersectionRef,
    onIntersect: () => {
      if (hasMore && isLoading === false) {
        loadMore();
      }
    },
  });

  useUserSubscription({
    userId: post?.targetId,
    level: SubscriptionLevels.COMMENT,
    shouldSubscribe: !!post?.targetId,
  });

  useCommunitySubscription({
    communityId: community?.communityId,
    level: SubscriptionLevels.COMMENT,
    shouldSubscribe: !!community?.communityId,
  });

  useCommunityStoriesSubscription({
    targetId: referenceId,
    // TODO: fix type it's actually have the same type but different name
    targetType: referenceType as Amity.StoryTargetType,
    shouldSubscribe: referenceType === 'story' && !!referenceId,
  });

  if (items.length === 0) {
    return (
      <div className={styles.noCommentsContainer}>
        <Typography.Body>No comments yet</Typography.Body>
      </div>
    );
  }

  return (
    <div
      className={styles.commentList__container}
      style={themeStyles}
      ref={containerRef}
      data-qa-anchor={accessibilityId}
    >
      {items.map((item) => {
        return isAmityAd(item) ? (
          <CommentAd key={item.adId} ad={item} />
        ) : (
          <Comment
            key={item.commentId}
            comment={item as Amity.Comment}
            onClickReply={(comment) => onClickReply?.(comment)}
            componentId={componentId}
            targetId={referenceId}
            targetType={referenceType}
            shoudAllowInteraction={shouldAllowInteraction}
          />
        );
      })}
      {/* TODO: add this button when implement desktop view  */}
      {/* <div className={styles.postCommentList__viewAllComments__button}>
        <Typography.BodyBold>View all comments...</Typography.BodyBold>
      </div> */}
      {!isLoading && (
        <div ref={intersectionRef} className={styles.commentList__container_intersection} />
      )}
    </div>
  );
};
