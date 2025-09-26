import React from 'react';

import UICategoryChip from './UICategoryChip';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Ui Only/Categories',
};

export const UiCategoryChip = {
  render: () => {
    const [props] = useArgs();

    if (!props.removable) delete props.onRemove;

    return <UICategoryChip {...props} />;
  },

  name: 'Chip',

  args: {
    name: 'Boaty Mc Boat',
    fileUrl: 'https://via.placeholder.com/150x150',
    removable: false,
  },

  argTypes: {
    name: { control: { type: 'text' } },
    fileUrl: { control: { type: 'text' } },
    removable: { control: { type: 'boolean' } },
    onClick: { action: 'onClick()' },
    onRemove: { action: 'onRemove()' },
  },
};
