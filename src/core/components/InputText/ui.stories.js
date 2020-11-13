import React, { useState } from 'react';

import StyledInputText from '.';

export default {
  title: 'Ui Only/Input',
};

export const UiInputText = ({ onChange, ...rest }) => {
  const [value, setValue] = useState('');

  const handleChange = newVal => {
    onChange(newVal);
    setValue(newVal);
  };

  return <StyledInputText {...rest} value={value} onChange={handleChange} />;
};

UiInputText.storyName = 'Simple Input text';

UiInputText.args = {
  multiline: false,
  invalid: false,
  disabled: false,
};

UiInputText.argTypes = {
  multiline: { control: { type: 'boolean' } },
  invalid: { control: { type: 'boolean' } },
  disabled: { control: { type: 'boolean' } },
  onChange: { action: 'onChange()' },
};

export const UiPrependAppend = ({ onChange, ...rest }) => {
  const [value, setValue] = useState('');

  const handleChange = newVal => {
    onChange(newVal);
    setValue(newVal);
  };

  return <StyledInputText {...rest} value={value} onChange={handleChange} />;
};

UiPrependAppend.storyName = 'with Decorators';

UiPrependAppend.args = {
  prepend: '',
  append: '',
};

UiPrependAppend.argTypes = {
  prepend: { control: { type: 'text' } },
  append: { control: { type: 'text' } },
  onChange: { action: 'onChange()' },
};
