import React from 'react';
import useOnePost from 'hooks/useOnePost';
import Post from '.';

export default {
  title: 'Post',
};

export const BasicPost = () => {
  const [post, isLoading] = useOnePost();
  if (isLoading) return <p>Loading...</p>;
  return <Post postId={post.postId} />;
};
