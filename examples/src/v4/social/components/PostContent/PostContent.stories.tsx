import React from 'react';
import useOnePost from '~/mock/useOnePost';

import { PostContent } from './PostContent';

export default {
  title: 'v4-social/components/PostContent',
};

export const PostContentStory = {
  render: () => {
    const [post] = useOnePost();

    if (post == null) return null;

    return <PostContent post={post} />;
  },

  name: 'PostContent',
};
