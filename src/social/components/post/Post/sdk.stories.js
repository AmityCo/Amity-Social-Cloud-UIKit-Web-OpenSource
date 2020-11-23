import React from 'react';

import useOnePost from '~/mock/useOnePost';

import UiKitPost from '.';

export default {
  title: 'SDK Connected/Social/Post',
};

export const SDKPost = ({ onClickUser }) => {
  const [post, isLoading] = useOnePost();
  if (isLoading) return <p>Loading...</p>;
  return <UiKitPost postId={post.postId} onClickUser={onClickUser} />;
};

SDKPost.storyName = 'Single Post';

SDKPost.argTypes = {
  onClickUser: { action: 'onClickUser(userId)' },
};
