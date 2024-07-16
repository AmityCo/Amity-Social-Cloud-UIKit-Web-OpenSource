import React from 'react';

import UiKitVideo from './StyledVideo';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Ui only/Uploaders',
};

export const VideoStory = {
  render: () => {
    const [{ remove, ...args }] = useArgs();

    if (!remove) delete args.onRemove;
    return <UiKitVideo {...args} />;
  },

  name: 'Video',

  args: {
    url: '',
    progress: -1,
    remove: false,
  },

  argTypes: {
    url: {
      control: {
        type: 'text',
      },
    },
    progress: {
      control: {
        type: 'number',
        min: -0.01,
        max: 1,
        step: 0.01,
      },
    },
    remove: {
      control: {
        type: 'boolean',
      },
    },
    onRemove: {
      action: 'onRemove',
    },
  },
};
