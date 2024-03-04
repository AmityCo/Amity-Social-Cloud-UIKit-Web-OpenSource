import React, { memo } from 'react';
import { useIntl } from 'react-intl';

import useCommentsCollection from '~/social/hooks/collections/useCommentsCollection';
import LoadMoreWrapper from '~/social/components/LoadMoreWrapper';
import Comment from '~/social/v4/components/Comment';
import {
  NoCommentsContainer,
  TabIcon,
  TabIconContainer,
} from '~/social/components/CommentList/styles';

interface CommentListProps {
  parentId?: string;
  referenceId?: string;
  referenceType: Amity.CommentReferenceType;
  // filterByParentId?: boolean;
  readonly?: boolean;
  isExpanded?: boolean;
  limit?: number;
  onClickReply?: (
    replyTo: string,
    referenceType: Amity.Comment['referenceType'],
    referenceId: Amity.Comment['referenceId'],
    commentId: Amity.Comment['commentId'],
  ) => void;
}

const CommentList = ({
  parentId,
  referenceId,
  referenceType,
  limit = 5,
  // TODO: breaking change
  // filterByParentId = false,
  readonly = false,
  isExpanded = true,
  onClickReply,
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
    ? formatMessage(
        {
          id: 'collapsible.viewMoreReplies',
        },
        { count: commentCount },
      )
    : formatMessage({ id: 'collapsible.viewMoreComments' });

  const prependIcon = isReplyComment ? (
    <TabIconContainer>
      <TabIcon />
    </TabIconContainer>
  ) : null;

  if (comments?.length === 0 && referenceType === 'story') {
    return (
      <NoCommentsContainer>
        {formatMessage({ id: 'storyViewer.commentSheet.empty' })}
      </NoCommentsContainer>
    );
  }

  if (comments?.length === 0) return null;

  return (
    <>
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
              onClickReply={onClickReply}
            />
          );
        })}
      />
    </>
  );
};

export default memo(CommentList);
