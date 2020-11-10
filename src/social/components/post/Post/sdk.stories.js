import React from 'react';

import useOnePost from '~/mock/useOnePost';

import UiKitPost from '.';

export default {
  title: 'SDK Connected/Social/Post',
};

export const SDKPost = () => {
  const [post, isLoading] = useOnePost();
  if (isLoading) return <p>Loading...</p>;
  return <UiKitPost postId={post.postId} />;
};

SDKPost.storyName = 'Single Post';
