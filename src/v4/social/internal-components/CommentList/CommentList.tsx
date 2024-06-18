import React, { memo } from 'react';
import { useIntl } from 'react-intl';

import { Comment } from '../Comment';
import styles from './CommentList.module.css';
import { ExpandIcon } from '~/v4/social/icons';
import { LoadMoreWrapper } from '~/v4/core/components/LoadMoreWrapper/LoadMoreWrapper';
import useCommentsCollection from '~/v4/social/hooks/collections/useCommentsCollection';

interface CommentListProps {
  parentId?: string;
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

  const { formatMessage } = useIntl();
  const isReplyComment = !!parentId;
  const commentCount = comments?.length;

  const loadMoreText = isReplyComment
    ? formatMessage({ id: 'collapsible.viewMoreReplies' }, { count: commentCount })
    : formatMessage({ id: 'collapsible.viewMoreComments' });

  const prependIcon = isReplyComment ? (
    <div className={styles.tabIconContainer}>
      <ExpandIcon className={styles.tabIcon} />
    </div>
  ) : null;

  if (comments?.length === 0 && referenceType === 'story') {
    return (
      <div className={styles.noCommentsContainer}>
        {formatMessage({ id: 'storyViewer.commentSheet.empty' })}
      </div>
    );
  }

  if (comments?.length === 0) return null;

  const renderComments = () => {
    return comments.map((comment) => (
      <Comment
        key={comment.commentId}
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
