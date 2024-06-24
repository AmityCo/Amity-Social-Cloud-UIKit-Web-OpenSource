import React from 'react';

import { TopSearchBar } from './TopSearchBar';

export default {
  title: 'v4-social/components/TopSearchBar',
};

export const TopSearchBarStory = {
  render: () => {
    return <TopSearchBar search={() => {}} />;
  },

  name: 'TopSearchBar',
};
