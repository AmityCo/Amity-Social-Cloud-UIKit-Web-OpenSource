import React from 'react';
import { useArgs } from '@storybook/client-api';
import Switch from '.';

export default {
  title: 'Switch',
  component: Switch,
  parameters: { layout: 'centered' },
};

export const Default = args => {
  const [{ value }, updateArgs] = useArgs();
  const toggleValue = () => updateArgs({ value: !value });
  return <Switch {...args} onChange={toggleValue} />;
};

Default.args = {
  value: false,
};

Default.argTypes = {
  value: { control: { type: 'boolean' } },
};

export const WithActions = args => <Switch {...args} />;

WithActions.argTypes = {
  onChange: { action: 'Changed!' },
};
