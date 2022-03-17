import React from 'react';
import { FormattedMessage } from 'react-intl';

import useOnePost from '~/mock/useOnePost';

import UiKitPostLikeButton from '.';

export default {
  title: 'SDK Connected/Social/Post',
};

// This is the SDK-integrated Post Like Button.
export const SDKPostLikeButton = ({ onLikeSuccess, onUnlikeSuccess }) => {
  const [post, isLoading] = useOnePost();
  if (isLoading)
    return (
      <p>
        <FormattedMessage id="loading" />
      </p>
    );
  return (
    <UiKitPostLikeButton
      postId={post.postId}
      onLikeSuccess={onLikeSuccess}
      onUnlikeSuccess={onUnlikeSuccess}
    />
  );
};

SDKPostLikeButton.storyName = 'Like button';
