import React from 'react';
import { useArgs } from '@storybook/client-api';
import Switch from '.';

export default {
  title: 'Switch',
  component: Switch,
  args: { value: false },
  argTypes: {
    value: { control: { type: 'boolean' } },
  },
  parameters: { layout: 'centered' },
};

export const Default = args => {
  const [{ value }, updateArgs] = useArgs();
  const toggleValue = () => updateArgs({ value: !value });
  return <Switch {...args} onChange={toggleValue} />;
};
