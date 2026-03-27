import { CommentRepository } from '@amityco/ts-sdk';
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
  /** Optional render prop for an inline compose bar rendered inside the thread container. */
  renderInlineComposer?: () => React.ReactNode;
  /** When set, renderInlineComposer is placed directly after the comment in this list whose
   *  commentId matches this value instead of at the bottom of the list. */
  inlineComposerAfterCommentId?: string;
  /** Comments to show immediately at the top before the live collection loads.
   *  Used when the list was not yet mounted at the time the comment was created
   *  (e.g. the very first reply under an L0 comment). */
  initialPendingComments?: Amity.Comment[];
  showReplyCommentAt?: string;
  highlightedL2CommentId?: string;
  /** When true the L2 list sorts lastCreated and highlights the first (latest) comment. */
  highlightLatestL2?: boolean;
  /** When false, only initialPendingComments are rendered and the server collection is not
   *  fetched. Used to show newly created replies above a still-collapsed "View x replies"
   *  button. Defaults to true. */
  shouldFetch?: boolean;
  /** When true, a "View x replies" button is rendered below this list by the
   *  parent.  Used to condition thread-line masking for pending-only L2 lists. */
  hasViewRepliesBelow?: boolean;
  onEmpty?: () => void;
  onHighlightedDeleted?: () => void;
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
  inlineComposerAfterCommentId,
  initialPendingComments = [],
  showReplyCommentAt,
  highlightedL2CommentId,
  highlightLatestL2 = false,
  shouldFetch = true,
  hasViewRepliesBelow = false,
  onEmpty,
  onHighlightedDeleted,
}: ReplyCommentProps) => {
  // L2 notification: start collapsed — show only the pinned target, rest behind "View more replies".
  // L2 normal: start expanded (no highlight target).
  // L1 notification (highlightedCommentId or highlightLatestL2): start collapsed.
  // L1 normal: start expanded.
  const [showFilteredComments, setShowFilteredComments] = useState(
    isL2List ? !highlightedCommentId : !highlightedCommentId && !highlightLatestL2,
  );
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [pendingComments, setPendingComments] = useState<Amity.Comment[]>(initialPendingComments);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const highlightedCommentRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { comments, hasMore, isLoading, loadMore } = useCommentsCollection({
    referenceId,
    referenceType: referenceType as Amity.CommentReferenceType,
    parentId,
    pageSize: 5,
    sortBy: isL2List ? 'firstCreated' : 'lastCreated',
    shouldCall: shouldFetch,
    includeDeleted: false,
  });

  const notification = useNotifications();

  const effectiveHighlightedCommentId = highlightedCommentId;

  // For L2 notification targets: fetch the target independently so it is always pinned at
  // the top regardless of its position in the firstCreated-sorted collection. Uses the same
  // direct CommentRepository pattern as PostDetailPage — no extra hook needed.
  const [notificationTargetComment, setNotificationTargetComment] = useState<Amity.Comment | null>(
    null,
  );
  // Ref to avoid stale closure in the async CommentRepository callback.
  const onHighlightedDeletedRef = useRef(onHighlightedDeleted);
  onHighlightedDeletedRef.current = onHighlightedDeleted;

  useEffect(() => {
    if (!isL2List || !highlightedCommentId) return;
    let unsubscribe: (() => void) | undefined;
    unsubscribe = CommentRepository.getComment(highlightedCommentId, (resp) => {
      if (!resp.loading) {
        if (resp.data) {
          const comment = resp.data as Amity.Comment;
          setNotificationTargetComment(comment);
          if (comment.isDeleted) {
            onHighlightedDeletedRef.current?.();
          }
        } else {
          // Comment not found — treat as deleted.
          onHighlightedDeletedRef.current?.();
        }
        unsubscribe?.();
        unsubscribe = undefined;
      }
    });
    return () => unsubscribe?.();
  }, [isL2List, highlightedCommentId]);

  const highlightedComment: Amity.Comment[] =
    isL2List && highlightedCommentId
      ? notificationTargetComment
        ? [notificationTargetComment]
        : []
      : comments.filter((comment) => effectiveHighlightedCommentId === comment.commentId);

  const filteredComments = comments.filter(
    // Always exclude the highlighted comment from the regular list when one exists so it
    // never appears twice — the pinned slot at the top is the single source of truth.
    (comment) =>
      !effectiveHighlightedCommentId || comment.commentId !== effectiveHighlightedCommentId,
  );

  const highlightedCommentDeleted = highlightedComment.filter((comment) => comment.isDeleted);

  // Notify parent when the L2 notification target turns out to be deleted.
  useEffect(() => {
    if (highlightedCommentDeleted.length > 0) {
      onHighlightedDeletedRef.current?.();
    }
  }, [highlightedCommentDeleted.length]);

  // Tracks the latest comments array without closure staleness.
  const commentsRef = useRef(comments);
  // Active only when fetching. When shouldFetch transitions false→true the effect re-arms it.
  const pendingEmptyCheckRef = useRef(shouldFetch);

  // Tracks whether the collection has completed its first load.
  const hasInitiallyLoadedRef = useRef(false);

  useEffect(() => {
    commentsRef.current = comments;
  }, [comments]);

  useEffect(() => {
    if (shouldFetch) pendingEmptyCheckRef.current = true;
  }, [shouldFetch]);

  // Reset isLoadingMore once the collection finishes loading; also fire the empty-check
  // when the user triggered the load and the result contains no replies.
  useEffect(() => {
    if (!isLoading) {
      hasInitiallyLoadedRef.current = true;
      setIsLoadingMore(false);
      if (pendingEmptyCheckRef.current) {
        pendingEmptyCheckRef.current = false;
        if (commentsRef.current.length === 0) {
          if (effectiveHighlightedCommentId) {
            notification.info({ content: 'This reply is no longer available.' });
          }
          onEmpty?.();
        }
      }
    }
  }, [isLoading]);

  // Collapse the thread when the live SDK collection becomes empty after a deletion.
  // This covers the case where the deleted comment was already synced to the server
  // collection and is removed asynchronously by the SDK after the delete call.
  useEffect(() => {
    if (!hasInitiallyLoadedRef.current) return;
    if (comments.length === 0 && pendingComments.length === 0) {
      onEmpty?.();
    }
  }, [comments.length, pendingComments.length]);

  const handleClickLoadMore = () => {
    pendingEmptyCheckRef.current = true;
    if (effectiveHighlightedCommentId && !showFilteredComments) {
      // First expand: just reveal the already-fetched page of comments.
      // The "View more replies" button will remain visible if hasMore is true,
      // and subsequent clicks will each fetch the next 5.
      setShowFilteredComments(true);
    } else {
      setIsLoadingMore(true);
      loadMore();
    }
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
      // The new comment is shown via the pending slot above the list — do not
      // auto-expand or load more so that any collapsed "View more replies" state is preserved.
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
  const hasBouncedRef = useRef(false);

  useEffect(() => {
    hasBouncedRef.current = false;
  }, [effectiveHighlightedCommentId]);

  useEffect(() => {
    if (isL2List || !parentId || !effectiveHighlightedCommentId) return;

    const handleScrollComplete = (e: CustomEvent) => {
      if (e.detail.commentId === effectiveHighlightedCommentId && !hasBouncedRef.current) {
        hasBouncedRef.current = true;
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

  // L1 fallback: trigger bounce directly once the highlighted comment loads.
  // Handles the case where SCROLL_COMPLETE was already dispatched before this list mounted
  // (e.g. L0 parent was deleted and the reply list auto-expanded late).
  // Skip when highlightedL2CommentId is set — the L1 is only pinned for context, not the target.
  useEffect(() => {
    if (
      isL2List ||
      !parentId ||
      !effectiveHighlightedCommentId ||
      highlightedComment.length === 0 ||
      highlightedL2CommentId
    )
      return;

    const fallback = setTimeout(() => {
      if (!hasBouncedRef.current) {
        hasBouncedRef.current = true;
        setIsHighlighted(true);
        timerRef.current = setTimeout(() => {
          setIsHighlighted(false);
        }, 3000);
      }
    }, 800);

    return () => clearTimeout(fallback);
  }, [isL2List, parentId, effectiveHighlightedCommentId, highlightedComment.length]);

  return (
    <div
      className={styles.replyCommentList}
      data-is-l2={isL2List ? 'true' : 'false'}
      data-pending-only={isL2List && !shouldFetch ? 'true' : 'false'}
      data-has-view-replies={isL2List && !shouldFetch && hasViewRepliesBelow ? 'true' : 'false'}
    >
      {/* Optimistic pending comments — always at top, disappear once live collection catches up */}
      {visiblePending.map((comment, index) => (
        <React.Fragment key={`pending-${comment.commentId}`}>
          <div
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
                  ? ({
                      showL2Replies,
                      pendingL2Comments,
                      hideL2Replies,
                      onHighlightedDeleted: onHL2Deleted,
                      hasViewRepliesBelow,
                    }) =>
                      showL2Replies || pendingL2Comments.length > 0 ? (
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
                          shouldFetch={showL2Replies}
                          hasViewRepliesBelow={hasViewRepliesBelow}
                          onEmpty={hideL2Replies}
                          onHighlightedDeleted={onHL2Deleted}
                        />
                      ) : null
                  : undefined
              }
            />
          </div>
          {inlineComposerAfterCommentId === comment.commentId && renderInlineComposer?.()}
        </React.Fragment>
      ))}

      {/* Skeleton after pending items — shows below newly created comments while server loads */}
      {isLoading &&
        shouldFetch &&
        !isLoadingMore &&
        (isL2List ? (
          <div key="skeleton-top" className={styles.replyCommentList__item}>
            <CommentSkeleton numberOfSkeletons={1} />
          </div>
        ) : (
          <CommentSkeleton numberOfSkeletons={1} />
        ))}

      {/* Display highlighted comment at the top. Always kept pinned when a notification
          target is present (highlightedCommentId set) so the L1 parent of an L2 notification
          remains visible at the top even after the user expands the full reply list. */}
      {highlightedComment.length > 0 &&
        (!showFilteredComments || isL2List || !!highlightedCommentId) &&
        highlightedComment.map((comment) => (
          <React.Fragment key={comment.commentId}>
            <div
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
                    ? ({
                        showL2Replies,
                        pendingL2Comments,
                        hideL2Replies,
                        onHighlightedDeleted: onHL2Deleted,
                        hasViewRepliesBelow,
                      }) =>
                        showL2Replies || pendingL2Comments.length > 0 ? (
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
                            shouldFetch={showL2Replies}
                            hasViewRepliesBelow={hasViewRepliesBelow}
                            onEmpty={hideL2Replies}
                            onHighlightedDeleted={onHL2Deleted}
                          />
                        ) : null
                    : undefined
                }
              />
            </div>
            {inlineComposerAfterCommentId === comment.commentId && renderInlineComposer?.()}
          </React.Fragment>
        ))}

      {/* Display other comments only if showFilteredComments is true */}
      {(showFilteredComments || !!showReplyCommentAt) &&
        filteredServerComments.map((comment, index) => (
          <React.Fragment key={comment.commentId}>
            <div
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
                    ? ({
                        showL2Replies,
                        pendingL2Comments,
                        hideL2Replies,
                        onHighlightedDeleted: onHL2Deleted,
                        hasViewRepliesBelow,
                      }) =>
                        showL2Replies || pendingL2Comments.length > 0 ? (
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
                            shouldFetch={showL2Replies}
                            hasViewRepliesBelow={hasViewRepliesBelow}
                            onEmpty={hideL2Replies}
                            onHighlightedDeleted={onHL2Deleted}
                          />
                        ) : null
                    : undefined
                }
              />
            </div>
            {inlineComposerAfterCommentId === comment.commentId && renderInlineComposer?.()}
          </React.Fragment>
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
        shouldFetch &&
        isLoadingMore &&
        (isL2List ? (
          <div key="skeleton-bottom" className={styles.replyCommentList__item}>
            <CommentSkeleton numberOfSkeletons={1} />
          </div>
        ) : (
          <CommentSkeleton numberOfSkeletons={1} />
        ))}
      {(!inlineComposerAfterCommentId ||
        (inlineComposerAfterCommentId &&
          !filteredServerComments.some(
            (comment) => comment.commentId === inlineComposerAfterCommentId,
          ))) &&
        renderInlineComposer?.()}
    </div>
  );
};
