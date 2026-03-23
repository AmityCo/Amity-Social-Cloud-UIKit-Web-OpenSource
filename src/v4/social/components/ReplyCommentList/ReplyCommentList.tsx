import React, { useEffect, useState, useRef } from 'react';
import { Typography } from '~/v4/core/components';
import { CommentSkeleton } from '~/v4/social/components/Comment/CommentSkeleton';
import useCommentsCollection from '~/v4/social/hooks/collections/useCommentsCollection';
import ReplyComment from '~/v4/social/components/ReplyComment/ReplyComment';
import styles from './ReplyCommentList.module.css';
import { AngleDown } from '~/v4/icons/AngleDown';
import { EVENT_LISTENER } from '~/v4/social/constants/eventListener';
import clsx from 'clsx';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';

interface ReplyCommentProps {
  pageId?: string;
  componentId?: string;
  community?: Amity.Community;
  referenceId: string;
  referenceType: string;
  parentId: string;
  highlightedCommentId?: string;
  l0AncestorId?: string;
  onClickReply?: (params: {
    comment: Amity.Comment;
    parentIdOverride?: string;
    l0AncestorId?: string;
  }) => void;
  isL2List?: boolean;
  /** Optional render prop for an inline compose bar rendered at the bottom of the thread
   *  container, keeping it inside the thread-line visual. */
  renderInlineComposer?: () => React.ReactNode;
  /** Comments to show immediately at the top before the live collection loads.
   *  Used when the list was not yet mounted at the time the comment was created
   *  (e.g. the very first reply under an L0 comment). */
  initialPendingComments?: Amity.Comment[];
  showReplyCommentAt?: string;
  highlightedL2CommentId?: string;
  /** When true the L2 list sorts lastCreated and highlights the first (latest) comment. */
  highlightLatestL2?: boolean;
  onEmpty?: () => void;
}

