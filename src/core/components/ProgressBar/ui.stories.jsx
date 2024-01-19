import React from 'react';

import UiKitProgressBar from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Ui Only',
};

export const ProgressBar = {
  render: () => {
    const [props] = useArgs();
    return <UiKitProgressBar {...props} />;
  },

  args: {
    progress: 0,
    lightMode: false,
  },

  argTypes: {
    progress: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
      },
    },
    lightMode: {
      control: {
        type: 'boolean',
      },
    },
  },
};
