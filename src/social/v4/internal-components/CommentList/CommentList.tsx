import React, { memo, useState } from 'react';
import { useIntl } from 'react-intl';

import useCommentsCollection from '~/social/hooks/collections/useCommentsCollection';
import LoadMoreWrapper from '~/social/components/LoadMoreWrapper';
import Comment from '~/social/v4/internal-components/Comment';
import {
  NoCommentsContainer,
  TabIcon,
  TabIconContainer,
} from '~/social/components/CommentList/styles';
import { MobileSheet } from '../Comment/styles';
import { ReactionList } from '../../components/ReactionList';

interface CommentListProps {
  parentId?: string;
  referenceId?: string;
  referenceType: Amity.CommentReferenceType;
  // filterByParentId?: boolean;
  readonly?: boolean;
  isExpanded?: boolean;
  limit?: number;
  onClickReply?: (comment: Amity.Comment) => void;
  style?: React.CSSProperties;
  onClickReaction?: (commentId: string) => void;
  shouldAllowInteraction?: boolean;
}

export const CommentList = ({
  parentId,
  referenceId,
  referenceType,
  limit = 5,
  // TODO: breaking change
  // filterByParentId = false,
  readonly = false,
  isExpanded = true,
  onClickReply,
  style,
  shouldAllowInteraction,
}: CommentListProps) => {
  const [selectedCommentId, setSelectedCommentId] = useState<string>('');
  const { comments, hasMore, loadMore } = useCommentsCollection({
    parentId,
    referenceId,
    referenceType,
    limit,
  });

  const { formatMessage } = useIntl();

  const handleReactionClick = (commentId: string) => {
    setSelectedCommentId(commentId);
  };

  const handleReactionListClose = () => {
    setSelectedCommentId('');
  };

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
    <div
      style={{
        maxHeight: 'calc(100vh - 24rem)',
        overflowY: 'auto',
      }}
    >
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
              style={style}
              onClickReactionList={() => handleReactionClick(comment.commentId)}
              shouldAllowInteraction={shouldAllowInteraction}
            />
          );
        })}
      />
      {selectedCommentId && (
        <MobileSheet
          isOpen={!!selectedCommentId}
          onClose={handleReactionListClose}
          detent="full-height"
          mountPoint={document.getElementById('asc-uikit-stories-viewer') as HTMLElement}
          rootId="comment-reaction-list-sheet"
        >
          <MobileSheet.Container>
            <MobileSheet.Header />
            <MobileSheet.Content>
              <ReactionList referenceId={selectedCommentId} referenceType="comment" />
            </MobileSheet.Content>
          </MobileSheet.Container>
        </MobileSheet>
      )}
    </div>
  );
};

export default memo(CommentList);
