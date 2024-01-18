import React from 'react';

import UiKitProgressBar from '.';

export default {
  title: 'Ui Only',
};

export const ProgressBar = ({ ...props }) => {
  return <UiKitProgressBar {...props} />;
};

ProgressBar.args = {
  progress: 0,
  lightMode: false,
};

ProgressBar.argTypes = {
  progress: {
    control: {
      type: 'range',
      min: 0,
      max: 100,
    },
  },
  lightMode: {
    control: {
      type: 'boolean',
    },
  },
};
