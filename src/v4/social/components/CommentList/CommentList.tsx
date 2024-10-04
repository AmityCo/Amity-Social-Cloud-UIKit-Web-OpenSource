import React, { useRef, useState } from 'react';

import { Comment } from '~/v4/social/components/Comment/Comment';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { CommentRepository, SubscriptionLevels } from '@amityco/ts-sdk';
import { usePaginator } from '~/v4/core/hooks/usePaginator';
import { CommentAd } from '~/v4/social/internal-components/CommentAd/CommentAd';
import { CommentSkeleton } from '~/v4/social/components/Comment/CommentSkeleton';
import styles from './CommentList.module.css';
import useCommunityStoriesSubscription from '~/v4/social/hooks/useCommunityStoriesSubscription';
import { Typography } from '~/v4/core/components';
import usePostSubscription from '~/v4/core/hooks/subscriptions/usePostSubscription';

type CommentListProps = {
  referenceId: string;
  referenceType: Amity.CommentReferenceType;
  pageId?: string;
  onClickReply: (comment: Amity.Comment) => void;
  limit?: number;
  includeDeleted?: boolean;
  community?: Amity.Community | null;
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
  shouldAllowInteraction = true,
}: CommentListProps) => {
  const componentId = 'comment_tray_component';

  const { themeStyles, accessibilityId } = useAmityComponent({
    componentId,
    pageId,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

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
    node: intersectionNode,
    options: {
      threshold: 0.8,
    },
    onIntersect: () => {
      if (hasMore && isLoading === false) {
        loadMore();
      }
    },
  });

  usePostSubscription({
    postId: referenceId,
    level: SubscriptionLevels.COMMENT,
    shouldSubscribe: referenceType === 'post',
  });

  useCommunityStoriesSubscription({
    targetId: referenceId,
    // TODO: fix type it's actually have the same type but different name
    targetType: referenceType as Amity.StoryTargetType,
    shouldSubscribe: referenceType === 'story' && !!referenceId,
  });

  if (!isLoading && items.length === 0) {
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
            pageId={pageId}
            key={item.commentId}
            comment={item as Amity.Comment}
            onClickReply={(comment) => onClickReply?.(comment)}
            componentId={componentId}
            community={community}
            shouldAllowInteraction={shouldAllowInteraction}
          />
        );
      })}
      {/* TODO: add this button when implement desktop view  */}
      {/* <div className={styles.postCommentList__viewAllComments__button}>
        <Typography.BodyBold>View all comments...</Typography.BodyBold>
      </div> */}
      {isLoading && (
        <CommentSkeleton pageId={pageId} componentId={componentId} numberOfSkeletons={3} />
      )}

      <div
        ref={(node) => setIntersectionNode(node)}
        className={styles.commentList__container_intersection}
      />
    </div>
  );
};
