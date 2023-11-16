import React from 'react';

import UiKitFile from './styles';

export default {
  title: 'Ui only/Uploaders',
};

export const SimpleFile = ({ remove, ...args }) => {
  // eslint-disable-next-line no-param-reassign
  if (!remove) delete args.onRemove;
  return <UiKitFile {...args} />;
};

SimpleFile.storyName = 'File';

SimpleFile.args = {
  name: 'file.txt',
  type: 'image/*',
  url: '',
  size: 100000,
  progress: -1,
  remove: false,
};

SimpleFile.argTypes = {
  name: {
    control: {
      type: 'text',
    },
  },
  type: {
    control: {
      type: 'text',
    },
  },
  url: {
    control: {
      type: 'text',
    },
  },
  size: {
    control: {
      type: 'number',
      min: 0,
      step: 100,
    },
  },
  progress: {
    control: {
      type: 'number',
      min: -0.01,
      max: 1,
      step: 0.01,
    },
  },
  remove: {
    control: {
      type: 'boolean',
    },
  },
  onRemove: {
    action: 'onRemove',
  },
};
