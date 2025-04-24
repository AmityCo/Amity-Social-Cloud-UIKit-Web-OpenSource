import React, { useEffect, useState, useRef } from 'react';
import { Typography } from '~/v4/core/components';
import { CommentSkeleton } from '~/v4/social/components/Comment/CommentSkeleton';
import ReplyCommentIcon from '~/v4/icons/ReplyComment';
import useCommentsCollection from '~/v4/social/hooks/collections/useCommentsCollection';
import ReplyComment from '~/v4/social/components/ReplyComment/ReplyComment';
import styles from './ReplyCommentList.module.css';

interface ReplyCommentProps {
  pageId?: string;
  componentId?: string;
  community?: Amity.Community;
  referenceId: string;
  referenceType: string;
  parentId: string;
  highlightedCommentId?: string;
}

export const ReplyCommentList = ({
  pageId = '*',
  componentId = '*',
  referenceId,
  referenceType,
  community,
  parentId,
  highlightedCommentId,
}: ReplyCommentProps) => {
  const [showFilteredComments, setShowFilteredComments] = useState(!highlightedCommentId);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const highlightedCommentRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { comments, hasMore, isLoading, loadMore } = useCommentsCollection({
    referenceId,
    referenceType: referenceType as Amity.CommentReferenceType,
    parentId,
    limit: 20,
    shouldCall: true,
    includeDeleted: true,
  });

  // Filter out the highlighted comment from the regular comments list
  const filteredComments = comments.filter(
    (comment) => !highlightedCommentId || comment.commentId !== highlightedCommentId,
  );

  const highlightedComment = comments.filter(
    (comment) => highlightedCommentId == comment.commentId,
  );

  const handleClickLoadMore = () => {
    if (highlightedCommentId && !showFilteredComments) {
      // First show the filtered comments
      setShowFilteredComments(true);
      // If there are more comments to load, load them as well
      if (hasMore) {
        loadMore();
      }
    } else {
      loadMore();
    }
  };

  // Effect to animate the highlighted comment when it's loaded
  useEffect(() => {
    if (parentId && highlightedCommentId && highlightedComment.length > 0) {
      // Create event listener for the scroll complete event
      const handleScrollComplete = (e: CustomEvent) => {
        if (e.detail.commentId === highlightedCommentId) {
          // Only start the bounce animation after the scroll is complete
          setIsHighlighted(true);

          // Reset the animation after it completes
          timerRef.current = setTimeout(() => {
            setIsHighlighted(false);
          }, 1000); // Animation duration
        }
      };
      // Add event listener for the custom scroll complete event
      document.addEventListener('comment-scroll-complete', handleScrollComplete as EventListener);
      // Clean up the event listener and timer when component unmounts
      return () => {
        document.removeEventListener(
          'comment-scroll-complete',
          handleScrollComplete as EventListener,
        );
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };
    }
  }, [highlightedComment, highlightedCommentId, parentId]);

  return (
    <div className={styles.replyCommentList}>
      {isLoading && <CommentSkeleton numberOfSkeletons={3} />}

      {/* Display highlighted comment at the top if it exists */}
      {highlightedComment.length > 0 &&
        highlightedComment.map((comment) => (
          <div
            key={comment.commentId}
            ref={highlightedCommentRef}
            className={`${styles.replyCommentList__highlightedComment} ${isHighlighted ? styles.replyCommentList__bounceAnimation : ''}`}
          >
            <ReplyComment
              pageId={pageId}
              community={community}
              comment={comment as Amity.Comment}
            />
          </div>
        ))}

      {/* Display other comments only if showFilteredComments is true */}
      {showFilteredComments &&
        filteredComments.map((comment) => (
          <ReplyComment
            key={comment.commentId}
            pageId={pageId}
            community={community}
            comment={comment as Amity.Comment}
          />
        ))}

      {/* Show "View more replies" if there are either more comments to load or filtered comments to show */}
      {(hasMore ||
        (highlightedCommentId && filteredComments.length > 0 && !showFilteredComments)) && (
        <div
          className={styles.postReplyCommentList__viewReply_button}
          onClick={handleClickLoadMore}
        >
          <ReplyCommentIcon className={styles.postReplyCommentList__viewReply_icon} />
          <Typography.CaptionBold className={styles.postReplyCommentList__viewReply_text}>
            View more replies
          </Typography.CaptionBold>
        </div>
      )}
    </div>
  );
};
