import React from 'react';

import UiKitUserChip from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'SDK Connected/User',
};

export const Chip = {
  render: () => {
    const [props] = useArgs();

    if (!props.removable) delete props.onRemove;

    return <UiKitUserChip {...props} />;
  },

  name: 'Chip',

  args: {
    userId: 'upstra-console',
    removable: false,
  },

  argTypes: {
    userId: { control: { type: 'text' } },
    removable: { control: { type: 'boolean' } },
    onClick: { action: 'onClick()' },
    onRemove: { action: 'onRemove()' },
  },
};
