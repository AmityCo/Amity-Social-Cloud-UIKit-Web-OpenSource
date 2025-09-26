import React from 'react';
import { FormattedMessage } from 'react-intl';

import useOnePost from '~/mock/useOnePost';

import UiKitPostLikeButton from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'SDK Connected/Social/Post',
};

export const SDKPostLikeButton = {
  render: () => {
    const [{ onLikeSuccess, onUnlikeSuccess }] = useArgs();
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
  },

  name: 'Like button',
};
