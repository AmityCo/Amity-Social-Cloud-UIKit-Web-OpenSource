import React from 'react';
import useOnePost from '~/mock/useOnePost';

import { CommentSkeleton } from './CommentSkeleton';

export default {
  title: 'v4-social/components/CommentSkeleton',
};

export const PostCommentSkeletonStory = {
  render: () => {
    const [post] = useOnePost();

    if (post == null) return null;

    return <CommentSkeleton />;
  },

  name: 'CommentSkeleton',
};
