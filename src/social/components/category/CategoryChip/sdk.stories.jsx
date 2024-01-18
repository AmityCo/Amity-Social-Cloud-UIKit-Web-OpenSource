import React from 'react';

import UiKitCategoryChip from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'SDK Connected/Category',
};

export const Chip = {
  render: () => {
    const [props] = useArgs();

    if (!props.removable) delete props.onRemove;

    return <UiKitCategoryChip {...props} />;
  },

  name: 'Chip',

  args: {
    categoryId: 'upstra-console',
    removable: false,
  },

  argTypes: {
    categoryId: { control: { type: 'text' } },
    removable: { control: { type: 'boolean' } },
    onClick: { action: 'onClick()' },
    onRemove: { action: 'onRemove()' },
  },
};
