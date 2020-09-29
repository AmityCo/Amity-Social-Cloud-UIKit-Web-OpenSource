import React from 'react';
import { EkoPostTargetType } from 'eko-sdk';
import PostCompose from '.';

export default {
  title: 'Post Compose',
};

export const CreatePost = ({ onCreateSuccess }) => (
  <PostCompose
    targetId="Web-Test"
    targetType={EkoPostTargetType.UserFeed}
    onCreateSuccess={onCreateSuccess}
  />
);

CreatePost.argTypes = {
  onCreateSuccess: { action: 'Created post with Id and text' },
};
