import React, { useEffect, useRef, useState } from 'react';

import { Comment } from '~/v4/social/components/Comment/Comment';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { CommentRepository } from '@amityco/ts-sdk';
import { usePaginator } from '~/v4/core/hooks/usePaginator';
import { CommentAd } from '~/v4/social/internal-components/CommentAd/CommentAd';
import { CommentSkeleton } from '~/v4/social/components/Comment/CommentSkeleton';
import styles from './CommentList.module.css';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/components/AriaButton';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useNetworkState } from 'react-use';
import Redo from '~/v4/icons/Redo';
import clsx from 'clsx';

type CommentListProps = {
  referenceId: string;
  referenceType: Amity.CommentReferenceType;
  pageId?: string;
  onClickReply: (comment: Amity.Comment) => void;
  limit?: number;
  includeDeleted?: boolean;
  community?: Amity.Community | null;
  shouldAllowInteraction?: boolean;
  commentCount?: number;
  renderReplyComment?: (comment: Amity.Comment) => React.ReactNode;
  highlightedCommentId?: string;
  parentId?: string;
  commentListClassName?: string;
  showReplyCommentAt?: string;
  eventCreatorId?: Amity.Event['userId'];
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
  includeDeleted = true,
  community,
  shouldAllowInteraction = true,
  commentCount = 0,
  renderReplyComment,
  highlightedCommentId,
  parentId,
  commentListClassName,
  showReplyCommentAt,
  eventCreatorId,
}: CommentListProps) => {
  const componentId = 'comment_tray_component';
  const { online } = useNetworkState();
  const { isDesktop } = useResponsive();

  const { themeStyles, accessibilityId } = useAmityComponent({
    componentId,
    pageId,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const highlightedCommentRef = useRef<HTMLDivElement>(null);
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);

  const { items, refresh, loadMore, hasMore, isLoading } = usePaginator({
    fetcher: CommentRepository.getComments,
    params: {
      referenceId,
      referenceType,
      limit: highlightedCommentId ? 20 : limit,
      includeDeleted,
    },
    placement: 'comment' as Amity.AdPlacement,
    pageSize: highlightedCommentId ? 20 : limit,
    getItemId: (item) => item.commentId,
    shouldCall: true,
  });

  // Find highlighted comment from items if highlightedCommentId is provided
  const highlightedComment = highlightedCommentId
    ? (items.find(
        (item) =>
          !isAmityAd(item) &&
          (item as Amity.Comment).commentId === (parentId ? parentId : highlightedCommentId),
      ) as Amity.Comment | undefined)
    : undefined;

  // Filter out highlighted comment from items to avoid duplication
  const filteredItems = items.filter(
    (item) =>
      isAmityAd(item) ||
      !highlightedCommentId ||
      (item as Amity.Comment).commentId !== (parentId ? parentId : highlightedCommentId),
  );

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

  useEffect(() => {
    refresh();
  }, []);

  // Effect to scroll to highlighted comment with animation
  useEffect(() => {
    if (!parentId && highlightedComment && highlightedCommentRef.current) {
      // Create event listener for the scroll complete event
      const handleScrollComplete = (e: CustomEvent) => {
        if (e.detail.commentId === highlightedComment.commentId && !showReplyCommentAt) {
          // Only start the bounce animation after the scroll is complete
          setIsHighlighted(true);

          // Reset the animation after it completes
          const timer = setTimeout(() => {
            setIsHighlighted(false);
          }, 1000); // Animation duration

          return () => clearTimeout(timer);
        }
      };

      // Add event listener for the custom scroll complete event
      document.addEventListener('comment-scroll-complete', handleScrollComplete as EventListener);

      // Clean up the event listener when component unmounts
      return () => {
        document.removeEventListener(
          'comment-scroll-complete',
          handleScrollComplete as EventListener,
        );
      };
    }
  }, [highlightedComment, highlightedCommentId, parentId, showReplyCommentAt]);

  if (!online) {
    return (
      <div className={styles.noCommentsContainer}>
        <Redo className={styles.noCommentsContainer__icon} />
        <Typography.Body>Unable to load comments</Typography.Body>
      </div>
    );
  }

  if (!isLoading && items.length === 0) {
    return (
      <div className={styles.noCommentsContainer}>
        <Typography.Body>No comments yet</Typography.Body>
      </div>
    );
  }

  const isShowReply =
    !!showReplyCommentAt && !!highlightedCommentId && showReplyCommentAt === highlightedCommentId;

  return (
    <div
      className={clsx(styles.commentList__container, commentListClassName)}
      style={themeStyles}
      ref={containerRef}
      data-testid={accessibilityId}
    >
      {/* Render highlighted comment at the top if it exists */}
      {highlightedComment && (
        <div
          className={`${styles.commentList__highlightedComment} ${isHighlighted ? styles.commentList__bounceAnimation : ''}`}
          ref={highlightedCommentRef}
        >
          <Comment
            pageId={pageId}
            comment={highlightedComment}
            isHost={eventCreatorId === highlightedComment.userId}
            onClickReply={(comment) => onClickReply?.(comment)}
            componentId={componentId}
            community={community}
            shouldAllowInteraction={shouldAllowInteraction}
            highlightedCommentId={highlightedCommentId}
            parentId={parentId}
            showReply={highlightedComment.commentId === showReplyCommentAt}
            testId={`comment-highlighted`}
          />
          {renderReplyComment?.(highlightedComment)}
        </div>
      )}

      {/* Render regular comments without the highlighted one */}
      {filteredItems.map((item, index) => {
        return isAmityAd(item) ? (
          <CommentAd key={item.adId} ad={item} />
        ) : (
          <div key={(item as Amity.Comment).commentId}>
            <Comment
              pageId={pageId}
              isHost={eventCreatorId === item.userId}
              comment={item as Amity.Comment}
              onClickReply={(comment) => onClickReply?.(comment)}
              componentId={componentId}
              community={community}
              shouldAllowInteraction={shouldAllowInteraction}
              showReply={item.commentId === showReplyCommentAt}
              testId={`comment-${index}`}
            />
            {renderReplyComment?.(item as Amity.Comment)}
          </div>
        );
      })}

      {isDesktop &&
        hasMore &&
        !expanded &&
        filteredItems
          .filter((item) => !isAmityAd(item))
          .filter((item) => !(item as Amity.Comment).isDeleted).length < commentCount && (
          <Button
            className={styles.commentList__viewAllComments__button}
            variant="text"
            onPress={() => {
              loadMore();
              setExpanded(true);
            }}
          >
            <Typography.BodyBold className={styles.commentList__viewAllComments__button__text}>
              View all comments...
            </Typography.BodyBold>
          </Button>
        )}

      {isLoading && (
        <CommentSkeleton pageId={pageId} componentId={componentId} numberOfSkeletons={3} />
      )}

      {(!isDesktop || (isDesktop && expanded)) && (
        <div
          ref={(node) => setIntersectionNode(node)}
          className={styles.commentList__container_intersection}
        />
      )}
    </div>
  );
};
