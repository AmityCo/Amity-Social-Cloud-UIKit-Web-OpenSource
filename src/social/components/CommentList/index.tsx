import React, { memo, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import Comment from '~/social/components/Comment';

import { TabIcon, TabIconContainer } from './styles';
import LoadMoreWrapper from '../LoadMoreWrapper';
import usePostSubscription from '~/social/hooks/usePostSubscription';
import { SubscriptionLevels } from '@amityco/ts-sdk';
import useCommentsCollection from '~/social/hooks/collections/useCommentsCollection';
import usePost from '~/social/hooks/usePost';
import { LoadMoreButton, ShevronDownIcon } from '../LoadMoreWrapper/styles';

interface CommentListProps {
  parentId?: string;
  referenceId?: string;
  referenceType: Amity.CommentReferenceType;
  // filterByParentId?: boolean;
  readonly?: boolean;
  isExpanded?: boolean;
  limit?: number;
}

const InnerCommentList = ({
  parentId,
  referenceId,
  referenceType,
  limit = 5,
  // TODO: breaking change
  // filterByParentId = false,
  readonly = false,
  isExpanded = true,
  callLoadMoreAgain = false,
}: CommentListProps & {
  callLoadMoreAgain?: boolean;
}) => {
  const [isCallAgain, setIsCallAgain] = useState(!callLoadMoreAgain);
  const { formatMessage } = useIntl();
  const isReplyComment = !!parentId;
  const { comments, hasMore, loadMore } = useCommentsCollection({
    parentId,
    referenceId,
    referenceType,
    limit,
  });

  useEffect(() => {
    if (isCallAgain && comments.length > 0 && hasMore) {
      loadMore();
      setIsCallAgain(false);
    }
  }, [comments, hasMore, loadMore, isCallAgain]);

  const loadMoreText = isReplyComment
    ? formatMessage({ id: 'collapsible.viewMoreReplies' })
    : formatMessage({ id: 'collapsible.viewMoreComments' });

  const prependIcon = isReplyComment ? (
    <TabIconContainer>
      <TabIcon />
    </TabIconContainer>
  ) : null;

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

const PostCommentList = (props: CommentListProps) => {
  const {
    parentId,
    referenceId,
    referenceType,
    limit = 5,
    // TODO: breaking change
    // filterByParentId = false,
    readonly = false,
    isExpanded = true,
  } = props;
  const { formatMessage } = useIntl();
  const [firstRender, setFirstRender] = useState(true);
  const isReplyComment = !!parentId;
  const post = usePost(referenceId);

  usePostSubscription({
    postId: referenceId,
    level: SubscriptionLevels.COMMENT,
    shouldSubscribe: () => referenceType === 'post' && !parentId,
  });

  const loadMoreText = isReplyComment
    ? formatMessage({ id: 'collapsible.viewMoreReplies' })
    : formatMessage({ id: 'collapsible.viewMoreComments' });

  const prependIcon = isReplyComment ? (
    <TabIconContainer>
      <TabIcon />
    </TabIconContainer>
  ) : null;

  if (firstRender) {
    return (
      <LoadMoreWrapper
        hasMore={(post?.comments.length || 0) > (post?.latestComments?.length || 0)}
        loadMore={() => {
          setFirstRender(false);
        }}
        text={loadMoreText}
        className={isReplyComment ? 'reply-button' : 'comments-button'}
        prependIcon={prependIcon}
        appendIcon={null}
        isExpanded={isExpanded}
        contentSlot={(post?.latestComments || []).map((comment: Amity.Comment) => (
          <Comment key={comment.commentId} commentId={comment.commentId} readonly={readonly} />
        ))}
      />
    );
  }

  return <InnerCommentList {...props} callLoadMoreAgain />;
};

const ReplayCommentList = (props: CommentListProps) => {
  const [isExpanded, setExpanded] = useState(false);
  const { formatMessage } = useIntl();

  const prependIcon = (
    <TabIconContainer>
      <TabIcon />
    </TabIconContainer>
  );

  if (!isExpanded) {
    return (
      <LoadMoreButton className="reply-button" onClick={() => setExpanded((prev) => !prev)}>
        {prependIcon} {formatMessage({ id: 'collapsible.viewMoreReplies' })}
      </LoadMoreButton>
    );
  }

  return <InnerCommentList {...props} isExpanded />;
};

const CommentList = (props: CommentListProps) => {
  const { referenceType, parentId } = props;
  const isReplyComment = !!parentId;

  if (isReplyComment) {
    return <ReplayCommentList {...props} />;
  }

  if (referenceType === 'post' && !isReplyComment) {
    return <PostCommentList {...props} />;
  }

  return <InnerCommentList {...props} />;
};

export default memo(CommentList);
