import React from 'react';
import UiKitApp from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'V3/Social',
};

export const SDKCommunityApp = {
  render: () => {
    const [props] = useArgs();
    return <UiKitApp {...props} />;
  },
  name: 'Application',

  args: {
    shouldHideExplore: false,
    socialCommunityCreationButtonVisible: true,
  },

  argTypes: {
    shouldHideExplore: { control: { type: 'boolean' } },
    socialCommunityCreationButtonVisible: { control: { type: 'boolean' } },
    onMemberClick: { action: 'onMemberClick()' },
  },
};
