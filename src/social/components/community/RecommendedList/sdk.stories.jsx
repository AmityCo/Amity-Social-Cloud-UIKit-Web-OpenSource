import React from 'react';
import UiKitRecommendedCommunitiesList from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKRecommendedList = {
  render: () => {
    const [props] = useArgs();
    return <UiKitRecommendedCommunitiesList {...props} />;
  },
  name: 'Recommended list',
};
