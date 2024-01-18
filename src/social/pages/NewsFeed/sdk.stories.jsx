import React from 'react';

import NewsFeed from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'SDK Connected/Social/Pages',
};

export const SDKNewsFeed = {
  render: () => {
    const [props] = useArgs();
    return <NewsFeed {...props} />;
  },
  name: 'News Feed',
};
