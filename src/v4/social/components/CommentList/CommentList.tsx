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
import { EVENT_LISTENER } from '~/v4/social/constants/eventListener';

type CommentListProps = {
  referenceId: string;
  referenceType: Amity.CommentReferenceType;
  pageId?: string;
  onClickReply: (params: {
    comment: Amity.Comment;
    parentIdOverride?: string;
    l0AncestorId?: string;
  }) => void;
  limit?: number;
  includeDeleted?: boolean;
  community?: Amity.Community | null;
  shouldAllowInteraction?: boolean;
  commentCount?: number;
  renderReplyComment?: (comment: Amity.Comment) => React.ReactNode;
  /** The L1 comment ID being replied to — passed through to Comment/ReplyCommentList
   *  so the inline composer appears after the specific L1 instead of at the bottom. */
  replyTargetCommentId?: string;
  highlightedCommentId?: string;
  parentId?: string;
  /** Direct parent of the target comment from the notification (L1 ID for L2 notifications).
   *  Forwarded to the pinned highlighted Comment so it can synchronously determine it is
   *  an L2 target and pin the correct L1 reply at the top immediately. */
  parantId?: string;
  commentListClassName?: string;
  showReplyCommentAt?: string;
  eventCreatorId?: Amity.Event['userId'];
  /** When true, suppress the "No comments yet" placeholder so the list can be embedded
   *  in dense surfaces (e.g. feed cards) without reserving vertical space. */
  hideEmptyState?: boolean;
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
  replyTargetCommentId,
  highlightedCommentId,
  parentId,
  parantId,
  commentListClassName,
  showReplyCommentAt,
  eventCreatorId,
  hideEmptyState = false,
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
  const [pendingL0Comments, setPendingL0Comments] = useState<Amity.Comment[]>([]);

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

  // Keep pending IDs pinned at top even after they land in the live collection
  const pendingL0CommentIds = new Set(pendingL0Comments.map((c) => c.commentId));
  // For each pending comment, prefer the live server version once it arrives (richer data)
  const visiblePendingL0 = pendingL0Comments.map((c) => {
    const serverVersion = items.find(
      (item) => !isAmityAd(item) && (item as Amity.Comment).commentId === c.commentId,
    ) as Amity.Comment | undefined;
    return serverVersion ?? c;
  });

  // Prune pending comments once they've landed in the server collection so the
  // array doesn't grow indefinitely and they stop being pinned at the top.
  useEffect(() => {
    if (pendingL0Comments.length === 0) return;
    if (highlightedCommentId) return;
    const serverIds = new Set(
      items.filter((item) => !isAmityAd(item)).map((item) => (item as Amity.Comment).commentId),
    );
    const stillPending = pendingL0Comments.filter((c) => !serverIds.has(c.commentId));
    if (stillPending.length !== pendingL0Comments.length) {
      setPendingL0Comments(stillPending);
    }
  }, [items, highlightedCommentId]);

  // Find highlighted comment from items if highlightedCommentId is provided
  const highlightedComment = highlightedCommentId
    ? (items.find(
        (item) =>
          !isAmityAd(item) &&
          (item as Amity.Comment).commentId === (parentId ? parentId : highlightedCommentId),
      ) as Amity.Comment | undefined)
    : undefined;

  // Filter out highlighted comment and pending L0 comments from items to avoid duplication
  const filteredItems = items.filter(
    (item) =>
      isAmityAd(item) ||
      ((!highlightedCommentId ||
        (item as Amity.Comment).commentId !== (parentId ? parentId : highlightedCommentId)) &&
        !pendingL0CommentIds.has((item as Amity.Comment).commentId)),
  );

  useIntersectionObserver({
    node: intersectionNode,
    onIntersect: () => {
      if (hasMore && isLoading === false) {
        loadMore();
      }
    },
  });

  useEffect(() => {
    refresh();
  }, []);

  // Listen for newly created L0 comments and prepend them optimistically.
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ referenceId: string; comment: Amity.Comment }>).detail;
      if (detail.referenceId !== referenceId) return;
      setPendingL0Comments((prev) => {
        if (prev.some((p) => p.commentId === detail.comment.commentId)) return prev;
        return [detail.comment, ...prev];
      });
    };
    document.addEventListener(EVENT_LISTENER.L0_COMMENT_CREATED, handler);
    return () => document.removeEventListener(EVENT_LISTENER.L0_COMMENT_CREATED, handler);
  }, [referenceId]);

  // Track whether the L0 bounce has already fired to avoid double-bouncing.
  const hasL0BouncedRef = useRef(false);

  useEffect(() => {
    hasL0BouncedRef.current = false;
  }, [highlightedCommentId]);

  // Effect to scroll to highlighted comment with animation
  useEffect(() => {
    if (!parentId && highlightedComment && highlightedCommentRef.current) {
      // Create event listener for the scroll complete event
      const handleScrollComplete = (e: CustomEvent) => {
        if (
          e.detail.commentId === highlightedComment.commentId &&
          !showReplyCommentAt &&
          !hasL0BouncedRef.current
        ) {
          hasL0BouncedRef.current = true;
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
      document.addEventListener(
        EVENT_LISTENER.SCROLL_COMPLETE,
        handleScrollComplete as EventListener,
      );

      // Clean up the event listener when component unmounts
      return () => {
        document.removeEventListener(
          EVENT_LISTENER.SCROLL_COMPLETE,
          handleScrollComplete as EventListener,
        );
      };
    }
  }, [highlightedComment, highlightedCommentId, parentId, showReplyCommentAt]);

  // L0 fallback: trigger bounce directly once the highlighted comment renders.
  // Handles the case where SCROLL_COMPLETE was already dispatched before the comment
  // data loaded and the listener was registered.
  useEffect(() => {
    if (!parentId && highlightedComment && highlightedCommentRef.current && !showReplyCommentAt) {
      const fallback = setTimeout(() => {
        if (!hasL0BouncedRef.current) {
          hasL0BouncedRef.current = true;
          setIsHighlighted(true);
          setTimeout(() => setIsHighlighted(false), 1000);
        }
      }, 1200);

      return () => clearTimeout(fallback);
    }
  }, [parentId, highlightedComment, showReplyCommentAt]);

  if (!online) {
    return (
      <div className={styles.noCommentsContainer}>
        <Redo className={styles.noCommentsContainer__icon} />
        <Typography.Body>Unable to load comments</Typography.Body>
      </div>
    );
  }

  if (!isLoading && items.length === 0 && visiblePendingL0.length === 0 && !hideEmptyState) {
    return (
      <div className={styles.noCommentsContainer}>
        <Typography.Body>No comments yet</Typography.Body>
      </div>
    );
  }

  return (
    <div
      className={clsx(styles.commentList__container, commentListClassName)}
      style={themeStyles}
      ref={containerRef}
      data-testid={accessibilityId}
    >
      {/* Optimistic pending L0 comments — prepended at top before the live collection catches up */}
      {visiblePendingL0.map((comment, index) => (
        <div key={`pending-l0-${comment.commentId}`}>
          <Comment
            pageId={pageId}
            comment={comment}
            isHost={eventCreatorId === comment.userId}
            onClickReply={(params) => onClickReply?.(params)}
            componentId={componentId}
            community={community}
            shouldAllowInteraction={shouldAllowInteraction}
            testId={`pending-comment-${index}`}
            renderReplyComment={renderReplyComment}
            replyTargetCommentId={replyTargetCommentId}
          />
        </div>
      ))}

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
            onClickReply={(params) => onClickReply?.(params)}
            componentId={componentId}
            community={community}
            shouldAllowInteraction={shouldAllowInteraction}
            highlightedCommentId={highlightedCommentId}
            parentId={parentId}
            parantId={parantId}
            showReply={highlightedComment.commentId === showReplyCommentAt}
            testId={`comment-highlighted`}
            renderReplyComment={renderReplyComment}
            replyTargetCommentId={replyTargetCommentId}
          />
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
              onClickReply={(params) => onClickReply?.(params)}
              componentId={componentId}
              community={community}
              shouldAllowInteraction={shouldAllowInteraction}
              showReply={item.commentId === showReplyCommentAt}
              testId={`comment-${index}`}
              renderReplyComment={renderReplyComment}
              replyTargetCommentId={replyTargetCommentId}
            />
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
        <CommentSkeleton pageId={pageId} componentId={componentId} numberOfSkeletons={1} />
      )}

      {(!isDesktop || (isDesktop && expanded)) && !isLoading && (
        <div
          ref={(node) => setIntersectionNode(node)}
          className={styles.commentList__container_intersection}
        />
      )}
    </div>
  );
};
