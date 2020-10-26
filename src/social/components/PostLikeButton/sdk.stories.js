import React from 'react';

import useOnePost from '~/mock/useOnePost';

import UiKitPostLikeButton from '.';

export default {
  title: 'SDK Connected/Social/Post',
};

// This is the SDK-integrated Post Like Button.
export const SDKPostLikeButton = ({ onLikeSuccess, onUnlikeSuccess }) => {
  const [post, isLoading] = useOnePost();
  if (isLoading) return <p>Loading...</p>;
  return (
    <UiKitPostLikeButton
      postId={post.postId}
      onLikeSuccess={onLikeSuccess}
      onUnlikeSuccess={onUnlikeSuccess}
    />
  );
};

SDKPostLikeButton.storyName = 'Like button';
