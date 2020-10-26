import React from 'react';
import PropTypes from 'prop-types';

import usePostLike from '~/social/hooks/usePostLike';

import StyledPostLikeButton from './styles';

const PostLikeButton = ({ postId, onLikeSuccess, onUnlikeSuccess }) => {
  const { handleToggleLike, isActive, isDisabled } = usePostLike({
    postId,
    onLikeSuccess,
    onUnlikeSuccess,
  });

  return (
    <StyledPostLikeButton onClick={handleToggleLike} isActive={isActive} isDisabled={isDisabled} />
  );
};

PostLikeButton.propTypes = {
  postId: PropTypes.string.isRequired,
  onLikeSuccess: PropTypes.func,
  onUnlikeSuccess: PropTypes.func,
};

export default PostLikeButton;
