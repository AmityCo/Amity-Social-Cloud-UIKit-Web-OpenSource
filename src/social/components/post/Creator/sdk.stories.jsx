import React from 'react';

import UiKitPostCreator from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'SDK Connected/Social/Post',
};

export const SDKCreatePost = {
  render: () => {
    const [{ onCreateSuccess }] = useArgs();
    return (
      <UiKitPostCreator targetId="Web-Test" targetType={'user'} onCreateSuccess={onCreateSuccess} />
    );
  },

  name: 'Creator',

  argTypes: {
    onCreateSuccess: { action: 'onCreateSuccess()' },
  },
};
