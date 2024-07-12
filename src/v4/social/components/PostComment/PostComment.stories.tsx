import React from 'react';
import useOneComment from '~/mock/useOneComment';

import { PostComment } from './PostComment';

export default {
  title: 'v4-social/components/PostComment',
};

export const PostCommentStory = {
  render: () => {
    const [comment] = useOneComment();

    if (comment == null) return null;

    return <PostComment comment={comment} />;
  },

  name: 'PostComment',
};
