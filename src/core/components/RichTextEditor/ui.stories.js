import React, { useState } from 'react';

import RichTextEditor from '.';

export default {
  title: 'Ui Only/RichTextEditor',
};

const initialValue = 'This is **bold** and _italic_ and ~~strike through~~ text';

export const RichText = ({ onChange, ...rest }) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (newVal) => {
    onChange(newVal.text);
    setValue(newVal.text);
  };

  return (
    <RichTextEditor
      {...rest}
      placeholder="What is on your mind?"
      value={value}
      onChange={handleChange}
    />
  );
};

RichText.storyName = 'Simple Input text';

RichText.args = {
  multiline: false,
  invalid: false,
  disabled: false,
  rows: 3,
  maxRows: 5,
};

RichText.argTypes = {
  multiline: { control: { type: 'boolean' } },
  invalid: { control: { type: 'boolean' } },
  disabled: { control: { type: 'boolean' } },
  rows: { control: { type: 'number' } },
  maxRows: { control: { type: 'number' } },
  onClear: { action: 'onClear()' },
  onChange: { action: 'onChange()' },
  onClick: { action: 'onClick()' },
  onKeyPress: { action: 'onKeyPress()' },
};
