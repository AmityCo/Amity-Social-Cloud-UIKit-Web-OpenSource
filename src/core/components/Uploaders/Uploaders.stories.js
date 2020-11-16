import React from 'react';

import UiKitFileLoader from './Loader';

export default {
  title: 'Ui only/Uploaders',
};

export const LocalLoader = args => {
  return (
    <UiKitFileLoader {...args}>
      <div
        style={{
          padding: '1em',
          border: '1px dashed #dfdfdf',
          textAlign: 'center',
        }}
      >
        Click/Drop to upload
      </div>
    </UiKitFileLoader>
  );
};

LocalLoader.storyName = 'Loader';

LocalLoader.args = {
  mimeType: 'image/*',
  multiple: true,
  disabled: false,
};

LocalLoader.argTypes = {
  mimeType: {
    control: {
      type: 'text',
    },
  },
  multiple: {
    control: {
      type: 'boolean',
    },
  },
  disabled: {
    control: {
      type: 'boolean',
    },
  },
  onChange: { action: 'onChange()' },
};
