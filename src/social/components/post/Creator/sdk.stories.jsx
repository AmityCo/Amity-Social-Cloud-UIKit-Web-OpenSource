import React from 'react';

import { PostTargetType } from '@amityco/js-sdk';

import UiKitPostCreator from '.';

export default {
  title: 'SDK Connected/Social/Post',
};

export const SDKCreatePost = ({ onCreateSuccess }) => (
  <UiKitPostCreator
    targetId="Web-Test"
    targetType={PostTargetType.UserFeed}
    onCreateSuccess={onCreateSuccess}
  />
);

SDKCreatePost.storyName = 'Creator';

SDKCreatePost.argTypes = {
  onCreateSuccess: { action: 'onCreateSuccess()' },
};
