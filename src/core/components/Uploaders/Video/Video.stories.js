import React from 'react';

import UiKitVideo from './styles';

export default {
  title: 'Ui only/Uploaders',
};

export const VideoStory = ({ remove, ...args }) => {
  // eslint-disable-next-line no-param-reassign
  if (!remove) delete args.onRemove;
  return <UiKitVideo {...args} />;
};

VideoStory.storyName = 'Video';

VideoStory.args = {
  url: '',
  progress: -1,
  remove: false,
};

VideoStory.argTypes = {
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
