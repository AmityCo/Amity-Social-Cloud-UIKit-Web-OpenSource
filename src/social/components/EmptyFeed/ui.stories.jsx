import React from 'react';

import StyledEmptyFeed from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Ui Only/Social/Feed',
};

export const UiEmptyFeed = {
  render: () => {
    const [props] = useArgs();
    return <StyledEmptyFeed {...props} />;
  },
  name: 'Empty',

  args: {
    targetType: 'globalFeed',
    feedType: '',
  },

  argTypes: {
    canPost: { control: { type: 'boolean' } },
    targetType: {
      control: { type: 'select' },
      options: ['myFeed', 'globalFeed', 'communityFeed', 'userFeed'],
    },
    feedType: { control: { type: 'select' }, options: ['reviewing'] },
  },
};
