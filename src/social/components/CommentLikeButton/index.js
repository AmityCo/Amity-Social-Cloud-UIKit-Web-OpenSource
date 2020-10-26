import React from 'react';
import PropTypes from 'prop-types';

import useCommentLike from '~/social/hooks/useCommentLike';

import StyledCommentLikeButton from './styles';

const CommentLikeButton = ({ commentId, onLikeSuccess, onUnlikeSuccess }) => {
  const { handleToggleLike, isActive, isDisabled, totalLikes } = useCommentLike({
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

CommentLikeButton.propTypes = {
  commentId: PropTypes.string.isRequired,
  onLikeSuccess: PropTypes.func,
  onUnlikeSuccess: PropTypes.func,
};

export default CommentLikeButton;
