import React from 'react';
import useOnePost from '~/mock/useOnePost';

import PostHeader from '.';

export default {
  title: 'SDK Connected/Social/Post',
};

export const SdkPostHeader = () => {
  const [post, isLoading] = useOnePost();
  if (isLoading) return <p>Loading...</p>;
  return <PostHeader postId={post.postId} />;
};

SdkPostHeader.storyName = 'Post header';
