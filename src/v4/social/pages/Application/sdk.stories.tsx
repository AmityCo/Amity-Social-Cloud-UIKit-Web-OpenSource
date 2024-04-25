import React from 'react';
import UiKitApp from './index';

export default {
  title: 'V4/Social',
};

export const SDKCommunityAppV4 = {
  render: (props) => {
    return <UiKitApp {...props} />;
  },
  name: 'ApplicationV4',

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
