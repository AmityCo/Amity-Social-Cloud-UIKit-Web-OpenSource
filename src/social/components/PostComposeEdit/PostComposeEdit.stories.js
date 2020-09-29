import React from 'react';
import getOnePost from '~/mock/useOnePost';
import PostComposeEdit from '.';

export default {
  title: 'Post Compose Edit',
};

export const EditTextPost = ({ onSave }) => {
  const [post, isLoading] = getOnePost();
  if (isLoading) return <p>Loading...</p>;
  return <PostComposeEdit post={post} onSave={onSave} />;
};

EditTextPost.argTypes = {
  onSave: { action: 'Updated post with Id and new text' },
};
