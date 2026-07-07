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
  /** When true (feed cards), show only `limit` comments with a "View all N comments" /
   *  "Hide all comments" toggle on every viewport. When false (detail page, tray, drawer),
   *  keep the full list + auto infinite-scroll behavior. */
  collapsible?: boolean;
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
  collapsible = false,
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
  const [pendingL0Comments, setPendingL0Comments] = useState<Amity.Comment[]>([]);

  // Do not call refresh() on mount: usePaginator already fetches, and a manual refresh on every CommentList mount re-opens the SDK live observer (this component renders per feed post, so it trips the rate limiter fast).
  const { items, loadMore, hasMore, isLoading } = usePaginator({
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

  // The deep-link target's L0 ancestor: for reply targets (parentId set) it's the L0 root,
  // otherwise the highlighted comment itself. This comment is rendered in its natural list
  // position (not pinned) and scrolled to once it is present.
  const targetL0Id = highlightedCommentId
    ? parentId
      ? parentId
      : highlightedCommentId
    : undefined;

  const isTargetLoaded =
    !!targetL0Id &&
    items.some((item) => !isAmityAd(item) && (item as Amity.Comment).commentId === targetL0Id);

  // Filter out only the optimistic pending L0 comments (rendered separately at the top).
  const filteredItems = items.filter(
    (item) => isAmityAd(item) || !pendingL0CommentIds.has((item as Amity.Comment).commentId),
  );

  // Collapsible feed cards show only `limit` comments until expanded; slicing the already-loaded
  // list when collapsed lets "Hide all comments" actually shrink the visible list back down.
  // Non-collapsible surfaces (detail page, tray, drawer) keep the full list + infinite scroll.
  const displayedItems = collapsible && !expanded ? filteredItems.slice(0, limit) : filteredItems;
  const hasMoreToShow =
    hasMore ||
    filteredItems.filter((item) => !isAmityAd(item) && !(item as Amity.Comment).isDeleted).length >
      limit;

  useIntersectionObserver({
    node: intersectionNode,
    onIntersect: () => {
      if (hasMore && isLoading === false) {
        loadMore();
      }
    },
  });

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

  // Deep-link target may be beyond the first loaded page. Keep loading until it is present so it
  // can render in its natural position and be scrolled to (bounded by the total comment count).
  useEffect(() => {
    if (!targetL0Id || isTargetLoaded) return;
    if (hasMore && !isLoading) loadMore();
  }, [targetL0Id, isTargetLoaded, hasMore, isLoading, loadMore]);

  // Scroll the target comment into view once (per target) after it renders. The <Comment> below
  // owns the persistent highlight treatment (glow fill + accent edge); we only handle scrolling.
  const hasScrolledToTargetRef = useRef(false);
  useEffect(() => {
    hasScrolledToTargetRef.current = false;
  }, [targetL0Id]);
  useEffect(() => {
    if (!targetL0Id || !isTargetLoaded || hasScrolledToTargetRef.current) return;
    const timer = setTimeout(() => {
      if (highlightedCommentRef.current && !hasScrolledToTargetRef.current) {
        hasScrolledToTargetRef.current = true;
        highlightedCommentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [targetL0Id, isTargetLoaded]);

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

      {/* Render comments in their natural order (sliced to `limit` when collapsed). The deep-link
          target renders in place — not pinned — and receives the highlight props + a ref so it
          gets the glow treatment, expands its reply thread, and can be scrolled into view. */}
      {displayedItems.map((item, index) => {
        if (isAmityAd(item)) {
          return <CommentAd key={item.adId} ad={item} />;
        }
        const comment = item as Amity.Comment;
        const isTarget = !!targetL0Id && comment.commentId === targetL0Id;
        return (
          <div key={comment.commentId} ref={isTarget ? highlightedCommentRef : undefined}>
            <Comment
              pageId={pageId}
              isHost={eventCreatorId === comment.userId}
              comment={comment}
              onClickReply={(params) => onClickReply?.(params)}
              componentId={componentId}
              community={community}
              shouldAllowInteraction={shouldAllowInteraction}
              highlightedCommentId={isTarget ? highlightedCommentId : undefined}
              parentId={isTarget ? parentId : undefined}
              parantId={isTarget ? parantId : undefined}
              showReply={comment.commentId === showReplyCommentAt}
              testId={isTarget ? 'comment-highlighted' : `comment-${index}`}
              renderReplyComment={renderReplyComment}
              replyTargetCommentId={replyTargetCommentId}
            />
          </div>
        );
      })}

      {collapsible
        ? (expanded || hasMoreToShow) && (
            <Button
              className={styles.commentList__commentsToggle}
              variant="text"
              onPress={() => {
                if (expanded) {
                  setExpanded(false);
                } else {
                  loadMore();
                  setExpanded(true);
                }
              }}
            >
              <Typography.Caption as="span" className={styles.commentList__commentsToggle__text}>
                {expanded ? 'Hide all comments' : `View all ${commentCount} comments`}
              </Typography.Caption>
            </Button>
          )
        : isDesktop &&
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

      {/* Infinite-scroll sentinel — only when there are more comments to fetch.
       * Rendering it unconditionally left an empty node that still consumed the
       * list's `gap: 1rem`, adding dead space below the "Hide all comments"
       * toggle once everything was already loaded. */}
      {(collapsible ? expanded : !isDesktop || expanded) && !isLoading && hasMore && (
        <div
          ref={(node) => setIntersectionNode(node)}
          className={styles.commentList__container_intersection}
        />
      )}
    </div>
  );
};
