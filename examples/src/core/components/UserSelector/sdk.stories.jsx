import React from 'react';
import { useArgs } from '@storybook/client-api';

import UiKitUserSelector from '.';

export default {
  title: 'SDK Connected/User',
};

export const UserSelector = {
  render: () => {
    const [{ value, onChange }, updateArgs] = useArgs();

    const setValue = (newVal) => {
      onChange(newVal);
      updateArgs({ value: newVal });
    };

    return <UiKitUserSelector value={value} onChange={setValue} />;
  },

  name: 'Selector',

  args: {
    value: [],
  },

  argTypes: {
    value: { control: { type: 'object' } },
    onChange: { action: 'onChange()' },
  },
};
