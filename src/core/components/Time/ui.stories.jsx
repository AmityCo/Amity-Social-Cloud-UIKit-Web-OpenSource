import React from 'react';

import UiKitTime from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Ui Only',
};

export const Time = {
  render: () => {
    const [{ date, ...restArgs }] = useArgs();
    const normalizedDate = new Date(date);
    return <UiKitTime date={normalizedDate} {...restArgs} />;
  },

  args: {
    className: '',
    date: Date.now(),
  },

  argTypes: {
    className: {
      control: {
        type: 'text',
      },
    },
    date: {
      control: {
        type: 'date',
      },
    },
  },
};
