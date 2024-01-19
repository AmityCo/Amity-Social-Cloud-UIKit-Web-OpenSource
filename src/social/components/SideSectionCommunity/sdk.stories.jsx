import React from 'react';
import UiKitSideSectionCommunityComponent from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKSideSectionCommunity = {
  render: () => {
    const [{ children }] = useArgs();
    return <UiKitSideSectionCommunityComponent>{children}</UiKitSideSectionCommunityComponent>;
  },

  name: 'Community side section',

  args: {
    children: 'children slot',
  },
};
