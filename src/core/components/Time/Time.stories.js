import React from 'react';
import Time from '.';

export default {
  title: 'Components/Time',
  parameters: { layout: 'centered' },
};

const dateNow = Date.now();

export const SimpleTime = ({ ...props }) => {
  return <Time {...props} />;
};

SimpleTime.args = {
  className: '',
  date: dateNow,
};

SimpleTime.argTypes = {
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
