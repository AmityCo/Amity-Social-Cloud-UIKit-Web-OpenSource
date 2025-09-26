import React from 'react';
import useOnePostWithCommentAndReactions from '~/mock/useOnePostWithCommentsAndReactions';
import { PostDetailPage } from './PostDetailPage';

export default {
  title: 'v4-social/pages/PostDetailPage',
};

export const PostDetailPageStories = {
  render: () => {
    const [post, isLoading] = useOnePostWithCommentAndReactions();

    if (isLoading && !post) return null;

    return <PostDetailPage id={post?.postId} />;
  },
};
