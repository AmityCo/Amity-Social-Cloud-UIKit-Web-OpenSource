import React from 'react';

import UiKitTime from '.';

export default {
  title: 'Ui Only',
};

export const Time = ({ date, ...restArgs }) => {
  const normalizedDate = new Date(date);
  return <UiKitTime date={normalizedDate} {...restArgs} />;
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
