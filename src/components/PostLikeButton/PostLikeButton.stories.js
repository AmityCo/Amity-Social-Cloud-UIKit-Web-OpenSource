import React from 'react';
import { useArgs } from '@storybook/client-api';
import useOnePost from 'hooks/useOnePost';
import StyledPostLikeButton from './PostLikeButton.styles';
import SDKPostLikeButton from '.';

export default {
  title: 'Post Like Button',
  parameters: { layout: 'centered' },
};

export const PostLikeButton = ({ isDisabled }) => {
  const [{ isActive }, updateArgs] = useArgs();
  const toggleLike = () => updateArgs({ isActive: !isActive });
  return <StyledPostLikeButton onClick={toggleLike} isActive={isActive} isDisabled={isDisabled} />;
};

PostLikeButton.args = {
  isActive: false,
  isDisabled: false,
};

PostLikeButton.argTypes = {
  isActive: { control: { type: 'boolean' } },
  isDisabled: { control: { type: 'boolean' } },
  onClick: { action: 'Like button clicked!' },
};

// TODO - can combine this story with above when Storybook fix Julien's bug.
export const PostLikeButtonWithActions = ({ onClick, isActive, isDisabled }) => {
  return <StyledPostLikeButton onClick={onClick} isActive={isActive} isDisabled={isDisabled} />;
};

PostLikeButtonWithActions.args = {
  isActive: false,
  isDisabled: false,
};

PostLikeButtonWithActions.argTypes = {
  isActive: { control: { type: 'boolean' } },
  isDisabled: { control: { type: 'boolean' } },
  onClick: { action: 'Like button clicked!' },
};

// This is the SDK-integrated Post Like Button.
export const PostLikeButtonWithSDK = ({ onLikeSuccess, onUnlikeSuccess }) => {
  const [post, isLoading] = useOnePost();
  if (isLoading) return <p>Loading...</p>;
  return (
    <SDKPostLikeButton
      postId={post.postId}
      onLikeSuccess={onLikeSuccess}
      onUnlikeSuccess={onUnlikeSuccess}
    />
  );
};
