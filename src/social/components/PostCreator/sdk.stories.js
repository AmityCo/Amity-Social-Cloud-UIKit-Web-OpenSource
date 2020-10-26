import React from 'react';

import { EkoPostTargetType } from 'eko-sdk';

import UiKitPostCreator from '.';

export default {
  title: 'SDK Connected/Social/Post',
};

export const SDKCreatePost = ({ onCreateSuccess }) => (
  <UiKitPostCreator
    targetId="Web-Test"
    targetType={EkoPostTargetType.UserFeed}
    onCreateSuccess={onCreateSuccess}
  />
);

SDKCreatePost.storyName = 'Creator';

SDKCreatePost.argTypes = {
  onCreateSuccess: { action: 'onCreateSuccess()' },
};
