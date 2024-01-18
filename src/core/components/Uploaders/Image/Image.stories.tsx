import React from 'react';

import UiKitImage from './StyledImage';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Ui only/Uploaders',
};

export const SimpleImage = {
  render: () => {
    const [props] = useArgs();
    const { remove: removeFn, ...rest } = props;
    // eslint-disable-next-line no-param-reassign
    if (!removeFn) {
      return <UiKitImage {...rest} />;
    }
    return <UiKitImage {...props} />;
  },

  name: 'Image',

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
