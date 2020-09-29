import React from 'react';
import { useArgs } from '@storybook/client-api';
import UiKitSwitch from '.';

export default {
  title: 'Components/Switch',
  component: UiKitSwitch,
  parameters: { layout: 'centered' },
};

export const SimpleSwitch = () => {
  const [{ value, onChange }, updateArgs] = useArgs();

  const setValue = newVal => {
    onChange(newVal);
    updateArgs({ value: newVal });
  };

  return <UiKitSwitch value={value} onChange={setValue} />;
};

SimpleSwitch.args = {
  value: false,
};

SimpleSwitch.argTypes = {
  value: { control: { type: 'boolean' } },
  onChange: { action: 'onChange' },
};
