import React from 'react';

import useOnePost from '~/mock/useOnePost';

import UiKitPost from '.';

export default {
  title: 'SDK Connected/Social/Post',
};

export const SDKPost = props => {
  const [post, isLoading] = useOnePost();
  if (isLoading) return <p>Loading...</p>;
  return <UiKitPost postId={post.postId} {...props} />;
};

SDKPost.storyName = 'Single Post';
