import React from 'react';
import TrendingCommunitiesList from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SdkTrendingCommunities = {
  render: () => {
    const [props] = useArgs();
    return <TrendingCommunitiesList {...props} />;
  },
  name: 'Trending list',
};
