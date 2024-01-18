import React from 'react';
import { useArgs } from '@storybook/client-api';

import UiKitSelect from '.';

export default {
  title: 'Ui Only/Select',
};

export const SimpleSelect = {
  render: () => {
    const [{ itemsAmount, multiple, disabled }] = useArgs();
    const items = Array.from({ length: itemsAmount }).map((_, index) => ({
      name: `item_${index}`,
      value: index,
    }));
    return <UiKitSelect options={items} multiple={multiple} disabled={disabled} />;
  },

  args: {
    itemsAmount: 5,
    multiple: false,
    disabled: false,
  },

  argTypes: {
    itemsAmount: { control: { type: 'text' } },
    multiple: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    onClick: { action: 'onClick()' },
  },
};
