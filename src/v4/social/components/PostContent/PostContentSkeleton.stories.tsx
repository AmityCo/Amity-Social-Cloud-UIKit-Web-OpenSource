import React from 'react';
import useOnePost from '~/mock/useOnePost';

import { PostContentSkeleton } from './PostContentSkeleton';

export default {
  title: 'v4-social/components/PostContentSkeleton',
};

export const PostContentSkeletonStory = {
  render: () => {
    const [post] = useOnePost();

    if (post == null) return null;

    return <PostContentSkeleton />;
  },

  name: 'PostContentSkeleton',
};
