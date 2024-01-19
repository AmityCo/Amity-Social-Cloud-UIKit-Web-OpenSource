import React from 'react';

import UIUserChip from './UIUserChip';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Ui Only/User',
};

export const UiUserChip = {
  render: () => {
    const [props] = useArgs();

    if (!props.removable) delete props.onRemove;

    return <UIUserChip {...props} />;
  },

  name: 'Chip',

  args: {
    displayName: 'Boaty Mc Boat',
    fileUrl: 'https://via.placeholder.com/150x150',
    removable: false,
  },

  argTypes: {
    displayName: { control: { type: 'text' } },
    fileUrl: { control: { type: 'text' } },
    removable: { control: { type: 'boolean' } },
    onClick: { action: 'onClick()' },
    onRemove: { action: 'onRemove()' },
  },
};
