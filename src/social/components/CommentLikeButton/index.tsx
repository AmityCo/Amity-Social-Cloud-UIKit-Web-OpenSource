import React from 'react';

import useComment from '~/social/hooks/useComment';
import UICommentLikeButton from './UICommentLikeButton';
import useUserReactionSubscription from '~/social/hooks/useUserReactionSubscription';
import useCommunityReactionSubscription from '~/social/hooks/useCommunityReactionSubscription';
import useCommentSubscription from '~/social/hooks/useCommentSubscription';

interface CommentLikeButtonProps {
  commentId?: string;
  onLikeSuccess?: (comment: Amity.Comment) => void;
  onUnlikeSuccess?: (comment: Amity.Comment) => void;
}

const CommentLikeButton = ({
  commentId,
  onLikeSuccess,
  onUnlikeSuccess,
}: CommentLikeButtonProps) => {
  const comment = useComment(commentId);

  useUserReactionSubscription({
    userId: comment?.targetId,
    shouldSubscribe: () => comment?.targetType === 'user',
  });

  useCommunityReactionSubscription({
    communityId: comment?.targetId,
    shouldSubscribe: () => comment?.targetType === 'community',
  });

  return (
    <UICommentLikeButton
      comment={comment}
      onLikeSuccess={onLikeSuccess}
      onUnlikeSuccess={onUnlikeSuccess}
    />
  );
};

export default CommentLikeButton;
