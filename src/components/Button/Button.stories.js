import React from 'react';
import UIKitButton from '.';

export default {
  title: 'Components',
  parameters: { layout: 'centered' },
};

export const Button = ({ label, ...props }) => {
  return (
    <div>
      before <UIKitButton {...props}>{label}</UIKitButton> after
    </div>
  );
};

Button.args = {
  label: 'hello world',
  variant: 'primary',
  disabled: false,
};

Button.argTypes = {
  label: {
    control: {
      type: 'text',
    },
  },
  variant: {
    control: {
      type: 'select',
      options: ['primary', 'secondary'],
    },
  },
  disabled: {
    control: {
      type: 'boolean',
    },
  },
  onClick: { action: 'onClick' },
};
