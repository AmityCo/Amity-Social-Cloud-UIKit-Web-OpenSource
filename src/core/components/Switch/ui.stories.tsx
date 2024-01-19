import React from 'react';
import { useArgs } from '@storybook/client-api';
import UiKitSwitch from '.';

export default {
  title: 'Ui Only',
};

export const Switch = {
  render: () => {
    const [{ value, onChange, disabled }, updateArgs] = useArgs();

    const setValue = (newVal: boolean) => {
      onChange(newVal);
      updateArgs({ value: newVal });
    };

    return <UiKitSwitch value={value} disabled={disabled} onChange={setValue} />;
  },

  args: {
    value: false,
    disabled: false,
  },

  argTypes: {
    value: { control: { type: 'boolean' } },
    onChange: { action: 'onChange()' },
    disabled: { control: { type: 'boolean' } },
  },
};
