import React from 'react';
import UiKitExploreHeader from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKExploreHeader = {
  render: () => {
    const [props] = useArgs();
    return <UiKitExploreHeader {...props} />;
  },
  name: 'Explore header',
};
