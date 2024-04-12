import React, { useState } from 'react';

import StyledInputText from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Ui Only/v4/Input Text',
};

export const UiInputText = {
  render: () => {
    const [{ onChange, ...rest }] = useArgs();
    const [value, setValue] = useState('');

    const handleChange = (newVal) => {
      onChange(newVal);
      setValue(newVal);
    };

    return <StyledInputText {...rest} value={value} onChange={handleChange} />;
  },

  name: 'Simple Input text',

  args: {
    multiline: false,
    invalid: false,
    disabled: false,
  },

  argTypes: {
    multiline: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    onClear: { action: 'onClear()' },
    onChange: { action: 'onChange()' },
  },
};

export const UiPrependAppend = {
  render: () => {
    const [{ onChange, ...rest }] = useArgs();
    const [value, setValue] = useState('');

    const handleChange = (newVal) => {
      onChange(newVal);
      setValue(newVal);
    };

    return <StyledInputText {...rest} value={value} onChange={handleChange} />;
  },

  name: 'with Decorators',

  args: {
    prepend: '',
    append: '',
  },

  argTypes: {
    prepend: { control: { type: 'text' } },
    append: { control: { type: 'text' } },
    onChange: { action: 'onChange()' },
  },
};
