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
  // filterByParentId?: boolean;
  readonly?: boolean;
  isExpanded?: boolean;
  limit?: number;
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
}: CommentListProps) => {
  const { comments, hasMore, loadMore } = useCommentsCollection({
    parentId,
    referenceId,
    referenceType,
    limit,
  });

  usePostSubscription({
    postId: referenceId,
    level: SubscriptionLevels.COMMENT,
    shouldSubscribe: () => referenceType === 'post' && !parentId,
  });

  const { formatMessage } = useIntl();

  const isReplyComment = !!parentId;

  const loadMoreText = isReplyComment
    ? formatMessage({ id: 'collapsible.viewMoreReplies' })
    : formatMessage({ id: 'collapsible.viewMoreComments' });

  const prependIcon = isReplyComment ? (
    <TabIconContainer>
      <TabIcon />
    </TabIconContainer>
  ) : null;

  if (comments.length === 0 && referenceType === 'story' && !isReplyComment) {
    return (
      <NoCommentsContainer>
        {formatMessage({ id: 'storyViewer.commentSheet.empty' })}
      </NoCommentsContainer>
    );
  }

  if (comments.length === 0) return null;

  return (
    <LoadMoreWrapper
      hasMore={hasMore}
      loadMore={loadMore}
      text={loadMoreText}
      className={isReplyComment ? 'reply-button' : 'comments-button'}
      prependIcon={prependIcon}
      appendIcon={null}
      isExpanded={isExpanded}
      contentSlot={comments.map((comment) => (
        <Comment key={comment.commentId} commentId={comment.commentId} readonly={readonly} />
      ))}
    />
  );
};

export default memo(CommentList);
