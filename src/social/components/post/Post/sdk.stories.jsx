import React from 'react';

import useOnePost from '~/mock/useOnePost';

import UiKitPost from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'SDK Connected/Social/Post',
};

export const SDKPost = {
  render: () => {
    const [props] = useArgs();
    const [post, isLoading] = useOnePost();
    if (isLoading) return <p>Loading...</p>;
    return <UiKitPost postId={post?.postId} {...props} />;
  },

  name: 'Single Post',
};
