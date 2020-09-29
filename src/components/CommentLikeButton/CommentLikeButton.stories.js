import React from 'react';
import { useArgs } from '@storybook/client-api';
import useOneComment from 'hooks/useOneComment';
import StyledCommentLikeButton from './CommentLikeButton.styles';
import SDKComentLikeButton from '.';

export default {
  title: 'Comment Like Button',
  parameters: { layout: 'centered' },
};

export const CommentLikeButton = ({ isDisabled }) => {
  const [{ isActive, totalLikes }, updateArgs] = useArgs();
  const toggleLike = () =>
    updateArgs({
      isActive: !isActive,
      totalLikes: isActive ? totalLikes - 1 : totalLikes + 1,
    });
  return (
    <StyledCommentLikeButton
      onClick={toggleLike}
      isActive={isActive}
      isDisabled={isDisabled}
      totalLikes={totalLikes}
    />
  );
};

CommentLikeButton.args = {
  isActive: false,
  isDisabled: false,
  totalLikes: 0,
};

CommentLikeButton.argTypes = {
  isActive: { control: { type: 'boolean' } },
  isDisabled: { control: { type: 'boolean' } },
  onClick: { action: 'Like button clicked!' },
  totalLikes: { control: { type: 'number', min: 0 } },
};

// This is the SDK-integrated Comment Like Button.
export const CommentLikeButtonWithSDK = ({ onLikeSuccess, onUnlikeSuccess }) => {
  const [comment, isLoading] = useOneComment();
  if (isLoading) return <p>Loading...</p>;
  return (
    <SDKComentLikeButton
      commentId={comment.commentId}
      onLikeSuccess={onLikeSuccess}
      onUnlikeSuccess={onUnlikeSuccess}
    />
  );
};
