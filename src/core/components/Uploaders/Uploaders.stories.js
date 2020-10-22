import React from 'react';

import UiKitFileLoader from './FileLoader';
import UiKitFileUploader from './FileUploader';
import UiKitImageUploader from './ImageUploader';

export default {
  title: 'Components/Uploaders',
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

export const FileUploader = ({ remove, ...args }) => {
  return (
    <UiKitFileUploader {...args}>
      <div
        style={{
          padding: '1em',
          border: '1px dashed #dfdfdf',
          textAlign: 'center',
        }}
      >
        Click/Drop to upload
      </div>
    </UiKitFileUploader>
  );
};

FileUploader.args = { ...LocalLoader.args };
FileUploader.argTypes = { ...LocalLoader.argTypes };

export const ImageUploader = ({ remove, ...args }) => {
  return (
    <UiKitImageUploader {...args}>
      <div
        style={{
          padding: '1em',
          border: '1px dashed #dfdfdf',
          textAlign: 'center',
        }}
      >
        Click/Drop to upload
      </div>
    </UiKitImageUploader>
  );
};

ImageUploader.args = { ...LocalLoader.args };
ImageUploader.argTypes = { ...LocalLoader.argTypes };
