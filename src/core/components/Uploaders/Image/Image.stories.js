import React from 'react';

import UiKitImage from './styles';

export default {
  title: 'Ui only/Uploaders',
};

export const SimpleImage = ({ remove, ...args }) => {
  // eslint-disable-next-line no-param-reassign
  if (!remove) delete args.onRemove;
  return <UiKitImage {...args} />;
};

SimpleImage.storyName = 'Image';

SimpleImage.args = {
  url: '',
  progress: -1,
  remove: false,
};

SimpleImage.argTypes = {
  url: {
    control: {
      type: 'text',
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
