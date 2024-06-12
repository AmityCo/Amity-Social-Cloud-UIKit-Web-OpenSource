import React from 'react';

import { Timestamp } from './Timestamp';

export default {
  title: 'v4-social/elements/Timestamp',
};

export const TimestampStory = {
  render: () => {
    return <Timestamp timestamp={20} />;
  },

  name: 'Timestamp',
};
