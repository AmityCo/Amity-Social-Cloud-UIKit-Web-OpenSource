import React from 'react';

import UiKitTime from '.';

export default {
  title: 'Ui Only',
};

export const Time = ({ ...props }) => {
  return <UiKitTime {...props} />;
};

Time.args = {
  className: '',
  date: Date.now(),
};

Time.argTypes = {
  className: {
    control: {
      type: 'text',
    },
  },
  date: {
    control: {
      type: 'date',
    },
  },
};
