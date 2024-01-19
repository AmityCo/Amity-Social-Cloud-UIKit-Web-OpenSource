import React from 'react';
import { useArgs } from '@storybook/client-api';

import UiKitUserSearchBox from '.';

export default {
  title: 'SDK Connected/User',
};

export const UserSearchBox = {
  render: () => {
    const [{ value, onChange }, updateArgs] = useArgs();

    const setValue = (newVal) => {
      onChange(newVal);
      updateArgs({ value: newVal });
    };

    return <UiKitUserSearchBox value={value} onChange={setValue} />;
  },

  name: 'SearchBox',

  args: {
    value: '',
  },

  argTypes: {
    value: { control: { type: 'string' } },
    onChange: { action: 'onChange()' },
  },
};
