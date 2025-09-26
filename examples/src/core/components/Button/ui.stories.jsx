import React from 'react';
import UiKitButton from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Ui Only',
};

export const Button = {
  render: () => {
    const [{ label, ...props }] = useArgs();
    return <UiKitButton {...props}>{label}</UiKitButton>;
  },

  args: {
    label: 'hello world',
    variant: 'primary',
    disabled: false,
    fullWidth: false,
  },

  argTypes: {
    label: {
      control: {
        type: 'text',
      },
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary'],
    },
    disabled: {
      control: {
        type: 'boolean',
      },
    },
    fullWidth: {
      control: {
        type: 'boolean',
      },
    },
    onClick: { action: 'onClick()' },
  },
};
