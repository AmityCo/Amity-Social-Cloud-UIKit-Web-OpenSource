import React from 'react';

import useComment from '~/social/hooks/useComment';
import UICommentLikeButton from './UICommentLikeButton';
import useUserReactionSubscription from '~/social/hooks/useUserReactionSubscription';
import useCommunityReactionSubscription from '~/social/hooks/useCommunityReactionSubscription';

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

  return (
    <UICommentLikeButton
      comment={comment}
      onLikeSuccess={onLikeSuccess}
      onUnlikeSuccess={onUnlikeSuccess}
    />
  );
};

export default CommentLikeButton;
