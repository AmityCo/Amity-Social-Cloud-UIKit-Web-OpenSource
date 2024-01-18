import React from 'react';
import { FormattedMessage } from 'react-intl';

import useOnePost from '~/mock/useOnePost';
import PostHeader from '.';

export default {
  title: 'SDK Connected/Social/Post',
};

export const SdkPostHeader = {
  render: () => {
    const [post, isLoading] = useOnePost();
    if (isLoading)
      return (
        <p>
          <FormattedMessage id="loading" />
        </p>
      );
    return <PostHeader postId={post.postId} />;
  },

  name: 'Post header',
};
