import React from 'react';

import useOneComment from '~/mock/useOneComment';

import UiKitCommentLikeButton from '.';

export default {
  title: 'SDK Connected/Social/Comment',
};

// This is the SDK-integrated Comment Like Button.
export const SDKCommentLikeButton = ({ onLikeSuccess, onUnlikeSuccess }) => {
  const [comment, isLoading] = useOneComment();
  if (isLoading) return <p>Loading...</p>;
  return (
    <UiKitCommentLikeButton
      commentId={comment.commentId}
      onLikeSuccess={onLikeSuccess}
      onUnlikeSuccess={onUnlikeSuccess}
    />
  );
};

SDKCommentLikeButton.storyName = 'Like button';
