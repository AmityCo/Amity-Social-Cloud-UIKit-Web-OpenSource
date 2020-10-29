import React from 'react';

import getOnePost from '~/mock/useOnePost';

import UiKitPostEditor from '.';

export default {
  title: 'SDK Connected/Social/Post',
};

export const SDKEditPost = ({ onSave }) => {
  const [post, isLoading] = getOnePost();
  if (isLoading) return <p>Loading...</p>;
  return <UiKitPostEditor postId={post.postId} onSave={onSave} />;
};

SDKEditPost.storyName = 'Editor';

SDKEditPost.argTypes = {
  onSave: { action: 'onSave()' },
};
