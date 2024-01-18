import React from 'react';
import PostTextContent from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Ui Only/Social/Post/TextContent',
};

export const UIPostTextContent = {
  render: () => {
    const [props] = useArgs();
    return (
      <div
        style={{
          width: '200px',
          height: '100px',
          border: '1px dashed darkgrey',
          padding: '20px',
          borderRadius: '6px',
        }}
      >
        <PostTextContent {...props} />
      </div>
    );
  },

  name: 'Text content',

  args: {
    text: 'Some post text that goes over maxPostLines lines long',
    postMaxLines: 2,
  },

  argTypes: {
    text: { control: { type: 'text' } },
    postMaxLines: { control: { type: 'number' } },
  },
};
