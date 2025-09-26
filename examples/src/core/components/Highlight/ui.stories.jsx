import React from 'react';

import UiKitHighlight from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Ui Only',
};

export const Highlight = {
  render: () => {
    const [props] = useArgs();
    return <UiKitHighlight {...props} />;
  },

  args: {
    text: 'Some text with partial match',
    query: 'with partial',
  },

  argTypes: {
    text: { control: { type: 'text' } },
    query: { control: { type: 'text' } },
  },
};
