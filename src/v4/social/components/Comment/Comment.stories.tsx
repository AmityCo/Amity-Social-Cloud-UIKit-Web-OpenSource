import React from 'react';
import useOneComment from '~/mock/useOneComment';

import { Comment } from './Comment';

export default {
  title: 'v4-social/components/Comment',
};

export const CommentStory = {
  render: () => {
    const [comment] = useOneComment();

    if (comment == null) return null;

    return <Comment comment={comment} />;
  },

  name: 'Comment',
};
