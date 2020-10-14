import React from 'react';
import { ProgressBar } from '.';

export default {
  title: 'Components/Progress Bar',
  parameters: { layout: 'centered' },
};

export const SimpleProgressBar = ({ ...props }) => {
  return <ProgressBar {...props} />;
};

SimpleProgressBar.args = {
  progress: 0,
  lightMode: false,
};

SimpleProgressBar.argTypes = {
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
