import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import Comment from '~/social/components/Comment';
import { NoCommentsContainer, TabIcon, TabIconContainer } from './styles';
import LoadMoreWrapper from '../LoadMoreWrapper';
import usePostSubscription from '~/social/hooks/usePostSubscription';
import { SubscriptionLevels } from '@amityco/ts-sdk';
import useCommentsCollection from '~/social/hooks/collections/useCommentsCollection';

interface CommentListProps {
  parentId?: string;
  referenceId?: string;
  referenceType: Amity.CommentReferenceType;
  readonly?: boolean;
  isExpanded?: boolean;
  limit?: number;
  latestComments?: Amity.Comment[];
}

const CommentList = ({
  parentId,
  referenceId,
  referenceType,
  limit = 5,
  readonly = false,
  isExpanded = true,
  latestComments,
}: CommentListProps) => {
  const { formatMessage } = useIntl();
  const isReplyComment = !!parentId;

  const {
    comments: fetchedComments,
    hasMore,
    loadMore,
  } = useCommentsCollection({
    parentId,
    referenceId,
    referenceType,
    limit,
    shouldCall: () => latestComments?.length === 0,
  });

  usePostSubscription({
    postId: referenceId,
    level: SubscriptionLevels.COMMENT,
    shouldSubscribe: () => referenceType === 'post' && !parentId,
  });

  const comments = latestComments || fetchedComments;

  const loadMoreText = isReplyComment
    ? formatMessage({ id: 'collapsible.viewMoreReplies' })
    : formatMessage({ id: 'collapsible.viewMoreComments' });

  const prependIcon = isReplyComment ? (
    <TabIconContainer>
      <TabIcon />
    </TabIconContainer>
  ) : null;

  if (
    (latestComments?.length === 0 || comments.length === 0) &&
    referenceType === 'story' &&
    !isReplyComment
  ) {
    return (
      <NoCommentsContainer>
        {formatMessage({ id: 'storyViewer.commentSheet.empty' })}
      </NoCommentsContainer>
    );
  }

  if (latestComments?.length === 0 || comments.length === 0) return null;

  return (
    <LoadMoreWrapper
      hasMore={hasMore}
      loadMore={loadMore}
      text={loadMoreText}
      className={isReplyComment ? 'reply-button' : 'comments-button'}
      prependIcon={prependIcon}
      appendIcon={null}
      isExpanded={isExpanded}
      contentSlot={
        latestComments
          ? latestComments.map((comment) => (
              <Comment key={comment.commentId} commentId={comment.commentId} readonly={readonly} />
            ))
          : comments.map((comment) => (
              <Comment key={comment.commentId} commentId={comment.commentId} readonly={readonly} />
            ))
      }
    />
  );
};

export default memo(CommentList);