export const ReplyCommentList = ({
  pageId = '*',
  componentId = '*',
  referenceId,
  referenceType,
  community,
  parentId,
  highlightedCommentId,
  l0AncestorId,
  onClickReply,
  isL2List = false,
  renderInlineComposer,
  initialPendingComments = [],
  showReplyCommentAt,
  highlightedL2CommentId,
  highlightLatestL2 = false,
  onEmpty,
}: ReplyCommentProps) => {
  const [showFilteredComments, setShowFilteredComments] = useState(
    !highlightedCommentId && !highlightLatestL2,
  );
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [pendingComments, setPendingComments] = useState<Amity.Comment[]>(initialPendingComments);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  // After user expands the L2 list, switch to firstCreated order
  const [hasExpandedAll, setHasExpandedAll] = useState(false);
  // Captures the full latest comment object so it stays pinned at top after expansion
  // (the latest comment won't appear in the first page of a firstCreated-sorted collection)
  const [pinnedLatestComment, setPinnedLatestComment] = useState<Amity.Comment | undefined>(
    undefined,
  );
  const highlightedCommentRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notification = useNotifications();

  const { comments, hasMore, isLoading, loadMore } = useCommentsCollection({
    referenceId,
    referenceType: referenceType as Amity.CommentReferenceType,
    parentId,
    limit: 5,
    sortBy: isL2List
      ? hasExpandedAll
        ? 'firstCreated'
        : 'lastCreated' // initial: lastCreated so recent target appears in first page
      : 'lastCreated',
    shouldCall: true,
    includeDeleted: false,
  });

  // When no specific L2 comment ID is provided, dynamically target the first (latest) comment.
  // After expansion: use the captured full object so the pinned slot never depends on the
  // re-fetched (firstCreated) collection containing the newest comment.
  const effectiveHighlightedCommentId =
    isL2List && highlightLatestL2
      ? hasExpandedAll
        ? pinnedLatestComment?.commentId
        : comments.length > 0
          ? comments[0].commentId
          : undefined
      : highlightedCommentId;

  // When expanded, derive highlightedComment from the captured pinned object so the slot
  // always has data regardless of sort order or page position.
  const highlightedComment: Amity.Comment[] =
    hasExpandedAll && pinnedLatestComment
      ? [pinnedLatestComment]
      : comments.filter((comment) => effectiveHighlightedCommentId === comment.commentId);

  const filteredComments = comments.filter(
    // Always exclude the highlighted comment from the regular list when one exists so it
    // never appears twice — the pinned slot at the top is the single source of truth.
    (comment) =>
      !effectiveHighlightedCommentId || comment.commentId !== effectiveHighlightedCommentId,
  );

  const highlightedCommentDeleted = highlightedComment.filter((comment) => comment.isDeleted);

  const hasMoreRef = useRef(hasMore);
  const loadMoreRef = useRef(loadMore);
  // Tracks the latest comments array without closure staleness.
  const commentsRef = useRef(comments);
  // Set to true from the start so the initial collection load is also checked.
  const pendingEmptyCheckRef = useRef(true);
  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);
  useEffect(() => {
    loadMoreRef.current = loadMore;
  }, [loadMore]);
  useEffect(() => {
    commentsRef.current = comments;
  }, [comments]);

  // Reset isLoadingMore once the collection finishes loading; also fire the empty-check
  // when the user triggered the load and the result contains no replies.
  useEffect(() => {
    if (!isLoading) {
      setIsLoadingMore(false);
      if (pendingEmptyCheckRef.current) {
        pendingEmptyCheckRef.current = false;
        if (commentsRef.current.length === 0) {
          notification.info({ content: 'This reply is no longer available.' });
          onEmpty?.();
        }
      }
    }
  }, [isLoading]);

  const handleClickLoadMore = () => {
    pendingEmptyCheckRef.current = true;
    if (highlightLatestL2 && !hasExpandedAll) {
      // Capture the full comment object before switching sort order so the pinned slot
      // always has data regardless of what the re-fetched collection returns.
      if (comments.length > 0) {
        setPinnedLatestComment(comments[0] as Amity.Comment);
      }
      // Switch from lastCreated → firstCreated; the collection will re-fetch automatically.
      setHasExpandedAll(true);
      setShowFilteredComments(true);
    } else if (effectiveHighlightedCommentId && !showFilteredComments) {
      // Capture the specific target before switching sort so it stays pinned at top.
      if (highlightedComment[0]) {
        setPinnedLatestComment(highlightedComment[0] as Amity.Comment);
      }
      setHasExpandedAll(true); // switch to firstCreated
      setShowFilteredComments(true);
      if (hasMore) {
        setIsLoadingMore(true);
        loadMore();
      }
    } else {
      setIsLoadingMore(true);
      loadMore();
    }

    setPendingComments([]);
  };

  const pendingCommentIds = new Set(pendingComments.map((p) => p.commentId));
  const visiblePending = [...pendingComments];

  const filteredServerComments = filteredComments.filter(
    (c) => !pendingCommentIds.has(c.commentId),
  );

  // Listen for newly created replies targeted at this list's parentId.
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ parentId: string; comment: Amity.Comment }>).detail;
      if (detail.parentId !== parentId) return;
      setPendingComments((prev) => {
        if (prev.some((p) => p.commentId === detail.comment.commentId)) return prev;
        // Prepend so newest-created appears at the top of the visible list.
        return [detail.comment, ...prev];
      });
      // Auto-expand the reply list so the new comment is immediately visible
      // alongside any existing replies (equivalent to the user tapping "View more replies").
      setShowFilteredComments(true);
      if (hasMoreRef.current) {
        loadMoreRef.current();
      }
    };
    document.addEventListener(EVENT_LISTENER.REPLY_CREATED, handler);
    return () => document.removeEventListener(EVENT_LISTENER.REPLY_CREATED, handler);
  }, [parentId]);

  // Remove optimistically-added pending comments when they are deleted.
  useEffect(() => {
    const handler = (e: Event) => {
      const { commentId, parentId: deletedParentId } = (
        e as CustomEvent<{ commentId: string; parentId?: string }>
      ).detail;
      // Only react to deletions whose parent matches this list's parentId.
      if (deletedParentId !== parentId) return;
      setPendingComments((prev) => prev.filter((p) => p.commentId !== commentId));
    };
    document.addEventListener(EVENT_LISTENER.COMMENT_DELETED, handler);
    return () => document.removeEventListener(EVENT_LISTENER.COMMENT_DELETED, handler);
  }, [parentId]);

  // L2: trigger blue-highlight directly once the comment appears in the DOM.
  // L2 lists mount after SCROLL_COMPLETE has already fired so we can't rely on that event.
  useEffect(() => {
    if (!isL2List || !parentId || !effectiveHighlightedCommentId || highlightedComment.length === 0)
      return;

    timerRef.current = setTimeout(() => {
      setIsHighlighted(true);
      timerRef.current = setTimeout(() => {
        setIsHighlighted(false);
      }, 3000);
    }, 100);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isL2List, highlightedComment.length, effectiveHighlightedCommentId, parentId]);

  // L1: register SCROLL_COMPLETE listener immediately on mount so it never misses the event,
  // regardless of whether comments have loaded yet.
  useEffect(() => {
    if (isL2List || !parentId || !effectiveHighlightedCommentId) return;

    const handleScrollComplete = (e: CustomEvent) => {
      if (e.detail.commentId === effectiveHighlightedCommentId) {
        setIsHighlighted(true);
        timerRef.current = setTimeout(() => {
          setIsHighlighted(false);
        }, 3000);
      }
    };
    document.addEventListener(
      EVENT_LISTENER.SCROLL_COMPLETE,
      handleScrollComplete as EventListener,
    );
    return () => {
      document.removeEventListener(
        EVENT_LISTENER.SCROLL_COMPLETE,
        handleScrollComplete as EventListener,
      );
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isL2List, effectiveHighlightedCommentId, parentId]);

  return (
    <div className={styles.replyCommentList} data-is-l2={isL2List ? 'true' : 'false'}>
      {/* Skeleton at top only for initial load or new-comment loading, not for load-more */}
      {isLoading &&
        !isLoadingMore &&
        (isL2List ? (
          <div key="skeleton-top" className={styles.replyCommentList__item}>
            <CommentSkeleton numberOfSkeletons={1} />
          </div>
        ) : (
          <CommentSkeleton numberOfSkeletons={1} />
        ))}

      {/* Optimistic pending comments — prepended at top, disappear once live collection catches up */}
      {visiblePending.map((comment, index) => (
        <div
          key={`pending-${comment.commentId}`}
          className={styles.replyCommentList__item}
          data-is-deleted={comment.isDeleted ? 'true' : 'false'}
        >
          <ReplyComment
            pageId={pageId}
            community={community}
            comment={comment}
            testId={`pending-reply-comment-${index}`}
            isL2={isL2List}
            l0AncestorId={l0AncestorId}
            onClickReply={onClickReply}
            showReply={!!(showReplyCommentAt && comment.commentId === showReplyCommentAt)}
            renderL2ReplyList={
              !isL2List
                ? ({ showL2Replies, pendingL2Comments, hideL2Replies }) =>
                    showL2Replies ? (
                      <ReplyCommentList
                        pageId={pageId}
                        community={community}
                        referenceId={comment.referenceId}
                        referenceType={comment.referenceType}
                        parentId={comment.commentId}
                        l0AncestorId={l0AncestorId}
                        onClickReply={onClickReply}
                        isL2List
                        initialPendingComments={pendingL2Comments}
                        highlightLatestL2={highlightLatestL2}
                        highlightedCommentId={
                          showReplyCommentAt && comment.commentId === showReplyCommentAt
                            ? highlightedL2CommentId
                            : undefined
                        }
                        onEmpty={hideL2Replies}
                      />
                    ) : null
                : undefined
            }
          />
        </div>
      ))}

      {/* Display highlighted comment at the top. Always kept pinned when a notification
          target is present (highlightedCommentId set) so the L1 parent of an L2 notification
          remains visible at the top even after the user expands the full reply list. */}
      {highlightedComment.length > 0 &&
        (!showFilteredComments || isL2List || !!highlightedCommentId) &&
        highlightedComment.map((comment) => (
          <div
            key={comment.commentId}
            ref={highlightedCommentRef}
            className={clsx(
              styles.replyCommentList__item,
              styles.replyCommentList__highlightedComment,
              isHighlighted &&
                !isL2List &&
                !highlightLatestL2 &&
                styles.replyCommentList__bounceAnimation,
            )}
            data-testid="highlighted-comment"
            data-is-deleted={comment.isDeleted ? 'true' : 'false'}
          >
            <ReplyComment
              pageId={pageId}
              community={community}
              comment={comment as Amity.Comment}
              isHighlightDeleted={
                highlightedComment.length > 0 && showFilteredComments ? false : true
              }
              isL2={isL2List}
              l0AncestorId={l0AncestorId}
              onClickReply={onClickReply}
              isHighlighted={isHighlighted && isL2List}
              showReply={!!(showReplyCommentAt && comment.commentId === showReplyCommentAt)}
              renderL2ReplyList={
                !isL2List
                  ? ({ showL2Replies, pendingL2Comments, hideL2Replies }) =>
                      showL2Replies ? (
                        <ReplyCommentList
                          pageId={pageId}
                          community={community}
                          referenceId={(comment as Amity.Comment).referenceId}
                          referenceType={(comment as Amity.Comment).referenceType}
                          parentId={(comment as Amity.Comment).commentId}
                          l0AncestorId={l0AncestorId}
                          onClickReply={onClickReply}
                          isL2List
                          initialPendingComments={pendingL2Comments}
                          highlightLatestL2={highlightLatestL2}
                          highlightedCommentId={
                            showReplyCommentAt &&
                            (comment as Amity.Comment).commentId === showReplyCommentAt
                              ? highlightedL2CommentId
                              : undefined
                          }
                          onEmpty={hideL2Replies}
                        />
                      ) : null
                  : undefined
              }
            />
          </div>
        ))}

      {/* Display other comments only if showFilteredComments is true */}
      {(showFilteredComments || !!showReplyCommentAt) &&
        filteredServerComments.map((comment, index) => (
          <div
            key={comment.commentId}
            className={styles.replyCommentList__item}
            data-is-deleted={comment.isDeleted ? 'true' : 'false'}
          >
            <ReplyComment
              pageId={pageId}
              community={community}
              comment={comment as Amity.Comment}
              testId={`reply-comment-${index}`}
              isL2={isL2List}
              l0AncestorId={l0AncestorId}
              onClickReply={onClickReply}
              showReply={!!(showReplyCommentAt && comment.commentId === showReplyCommentAt)}
              renderL2ReplyList={
                !isL2List
                  ? ({ showL2Replies, pendingL2Comments, hideL2Replies }) =>
                      showL2Replies ? (
                        <ReplyCommentList
                          pageId={pageId}
                          community={community}
                          referenceId={(comment as Amity.Comment).referenceId}
                          referenceType={(comment as Amity.Comment).referenceType}
                          parentId={(comment as Amity.Comment).commentId}
                          l0AncestorId={l0AncestorId}
                          onClickReply={onClickReply}
                          isL2List
                          initialPendingComments={pendingL2Comments}
                          highlightLatestL2={highlightLatestL2}
                          highlightedCommentId={
                            showReplyCommentAt &&
                            (comment as Amity.Comment).commentId === showReplyCommentAt
                              ? highlightedL2CommentId
                              : undefined
                          }
                          onEmpty={hideL2Replies}
                        />
                      ) : null
                  : undefined
              }
            />
          </div>
        ))}

      {/* Show "View more replies" when there are more pages to fetch, OR when loaded sibling
          replies are hidden because the list hasn't been expanded yet (L1 notification case). */}
      {(hasMore || (!showFilteredComments && filteredServerComments.length > 0)) &&
        !isLoadingMore && (
          <div
            className={clsx(
              isL2List && styles.replyCommentList__item,
              styles.replyCommentList__viewReplyItem,
            )}
          >
            <div
              data-isdeleted-highlight={highlightedCommentDeleted.length > 0}
              className={styles.postReplyCommentList__viewReply_button}
              role="button"
              tabIndex={0}
              onClick={handleClickLoadMore}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  handleClickLoadMore();
                }
              }}
            >
              <AngleDown className={styles.postReplyCommentList__viewReply_icon} />
              <Typography.CaptionBold className={styles.postReplyCommentList__viewReply_text}>
                View more replies
              </Typography.CaptionBold>
            </div>
          </div>
        )}

      {/* Skeleton below the button while loading more replies */}
      {isLoading &&
        isLoadingMore &&
        (isL2List ? (
          <div key="skeleton-bottom" className={styles.replyCommentList__item}>
            <CommentSkeleton numberOfSkeletons={1} />
          </div>
        ) : (
          <CommentSkeleton numberOfSkeletons={1} />
        ))}
      {renderInlineComposer?.()}
    </div>
  );
};
