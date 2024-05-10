import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import useCommentsCollection from '~/social/hooks/collections/useCommentsCollection';

import { Comment } from '../Comment';
import styles from './CommentList.module.css';
import { LoadMoreWrapper } from '~/v4/core/components/LoadMoreWrapper';
import { ExpandIcon } from '~/v4/social/icons';

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
}: CommentListProps) => {
  const { comments, hasMore, loadMore } = useCommentsCollection({
    parentId,
    referenceId,
    referenceType,
    limit,
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

  return (
    <div className={styles.commentListContainer}>
      <LoadMoreWrapper
        hasMore={hasMore}
        loadMore={loadMore}
        text={loadMoreText}
        className={isReplyComment ? 'reply-button' : 'comments-button'}
        appendIcon={null}
        prependIcon={prependIcon}
        isExpanded={isExpanded}
        contentSlot={comments.map((comment) => {
          return (
            <Comment
              key={comment.commentId}
              commentId={comment.commentId}
              readonly={readonly}
              onClickReply={() => onClickReply?.(comment as Amity.Comment)}
              shouldAllowInteraction={shouldAllowInteraction}
            />
          );
        })}
      />
    </div>
  );
};

export default memo(CommentList);
