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
import usePostSubscription from '~/social/hooks/usePostSubscription';
import { SubscriptionLevels } from '@amityco/ts-sdk';
import useCommunityStoriesSubscription from '~/social/hooks/useCommunityStoriesSubscription';
import { MobileSheet } from '../Comment/styles';

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
  onReply,
}: CommentListProps) => {
  const { comments, hasMore, loadMore } = useCommentsCollection({
    parentId,
    referenceId,
    referenceType,
    limit,
  });

  const { formatMessage } = useIntl();

  const [isOpenBottomSheet, setIsOpenBottomSheet] = React.useState(false);

  const isReplyComment = !!parentId;

  const loadMoreText = isReplyComment
    ? `View 1 reply`
    : formatMessage({ id: 'collapsible.viewMoreComments' });

  const prependIcon = isReplyComment ? (
    <TabIconContainer>
      <TabIcon />
    </TabIconContainer>
  ) : null;

  if (comments.length === 0 && referenceType === 'story') {
    return (
      <NoCommentsContainer>
        {formatMessage({ id: 'storyViewer.commentSheet.empty' })}
      </NoCommentsContainer>
    );
  }

  if (comments.length === 0) return null;

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
              onReply={onReply}
              onClickOverflowMenu={() => setIsOpenBottomSheet(true)}
            />
          );
        })}
      />
      <MobileSheet
        isOpen={isOpenBottomSheet}
        onClose={() => setIsOpenBottomSheet(false)}
        mountPoint={document.getElementById('stories-viewer') as HTMLElement}
      >
        <MobileSheet.Container>
          <MobileSheet.Content></MobileSheet.Content>
        </MobileSheet.Container>
      </MobileSheet>
    </>
  );
};

export default memo(CommentList);
