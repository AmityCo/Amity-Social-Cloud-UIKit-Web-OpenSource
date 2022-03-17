import React from 'react';
import { useArgs } from '@storybook/client-api';
import UiKitSwitch from '.';

export default {
  title: 'Ui Only',
};

export const Switch = () => {
  const [{ value, onChange, disabled }, updateArgs] = useArgs();

  const setValue = (newVal) => {
    onChange(newVal);
    updateArgs({ value: newVal });
  };

  return <UiKitSwitch value={value} disabled={disabled} onChange={setValue} />;
};

Switch.args = {
  value: false,
  disabled: false,
};

Switch.argTypes = {
  value: { control: { type: 'boolean' } },
  onChange: { action: 'onChange()' },
  disabled: { control: { type: 'boolean' } },
};
