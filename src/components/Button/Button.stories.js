import React from 'react';
import UIKitButton from '.';

export default {
  title: 'Components/Button',
  parameters: { layout: 'centered' },
};

export const SimpleButton = ({ label, ...props }) => {
  return (
    <div>
      before <UIKitButton {...props}>{label}</UIKitButton> after
    </div>
  );
};

SimpleButton.args = {
  label: 'hello world',
  variant: 'primary',
  disabled: false,
};

SimpleButton.argTypes = {
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
