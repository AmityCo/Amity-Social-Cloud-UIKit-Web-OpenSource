import React from 'react';
import useOnePost from '~/mock/useOnePost';

import { PostCommentSkeleton } from './PostCommentSkeleton';

export default {
  title: 'v4-social/components/PostCommentSkeleton',
};

export const PostCommentSkeletonStory = {
  render: () => {
    const [post] = useOnePost();

    if (post == null) return null;

    return <PostCommentSkeleton />;
  },

  name: 'PostCommentSkeleton',
};
