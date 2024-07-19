import React, { memo } from 'react';

import { Comment } from '~/v4/social/internal-components/Comment/';
import styles from './CommentList.module.css';
import { ExpandIcon } from '~/v4/social/icons';
import { LoadMoreWrapper } from '~/v4/core/components/LoadMoreWrapper/LoadMoreWrapper';
import useCommentsCollection from '~/v4/social/hooks/collections/useCommentsCollection';
import { CommentBubbleDeleted } from '~/v4/social/elements/CommentBubbleDeleted';

interface CommentListProps {
  parentId?: string;
  pageId?: string;
  componentId?: string;
  referenceId?: string;
  referenceType: Amity.CommentReferenceType;
  readonly?: boolean;
  isExpanded?: boolean;
  limit?: number;
  onClickReply?: (comment: Amity.Comment) => void;
  style?: React.CSSProperties;
  shouldAllowInteraction?: boolean;
  includeDeleted?: boolean;
}

export const CommentList = ({
  pageId = '*',
  componentId = '*',
  parentId,
  referenceId,
  referenceType,
  limit = 5,
  readonly = false,
  isExpanded = true,
  onClickReply,
  shouldAllowInteraction,
  includeDeleted = false,
}: CommentListProps) => {
  const { comments, hasMore, loadMore } = useCommentsCollection({
    parentId,
    referenceId,
    referenceType,
    limit,
    includeDeleted,
  });

  const isReplyComment = !!parentId;
  const commentCount = comments?.length;

  const loadMoreText = isReplyComment
    ? `View ${commentCount === 1 ? '1 reply' : `${commentCount} replies`}`
    : 'View more comments';

  const prependIcon = isReplyComment ? (
    <div className={styles.tabIconContainer}>
      <ExpandIcon className={styles.tabIcon} />
    </div>
  ) : null;

  if (comments.length === 0 && isReplyComment) {
    return <CommentBubbleDeleted componentId="comment_tray_component" />;
  }

  if (comments?.length === 0) {
    return <div className={styles.noCommentsContainer}>No comments yet</div>;
  }

  const renderComments = () => {
    return comments.map((comment) => (
      <Comment
        key={comment.commentId}
        pageId={pageId}
        componentId={componentId}
        commentId={comment.commentId}
        readonly={readonly}
        onClickReply={() => onClickReply?.(comment as Amity.Comment)}
        shouldAllowInteraction={shouldAllowInteraction}
      />
    ));
  };

  return (
    <LoadMoreWrapper
      hasMore={hasMore}
      loadMore={loadMore}
      text={loadMoreText}
      contentSlot={renderComments()}
      prependIcon={prependIcon}
      isExpanded={isExpanded}
    />
  );
};

export default memo(CommentList);
