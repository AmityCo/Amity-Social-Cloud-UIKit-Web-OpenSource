import React from 'react';
import useCommentLikeSdk from './useCommentLikeSdk';
import StyledCommentLikeButton from './CommentLikeButton.styles';

const CommentLikeButton = ({ commentId, onLikeSuccess, onUnlikeSuccess }) => {
  const { handleToggleLike, isActive, isDisabled, totalLikes } = useCommentLikeSdk({
    commentId,
    onLikeSuccess,
    onUnlikeSuccess,
  });
  return (
    <StyledCommentLikeButton
      onClick={handleToggleLike}
      isActive={isActive}
      isDisabled={isDisabled}
      totalLikes={totalLikes}
    />
  );
};

export default CommentLikeButton;
