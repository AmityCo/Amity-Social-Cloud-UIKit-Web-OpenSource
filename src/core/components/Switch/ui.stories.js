import React from 'react';
import { useArgs } from '@storybook/client-api';
import UiKitSwitch from '.';

export default {
  title: 'Ui Only',
};

export const Switch = () => {
  const [{ value, onChange }, updateArgs] = useArgs();

  const setValue = newVal => {
    onChange(newVal);
    updateArgs({ value: newVal });
  };

  return <UiKitSwitch value={value} onChange={setValue} />;
};

Switch.args = {
  value: false,
};

Switch.argTypes = {
  value: { control: { type: 'boolean' } },
  onChange: { action: 'onChange()' },
};
