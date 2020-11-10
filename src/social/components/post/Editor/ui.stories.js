import React from 'react';
import { useArgs } from '@storybook/client-api';

import StyledPostEditor from './UIPostEditor';

export default {
  title: 'Ui Only/Social/Post',
};

export const UiEditPost = () => {
  const [{ text, placeholder, onChange }, updateArgs] = useArgs();

  const setText = newVal => {
    onChange(newVal);
    updateArgs({ text: newVal.text });
  };

  return (
    <StyledPostEditor
      placeholder={placeholder}
      data={{ text }}
      dataType="text"
      onChange={setText}
    />
  );
};

UiEditPost.storyName = 'Editor';

UiEditPost.args = {
  placeholder: 'placeholder...',
  text: 'Some post content',
};

UiEditPost.argTypes = {
  placeholder: { control: { type: 'text' } },
  text: { control: { type: 'text' } },
  onChange: { action: 'onChange()' },
};
